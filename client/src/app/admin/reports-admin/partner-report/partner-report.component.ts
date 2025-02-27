import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-partner-report',
  templateUrl: './partner-report.component.html',
  styleUrls: ['./partner-report.component.css']
})
export class PartnerReportComponent implements OnInit {
  partnerArray: any[] = [];
  partnerId: any;


  constructor(private http: HttpClient, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    // set the parameter value and get
    this.route.queryParams.subscribe(params => {
      this.partnerId = params['partnerId'];
      console.log(this.partnerId);
    });

    this.fetchPartnerDetails();
  }



  fetchPartnerDetails() {
    this.http.get(environment.apiUrl + '/partner/get-partner' + '/' + this.partnerId).subscribe((resultData: any) => {
      this.partnerArray = resultData;
      console.log(this.partnerArray);

    });
    setTimeout(() => {
      window.print();
    }, 500);
  }
}
