import { Component, HostListener, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit{
  userData:any;
  token:any;

  last_name:any;
  first_name:any;
  designation:any;
  faculty:any;
  programArray: any[]=[];
  elementRef: any;

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



  constructor(private router:Router, private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.userData = jwt_decode(this.token);
    this.first_name = this.userData.firstName;
    this.last_name = this.userData.lastName;
    this.designation = this.userData.designation;
    this.faculty = this.userData.id;
  }

  ngOnInit(): void {
    this.getPrograms();
  }

  //sign out function
  signOut() {
    //remove the session token data
    localStorage.removeItem('token');

    //to navigate back to sign in page
    this.router.navigate(['auth/']);
  }

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

  isMenuOpen = false;
  isNotificationOpen = false;
  profile_image: any;


  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      this.isNotificationOpen = false; // Close notification dropdown if user clicks outside
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isNotificationOpen = false; // Close notification dropdown when account dropdown is opened
    }
  }

  toggleNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
    if (this.isNotificationOpen) {
      this.isMenuOpen = false; // Close account dropdown when notification dropdown is opened
    }
  }

}
