import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { NgxPaginationModule, PaginationInstance, PaginationService } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HttpClientModule } from '@angular/common/http';
import { environment } from './../environments/environment';
import { AvatarModule } from 'ngx-avatar';
import { NgChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { EditorModule, TINYMCE_SCRIPT_SRC  } from '@tinymce/tinymce-angular';





// Import components for ADMIN
import { AdminComponent } from './admin/admin.component';

// Import components for FACULTY
import { FacultyComponent } from './faculty/faculty.component';
import { NavigationAdminComponent } from './ui/navigation-admin/navigation-admin.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { NotificationAdminComponent } from './ui/notification-admin/notification-admin.component';
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

import { FacultyAdminComponent } from './admin/faculty-admin/faculty-admin.component';
import { PartnersAdminComponent } from './admin/partners-admin/partners-admin.component';
import { ProgramsAdminComponent } from './admin/programs-admin/programs-admin.component';
import { ReportsAdminComponent } from './admin/reports-admin/reports-admin.component';
import { ProgramReportComponent } from './admin/reports-admin/program-report/program-report.component';
import { PartnerReportComponent } from './admin/reports-admin/partner-report/partner-report.component';
import { PartnersReportComponent } from './admin/reports-admin/partners-report/partners-report.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { HeaderAdminComponent } from './ui/header-admin/header-admin.component';
import { ViewProgramAdminComponent } from './admin/programs-admin/view-program-admin/view-program-admin.component';
import { EditProgramAdminComponent } from './admin/programs-admin/edit-program-admin/edit-program-admin.component';
import { ViewPartnerAdminComponent } from './admin/partners-admin/view-partner-admin/view-partner-admin.component';
import { EditPartnerAdminComponent } from './admin/partners-admin/edit-partner-admin/edit-partner-admin.component';
const avatarColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];


@NgModule({
  declarations: [AppComponent, AdminComponent, FacultyComponent, NavigationAdminComponent, DashboardAdminComponent, NotificationAdminComponent, AuthComponent, ResetPasswordComponent, SignInComponent, ForgotPasswordComponent, SignUpComponent, FacultyAdminComponent, PartnersAdminComponent, ProgramsAdminComponent, ReportsAdminComponent, ProgramReportComponent, PartnerReportComponent, PartnersReportComponent, HomeAdminComponent, HeaderAdminComponent, ViewProgramAdminComponent, EditProgramAdminComponent, ViewPartnerAdminComponent, EditPartnerAdminComponent],
  imports: [BrowserModule, NgChartsModule, EditorModule, FormsModule, AvatarModule.forRoot({ colors: avatarColors }), AppRoutingModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, Ng2SearchPipeModule, RouterModule.forRoot([]),     NgxEchartsModule.forRoot({
    echarts: () => import('echarts')
  })],
  providers: [
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
