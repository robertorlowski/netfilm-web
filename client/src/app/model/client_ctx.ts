import { ApiMediaProvider, ProviderType } from "./../services/media.providers";
import { MediaItem } from "./mediaItem.model";
import { Genres } from "./genres.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({ providedIn: "root" })
export class ClientCtx {
  public geners: Genres[] = [];

  constructor(private apiProvider: ApiMediaProvider) {}

  private scrollSource = new Subject<any>();
  scrollDource$ = this.scrollSource.asObservable();
  public scrollEvent(event: any) {
    this.scrollSource.next(event);
  }

  private mediaSource = new Subject<MediaItem>();
  mediaSource$ = this.mediaSource.asObservable();
  public mediaEvent(item: MediaItem) {
    this.mediaSource.next(item);
  }

  public async getGenersNameByIdList(idList: number[]) {
    if (idList == undefined) {
      return "";
    }
    let genreStr: string = "";
    for (let item of idList) {
      if (genreStr != "") {
        genreStr += ", ";
      }
      genreStr += await this.getGenersNameByKod(item);
    }
    return genreStr;
  }

  public async getGenersNameByKod(kod: number) {
    if (this.geners.length === 0) {
      const data = await this.apiProvider
        .getProvider(ProviderType.NET)
        .loadGenres("pl")
        .toPromise();
      this.geners = data.genres;
    }
    for (let item of this.geners) {
      if (item.id === kod) {
        return item.name;
      }
    }
    return "unknown";
  }
}
