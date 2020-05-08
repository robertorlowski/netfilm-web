import { AppUtils } from "./../Utils/app_utils";
import { MediaService } from "./media_service";

import { Injectable } from "@angular/core";
import { ResultGenres } from "./../model/genres.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ApiClientNet implements MediaService {
  baseUrl: string = "https://api.themoviedb.org/";
  netUrl: string = "https://biuro.pruim.gliwice.pl:9000/";

  constructor(private http: HttpClient) {}

  public loadGenres(lang: string): Observable<ResultGenres> {
    return this.http.get<ResultGenres>(
      this.baseUrl.concat("3/genre/movie/list"),
      {
        params: {
          api_key: AppUtils.IMDB_API_KEY,
          language: lang,
        },
      }
    );
  }
  public getMoviesForGenreIDs(
    lang: string,
    page: number,
    genresIds: number[],
    sortBy: string
  ): Observable<ResultGenres> {
    return this.http.get<any>(
      this.netUrl.concat("netfilm/fetchMoviesForGenres"),
      {
        headers: {
          "api-key": AppUtils.NET_API_KEY,
        },
        params: {
          page: page.toString(),
          category: sortBy,
          genres: AppUtils.getGenersIsAsStr(genresIds),
        },
      }
    );
  }

  /*
  Future<List<MediaItem>> getMoviesForGenreIDs(
      {int page: 1, sortBy: "", List<int> genreIDs}) async {
    var url = Uri.https(netUrl, '/netfilm/fetchMoviesForGenres', {
      'page': page.toString(),
      'category': sortBy,
      'genres': getGenreIDs(genreIDs)
    });

    return _getJson(url, apiKey: NET_API_KEY).then((data) => data
        .map<MediaItem>((item) => MediaItem(item, MediaType.db))
        .where((item) => item.posterPath != "" || item.backdropPath != "")
        .toList());
  }
  */
}
