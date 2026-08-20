import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

const BOOKS_STORAGE_KEY = 'library.books';
const LOANS_STORAGE_KEY = 'library.loans';

export default class BookService extends Service {
  @tracked books = [];
  @tracked loans = [];
  @tracked isLoading = false;

  async loadBooks() {
    if (this.books.length > 0) {
      return this.books;
    }

    this.isLoading = true;

    try {
      const storedBooks = this.#readFromStorage(BOOKS_STORAGE_KEY);
      const storedLoans = this.#readFromStorage(LOANS_STORAGE_KEY);

      if (storedLoans) {
        this.loans = storedLoans;
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
  getBookByIsbn(isbn) {
    return this.books.find(book => book.isbn === isbn);
  }

  getBooksByGenre(genreId) {
    return this.books.filter(book => book.genre_id === genreId);
  }

  getBooksByAuthor(author) {
    return this.books.filter(book => 
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  getAvailableBooks() {
    return this.books.filter(book => book.copies_available > 0);
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
      issuedAt: new Date().toLocaleDateString(),
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

    this.#saveToStorage(BOOKS_STORAGE_KEY, this.books);
    this.#saveToStorage(LOANS_STORAGE_KEY, this.loans);

    return loan;
  }

  searchBooks(query) {
    const searchTerm = query.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  getBooksByPriceRange(min, max) {
    return this.books.filter(book => 
      book.price >= min && book.price <= max
    );
  }
}
