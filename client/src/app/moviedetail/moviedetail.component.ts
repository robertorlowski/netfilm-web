import { Subscription } from "rxjs";
import { ClientCtx } from "./../model/client_ctx";
import { MediaItem } from "./../model/mediaItem.model";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";

@Component({
  selector: "app-moviedetail",
  templateUrl: "./moviedetail.component.html",
  styleUrls: ["./moviedetail.component.scss"],
})
export class MoviedetailComponent implements OnInit, OnDestroy {
  movie: MediaItem = new MediaItem();
  private exec: any;
  private mediaSubscription: Subscription;
  geners: string;

  constructor(public clientCtx: ClientCtx) {}

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe;
  }

  ngOnInit() {
    this.mediaSubscription = this.clientCtx.mediaSource$.subscribe(
      (item: MediaItem) => {
        if (this.exec) {
          clearTimeout(this.exec);
        }
        this.exec = setTimeout(async () => {
          this.movie = item;
          this.geners = await this.clientCtx.getGenersNameByIdList(
            item.genreIds
          );
        }, 100);
      }
    );
  }
}
