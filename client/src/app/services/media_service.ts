import { ResultGenres } from "./../model/genres.model";
import { Observable } from "rxjs";

export interface MediaService {
  /**
   * Get genres
   * @param lang
   */
  loadGenres(lang: string): Observable<ResultGenres>;

  /**
   * Get movies for genres
   * @param lang
   * @param page
   * @param genresIds
   * @param sortBy
   */
  getMoviesForGenreIDs(
    lang: string,
    page: number,
    genresIds: number[],
    sortBy: string
  ): Observable<any>;

  /**
   * Get movies for title querty
   * @param query
   */
  getSearchResults(query: string): Observable<any>;

  /**
   * Get vdeos (triller)
   */
  getVideos(movieId: number): Observable<any>;
}
