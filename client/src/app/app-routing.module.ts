import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';

// Import components for AUTH
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

// Import components for ADMIN
import { AdminComponent } from './admin/admin.component';
import { FacultyAdminComponent } from './admin/faculty-admin/faculty-admin.component';
import { PartnersAdminComponent } from './admin/partners-admin/partners-admin.component';

// Import components for FACULTY
import { FacultyComponent } from './faculty/faculty.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ProgramsAdminComponent } from './admin/programs-admin/programs-admin.component';
import { ReportsAdminComponent } from './admin/reports-admin/reports-admin.component';
import { ProgramReportComponent } from './admin/reports-admin/program-report/program-report.component';
import { PartnerReportComponent } from './admin/reports-admin/partner-report/partner-report.component';
import { PartnersReportComponent } from './admin/reports-admin/partners-report/partners-report.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { ViewProgramAdminComponent } from './admin/programs-admin/view-program-admin/view-program-admin.component';
import { EditProgramAdminComponent } from './admin/programs-admin/edit-program-admin/edit-program-admin.component';
import { ViewPartnerAdminComponent } from './admin/partners-admin/view-partner-admin/view-partner-admin.component';
import { EditPartnerAdminComponent } from './admin/partners-admin/edit-partner-admin/edit-partner-admin.component';
import { AddProgramAdminComponent } from './admin/programs-admin/add-program-admin/add-program-admin.component';




const routes: Routes = [
  {
    path: 'management',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardAdminComponent },
      { path: 'home', component: HomeAdminComponent},
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'faculty', component: FacultyAdminComponent},
      { path: 'partners', component: PartnersAdminComponent},
      { path: 'partners/view', component: ViewPartnerAdminComponent},
      { path: 'partners/edit', component: EditPartnerAdminComponent},
      { path: 'programs', component: ProgramsAdminComponent},
      { path: 'programs/view', component: ViewProgramAdminComponent},
      { path: 'programs/edit', component: EditProgramAdminComponent},
      { path: 'programs/add', component: AddProgramAdminComponent},
      { path: 'reports', component: ReportsAdminComponent},
    ],
  },

  {
    path: 'report-program',
    component: ProgramReportComponent,
  },

  {
    path: 'report-partner',
    component: PartnerReportComponent,
  },

  {
    path: 'report-partners',
    component: PartnersReportComponent,
  }
  ,
  
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
    canActivate: [AuthGuard],
    children: [{ path: '', component: FacultyComponent }],
  },

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
