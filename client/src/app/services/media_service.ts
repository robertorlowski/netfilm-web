import { ResultGenres } from "./../model/genres.model";
import { Observable } from "rxjs";

export interface MediaService {
  loadGenres(lang: string): Observable<ResultGenres>;
  getMoviesForGenreIDs(
    lang: string,
    page: number,
    genresIds: number[],
    sortBy: string
  ): Observable<ResultGenres>;
}
