import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-footer-copyright",
  templateUrl: "./footer-copyright.component.html",
  styleUrls: ["./footer-copyright.component.css"],
})
export class FooterCopyrightComponent implements OnInit {
  Date = new Date();

  constructor() {}

  ngOnInit(): void {}
}
