import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { MustMatch } from './confirmed.validator';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-faculty-admin',
  templateUrl: './faculty-admin.component.html',
  styleUrls: ['./faculty-admin.component.css']
})

export class FacultyAdminComponent implements OnInit {



  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  get f() {
    return this.passwordForm.controls;
  }

  updateModal: boolean = false;
  deactivateModal: boolean = false;
  reactivateModal: boolean = false;
  acceptModal: boolean = false;
  rejectModal: boolean = false;
  deleteModal: boolean = false;
  undoModal: boolean = false;
  removeModal: boolean = false;
  addAdminModal: boolean = false;

  deactivateToast: boolean = false;
  reactivateToast: boolean = false;
  rejectToast: boolean = false;
  acceptToast: boolean = false;
  deleteToast: boolean = false;
  undoToast: boolean = false;
  removeToast: boolean = false;
  addToast: boolean = false;

  deactivateLoading: boolean = false;
  reactivateLoading: boolean = false;
  rejectLoading: boolean = false;
  acceptLoading: boolean = false;
  deleteLoading: boolean = false;
  undoLoading: boolean = false;
  removeLoading: boolean = false;
  addLoading: boolean = false;

  updateSelection: boolean = true;
  updateEmail: boolean = false;
  updateInfo: boolean = false;
  updatePassword: boolean = false;

  verifiedFaculty: any[] = [];
  deactivateedFaculty: any[] = [];
  pendingFaculty: any[] = [];
  rejectedFaculty: any[] = [];
  administrators: any[] = [];
  noneAdminFaculty: any[] = [];

  verifiedFacultyCount: number = 0;
  deactivateedFacultyCount: number = 0;
  pendingFacultyCount: number = 0;
  rejectedFacultyCount: number = 0;
  administratorsCount: number = 0;

  activeTab = 0;

  tabs = [
    { label: 'Verified accounts', badge: this.verifiedFacultyCount },
    { label: 'Deactivated accounts', badge: this.deactivateedFaculty.length },
    { label: 'Pending accounts', badge: this.pendingFaculty.length },
  ];
  sections = ['faculty-section-verified', 'faculty-section-deactivateed', 'faculty-section-pending', 'faculty-section-administrators'];

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  // id parameter
  deactivateVerifiedParam: any;
  updateModalParam: any;
  undoRejectedParam: any;
  deleteRejectedParam: any;
  rejectPendingParam: any;
  acceptPendingParam: any;
  reactivateResignedParam: any
  removeAdminParam: any;

  // password form
  passwordForm!: FormGroup;
  submitted = false;

  // password form edit data container
  editFirstName: any;
  editLastName: any;
  editDepartment: any;
  editDesignation: any;
  editEmail: any;

  // modal data
  modalId: any;
  modalFirstName: any;
  modalLastName: any;

  openAddAdminModal() {
    this.addAdminModal = true;
  }

  closeAddAdminModal() {
    this.addAdminModal = false;
  }

  openRemoveModal(data: any) {
    this.removeModal = true;

    this.removeAdminParam = data.id;

    this.modalId = data.id;
    this.modalFirstName = data.first_name;
    this.modalLastName = data.last_name;
  }

  closeRemoveModal() {
    this.removeModal = false;
  }

  openDeleteModal(data: any) {
    this.deleteModal = true;
    this.deleteRejectedParam = data.id;

    this.modalId = data.id;
    this.modalFirstName = data.first_name;
    this.modalLastName = data.last_name;
  }

  closeDeleteModal() {
    this.deleteModal = false;
  }

  openUndoModal(data: any) {
    this.undoModal = true;
    this.undoRejectedParam = data.id;

    this.modalId = data.id;
    this.modalFirstName = data.first_name;
    this.modalLastName = data.last_name;
  }

  closeUndoModal() {
    this.undoModal = false;
  }

  openAcceptModal(data: any) {
    this.acceptModal = true;
    this.acceptPendingParam = data.id;

    this.modalId = data.id;
    this.modalFirstName = data.first_name;
    this.modalLastName = data.last_name;
  }

  closeAcceptModal() {
    this.acceptModal = false;
  }

  openRejectModal(data: any) {
    this.rejectModal = true;
    this.rejectPendingParam = data.id;

    this.modalId = data.id;
    this.modalFirstName = data.first_name;
    this.modalLastName = data.last_name;
  }

  closeRejectModal() {
    this.rejectModal = false;
  }

  openReactivateModal(data: any) {
    this.reactivateModal = true;
    this.reactivateResignedParam = data.id;

    this.modalId = data.id;
    this.modalFirstName = data.first_name;
    this.modalLastName = data.last_name;
  }

  closeReactivateModal() {
    this.reactivateModal = false;
  }

  openResignModal(data: any) {
    this.deactivateModal = true;
    this.deactivateVerifiedParam = data.id;

    this.modalId = data.id;
    this.modalFirstName = data.first_name;
    this.modalLastName = data.last_name;
  }

