<template>
  <div class="book-card">
    <h3 class="book-title">{{@book.title}}</h3>
    <p class="book-author">By {{@book.author}}</p>
    <p class="book-info">Year: {{@book.publication_year}} | Pages: {{@book.pages}}</p>
    <p class="book-price">Price: ${{@book.price}}</p>
    <span class="book-badge">Available: {{@book.copies_available}} / {{@book.copies_total}}</span>
  </div>
</template>
