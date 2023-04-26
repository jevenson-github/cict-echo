import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signUpResponse: string | undefined;
  forgotPasswordResponse: string | undefined;
  email: string | undefined;
  emailForgot: string | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.forgotPasswordResponse = params['forgotPasswordResponse'];
      this.emailForgot = params['emailForgot'];
    });
    this.route.queryParams.subscribe(params => {
      this.signUpResponse = params['signUpResponse'];
      this.email = params['email'];
    });

  }
}
