import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

const routes: Routes = [{
  path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'forgot', component: ForgotComponent },
      { path : 'sign-up', component: SignUpComponent},
      { path: '', component: SignInComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
