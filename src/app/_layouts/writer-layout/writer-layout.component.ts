import { Component, OnInit, Input } from '@angular/core';
import { Step } from 'src/app/_models/step';
import { Article } from 'src/app/_models/article';

@Component({
  selector: 'app-writer-layout',
  templateUrl: './writer-layout.component.html',
  styleUrls: ['./writer-layout.component.css']
})
export class WriterLayoutComponent implements OnInit {
  @Input() steps: Step[];
  @Input() article: Article;
  constructor() { }

  ngOnInit() {
  }
  
}
