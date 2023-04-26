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

  id: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  department: string = '';
  designation: string = '';
  password: string = '';
  confirmPassword: string = '';

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

}