  closeResignModal() {
    this.deactivateModal = false;
  }

  openUpdateModal(data: any) {
    this.updateModal = true;
    this.updateModalParam = data.id;

    this.editFirstName = data.first_name;
    this.editLastName = data.last_name;
    this.editDepartment = data.department;
    this.editDesignation = data.designation;
    this.editEmail = data.email;

    this.modalId = data.id;
    this.modalFirstName = data.first_name;
    this.modalLastName = data.last_name;
  }

  closeUpdateModal() {
    this.updateModal = false;
    this.updateSelection = true;
    this.updateEmail = false;
    this.updateInfo = false;
    this.updatePassword = false;
  }

  toUpdateInfo() {
    this.updateSelection = false;
    this.updateEmail = false;
    this.updateInfo = true;
    this.updatePassword = false;
  }

  toUpdateEmail() {
    this.updateSelection = false;
    this.updateEmail = true;
    this.updateInfo = false;
    this.updatePassword = false;
  }

  toUpdateSelection() {
    this.updateSelection = true;
    this.updateEmail = false;
    this.updateInfo = false;
    this.updatePassword = false;
  }

  toUpdatePassword() {
    this.updateSelection = false;
    this.updateEmail = false;
    this.updateInfo = false;
    this.updatePassword = true;
  }


  // Observable

  fetchVerifiedFaculty(): Observable<any> {
    return this.http.get(environment.apiUrl + "/user/verified-user");
  }

  fetchResignedFaculty(): Observable<any> {
    return this.http.get(environment.apiUrl + "/user/deactivated-user");
  }

  fetchPendingFaculty(): Observable<any> {
    return this.http.get(environment.apiUrl + "/user/pending-user");
  }

  fetchRejectedFaculty(): Observable<any> {
    return this.http.get(environment.apiUrl + "/user/rejected-user");
  }

  fetchAdmins(): Observable<any> {
    return this.http.get(environment.apiUrl + "/user/get-admin");
  }


  // Table list of Data

  getVerifiedFaculty() {
    this.fetchVerifiedFaculty().subscribe((resultData: any) => {
      this.verifiedFaculty = resultData;
      this.tabs[0].badge = this.verifiedFaculty.length;
      console.log(this.verifiedFaculty);
    });
  }

  getResignedFaculty() {
    this.fetchResignedFaculty().subscribe((resultData: any) => {
      this.deactivateedFaculty = resultData;
      this.tabs[1].badge = this.deactivateedFaculty.length;
      console.log(this.deactivateedFaculty);
    });
  }

  getPendingFaculty() {
    this.fetchPendingFaculty().subscribe((resultData: any) => {
      this.pendingFaculty = resultData;
      this.tabs[2].badge = this.pendingFaculty.length;
      console.log(this.pendingFaculty);
    });
  }

  getRejectedFaculty() {
    this.fetchRejectedFaculty().subscribe((resultData: any) => {
      this.rejectedFaculty = resultData;
      this.tabs[3].badge = this.rejectedFaculty.length;
      console.log(this.rejectedFaculty);
    });
  }

  getAdmins() {
    this.fetchAdmins().subscribe((resultData: any) => {
      this.administrators = resultData;
      this.tabs[4].badge = this.administrators.length;
      console.log(this.administrators);
    });
  }


  // Buttons Functionality

  getNoneAdminFaculty() {
    this.http.get(environment.apiUrl + "/user/get-faculty").subscribe((resultData: any) => {
      this.noneAdminFaculty = resultData;
      console.log(this.noneAdminFaculty);
    });
  }

  deactivateVerifiedFaculty() {
    this.deactivateLoading = true;
    this.http.post(environment.apiUrl + "/user/deactivate/" + this.deactivateVerifiedParam, "").subscribe((resultData: any) => {
      console.log(resultData);
      this.deactivateModal = false;
      this.deactivateLoading = false;
      this.deactivateToast = true;

      // Call showToast() function to start the timer
      this.showToast();
      this.ngOnInit();
    });
  }

  updateLoading: boolean = false;
  updateToast: boolean = false;

  updateInfoVerifiedFaculty() {

    var formData = new FormData();
    formData.append("department", this.editDepartment);
    formData.append("designation", this.editDesignation);

    this.updateLoading = true;
    this.http.post(environment.apiUrl + "/user/update-info/" + this.updateModalParam, formData).subscribe((resultData: any) => {
      console.log(resultData);
      this.updateModal = false;

      this.updateModal = false;
      this.updateLoading = false;
      this.updateToast = true;

      // Call showToast() function to start the timer
      this.showToast();
      this.ngOnInit();
    });
  }

  updateEmailVerifiedFaculty() {
    let bodyData = {
      "email": this.editEmail
    }

    this.http.post(environment.apiUrl + "/user/update-email/" + this.updateModalParam, bodyData).subscribe((resultData: any) => {
      console.log(resultData);
      this.updateModal = false;
    });
  }

