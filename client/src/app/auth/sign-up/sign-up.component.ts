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

  // Loading buttons
  stepOneloading: boolean = false;

  // Form models
  id: any;
  email: any;
  firstName: any ;
  lastName: any;
  department: any;
  designation: any;
  password: any;
  confirmPassword: any;

  profilePictureUrl: string = '';
  idCardUrl: string = '';

  // Error messages
  idErrorMessage = '';
  emailErrorMessage = '';

  firstNameErrorMessage = '';
  lastNameErrorMessage = '';

  // Error flags
  showIdError = false;
  showEmailError = false;

  showFirstNameError = false;
  showLastNameError = false;

  firstNameTouched: boolean = false;
  lastNameTouched: boolean = false;

  showDepartmentError: boolean = false;
  showDesignationError: boolean = false;

  profilePicture: any;
  idCard: any;


  gotoStepOne() {
    this.step = 1;
  }

  gotoStepTwo() {

    // Validate ID input field
    if (!this.id) {
      // Show error message for blank ID
      this.showIdError = true;
      this.idErrorMessage = 'ID must not be blank.';
    } else if (!/^([0-9]{4})-([0-9]{3})$/.test(this.id)) {
      // Show error message for invalid ID pattern
      this.showIdError = true;
      this.idErrorMessage = 'The ID pattern is not matched (e.g., XXXX-XXX).';
    } else {
      // Hide error message for ID
      this.showIdError = false;
    }

    // Validate email input field
    if (!this.email) {
      // Show error message for blank email
      this.showEmailError = true;
      this.emailErrorMessage = 'Email must not be blank.';
    } else if (!this.email.endsWith('@bulsu.edu.ph')) {
      // Show error message for invalid email domain
      this.showEmailError = true;
      this.emailErrorMessage = 'It must be the institutional email (e.g., @bulsu.edu.ph).';
    } else {
      // Hide error message for email
      this.showEmailError = false;
    }

    // Check credentials if no validation errors
    if (!this.showIdError && !this.showEmailError) {
      this.stepOneloading = true;

      const data = {
        id: this.id,
        email: this.email
      };

      this.http.post(environment.apiUrl + '/auth/credential-check', data).subscribe(
        (response: any) => {
          if (response.errors) {
            // Handle validation errors here
            this.stepOneloading = false;
            this.showIdError = response.errors.id ? true : false;
            this.showEmailError = response.errors.email ? true : false;

            // Handle non-unique ID and email fields here
            if (response.errors.id && response.errors.id[0] === 'The id has already been taken.') {
              this.idErrorMessage = 'The ID is already used.';
              this.showIdError = true;
            }

            if (response.errors.email && response.errors.email[0] === 'The email has already been taken.') {
              this.emailErrorMessage = 'The email is already used.';
              this.showEmailError = true;
            }
          } else {
            // Handle success response here
            console.log(response);
            this.stepOneloading = false;
            this.step = 2;
          }
        },
        (error) => {
          // Handle error response here
          this.stepOneloading = false;
        }
      );



    }
  }



  gotoStepThree() {
    // Check if both fields have been touched and are not empty
    if (this.firstName && this.firstNameTouched && this.lastName && this.lastNameTouched) {
      this.step = 3;
    } else {
      // Show error messages for empty fields
      if (!this.firstName) {
        this.firstNameTouched = true;
      }
      if (!this.lastName) {
        this.lastNameTouched = true;
      }
    }
  }



  gotoStepFour(): void {
    // check if department and designation have been selected
    if (!this.department || !this.designation) {
      this.showDepartmentError = !this.department;
      this.showDesignationError = !this.designation;
      return;
    }
  
    // proceed to step 4
    this.step = 4;
  }
  

  gotoStepFive() {

    // Proceed to next step
    this.step = 5;
  }

  imgPP: any;
  imgPPsrc: any;

  onFileSelectedProfile(event: any) {
    this.imgPP = event.target.files[0];
    console.log(this.imgPP);

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imgPPsrc = reader.result;

      reader.readAsDataURL(file);
    }
  }
  

  gotoStepSix() {
    this.step = 6;

  }

  imgID: any;
  imgIDsrc: any;

  onFileSelectedId(event: any) {
    this.imgID = event.target.files[0];
    console.log(this.imgID);

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imgIDsrc = reader.result;

      reader.readAsDataURL(file);
    }
  }
  

  gotoStepSeven() {
    this.step = 7;
  }

  goBack() {
    this.step = this.step - 1;
  }

  reviewAgain() {
    this.step = 1;
  }

  submitRegistration() {
    const formData = new FormData();
    formData.append('id', this.id);
    formData.append('email', this.email);
    formData.append('first_name', this.firstName);
    formData.append('last_name', this.lastName);
    formData.append('department', this.department);
    formData.append('designation', this.designation);
    formData.append('password', this.password);
    formData.append('confirmPassword', this.confirmPassword);
    formData.append('profilePicture', this.imgPP, this.imgPP.name);
    formData.append('idCard', this.imgID, this.imgID.name);


    this.http.post(environment.apiUrl + '/auth/sign-up', formData).subscribe(
      (response: any) => {
        console.log(response);
  
        const queryParams = {
          'signUpResponse': 'success',
          'email': this.email
        };
    
        this.router.navigate(['/auth'], { queryParams: queryParams });
      },
      (error) => {
        console.error(error);
        // Handle errors here
      }
    );

    

  }


}