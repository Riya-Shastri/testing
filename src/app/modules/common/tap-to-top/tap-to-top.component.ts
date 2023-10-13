import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tap-to-top',
  templateUrl: './tap-to-top.component.html',
  styleUrls: ['./tap-to-top.component.scss']
})
export class TapToTopComponent implements OnInit {
  public showScroll: boolean;
  public showScrollHeight = 500;
  public hideScrollHeight = 10;
  
  constructor() { }

  ngOnInit() {
  }

  toTop(){
    window.scroll(0,0);
  }

  onActivate() {
    window.scroll(0,0);
    if (typeof window !== 'undefined') {
      const scrollToTop = window.setInterval(() => {
        const pos = window.pageYOffset;
        if (pos > 0) {
          window.scrollTo(0, pos - 200); // how far to scroll on each step
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 16);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      if ((window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > this.showScrollHeight) {
        this.showScroll = true;
      }
      else if (this.showScroll && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < this.hideScrollHeight) {
        this.showScroll = false;
      }
    }
  }
}
