import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { NgxPaginationModule, PaginationInstance, PaginationService } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Modal } from 'flowbite'
import { HttpClientModule } from '@angular/common/http';
import { environment } from './../environments/environment';
import { AvatarModule } from 'ngx-avatar';
import { NgChartsModule } from 'ng2-charts';




// Import components for ADMIN
import { AdminComponent } from './management/admin/admin.component';

// Import components for FACULTY
import { FacultyComponent } from './management/faculty/faculty.component';
import { NavigationAdminComponent } from './management/ui/navigation-admin/navigation-admin.component';
import { DashboardAdminComponent } from './management/admin/dashboard-admin/dashboard-admin.component';
import { NotificationAdminComponent } from './management/ui/notification-admin/notification-admin.component';
import { AuthComponent } from './management/auth/auth.component';
import { SignInComponent } from './management/auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './management/auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './management/auth/sign-up/sign-up.component';

import { FacultyAdminComponent } from './management/admin/faculty-admin/faculty-admin.component';
import { PartnersAdminComponent } from './management/admin/partners-admin/partners-admin.component';
import { PartnerAdminComponent } from './management/admin/partner-admin/partner-admin.component';
import { ProgramsAdminComponent } from './management/admin/programs-admin/programs-admin.component';
import { ReportsAdminComponent } from './management/admin/reports-admin/reports-admin.component';
import { ProgramReportComponent } from './management/admin/reports-admin/program-report/program-report.component';
import { PartnerReportComponent } from './management/admin/reports-admin/partner-report/partner-report.component';
import { PartnersReportComponent } from './management/admin/reports-admin/partners-report/partners-report.component';
import { ResetPasswordComponent } from './management/auth/reset-password/reset-password.component';
import { ChartModule } from 'angular-highcharts';
const avatarColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];


@NgModule({
  declarations: [AppComponent, AdminComponent, FacultyComponent, NavigationAdminComponent, DashboardAdminComponent, NotificationAdminComponent, AuthComponent, ResetPasswordComponent,SignInComponent, ForgotPasswordComponent, SignUpComponent, FacultyAdminComponent, PartnersAdminComponent, PartnerAdminComponent, ProgramsAdminComponent, ReportsAdminComponent, ProgramReportComponent, PartnerReportComponent, PartnersReportComponent],
  imports: [BrowserModule,ChartModule,  NgChartsModule, AvatarModule.forRoot({colors: avatarColors}), AppRoutingModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, Ng2SearchPipeModule, RouterModule.forRoot([])],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
