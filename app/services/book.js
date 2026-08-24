import Service from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import { tracked } from '@glimmer/tracking';

// local storage keys
const BOOKS_STORAGE_KEY = 'library.books';
const LOANS_STORAGE_KEY = 'library.loans';
const COLLECTED_FINES_STORAGE_KEY = 'library.collected-fines';

// Static variables
const FREE_FINE_MINUTES = 5;
const FINE_PER_MINUTE = 1;
const MINUTE_IN_MS = 60 * 1000;

export default class BookService extends Service {
  @tracked books = [];
  @tracked genres = [];

  @tracked loans = [];
  @tracked collectedFineTotal = 0;

  @tracked currentTime = Date.now();
  @tracked isLoading = false;

  #fineTimer = null;

  constructor() {
    super(...arguments);

    this.#fineTimer = setInterval(() => {
      this.currentTime = Date.now();
    }, MINUTE_IN_MS);

    registerDestructor(this, () => {
      clearInterval(this.#fineTimer);
    });
  }

  async loadBooks() {
    const { booksdata } = await import('../data/booksdata');
    this.genres = booksdata.genres || [];

    if (this.books.length > 0) {
      return this.books;
    }

    this.isLoading = true;

    try {
      const storedBooks = this.#readFromStorage(BOOKS_STORAGE_KEY);
      const storedLoans = this.#readFromStorage(LOANS_STORAGE_KEY);
      const storedCollectedFineTotal = this.#readFromStorage(COLLECTED_FINES_STORAGE_KEY);

      if (storedLoans) {
        this.loans = storedLoans;
      }

      if (typeof storedCollectedFineTotal === 'number') {
        this.collectedFineTotal = storedCollectedFineTotal;
      }

      if (storedBooks) {
        this.books = storedBooks;
        return this.books;
      }

      this.books = booksdata.books;
      this.#saveToStorage(BOOKS_STORAGE_KEY, this.books);
      return this.books;

    } catch (error) {


      console.error('Failed to load books:', error);
      return [];

    } finally {
      this.isLoading = false;
    }
  }

  // localStorage helpers
  #readFromStorage(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error(`Failed to read "${key}" from localStorage:`, error);
      return null;
    }
  }

  #saveToStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save "${key}" to localStorage:`, error);
    }
  }

  // Helper methods
  async fetchBookByIsbn(isbn) {
    await this.loadBooks();
    return this.getBookByIsbn(isbn) ?? null;
  }

  getBookByIsbn(isbn) {
    return this.books.find(book => book.isbn === isbn);
  }

  get pendingFineTotal() {
    // pending fine total = sum of fine amount for every active loan.
    return this.loans.reduce((total, loan) => {
      return total + this.getFineAmount(loan);
    }, 0);
  }

  getFineAmount(loan, now = this.currentTime) {
    const issuedAt = Number(loan?.issuedAt);

    if (!Number.isFinite(issuedAt)) {
      return 0;
    }

    // overdue milliseconds = current time - issued time - free minutes in milliseconds.
    const overdueMs = now - issuedAt - FREE_FINE_MINUTES * MINUTE_IN_MS;

    if (overdueMs <= 0) {
      return 0;
    }

    // fine amount = rounded-up overdue minutes * fine per minute.
    return Math.ceil(overdueMs / MINUTE_IN_MS) * FINE_PER_MINUTE;
  }

  getOverdueMinutes(loan, now = this.currentTime) {
    const fineAmount = this.getFineAmount(loan, now);

    // overdue minutes = fine amount / fine charged per minute.
    return fineAmount / FINE_PER_MINUTE;
  }

  issueBook(isbn, studentName) {
    const bookToIssue = this.getBookByIsbn(isbn);

    if (!bookToIssue || bookToIssue.copies_available <= 0) {
      return null;
    }

    this.books = this.books.map((book) => {
      if (book.isbn === isbn) {
        return {
          ...book,
          copies_available: book.copies_available - 1,
        };
      }

      return book;
    });

    const loan = {
      id: `${isbn}-${Date.now()}`,
      isbn,
      title: bookToIssue.title,
      author: bookToIssue.author,
      studentName,
      issuedAt: new Date().toTemporalInstant().epochMilliseconds,
    };

    this.loans = [...this.loans, loan];

    this.#saveToStorage(BOOKS_STORAGE_KEY, this.books);
    this.#saveToStorage(LOANS_STORAGE_KEY, this.loans);

    return loan;
  }

  collectBook(loanId) {
    const loan = this.loans.find((loan) => loan.id === loanId);

    if (!loan) {
      return null;
    }

    const fineAmount = this.getFineAmount(loan);

    this.books = this.books.map((book) => {
      if (book.isbn === loan.isbn && book.copies_available < book.copies_total) {
        return {
          ...book,
          copies_available: book.copies_available + 1,
        };
      }

      return book;
    });

    this.loans = this.loans.filter((loan) => loan.id !== loanId);
    this.collectedFineTotal += fineAmount;

    this.#saveToStorage(BOOKS_STORAGE_KEY, this.books);
    this.#saveToStorage(LOANS_STORAGE_KEY, this.loans);
    this.#saveToStorage(COLLECTED_FINES_STORAGE_KEY, this.collectedFineTotal);

    return { ...loan, fineAmount };
  }

  get availableYears() {

    const years = new Set(this.books.map((b) => b.publication_year).filter(Boolean));
    return Array.from(years).sort((first, second) => second - first); // Newest first
  }

  get availableGenres() {
    if (this.genres && this.genres.length > 0) {
      return this.genres;
    }
    // Fallback: extract distinct genre_ids present in loaded books
    const genreIds = new Set(this.books.map((b) => b.genre_id).filter(Boolean));
    return Array.from(genreIds).sort((firstId, secondId) => firstId - secondId).map((id) => ({
      id,
      name: `Genre ${id}`,
    }));
  }

  get genreMap() {
    return Object.fromEntries(
      this.availableGenres.map((g) => [g.id, g.name])
    );
  }

  getFilteredAndSortedBooks({ searchQuery = '', genreId = '', publicationYear = '', sortBy = 'title', sortOrder = 'asc' } = {}) {
    let result = [...this.books];
    const map = this.genreMap;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    // Filter by Genre ID
    if (genreId) {
      const gId = Number(genreId);
      result = result.filter((book) => book.genre_id === gId);
    }

    // Filter by Publication Year
    if (publicationYear) {
      const year = Number(publicationYear);
      result = result.filter((book) => book.publication_year === year);
    }

    // Sort books
    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'author') {
        comparison = a.author.localeCompare(b.author);
      } else if (sortBy === 'publication_year') {
        comparison = a.publication_year - b.publication_year;
      } else if (sortBy === 'genre') {
        const genreA = map[a.genre_id] || '';
        const genreB = map[b.genre_id] || '';
        comparison = genreA.localeCompare(genreB);
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }

}