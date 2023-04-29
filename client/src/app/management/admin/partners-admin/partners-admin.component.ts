import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-partners-admin',
  templateUrl: './partners-admin.component.html',
  styleUrls: ['./partners-admin.component.css']
})

export class PartnersAdminComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private formBuilder2: FormBuilder,
    private http: HttpClient,
  ) { };

  ngOnInit(): void {
    this.indexPartners();
  }

  partners: any[] = [];
  partner_id: any;

  // Search related 
  filteredPartnerArray: any;
  p: number = 1;

  clearSearch() {
    this.filteredPartnerArray = '';
  }

  // Toast
  showToast() {
    if (this.deleteToast === true || this.terminateToast === true || this.renewToast === true) {
      setTimeout(() => {
        this.deleteToast = false;
        this.terminateToast = false;
        this.renewToast = false;
      }, 5000);
    }
  }

  // Index partners
  fetchPartners(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/partner/index-partner');
  }

  indexPartners() {
    this.fetchPartners().subscribe((resultData: any) => {
      this.partners = resultData;
    });
  }

  computeDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.abs(end.getTime() - start.getTime());

    const years = Math.floor(duration / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(duration / (1000 * 60 * 60 * 24 * 30));
    const weeks = Math.floor(duration / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));

    if (years >= 1) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months >= 1) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else if (weeks >= 1) {
      return `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Delete function
  deleteModal: boolean = false;
  deleteLoading: boolean = false;
  deleteToast: boolean = false;

  deletePartnerModal(data: any) {
    this.deleteModal = true;
    this.partner_id = data.id;
  }

  deletePartner() {
    this.deleteLoading = true;
    this.http.delete('http://127.0.0.1:8000/api/partner/delete' + '/' + this.partner_id).subscribe(response => {
      this.deleteLoading = false;
      this.deleteModal = false;
      this.deleteToast = true;
      this.showToast();
      this.ngOnInit();
    });
  }

  // Terminate function
  terminateModal: boolean = false;
  terminateLoading: boolean = false;
  terminateToast: boolean = false;

  terminatePartnerModal(data: any) {
    this.terminateModal = true;
    this.partner_id = data.id;
  }

  terminatePartner() {
    this.terminateLoading = true;
    this.http.post('http://127.0.0.1:8000/api/partner/terminate' + '/' + this.partner_id, '').subscribe(response => {
      this.terminateLoading = false;
      this.terminateModal = false;
      this.terminateToast = true;
      this.showToast();
      this.ngOnInit();
    });
  }

  // Renew function
  renewModal: boolean = false;
  renewLoading: boolean = false;
  renewToast: boolean = false;

  form2!: FormGroup;
  submitMoa = false;
  moaFile: any;

  renewPartnerModal(data: any) {
    this.renewModal = true;
    this.partner_id = data.id;

    this.form2 = this.formBuilder2.group({
      moa_file: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
    });
  }

  renewPartner() {
    this.renewLoading = true;
    this.submitMoa = true;

    if (this.form2.invalid) {
      this.renewLoading = false;
      return;
    }

    var formDataUpdate = new FormData();
    formDataUpdate.append("moa_file", this.moaFile, this.moaFile.name);
    formDataUpdate.append("start_date", this.form2.controls['start_date'].value);
    formDataUpdate.append("end_date", this.form2.controls['end_date'].value);


    this.http.post('http://127.0.0.1:8000/api/partner/issue-moa' + '/' + this.partner_id, formDataUpdate).subscribe((resultData: any) => {
      console.log(resultData);
      this.renewLoading = false;
      this.renewModal = false;
      this.renewToast = true;
      this.form2.reset();
      this.showToast();
      this.ngOnInit();
    });

    this.submitMoa = false;
  }

  moaUpload(event: any) {
    this.moaFile = event.target.files[0];
    console.log(this.moaFile);
  }

  get u() {
    return this.form2.controls;
  }

  // Update function
  updateModal: boolean = false;
  updateLoading: boolean = false;
  updateToast: boolean = false;

  updatePartnerModal(data: any) {
    this.updateModal = true;
    this.partner_id = data.id;
  }

  updatePartner() {
    this.updateLoading = true;
    this.http.post('http://127.0.0.1:8000/api/partner/issue-moa' + '/' + this.partner_id, '').subscribe((resultData: any) => {
      console.log(resultData);
      this.updateLoading = false;
      this.updateModal = false;
      this.updateToast = true;
      this.showToast();
      this.ngOnInit();
    });
  }






}

