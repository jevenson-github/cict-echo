import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent {

  userData:any;
  token:any;

  last_name:any;
  first_name:any;
  designation:any;
  faculty:any;
  programArray: any[]=[];
  elementRef: any;

  ngOnInit(): void {
    this.getPrograms();
  }

  constructor(private router:Router, private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.userData = jwt_decode(this.token);
    this.first_name = this.userData.firstName;
    this.last_name = this.userData.lastName;
    this.designation = this.userData.designation;
    this.faculty = this.userData.id;
  };

  getPrograms() {
    this.http.get(environment.apiUrl + '/program/display-program' + '/' + this.faculty).subscribe((resultData:any) => {
    this.programArray = resultData.programs;
    console.log(resultData);
    });
  }
  

  detailsHolder:any[]=[];
  membersHolder:any[]=[];

  viewModal:boolean = false;
  
  viewProgramDetails(data:any) {
    this.viewModal = true;
    this.http.get(environment.apiUrl + '/program/display-program-title' + '/' + data.id).subscribe((resultData:any) => {
      this.detailsHolder = resultData.programs;
      this.membersHolder = resultData.members;
      console.log(this.detailsHolder);
      console.log(this.membersHolder);
      });
  }

  computeDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date();

    // Set the time of the current date to midnight to compare only the dates
    currentDate.setHours(0, 0, 0, 0);

    const duration = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(duration / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays === -1) {
      return 'Tomorrow';
    } else {
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
  }


  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }


}
