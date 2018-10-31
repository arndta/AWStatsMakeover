import { Injectable } from '@angular/core';
import { FileListService } from '../data/filelist/filelist.service';
import { IYear } from './interface/IYear';
import { ivyEnabled } from '@angular/core/src/ivy_switch';

@Injectable()
export class DatesService {

    constructor() {}

    getDatesList() : IYear[] {
        var dates = this.getDates();
        var years = this.getYears(dates);
        var dateList : IYear[];
        years.forEach(function (year) {
            var date : IYear = { year: parseInt(year), months: this.getMonths(dates, year)};
            dateList.push(date);
        });

        return dateList;
    }

    private getYears(dates : string[]) : string[] {
        var years : string[];
        dates.forEach(function(date){
            var year = date.split('-')[1];
            if (years.indexOf(year) == -1)
            {
                years.push(year);
            }
        });

        return years;
    }

    private getMonths(dates : string[], year : string) : string[] {
        var months : string[];
        dates.forEach(function(date){
            var parts = date.split('-'); 
            if (parts[1] == year) {
                if (months.indexOf(parts[0]) == -1)
                {
                    months.push(parts[0]);
                }                    
            }
        });

        return months;
    }

    private getDates() : string[] {
        var dates : string[];
        FileListService.files.forEach(function (file) {
            var date = file.split('.')[0].toLowerCase().replace('awstats', '');
            dates.push(`${date.substr(0,2)}-${date.substr(2)}`);
        });
        return dates;
    }
}