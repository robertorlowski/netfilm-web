import { AppUtils } from "./../Utils/app_utils";
import { Movie } from "./movie.mode";
import * as moment from "moment";

export enum MediaType {
  video,
  show,
  db,
}

export class MediaItem {
  public type: MediaType;
  public id: number;
  public voteAverage: number;
  public title: string;
  public posterPath: string;
  public backdropPath: string;
  public overview: string;
  public releaseDate: string;
  public movieIds: Movie[] = [];
  public genreIds: number[] = [];
  public videoIds: string[];
  public posterError: Boolean = false;

  public getPosterUrl(): string {
    return AppUtils.getMediumPictureUrl(this.posterPath);
  }

  public getLargePictureUrl(): string {
    return AppUtils.getLargePictureUrl(this.backdropPath);
  }

  public getReleaseYear(): string {
    return this.releaseDate == null || this.releaseDate == ""
      ? ""
      : moment(this.releaseDate).format("YYYY");
  }

  public static getMediaItem(jsonMap: any, type: MediaType): MediaItem {
    return type == MediaType.db
      ? MediaItem._internalFromNetJson(jsonMap, type)
      : MediaItem._internalFromJson(jsonMap, type);
  }

  private static _internalFromNetJson(
    jsonMap: any,
    type: MediaType
  ): MediaItem {
    const vo = new MediaItem();
    vo.type = type;
    vo.id = Number(jsonMap["id"]);
    vo.voteAverage = jsonMap["voteAverage"]
      ? Number(jsonMap["voteAverage"])
      : null;
    vo.title = jsonMap["title"];
    vo.posterPath = jsonMap["posterPath"] ? jsonMap["posterPath"] : "";
    vo.backdropPath = jsonMap["backdropPath"] ? jsonMap["backdropPath"] : "";
    vo.overview = jsonMap["overview"];
    vo.releaseDate = jsonMap["releaseDate"];
    vo.genreIds =
      jsonMap["genres"] == null ? [] : (jsonMap["genres"] as number[]);
    vo.movieIds = [];
    vo.movieIds = [];
    if (jsonMap["cdaIds"] !== null) {
      for (let item of jsonMap["cdaIds"]) {
        vo.movieIds.push(
          new Movie(
            "cda.pl",
            "CDA",
            item["link"],
            item["title"],
            item["time_min"] == null
              ? null
              : Number.parseInt(item["time_min"].toString())
          )
        );
      }
    }
    return vo;
  }

  private static _internalFromJson(jsonMap: any, type: MediaType): MediaItem {
    const vo = new MediaItem();
    vo.type = type;
    vo.id = Number(jsonMap["id"]);
    vo.voteAverage = jsonMap["vote_average"]
      ? Number(jsonMap["vote_average"])
      : null;
    vo.title = jsonMap[type == MediaType.video ? "title" : "name"];
    vo.posterPath = jsonMap["poster_path"] ? jsonMap["poster_path"] : "";
    vo.backdropPath = jsonMap["backdrop_path"] ? jsonMap["backdrop_path"] : "";
    vo.overview = jsonMap["overview"];
    vo.releaseDate =
      jsonMap[type == MediaType.video ? "release_date" : "first_air_date"];
    vo.genreIds = jsonMap["genres"];
    vo.movieIds = [];

    return vo;
  }
  /*
  public toJson():any {
    if (this.type == MediaType.db)
      return {
        'type': 2,
        'id': id,
        'voteAverage': voteAverage,
        'title': title,
        'posterPath': posterPath,
        'backdropPath': backdropPath,
        'overview': overview,
        'releaseDate': releaseDate,
        'genres': genreIds,
        'site': videoIds == null ? [] : videoIds,
        'cdaIds': movieIds == null
            ? []
            : movieIds.map((Movie item) => item..toJson()).toList()
      };
    else
      return {
        'type': type == MediaType.video ? 1 : 0,
        'id': id,
        'vote_average': voteAverage,
        'title': title,
        'poster_path': posterPath,
        'backdrop_path': backdropPath,
        'overview': overview,
        'release_date': releaseDate,
        'genre_ids': genreIds,
        'site': videoIds,
      };
  }
  */
  /*
  factory MediaItem.fromPrefsJson(Map jsonMap) {
    if (jsonMap['type'].toInt() == 1) {
      return MediaItem._internalFromJson(jsonMap, type: MediaType.video);
    } else if (jsonMap['type'].toInt() == 0) {
      return MediaItem._internalFromJson(jsonMap, type: MediaType.show);
    } else {
      return MediaItem._internalFromDbJson(jsonMap, type: MediaType.db);
    }
  }
  */
}
