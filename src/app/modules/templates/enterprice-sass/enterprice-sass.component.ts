import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ColorScssService } from 'src/app/_services/shared/color-scss.service';

@Component({
  selector: 'app-enterprice-sass',
  templateUrl: './enterprice-sass.component.html',
  styleUrls: ['./enterprice-sass.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EnterpriceSassComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private title: Title,
    public colorPicker: ColorScssService) { }


  ngOnInit() {
    this.title.setTitle(this.route.snapshot.data['title']);
    this.colorPicker.setColorScheme('color-8');

  }

}
