import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef } from "ngx-bootstrap";
import { ArticleSeries } from "src/app/_models/articleSeries";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ArticleService } from "src/app/_services/article/article.service";

@Component({
  selector: "app-article-series-modal",
  templateUrl: "./article-series-modal.component.html",
  styleUrls: ["./article-series-modal.component.scss"],
})
export class ArticleSeriesModalComponent implements OnInit {
  @Output() addArticleSeries = new EventEmitter();
  articleSeries: ArticleSeries;
  subCategories: any;
  imageType: any;
  parentFrontPage: any;
  articleType: any;
  articleSeriesForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private alertify: AlertifyService,
    private router: Router,
    public modalRef: BsModalRef
  ) {}
  ngOnInit(): void {
    
    this.articleSeriesForm = this.fb.group({
      seriesTitle: ["", [Validators.required]],
    });
  }
  OnSubmit() {
    this.addArticleSeries.emit(this.articleSeriesForm);
    this.modalRef.hide();
  }
}
