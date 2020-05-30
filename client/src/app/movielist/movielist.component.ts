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
  public selectedItem: MediaItem;
  private isLoading: Boolean = false;
  private page: number = 1;
  public isEnd: Boolean = true;
  @ViewChild("parent", { static: true }) movielistRef: ElementRef;
  private eParent: any;

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
    this.selectedItem = item;
    this.modalService.open("video-link");
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  public onScroll() {
    this.loadMovie();
  }

  /*
  public playTrailer(start: boolean) {

    if (start) {
      this.ytPlayerService.load(this.video[this.videoId % this.video.length]);
      this.videoId++;
      this.ytPlayerService.play();
      setTimeout(() => {
        this.trailerRef.nativeElement.style.visibility = "visible";
      }, 300);
    } else {
      this.ytPlayerService.stop();
      this.trailerRef.nativeElement.style.visibility = "hidden";
    }
    return false;
  }
   */
}
