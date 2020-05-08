import { ClientCtx } from "../model/client_ctx";
import { Observable } from "rxjs";
import { ResultGenres, Genres } from "./../model/genres.model";
import { ApiMediaProvider, ProviderType } from "./../services/media.providers";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  constructor(
    private apiProvider: ApiMediaProvider,
    private router: Router,
    private clientCtx: ClientCtx
  ) {}
  public genres: Genres[];
  faArrowRight = faArrowRight;

  ngOnInit() {
    this.apiProvider
      .getProvider(ProviderType.NET)
      .loadGenres("pl")
      .subscribe((data: ResultGenres) => {
        this.genres = data.genres;
        this.clientCtx.geners = data.genres;
        this.router.navigate([`movielist/${this.genres[0].id}`]);
      });
  }

  ngAfterViewInit() {}
}
