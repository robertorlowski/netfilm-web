import { ClientCtx } from "./model/client_ctx";
import { ScrollEvent } from "ngx-scroll-event";
import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "net-film";
  @Output() scroll = new EventEmitter<ScrollEvent>();
  @ViewChild("content", { static: true }) content: ElementRef;

  constructor(private clientCtx: ClientCtx) {}

  public handleScroll(event: ScrollEvent) {
    this.clientCtx.scrollEvent(event);
  }
}