  updatePassVerifiedFaculty() {
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return
    }

    this.http.post(environment.apiUrl + "/user/update-password/" + this.updateModalParam, this.passwordForm.value).subscribe((resultData: any) => {
      console.log(resultData);
      this.updateModal = false;
    });

    this.submitted = false;
    this.passwordForm.reset();

    this.updatePassword = false;
  }

  createPasswordForm() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
      { validator: MustMatch('password', 'confirmPassword') });
  }

  reactivateResignedFaculty() {
    this.reactivateLoading = true;
    this.http.post(environment.apiUrl + "/user/verify/" + this.reactivateResignedParam, "").subscribe((resultData: any) => {
      console.log(resultData);
      this.reactivateModal = false;
      this.reactivateLoading = false;
      this.reactivateToast = true;

      // Call showToast() function to start the timer
      this.showToast();
      this.ngOnInit();
    });
  }

  acceptPendingFaculty() {
    this.acceptLoading = true;
    this.http.post(environment.apiUrl + "/user/verify/" + this.acceptPendingParam, '').subscribe((resultData: any) => {
      console.log(resultData);
      this.acceptModal = false;
      this.acceptLoading = false;
      this.acceptToast = true;

      // Call showToast() function to start the timer
      this.showToast();
      this.ngOnInit();
    });
  }

  rejectPendingFaculty() {
    this.rejectLoading = true;
    this.http.post(environment.apiUrl + "/user/reject/" + this.rejectPendingParam, '').subscribe((resultData: any) => {
      console.log(resultData);
      this.rejectModal = false;
      this.rejectLoading = false;
      this.rejectToast = true;

      // Call showToast() function to start the timer
      this.showToast();
      this.ngOnInit();
    });
  }

  undoRejectedFaculty() {
    this.undoLoading = true;
    this.http.post(environment.apiUrl + "/user/pending/" + this.undoRejectedParam, "").subscribe((resultData: any) => {
      console.log(resultData);
      this.undoModal = false;
      this.undoLoading = false;
      this.undoToast = true;

      // Call showToast() function to start the timer
      this.showToast();
      this.ngOnInit();
    });
  }

  deleteRejectedFaculty() {
    this.deleteLoading = true;
    this.http.delete(environment.apiUrl + "/user/delete/" + this.deleteRejectedParam,).subscribe((resultData: any) => {
      console.log(resultData);
      this.deleteModal = false;
      this.deleteLoading = false;
      this.deleteToast = true;

      // Call showToast() function to start the timer
      this.showToast();
      this.ngOnInit();
    });
  }

  //remove admin
  makeFaculty() {
    this.removeLoading = true;
    console.log(this.removeAdminParam)
    this.http.post(environment.apiUrl + "/user/make-faculty/" + this.removeAdminParam, "").subscribe((resultData: any) => {
      console.log(resultData);
      this.removeModal = false;
      this.removeLoading = false;
      this.removeToast = true;

      // Call showToast() function to start the timer
      this.showToast();
      this.ngOnInit();
    });
  }

  adminFaculty: any[] = [];

  makeAdmin(data: any) {

    this.http.post(environment.apiUrl + "/user/make-admin/" + data.id, '').subscribe((resultData: any) => {
      console.log(resultData);
      this.addAdminModal = false;
      this.addToast = true;

      this.showToast();
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.getVerifiedFaculty();
    this.getResignedFaculty();
    this.getPendingFaculty();
    this.getRejectedFaculty();
    this.getAdmins();
    this.createPasswordForm();
    this.getNoneAdminFaculty();
  }

  filteredVerifiedFaculty: any;
  filteredResignedFaculty: any;
  filteredPendingFaculty: any;
  filteredRejectedFaculty: any;
  filteredAdministrators: any;
  filteredAddAdminModal: any;

  p: number = 1;

  imageUrl = 'http://via.placeholder.com/150'; // Placeholder image URL
  fileToUpload: File | null = null; // Selected file to upload

  imageToUpdate: any;
  imagePreview: any;

  onFileSelected(event: any) {

    this.imageToUpdate = event.target.files[0];
    console.log(this.imageToUpdate);

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;

      reader.readAsDataURL(file);
    }
  }

  showToast() {
    if (this.deactivateToast === true || this.reactivateToast === true || this.rejectToast === true || this.acceptToast === true ||
      this.deleteToast === true || this.undoToast === true || this.removeToast === true || this.addToast === true || this.updateToast === true) {
      setTimeout(() => {
        this.deactivateToast = false;
        this.reactivateToast = false;
        this.rejectToast = false;
        this.acceptToast = false;
        this.deleteToast = false;
        this.undoToast = false;
        this.removeToast = false;
        this.addToast = false;
        this.updateToast = false;
      }, 5000);
    }
  }


}