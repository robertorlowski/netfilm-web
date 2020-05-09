import { ClientCtx } from "./model/client_ctx";

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
  @Output() scroll = new EventEmitter<any>();
  @ViewChild("content", { static: true }) content: ElementRef;

  constructor(private clientCtx: ClientCtx) {
    console.log("START");
  }

  public onScroll(event: any) {
    this.clientCtx.scrollEvent(event);
  }
}
