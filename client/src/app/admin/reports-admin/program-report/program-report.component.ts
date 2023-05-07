import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-program-report',
  templateUrl: './program-report.component.html',
  styleUrls: ['./program-report.component.css']
})
export class ProgramReportComponent implements OnInit {
  programId:any;


  detailsHolder:any[]=[];
  membersHolder:any[]=[];


  constructor(private route: ActivatedRoute , private http: HttpClient){
  }
  ngOnInit(): void {
     // set the parameter value and get
  this.route.queryParams.subscribe(params => {
    this.programId = params['programId'];
    console.log(this.programId);
  });

  this.fetchProgramDetails();
  }

  fetchProgramDetails(){

    this.http.get(environment.apiUrl + '/program/display-program-title' + '/' + this.programId).subscribe((resultData:any) => {
      this.detailsHolder = resultData.programs;
      this.membersHolder = resultData.members;
      console.log(this.detailsHolder);
      console.log(this.membersHolder);
      });


      setTimeout(() => {
        window.print();
      }, 500);

  }
}
