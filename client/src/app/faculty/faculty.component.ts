import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MustMatch } from './confirmed.validator';
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

  profile_image: any;
  email: any;
  password: any;
  comfirmPassword: any;
  id: any;
  initials: any;

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



  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.token = localStorage.getItem('token');
    this.userData = jwt_decode(this.token);
    this.id = this.userData.id;
  }


  ngOnInit(): void {
    const userId = this.userData.id;
    
    this.http.get(environment.apiUrl + "/user/get-user/" + userId ).subscribe((resultData: any) => {
      this.last_name = resultData.last_name;
      this.first_name = resultData.first_name;
      this.designation = resultData.designation;
      this.initials = resultData.first_name.charAt(0) + resultData.last_name.charAt(0);
    });

    this.createPasswordForm();
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
    this.http.get(environment.apiUrl + '/program/display-program' + '/' + this.id).subscribe((resultData:any) => {
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

  showToast() {
    if (this.updatePassToast === true ||
        this.updateInfoToast === true ||
        this.updateEmailToast === true ) {
      setTimeout(() => {
        this.updatePassToast = false;
        this.updateInfoToast = false;
        this.updateEmailToast = false;
      }, 5000);
    }
  }

  //Update Modal
  updateModal: boolean = false;
  submitted = false;

  settings() {
    this.isMenuOpen = false;
    this.updateModal = true;
  }

  // Info form (fname, lname, email)

  updateInfoLoading: boolean = false;
  updateInfoToast: boolean = false;


  updateInfo(){

    var formData = new FormData();
    formData.append("first_name",  this.first_name);
    formData.append("last_name",  this.last_name);
    if (this.imageToUpdate){
      formData.append("profile_image",  this.imageToUpdate, this.imageToUpdate.name);
    }

    this.updateInfoLoading = true;
    this.http.post(environment.apiUrl + "/user/update-info/"+this.id, formData).subscribe((resultData: any) => {
      console.log(resultData);
      this.updateModal = false;
      this.updateInfoLoading = false;
      this.updateInfoToast = true;

      this.showToast();
    });

  }

  imageToUpdate: any;
  imagePreview: any;

  onFileSelected(event: any) {
    this.imageToUpdate = event.target.files[0];
    console.log(this.imageToUpdate);

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;

      reader.readAsDataURL(file);
    }
  }

  // email form
  updateEmailLoading: boolean = false;
  updateEmailToast: boolean = false;

  updateEmail(){
    var formData = new FormData();
    formData.append("email",  this.email);

    this.updateEmailLoading = true;
    this.http.post(environment.apiUrl + "/user/update-email/"+this.id, formData).subscribe((resultData: any) => {
      console.log(resultData);
      this.updateModal = false;
      this.updateEmailLoading = false;
      this.updateEmailToast = true;
      this.showToast();
    });
  }


  // password form
  passwordForm!: FormGroup;
  //updatePass: boolean = false;

  updatePassLoading: boolean = false;
  updatePassToast: boolean = false;

  get f() {
    return this.passwordForm.controls;
  }

  createPasswordForm() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]},
      { validator: MustMatch('password', 'confirmPassword')});
  }

  updatePassword(){
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return
    }

    this.updatePassLoading = true;
    this.http.post(environment.apiUrl + "/user/update-password/"+this.id, this.passwordForm.value).subscribe((resultData: any) => {
      console.log(resultData);
      this.updateModal = false;
      this.updatePassLoading = false;
      this.updatePassToast = true;

      this.showToast();
    });

    this.submitted = false;
    this.passwordForm.reset();
  }

}
