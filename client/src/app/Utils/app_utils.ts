import { MediaItem } from "./../model/mediaItem.model";
export class AppUtils {
  static _imageUrlLarge: string = "https://image.tmdb.org/t/p/w500";
  static _imageUrlMedium: string = "https://image.tmdb.org/t/p/w300";

  public static IMDB_API_KEY = "68b4fe2a513155a58dd0af4adacb281b";

  public static NET_API_KEY = "6fdf6ffc-ed77-94fa-407e-a7b86ed9e59d";

  public static getImdbUrl(imdbId: string): string {
    return `http://www.imdb.com/title/${imdbId}`;
  }

  public static getMediumPictureUrl(path: string) {
    return AppUtils._imageUrlMedium + path;
  }

  public static getLargePictureUrl(path: string) {
    return AppUtils._imageUrlLarge + path;
  }

  public static getGenersIsAsStr(generIds: number[]) {
    let result = "";
    if (generIds) {
      for (let ooo of generIds) {
        result += result === "" ? ooo.toString() : "," + ooo.toString();
      }
    }
    return result;
  }

  public static getPosterMediumPathUrl(media: MediaItem): string {
    if (media.posterPath) {
      return AppUtils.getMediumPictureUrl(media.posterPath);
    } else {
      return AppUtils.getMediumPictureUrl(media.backdropPath);
    }
  }
}
