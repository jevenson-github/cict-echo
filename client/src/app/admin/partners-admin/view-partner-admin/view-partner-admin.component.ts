import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-partner-admin',
  templateUrl: './view-partner-admin.component.html',
  styleUrls: ['./view-partner-admin.component.css']
})

export class ViewPartnerAdminComponent {
  partnerID: any;
  programsArray: any[] = [];
  partnerArray: any[] = [];
  moaArray: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.partnerID = params['partnerID'];
      console.log(this.partnerID);
    });

    this.http.get(environment.apiUrl + '/partner/get-partner/' + this.partnerID).subscribe((resultData: any) => {

      this.programsArray = resultData.programs;
      this.partnerArray = resultData.partner;

      console.log(this.programsArray);
      console.log(this.partnerArray);
    });

    this.http.get(environment.apiUrl + '/partner/get-moa-files' + '/' + this.partnerID).subscribe(
      (response: any) => {
        this.moaArray = response;
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );

  }


  computeDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.abs(end.getTime() - start.getTime());

    const years = Math.floor(duration / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(duration / (1000 * 60 * 60 * 24 * 30));
    const weeks = Math.floor(duration / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));

    if (years >= 1) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months >= 1) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else if (weeks >= 1) {
      return `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
