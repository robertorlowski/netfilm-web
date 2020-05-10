import { ClientCtx } from "./model/client_ctx";

import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
  title = "net-film";
  @Output() scroll = new EventEmitter<any>();
  @ViewChild("main", { static: true }) main: ElementRef;
  @ViewChild("content", { static: true }) content: ElementRef;

  constructor(private clientCtx: ClientCtx) {
    console.log("START");
  }

  ngAfterViewInit(): void {
    this.content.nativeElement.style.maxHeight =
      this.main.nativeElement.clientHeight - 390 + "px";
  }

  public onScroll(event: any) {
    this.clientCtx.scrollEvent(event);
  }
}
