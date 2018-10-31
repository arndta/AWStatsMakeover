import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ConfigService } from '../config/config.service';
import { IDataListing } from 'src/app/shared/interface/IDataListing';
import { FileListService } from '../filelist/filelist.service';

@Injectable()
export class SiteDataService {

    static dataList: IDataListing[];

    constructor(private http: Http, fileListService : FileListService) {}

    load() {
        return new Promise<void>((resolve, reject) => {
            FileListService.files.forEach(function(file){
                const jsonFile = `${ConfigService.config.dataRoot.replace(/\/$/, "")}/${file}`;
                this.http.get(jsonFile).toPromise().then((response : Response) => {
                    SiteDataService.dataList.push(response.json());
                    resolve();
                }).catch((response: any) => {
                    reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
                });
            });
            resolve();
        });
    }
}