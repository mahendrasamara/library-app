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

      const { booksdata } = await import('../data/booksdata');
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

  searchBooks(query) {
    const searchTerm = query.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  }


  // getBooksByGenre(genreId) {
  //   return this.books.filter(book => book.genre_id === genreId);
  // }

  // getBooksByAuthor(author) {
  //   return this.books.filter(book => 
  //     book.author.toLowerCase().includes(author.toLowerCase())
  //   );
  // }

  // getAvailableBooks() {
  //   return this.books.filter(book => book.copies_available > 0);
  // }

  // getBooksByPriceRange(min, max) {
  //   return this.books.filter(book => 
  //     book.price >= min && book.price <= max
  //   );
  // }
}
