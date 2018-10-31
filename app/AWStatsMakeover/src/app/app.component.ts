import { Component } from '@angular/core';
import { ConfigService } from './data/config/config.service';
import { FileListService } from './data/filelist/filelist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(configService : ConfigService, fileListService : FileListService) {
    configService.load();
    fileListService.load();
  }
}
