import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  stepOne = true;
  stepTwo = false;
  stepThree = false;
  stepFour = false;
  stepFive = false;

  goToStepOne() {
    this.stepOne = true;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
  }

  goToStepTwo() {
    this.stepOne = false;
    this.stepTwo = true;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = false;
  }

  goToStepThree() {
    this.stepOne = false;
    this.stepTwo = false;
    this.stepThree = true;
    this.stepFour = false;
    this.stepFive = false;
  }

  goToStepFour() {
    this.stepOne = false;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = true;
    this.stepFive = false;
  }

  goToStepFive() {
    this.stepOne = false;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = false;
    this.stepFive = true;
  }

  firstNameControl = new FormControl('', [Validators.required]);
  lastNameControl = new FormControl('', [Validators.required]);

  firstNameTouched = false;
  lastNameTouched = false;

  get firstNameValid() {
    return this.firstNameControl.valid || !this.firstNameTouched;
  }

  get lastNameValid() {
    return this.lastNameControl.valid || !this.lastNameTouched;
  }

  submitForm() {
    // do something when the form is submitted
  }

}
