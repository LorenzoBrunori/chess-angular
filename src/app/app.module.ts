import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { MenuComponent } from "./menu/menu.component";
import { ChessBoardComponent } from "./chess-board/chess-board.component";
import { FooterCopyrightComponent } from "./footer-copyright/footer-copyright.component";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ChessBoardComponent,
    FooterCopyrightComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
