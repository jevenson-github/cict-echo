import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

// Import components for AUTH
import { AuthComponent } from './management/auth/auth.component';
import { SignInComponent } from './management/auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './management/auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './management/auth/sign-up/sign-up.component';

// Import components for ADMIN
import { AdminComponent } from './management/admin/admin.component';
import { FacultyAdminComponent } from './management/admin/faculty-admin/faculty-admin.component';

// Import components for FACULTY
import { FacultyComponent } from './management/faculty/faculty.component';
import { DashboardAdminComponent } from './management/admin/dashboard-admin/dashboard-admin.component';
import { ResetPasswordComponent } from './management/auth/wizard/reset-password/reset-password.component';




const routes: Routes = [
  {
    path: 'management',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardAdminComponent },
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'faculty', component: FacultyAdminComponent}
    ],
  },

  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', component: SignInComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
    ],
  },

  {
    path: 'faculty',
    component: FacultyComponent,
    children: [{ path: '', component: FacultyComponent }],
  },

  // {
  //   path: 'auth',
  //   component: AuthComponent,
  //   children: [
  //     { path: '', component: SignInComponent },
  //     { path: 'forgot', component: ForgotComponent },
  //     { path: 'sign-up', component: StepOneComponent },
  //     { path: 'sign-up/step-two', component: StepTwoComponent },
  //     { path: 'sign-up/step-three', component: StepThreeComponent},
  //     { path: 'sign-up/step-four', component: StepFourComponent},
  //     { path: 'sign-up/step-five', component: StepFiveComponent},
  //     { path: 'sign-up/setup-complete', component: SetupCompleteComponent},
  //   ],
  // },

  {
    path: '',
    component: AppComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
