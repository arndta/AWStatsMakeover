import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { IConfig } from 'src/app/shared/interface/IConfig';

@Injectable()
export class ConfigService {

    static config: IConfig;

    constructor(private http: Http) {}

    load() {
        const jsonFile = `assets/config.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response : Response) => {
               ConfigService.config = <IConfig>response.json();
               resolve();
            }).catch((response: any) => {
               reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}