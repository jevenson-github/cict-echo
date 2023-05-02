import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MustMatch } from './confirmed.validator';

@Component({
  selector: 'app-navigation-admin',
  templateUrl: './navigation-admin.component.html',
  styleUrls: ['./navigation-admin.component.css']
})
export class NavigationAdminComponent implements OnInit {
  isMenuOpen = false;
  isNotificationOpen = false;
  userData: any;
  token: any;

  last_name: any;
  first_name: any;
  designation: any;
  profile_image: any;
  email: any;
  password: any;
  comfirmPassword: any;
  id: any;

  constructor(private elementRef: ElementRef, private router: Router, private http: HttpClient, private fb: FormBuilder, private fb2: FormBuilder) {
    this.token = localStorage.getItem('token');
    this.userData = jwt_decode(this.token);
    this.first_name = this.userData.firstName;
    this.last_name = this.userData.lastName;
    this.designation = this.userData.designation;
    this.profile_image = this.userData.profileImage;
    this.email = this.userData.emailAddress;
    this.id = this.userData.id;
  }


  ngOnInit(): void {
    this.createPasswordForm();
  }


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

  //sign out function
  signOut() {
    //remove the session token data
    localStorage.removeItem('token');

    //navigate back to sign in page
    this.router.navigate(['auth/']);

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
    this.http.post("http://127.0.0.1:8000/api/user/update-info/"+this.id, formData).subscribe((resultData: any) => {
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
      reader.onload = e => this.imagePreview = reader.result;

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
    this.http.post("http://127.0.0.1:8000/api/user/update-email/"+this.id, formData).subscribe((resultData: any) => {
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
    this.http.post("http://127.0.0.1:8000/api/user/update-password/"+this.id, this.passwordForm.value).subscribe((resultData: any) => {
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