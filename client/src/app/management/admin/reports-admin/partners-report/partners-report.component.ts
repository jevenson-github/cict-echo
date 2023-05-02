import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-partners-report',
  templateUrl: './partners-report.component.html',
  styleUrls: ['./partners-report.component.css']
})
export class PartnersReportComponent {
  partnerArray: any[] = [];
  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.getPartners();
  }

  getPartners() {
    this.http.get('http://127.0.0.1:8000/api/partner/get-partner-active').subscribe((resultData: any) => {
      this.partnerArray = resultData;
      console.log(resultData);
    });

    setTimeout(() => {
      window.print();
    }, 500);
  }
}
