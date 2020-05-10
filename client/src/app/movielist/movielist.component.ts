import { ModalService } from "./../services/modal.service";
import { ActivatedRoute } from "@angular/router";
import { AppUtils } from "./../Utils/app_utils";
import { MediaItem, MediaType } from "./../model/mediaItem.model";
import { ClientCtx } from "../model/client_ctx";
import { ApiMediaProvider, ProviderType } from "./../services/media.providers";
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Subscription } from "rxjs";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "app-movielist",
  templateUrl: "./movielist.component.html",
  styleUrls: ["./movielist.component.scss"],
})
export class MovielistComponent implements OnInit, OnDestroy, AfterViewInit {
  public title: string;
  private categoryId: number = NaN;
  public language: string = "pl";
  public movies: MediaItem[] = [];
  public selectedItem: MediaItem;
  private subscription: Subscription;
  private isLoading: Boolean = false;
  private page: number = 1;
  public isEnd: Boolean = true;
  @ViewChild("parent", { static: true }) movielistRef: ElementRef;
  private eParent: any;
  @ViewChild("mov", { static: true }) movRef: ElementRef;
  private movElement: any;

  constructor(
    private apiProvider: ApiMediaProvider,
    private activeRoute: ActivatedRoute,
    private clientCtx: ClientCtx,
    private modalService: ModalService,
    private deviceService: DeviceDetectorService
  ) {}

  ngAfterViewInit(): void {
    if (this.deviceService.browser === "IE") {
      this.movElement.style.maxWidth = "960px";
    }
  }

  private initData() {
    this.isLoading = false;
    this.isEnd = true;
    this.page = 1;
    this.movies = [];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }

  ngOnInit() {
    this.movElement = this.movRef.nativeElement;
    this.eParent = this.movielistRef.nativeElement;
    this.subscription = this.clientCtx.scrollDource$.subscribe(() => {
      this.loadMovie(this.categoryId);
    });

    this.activeRoute.params.subscribe((routeParams) => {
      if (routeParams.id === NaN) {
        return;
      }
      this.initData();
      this.categoryId = Number(routeParams.id);
      //get title
      this.title = this.clientCtx.getGenersNameByKod(this.categoryId);
      //load movies
      this.loadMovie(this.categoryId);
      //}
    });
  }

  posterMediumPath(madia: MediaItem): String {
    return AppUtils.getPosterMediumPathUrl(madia);
  }

  loadMovie(id: number) {
    if (this.categoryId === NaN || this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.apiProvider
      .getProvider(ProviderType.NET)
      .getMoviesForGenreIDs(this.language, this.page++, [id], "releaseDate")
      .subscribe((data: any) => {
        this.isEnd = (data as []).length === 0;
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
        //
        setTimeout(() => {
          //console.log(this.eParent.scrollHeight);
          //console.log(this.eParent.clientHeight);
          if (this.eParent.scrollHeight <= this.eParent.clientHeight) {
            this.loadMovie(this.categoryId);
          }
        }, 100);
      });
  }

  fetchNext() {
    this.loadMovie(this.categoryId);
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
}
