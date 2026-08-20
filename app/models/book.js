import Model, { attr } from '@warp-drive/legacy/model';

export default class BookModel extends Model {
  @attr('string') isbn;
  @attr('string') title;
  @attr('string') author;
  @attr('number') genre_id;
  @attr('number') publication_year;
  @attr('string') publisher;
  @attr('number') pages;
  @attr('number') price;
  @attr('number') copies_available;
  @attr('number') copies_total;
  @attr('string') description;
  @attr('string') published_date;
  @attr('string') language;
}