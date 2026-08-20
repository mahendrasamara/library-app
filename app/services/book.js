import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class BookService extends Service {
  @tracked books = [];
  @tracked isLoading = false;

  async loadBooks() {
    if (this.books.length > 0) {
      return this.books;
    }

    this.isLoading = true;
    
    try {

      const { booksdata } = await import('../data/booksdata');
      this.books = booksdata.books;
      return this.books;

    } catch (error) {

      console.error('Failed to load books:', error);
      return [];

    } finally {
      this.isLoading = false;
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
