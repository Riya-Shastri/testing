import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Article } from 'src/app/_models/article';

@Component({
  selector: 'app-article-reject-modal',
  templateUrl: './article-reject-modal.component.html',
  styleUrls: ['./article-reject-modal.component.css']
})
export class ArticleRejectModalComponent implements OnInit {
  article: Article;
  rejectionForm: FormGroup
  @Output() updateSelectedArticle = new EventEmitter();

  constructor(private fb: FormBuilder,public modalRef : BsModalRef) { }

  ngOnInit() {
    
      this.rejectionForm = this.fb.group({
        rejectionSuggestions: ['', Validators.required]
      });
  }

  OnSubmit(article){
    this.article.rejectionSuggestions = article.value.rejectionSuggestions;
    this.updateSelectedArticle.emit(this.article);
    this.modalRef.hide();
  }

  setValues(){
    if(this.article === undefined){
    }else{
      this.rejectionForm.get('rejectionSuggestions').setValue(this.article.rejectionSuggestions);
    }
  }

}
