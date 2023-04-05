import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

@NgModule({
  declarations: [
      AppComponent,
      SignInComponent,
      SignUpComponent,
      AuthComponent,
      ForgotComponent,
   ],
  imports: [BrowserModule, AppRoutingModule,
    AppRoutingModule,
    RouterModule.forRoot([
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
