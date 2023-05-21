import { Component, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-settings-admin',
  templateUrl: './settings-admin.component.html',
  styleUrls: ['./settings-admin.component.css']
})
export class SettingsAdminComponent {

  token: any;
  userData: any;
  id: any;
  first_name: any;
  last_name: any;
  department: any;
  designation: any;
  password: any;
  email: any;
  activeTab: number = 0;

  facultyArray: any;
  successorArray: any;

  avatarToUpdate: any;
  avatarPreview: any;

  selectedSuccessor:string | undefined;

  successorModal: boolean = false;

  updateAvatarSuccess: boolean = false;
  updateAvatarFail: boolean = false;
  updateNameToast: boolean = false;
  updatePasswordToast: boolean = false;
  assignSuccessorToast: boolean = false;
  removeSuccessorToast: boolean = false;
  updateEmailToast: boolean = false;

  updateNameLoading: boolean = false;
  updatePasswordLoading: boolean = false;
  successorLoading: boolean = false;
  updateEmailLoading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.userData = jwt_decode(this.token);
    this.id = this.userData.id;
  }

  ngOnInit(): void {
    const userId = this.userData.id;
    this.http.get(environment.apiUrl + "/user/get-user/" + userId).subscribe((resultData: any) => {
      this.last_name = resultData.last_name;
      this.first_name = resultData.first_name;
      this.department = resultData.department;
      this.designation = resultData.designation;
      this.email = resultData.email;
    });

    this.http.get(environment.apiUrl + "/user/verified-user").subscribe((resultData: any) => {
      this.facultyArray = resultData;
      console.log(this.facultyArray.length);

    });

    this.http.get(environment.apiUrl + "/user/get-successor").subscribe((resultData: any) => {
      this.successorArray = resultData;
      console.log(this.successorArray.length);
    });
  }

  tabs = [
    { label: 'Profile' },
    { label: 'Account' },
  ];

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  // Avatar
  avatarSelected(event: any) {
    this.avatarToUpdate = event.target.files[0];
    console.log(this.avatarToUpdate);
  
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
  
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => this.avatarPreview = reader.result;
  
        reader.readAsDataURL(file);
  
        var formData = new FormData();
        formData.append("profile_image", this.avatarToUpdate, this.avatarToUpdate.name);
  
        this.http.post(environment.apiUrl + "/user/update-info/" + this.id, formData).subscribe((resultData: any) => {
          this.updateAvatarSuccess = true;
          this.showToast();
        });
      } else {
        this.updateAvatarFail = true;
        this.showToast();
      }
    }
  }

  // Name
  updateName() {
    this.updateNameLoading = true;
    var formData = new FormData();
    formData.append("first_name", this.first_name);
    formData.append("last_name", this.last_name);

    this.http.post(environment.apiUrl + "/user/update-info/" + this.id, formData).subscribe((resultData: any) => {
      this.updateNameToast = true;
      this.updateNameLoading = false;
      this.showToast();
    });
  }

  // Email 
  updateEmail() {
    this.updateEmailLoading = true;
    var formData = new FormData();
    formData.append("email", this.email);
    this.http.post(environment.apiUrl + "/user/update-email/" + this.id, formData).subscribe((resultData: any) => {
      this.updateEmailToast = true;
      this.updateEmailLoading = false;
      this.showToast();
    });
  }

  // Password
  updatePassword() {
    this.updatePasswordLoading = true;
    var formData = new FormData();
    formData.append("password", this.password);

    this.http.post(environment.apiUrl + "/user/update-password/" + this.id, formData).subscribe((resultData: any) => {
      this.updatePasswordToast = true;
      this.updatePasswordLoading = false;
      this.showToast();
    });
  }

  // successor
  assignSuccessor() {
    this.successorLoading = true;
    this.http.post(environment.apiUrl + "/user/make-successor/" + this.selectedSuccessor, '').subscribe((resultData: any) => {
      this.assignSuccessorToast = true;
      this.successorLoading = false;
      this.showToast();
    });
  }

  removeSuccessor() {
    this.successorLoading = true;
    this.http.post(environment.apiUrl + "/user/remove-successor/", '').subscribe((resultData: any) => {
      this.removeSuccessorToast = true;
      this.successorLoading = false;
      this.showToast();
    });
  }
  

  showToast() {
    if (this.updateAvatarSuccess === true || this.updateAvatarFail === true || this.updateNameToast === true || this.updateEmailToast === true || this.updatePasswordToast === true || this.assignSuccessorToast === true || this.removeSuccessorToast === true) {
      setTimeout(() => {
        this.updateAvatarSuccess = false;
        this.updateAvatarFail = false;
        this.updateNameToast = false;
        this.updatePasswordToast = false;
        this.assignSuccessorToast = false;
        this.removeSuccessorToast = false;
        this.updateEmailToast = false;
      }, 5000);
    }

  }
}
