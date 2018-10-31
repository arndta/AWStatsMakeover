import { Component } from '@angular/core';
import { ConfigService } from 'src/app/data/config/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title : string;

  constructor() {
    this.title = ConfigService.config.siteTitle;
    console.log(this.title);
  }
}
