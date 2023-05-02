import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports-admin',
  templateUrl: './reports-admin.component.html',
  styleUrls: ['./reports-admin.component.css']
})
export class ReportsAdminComponent implements OnInit {

  programArray: any[]=[];
  partnerArray: any[] = [];

  constructor(private http: HttpClient) {};
  ngOnInit(): void {
   this.getPrograms();
   this.getPartners();

  }

  // all programs fetching
  getPrograms() {
    this.http.get('http://127.0.0.1:8000/api/program/index-program').subscribe((resultData:any) => {
    this.programArray = resultData;
    console.log(resultData);
    });
  }


  getPartners(){
    this.http.get('http://127.0.0.1:8000/api/partner/get-partner-active').subscribe((resultData:any) => {
      this.partnerArray = resultData;
      console.log(resultData);
      });
  }  

}
