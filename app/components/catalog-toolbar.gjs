import { on } from '@ember/modifier';
import '../styles/catalog-toolbar.css';

const isAsc = (order) => order === 'asc';

<template>
  <div class="catalog-toolbar">
    {{!-- Search Input --}}
    <div class="toolbar-group search-group">
      <label for="catalog-search" class="toolbar-label">Search:</label>
      <div class="search-input-wrapper">
        <input
          id="catalog-search"
          type="text"
          placeholder="Title or author..."
          class="toolbar-input"
          value={{@searchQuery}}
          {{on "input" @onSearch}}
        />
        <span class="search-icon">🔍</span>
      </div>
    </div>

    {{!-- Genre Filter --}}
    <div class="toolbar-group">
      <label for="catalog-genre-filter" class="toolbar-label">Genre:</label>
      <select
        id="catalog-genre-filter"
        class="toolbar-select"
        value={{@selectedGenre}}
        {{on "change" @onGenreChange}}
      >
        <option value="">All Genres</option>
        {{#each @availableGenres as |genre|}}
          <option value={{genre.id}}>{{genre.name}}</option>
        {{/each}}
      </select>
    </div>


    {{!-- Year of Publish Filter --}}
    <div class="toolbar-group">
      <label for="catalog-year-filter" class="toolbar-label">Year:</label>
      <select
        id="catalog-year-filter"
        class="toolbar-select"
        value={{@selectedYear}}
        {{on "change" @onYearChange}}
      >
        <option value="">All Years</option>
        {{#each @availableYears as |year|}}
          <option value={{year}}>{{year}}</option>
        {{/each}}
      </select>
    </div>

    {{!-- Sort By Dropdown --}}
    <div class="toolbar-group">
      <label for="catalog-sort-by" class="toolbar-label">Sort By:</label>
      <select
        id="catalog-sort-by"
        class="toolbar-select"
        value={{@sortBy}}
        {{on "change" @onSortByChange}}
      >
        <option value="title">Name (Title)</option>
        <option value="author">Author</option>
        <option value="publication_year">Year of Publish</option>
        <option value="genre">Genre</option>
      </select>
    </div>

    {{!-- Sort Direction Toggle --}}
    <div class="toolbar-group">
      <button
        type="button"
        class="toolbar-btn toggle-btn"
        title="Toggle Ascending / Descending"
        {{on "click" @onToggleSortOrder}}
      >
        {{#if (isAsc @sortOrder)}}
          <span>Order: A → Z ⬆️</span>
        {{else}}
          <span>Order: Z → A ⬇️</span>
        {{/if}}
      </button>
    </div>

    {{!-- Reset Filters Button --}}
    <div class="toolbar-group">
      <button
        type="button"
        class="toolbar-btn reset-btn"
        title="Reset all filters"
        {{on "click" @onReset}}
      >
        Reset ↺
      </button>
    </div>
  </div>
</template>

