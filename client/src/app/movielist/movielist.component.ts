import { Triller } from "./../model/triller.model";
import { YouTubePlayer } from "./../Utils/youtube-player";
import { Subscription } from "rxjs";
import { ModalService } from "./../services/modal.service";
import { ActivatedRoute } from "@angular/router";
import { AppUtils } from "./../Utils/app_utils";
import { MediaItem, MediaType } from "./../model/mediaItem.model";
import { ClientCtx } from "../model/client_ctx";
import { ApiMediaProvider, ProviderType } from "./../services/media.providers";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";

@Component({
  selector: "app-movielist",
  templateUrl: "./movielist.component.html",
  styleUrls: ["./movielist.component.scss"],
})
export class MovielistComponent implements OnInit, OnDestroy {
  public title: string;
  private categoryId: number = NaN;
  private subscription: Subscription;
  public language: string = "pl";
  public movies: MediaItem[] = [];
  public videoIDs: Array<Triller> = [];
  public selectedItem: MediaItem;
  private isLoading: Boolean = false;
  private page: number = 1;
  public isEnd: Boolean = true;
  @ViewChild("parent", { static: true }) movielistRef: ElementRef;
  private eParent: any;
  @ViewChild("trailer", { static: true }) trailerRef: ElementRef;
  @ViewChild("player", { static: true }) player: YouTubePlayer;
  private ytStatusSubscription: Subscription;

  constructor(
    private apiProvider: ApiMediaProvider,
    private activeRoute: ActivatedRoute,
    private clientCtx: ClientCtx,
    private modalService: ModalService
  ) {
    this.subscription = this.activeRoute.queryParams.subscribe(
      async (params) => {
        this.initData();
        let generID = params["id"];

        if (generID !== NaN && generID != undefined) {
          this.categoryId = Number(generID);
          //get title
          this.title = await this.clientCtx.getGenersNameByKod(this.categoryId);
          //load movies
          this.loadMovie();
        } else {
          let query = params["query"];
          this.title = query;
          this.searchMovie(query);
        }
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe;
    this.ytStatusSubscription.unsubscribe;
  }

  playerVars: YT.PlayerVars = {
    autoplay: YT.AutoPlay.NoAutoPlay,
    controls: YT.Controls.ShowLoadPlayer,
    autohide: YT.AutoHide.HideProgressBar,
    cc_load_policy: YT.ClosedCaptionsLoadPolicy.ForceOn,
    iv_load_policy: YT.IvLoadPolicy.Hide,
    modestbranding: YT.ModestBranding.Modest,
    rel: YT.RelatedVideos.Hide,
    showinfo: YT.ShowInfo.Hide,
  };

  private initData() {
    this.categoryId = undefined;
    this.isLoading = false;
    this.isEnd = true;
    this.page = 1;
    this.movies = [];
    this.clientCtx.mediaEvent(new MediaItem());
  }

  ngOnInit() {
    this.eParent = this.movielistRef.nativeElement;
    this.ytStatusSubscription = this.player.stateChange.subscribe(
      (data: any) => {
        switch (data.data) {
          case YT.PlayerState.ENDED:
            this.clientCtx.playingEvent(false);
            break;
          default:
            break;
        }
      }
    );
  }

  searchMovie(query: any) {
    if (query === undefined || this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.isEnd = true;
    this.apiProvider
      .getProvider(ProviderType.NET)
      .getSearchResults(query)
      .subscribe((data: any) => {
        this.movies = [];
        for (let ooo of data) {
          this.movies.push(MediaItem.getMediaItem(ooo, MediaType.db));
        }

        if (
          this.movies.length === (data as []).length &&
          this.movies.length > 0
        ) {
          this.showDetails(this.movies[0]);
        }
        this.isLoading = false;
      });
  }

  loadMovie() {
    if (this.categoryId === NaN || this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.apiProvider
      .getProvider(ProviderType.NET)
      .getMoviesForGenreIDs(
        this.language,
        this.page++,
        [this.categoryId],
        "releaseDate"
      )
      .subscribe((data: any) => {
        this.isEnd = (data as []).length === 0;
        let ccc = [];
        for (let ooo of data) {
          ccc.push(MediaItem.getMediaItem(ooo, MediaType.db));
        }
        this.movies = ccc;
        this.eParent.scrollTo(0, 0);

        if (
          this.movies.length === (data as []).length &&
          this.movies.length > 0
        ) {
          this.showDetails(this.movies[0]);
        }
        this.isLoading = false;
        //
        setTimeout(() => {
          if (this.eParent.scrollHeight <= this.eParent.clientHeight) {
            this.loadMovie();
          }
        }, 100);
      });
  }

  posterMediumPath(madia: MediaItem): String {
    return AppUtils.getPosterMediumPathUrl(madia);
  }

  fetchNext() {
    this.loadMovie();
  }

  showDetails(item: MediaItem) {
    this.clientCtx.mediaEvent(item);
  }

  showDetailWindow(item: MediaItem) {
    this.apiProvider
      .getProvider(ProviderType.NET)
      .getVideos(item.id)
      .subscribe((data: any) => {
        this.videoIDs = [];
        data.results.forEach((element: Triller) => {
          this.videoIDs.push(element);
        });
      });

    this.selectedItem = item;
    this.modalService.open("video-link");
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  public onScroll() {
    this.loadMovie();
  }

  public playTrailer(start: boolean, video: Triller = undefined) {
    if (start && video) {
      this.player.videoId = video.key;
      this.player.playVideo();
      this.clientCtx.playingEvent(true);
      setTimeout(() => {
        this.trailerRef.nativeElement.style.visibility = "visible";
      }, 300);
    } else {
      this.trailerRef.nativeElement.style.visibility = "hidden";
      this.player.stopVideo();
      this.clientCtx.playingEvent(false);
    }
    return false;
  }
}
