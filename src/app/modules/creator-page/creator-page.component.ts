import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creator-page',
  templateUrl: './creator-page.component.html',
  styleUrls: ['./creator-page.component.css']
})
export class CreatorPageComponent implements OnInit {
  styleFloater: any
  href: any;
  constructor() { }

  ngOnInit() {
    this.href = location.pathname;
  }

}
