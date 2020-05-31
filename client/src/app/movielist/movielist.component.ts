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
  public page: number = 1;
  public isEnd: Boolean = true;
  @ViewChild("parent", { static: true }) movielistRef: ElementRef;
  private eParent: any;
  @ViewChild("trailer", { static: true }) trailerRef: ElementRef;
  @ViewChild("player", { static: true }) player: YouTubePlayer;

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
          this.fetchMovie(0);
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
  }

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

        if (this.movies.length > 0) {
          this.showDetails(this.movies[0]);
        }
        this.isLoading = false;
      });
  }

  fetchMovie(step: number = 1) {
    if (this.categoryId === NaN || this.isLoading) {
      return;
    }
    if (this.page + step < 1) {
      return;
    }
    this.clientCtx.mediaEvent(new MediaItem());
    this.isLoading = true;
    this.movies = [];
    this.page = this.page + step;
    this.apiProvider
      .getProvider(ProviderType.NET)
      .getMoviesForGenreIDs(
        this.language,
        this.page,
        [this.categoryId],
        "releaseDate"
      )
      .subscribe((data: any) => {
        this.isEnd = (data as []).length === 0;

        this.isLoading = false;
        for (let ooo of data) {
          this.movies.push(MediaItem.getMediaItem(ooo, MediaType.db));
        }
        this.eParent.scrollTo(0, 0);

        if (this.movies.length > 0) {
          this.showDetails(this.movies[0]);
        }
      });
  }

  posterMediumPath(madia: MediaItem): String {
    return AppUtils.getPosterMediumPathUrl(madia);
  }

  showDetails(item: MediaItem) {
    this.clientCtx.mediaEvent(item);
  }

  showDetailWindow(id: string, item: MediaItem) {
    this.videoIDs = [];
    this.selectedItem = item;

    this.apiProvider
      .getProvider(ProviderType.NET)
      .getVideos(item.id)
      .subscribe((data: any) => {
        data.results.forEach((element: Triller) => {
          this.videoIDs.push(element);
        });
        this.modalService.open(id);
      });
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  public onScroll() {
    //this.fetchMovie();
  }

  public playTrailer(start: boolean, video: Triller = undefined) {
    if (start && video) {
      this.player.videoId = video.key;
      this.clientCtx.playingEvent(true);
      this.player.playVideo();
      setTimeout(() => {
        this.trailerRef.nativeElement.style.visibility = "visible";
      }, 300);
    } else {
      this.player.stopVideo();
      this.trailerRef.nativeElement.style.visibility = "hidden";
      this.clientCtx.playingEvent(false);
    }
    return false;
  }
}
