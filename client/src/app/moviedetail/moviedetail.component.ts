import { YouTubePlayer } from "./../Utils/youtube-player";
import { ApiMediaProvider, ProviderType } from "./../services/media.providers";
import { Subscription } from "rxjs";
import { ClientCtx } from "./../model/client_ctx";
import { MediaItem } from "./../model/mediaItem.model";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
@Component({
  selector: "app-moviedetail",
  templateUrl: "./moviedetail.component.html",
  styleUrls: ["./moviedetail.component.scss"],
})
export class MoviedetailComponent implements OnInit, OnDestroy {
  movie: MediaItem = new MediaItem();
  video: Array<string> = [];
  videoId: number = 0;
  ytVideo: string;
  videoStart: boolean = false;
  geners: string;
  errorImg: boolean = false;

  private exec: any;
  private mediaSubscription: Subscription;
  private ytStatusSubscription: Subscription;

  @ViewChild("player", { static: true }) player: YouTubePlayer;

  playerVars: YT.PlayerVars = {
    autoplay: YT.AutoPlay.AutoPlay,
    controls: YT.Controls.Hide,
    autohide: YT.AutoHide.HideAllControls,
    cc_load_policy: YT.ClosedCaptionsLoadPolicy.ForceOn,
    iv_load_policy: YT.IvLoadPolicy.Hide,
    modestbranding: YT.ModestBranding.Modest,
    rel: YT.RelatedVideos.Hide,
    showinfo: YT.ShowInfo.Hide,
  };

  constructor(
    public clientCtx: ClientCtx,
    private apiProvider: ApiMediaProvider
  ) {}

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe;
    this.ytStatusSubscription.unsubscribe;
  }

  ngOnInit() {
    this.mediaSubscription = this.clientCtx.mediaSource$.subscribe(
      (item: MediaItem) => {
        if (this.exec) {
          clearTimeout(this.exec);
        }
        this.exec = setTimeout(async () => {
          await this.init(item);
        }, 300);
      }
    );

    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    this.ytStatusSubscription = this.player.stateChange.subscribe(
      (data: any) => {
        console.log(data);
        switch (data.data) {
          case YT.PlayerState.ENDED:
            if (this.videoId < this.video.length) {
              this.playTrailer(true);
            } else {
              this.playTrailer(false);
            }
            break;
          case YT.PlayerState.UNSTARTED:
            this.player.playVideo();
            break;
          case YT.PlayerState.PLAYING:
            setTimeout(() => {
              this.videoStart = true;
            }, 1000);
            break;
          default:
            break;
        }
      }
    );
  }

  async init(item: MediaItem) {
    this.errorImg = false;
    this.movie = item;
    this.video = [];
    this.videoId = 0;

    this.playTrailer(false);

    if (!item.id) {
      return;
    }

    this.geners = await this.clientCtx.getGenersNameByIdList(item.genreIds);
    this.apiProvider
      .getProvider(ProviderType.NET)
      .getVideos(item.id)
      .subscribe((data: any) => {
        data.results.forEach((element: any) => {
          this.video.push(element.key);
        });
        setTimeout(() => {
          this.playTrailer(true);
        }, 2000);
      });
  }

  public playTrailer(start: boolean) {
    if (start) {
      const vvID = this.video[this.videoId % this.video.length];
      console.log("---------------------PLAY --------------------");
      this.player.stopVideo();
      this.player.videoId = vvID;
      this.videoId++;
      this.player.mute();
      this.player.playVideo();
    } else {
      this.videoStart = false;
      this.player.stopVideo();
    }
    return false;
  }
}
