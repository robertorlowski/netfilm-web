import { MediaItem } from "./mediaItem.model";
import { Genres } from "./genres.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({ providedIn: "root" })
export class ClientCtx {
  public geners: Genres[];

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

  public getGenersNameByIdList(idList: number[]) {
    if (idList == undefined) {
      return "";
    }
    let genreStr: string = "";
    for (let item of idList) {
      if (genreStr != "") {
        genreStr += ", ";
      }
      genreStr += this.getGenersNameByKod(item);
    }
    return genreStr;
  }

  public getGenersNameByKod(kod: number) {
    if (!this.geners) {
      return "unknown";
    }
    for (let item of this.geners) {
      if (item.id === kod) {
        return item.name;
      }
    }
    return "unknown";
  }
}
