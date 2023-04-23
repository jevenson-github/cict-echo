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
import { ResetPasswordComponent } from './management/auth/wizard/reset-password/reset-password.component';
import { AccountWizardComponent } from './management/auth/wizard/account-wizard/account-wizard.component';
import { FacultyAdminComponent } from './management/admin/faculty-admin/faculty-admin.component';
import { PartnersAdminComponent } from './management/admin/partners-admin/partners-admin.component';

@NgModule({
  declarations: [AppComponent, AdminComponent, FacultyComponent, NavigationAdminComponent, DashboardAdminComponent, NotificationAdminComponent, AuthComponent, SignInComponent, ForgotPasswordComponent, SignUpComponent, ResetPasswordComponent, AccountWizardComponent, FacultyAdminComponent, PartnersAdminComponent],
  imports: [BrowserModule, AppRoutingModule, AppRoutingModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, Ng2SearchPipeModule, RouterModule.forRoot([])],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
