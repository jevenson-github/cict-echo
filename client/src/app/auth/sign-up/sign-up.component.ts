import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

  ngOnInit() { }

  constructor(private http: HttpClient, private router: Router) { }

  // Always show first step on start
  step = 1;

  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;
  stepFive: boolean = false;

  // Loading buttons
  stepOneloading: boolean = false;

  // Form models

  id: any;
  email: any;
  firstName: any;
  lastName: any;
  department: any;
  designation: any;
  password: any;
  confirmPassword: any;

  gotoStepOne() {
    this.step = 1;
  }

  gotoStepTwo() {
    this.step = 2;
  }

  gotoStepThree() {
    this.step = 3;
  }

  gotoStepFour() {
    this.step = 4;
  }

  gotoStepFive() {
    this.step = 5;
  }

  gotoStepSix() {
    this.step = 6;
  }

  goBack() {
    this.step = this.step - 1;
  }

  reviewAgain() {
    this.step = 1;
  }

  submitRegistration() {
    const queryParams = {
      'signUpResponse': 'success',
      'email': this.email
    };

    this.router.navigate(['/auth'], { queryParams: queryParams });

  }

  submitInfo(){
    var formData = new FormData();
    formData.append("id",  this.id);
    formData.append("first_name",  this.firstName);
    formData.append("last_name",  this.lastName);
    formData.append("email", this.email);
    formData.append("password", this.password);
    formData.append("department",  this.department);
    formData.append("designation",  this.designation);
    formData.append("user_level", "faculty");
    formData.append("status", "pending");
    formData.append("profile_image",  this.image, this.image.name);

    this.http.post(environment.apiUrl + "//auth/sign-up", formData).subscribe((resultData: any) => {
      console.log(resultData);
    });

    console.log(this.id);
    console.log(this.firstName);
    console.log(this.lastName);
    console.log(this.email);
    console.log(this.department);
    console.log(this.designation);
    console.log(this.password);
    console.log(this.image);
  }

  image: any;
  imageSRC: any;

  onFileSelected(event: any) {
    // const file: File = event.target.files[0];
    // if (file) {
    //   this.fileToUpload = file;
    //   this.imageUrl = URL.createObjectURL(file);
    // }

    this.image = event.target.files[0];
    console.log(this.image);

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSRC = reader.result;

      reader.readAsDataURL(file);
  }
  }

}
