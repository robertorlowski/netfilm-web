import { ClientCtx } from "../model/client_ctx";
import { ResultGenres } from "./../model/genres.model";
import { ApiMediaProvider, ProviderType } from "./../services/media.providers";
import { Component, OnInit } from "@angular/core";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  private exec: any;

  faArrowRight = faArrowRight;
  serchValue: string;
  private lastId: number;

  constructor(
    private apiProvider: ApiMediaProvider,
    private router: Router,
    public clientCtx: ClientCtx
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.apiProvider
      .getProvider(ProviderType.NET)
      .loadGenres("pl")
      .subscribe((data: ResultGenres) => {
        this.clientCtx.geners = data.genres;
        this.lastId = this.clientCtx.geners[0].id;
        this.navigateToStart();
      });
  }
  navigateToStart() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.lastId,
      },
    };
    this.router.navigate([`movielist`], navigationExtras);
  }

  clearSearch() {
    this.serchValue = "";
    this.navigateToStart();
  }

  routerChange(id: number) {
    this.lastId = id;
    this.serchValue = "";
    console.log(id);
  }

  onSearchChange(searchValue: string): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        query: searchValue,
      },
    };

    if (this.exec) {
      clearTimeout(this.exec);
    }
    this.exec = setTimeout(async () => {
      this.router.navigate([`movielist`], navigationExtras);
    }, 500);
  }
}
