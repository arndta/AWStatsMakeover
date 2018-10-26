import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ConfigService } from '../config/config.service';

@Injectable()
export class FileListService {

    constructor(private http: Http) {}

    load() {
        const jsonFile = `${ConfigService.config.dataRoot.replace(/\/$/, "")}/fileindex.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response : Response) => {
               resolve(response.json());
            }).catch((response: any) => {
               reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}