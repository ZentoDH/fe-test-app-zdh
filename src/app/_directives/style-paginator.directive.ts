import {
  ElementRef,
  AfterViewInit,
  Directive,
  Host,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
  Input
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatButton } from "@angular/material/button";

interface PageObject {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

@Directive({
  selector: '[exadsStylePaginator]'
})
export class StylePaginatorDirective {
  private _button = null

  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private vr: ViewContainerRef,
    private ren: Renderer2
  ) {
    // to rerender button when page changes
    this.matPag.page.subscribe((e: PageObject) => {
      this.initPageButton()
    });
  }

  //Initialize default state after view init
  public ngAfterViewInit() {
    this.initPageButton()
  }

  private initPageButton() {
    const actionContainer = this.vr.element.nativeElement.querySelector(
      "div.mat-paginator-range-actions"
    );
    const nextPageNode = this.vr.element.nativeElement.querySelector(
      "button.mat-paginator-navigation-next"
    );

    const matPaginatorPageSize = this.vr.element.nativeElement.querySelector(
      "div.mat-paginator-page-size"
    );
    const matPaginatorRangeLabel = this.vr.element.nativeElement.querySelector(
      "div.mat-paginator-range-label"
    );

    this.ren.setStyle(matPaginatorPageSize, "display", "none");
    this.ren.setStyle(actionContainer, "width", "100%");
    this.ren.setStyle(matPaginatorRangeLabel, "flex-grow", "1");

    if(this._button) this.ren.removeChild(actionContainer, this._button);

    this.ren.insertBefore(
      actionContainer,
      this.createButton(this.matPag.pageIndex),
      nextPageNode
    );
  }

  private createButton(pageIndex: number): any {
    const linkBtn: MatButton = this.ren.createElement("button");
    // this.ren.addClass(linkBtn, "mat-flat-button");
    this.ren.setStyle(linkBtn, "background-color", "#ececec");
    this.ren.setStyle(linkBtn, "color", "#707070");
    this.ren.setStyle(linkBtn, "padding", "0 5px");
    this.ren.setStyle(linkBtn, "min-width", "30px");
    this.ren.setStyle(linkBtn, "height", "25px");
    this.ren.setStyle(linkBtn, "font-weight", "bold");
    this.ren.setStyle(linkBtn, "border", "0");
    this.ren.setStyle(linkBtn, "border-radius", "5px");

    const pagingTxt = pageIndex + 1
    const text = this.ren.createText(pagingTxt + "");

    this.ren.addClass(linkBtn, "mat-custom-page");

    this.ren.appendChild(linkBtn, text);
    this._button = linkBtn;
    return linkBtn;
  }

}
