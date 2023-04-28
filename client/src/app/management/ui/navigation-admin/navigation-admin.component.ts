import { Component, HostListener, ElementRef } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-admin',
  templateUrl: './navigation-admin.component.html',
  styleUrls: ['./navigation-admin.component.css']
})
export class NavigationAdminComponent {
  isMenuOpen = false;
  isNotificationOpen = false;
  userData: any;
  token: any;

  last_name: any;
  first_name: any;
  designation: any;
  profile_image: any;

  constructor(private elementRef: ElementRef, private router: Router) {
    this.token = localStorage.getItem('token');
    this.userData = jwt_decode(this.token);
    this.first_name = this.userData.firstName;
    this.last_name = this.userData.lastName;
    this.designation = this.userData.designation;
    this.profile_image = this.userData.profileImage;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      this.isNotificationOpen = false; // Close notification dropdown if user clicks outside
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isNotificationOpen = false; // Close notification dropdown when account dropdown is opened
    }
  }

  toggleNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
    if (this.isNotificationOpen) {
      this.isMenuOpen = false; // Close account dropdown when notification dropdown is opened
    }
  }

  //sign out function
  signOut() {
    //remove the session token data
    localStorage.removeItem('token');

    //navigate back to sign in page
    this.router.navigate(['auth/']);



  }
}
