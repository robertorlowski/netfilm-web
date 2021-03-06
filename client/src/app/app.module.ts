import { ModalService } from "./services/modal.service";
import { ClientCtx } from "./model/client_ctx";
import { RouterModule, Routes } from "@angular/router";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ApiMediaProvider } from "./services/media.providers";
import { ApiClientNet } from "./services/api_client_net";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MovielistComponent } from "./movielist/movielist.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MoviedetailComponent } from "./moviedetail/moviedetail.component";
import { ModalComponent } from "./modal-component/modal-component.component";
import { YouTubePlayer } from "./Utils/youtube-player";

const routes: Routes = [
  { path: "movielist", component: MovielistComponent },
  { path: "", redirectTo: "/", pathMatch: "full" },
  { path: "**", component: AppComponent },
  { path: "**", component: AppComponent },
];
@NgModule({
  declarations: [
    YouTubePlayer,
    AppComponent,
    SidebarComponent,
    MovielistComponent,
    MoviedetailComponent,
    ModalComponent,
  ],
  imports: [
    InfiniteScrollModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      onSameUrlNavigation: "reload",
    }),
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ApiMediaProvider,
    ApiClientNet,
    HttpClient,
    ClientCtx,
    ModalService,
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
