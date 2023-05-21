import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch2 } from 'src/app/confirmed2.validator';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private formBuilder: FormBuilder) { }

  email: string | undefined;

  submitted = false;

  // form!: FormGroup;
  formReset!: FormGroup;
  messageHolder: any;
  loading: boolean = false;


  ngOnInit(): void {
    // set the parameter value and get
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log(this.email);

    });
    this.validateNewPassword();
  }

  validateNewPassword() {
    this.formReset = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
      { validator: MustMatch2('password', 'confirmPassword') });
  }


  get f() {
    return this.formReset.controls;
  }

  resetPassword() {
    this.submitted = true;
    this.loading = true;

    if (this.formReset.invalid) {
      return;
    }
    this.http.post(environment.apiUrl + '/user/reset-password' + '/' + this.email, this.formReset.value).subscribe(response => {
      this.loading = true;
      console.log(response);
      this.messageHolder = response;

      if (this.messageHolder.status == 'Successful') {
        const queryParams = {
          'resetResponse': 'success',
        };
        this.router.navigate(['auth'], { queryParams: queryParams });
      }
      else if (this.messageHolder.status == 'Error') {
        alert(this.messageHolder.message);
      }
    });
    this.submitted = false;
    this.formReset.reset();
    this.loading = false;
  }

}
