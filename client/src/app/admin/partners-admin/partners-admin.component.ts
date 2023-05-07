import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';import { environment } from 'src/environments/environment';


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
  partner: any;

  // Search related
  filteredPartnerArray: any;
  p: number = 1;

  clearSearch() {
    this.filteredPartnerArray = '';
  }

  // Toast
  showToast() {
    if (this.deleteToast === true || this.terminateToast === true || this.renewToast === true ||
      this.updateToast === true || this.addToast === true) {
      setTimeout(() => {
        this.deleteToast = false;
        this.terminateToast = false;
        this.renewToast = false;
        this.updateToast = false;
        this.addToast = false;
      }, 5000);
    }
  }

  // Index partners
  fetchPartners(): Observable<any> {
    return this.http.get(environment.apiUrl + '/partner/index-partner');
  }

  indexPartners() {
    this.fetchPartners().subscribe((resultData: any) => {
      this.partners = resultData;
    });
  }

  computeDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date();

    // Set the time of the current date to midnight to compare only the dates
    currentDate.setHours(0, 0, 0, 0);

    const duration = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.floor(duration / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays === -1) {
      return 'Tomorrow';
    } else {
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
    this.partner = data.id;
  }

  deletePartner() {
    this.deleteLoading = true;
    this.http.delete(environment.apiUrl + '/partner/delete' + '/' + this.partner).subscribe(response => {
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
    this.partner = data.id;
  }

  terminatePartner() {
    this.terminateLoading = true;
    this.http.post(environment.apiUrl + '/partner/terminate' + '/' + this.partner, '').subscribe(response => {
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
    this.partner = data.id;

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


    this.http.post(environment.apiUrl + '/partner/issue-moa' + '/' + this.partner, formDataUpdate).subscribe((resultData: any) => {
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

  //form initialization
  name: any;
  email: any;
  description: any;
  address: any;
  contact_person: any;
  contact_number: any;

  //parameter id
  viewPartnerID: any;

  //image
  imageToUpdate: any;
  imagePreview: any;

  updatePartnerModal(data: any) {
    this.updateModal = true;
    this.partner = data.id;

    this.name = data.name;
    this.description = data.description;
    this.address = data.address;
    this.contact_person = data.contact_person;
    this.contact_number = data.contact_number;
    this.email = data.email;
    this.viewPartnerID = data.id;
  }

  updatePartner() {
    // for body
    var formData = new FormData();
    formData.append("name", this.name);
    formData.append("description", this.description);
    formData.append("address", this.address);
    formData.append("contact_person", this.contact_person);
    formData.append("contact_number", this.contact_number);
    formData.append("email", this.email);
    if (this.imageToUpdate) {
      formData.append("logo", this.imageToUpdate, this.imageToUpdate.name);
    }

    this.updateLoading = true;
    this.http.post(environment.apiUrl + '/partner/update-info' + '/' + this.viewPartnerID, formData).subscribe((resultData: any) => {
      console.log(resultData);
      this.updateLoading = false;
      this.updateModal = false;
      this.updateToast = true;
      this.showToast();
      this.ngOnInit();
    });
  }

  //for image preview and upload
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

  //Add Partner Function
  addModal: boolean = false;
  addLoading: boolean = false;
  addToast: boolean = false;

  form!: FormGroup;

  //image
  company_logo: any;
  imagePreview2: any;

  //validation
  submitPartner = false;

  addPartnerModal() {
    this.addModal = true;

    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      address: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      contact_person: [null, Validators.required],
      contact_number: [null, Validators.required],
    });
  }

  addPartner() {
    this.submitPartner = true;
    if (this.form.invalid) {
      return;
    }

    //body
    var partnerData = new FormData();
    partnerData.append("name", this.form.controls['name'].value);
    if (this.imageToUpdate) {
      partnerData.append("logo", this.imageToUpdate, this.imageToUpdate.name);
    }
    partnerData.append("description", this.form.controls['description'].value);
    partnerData.append("address", this.form.controls['address'].value);
    partnerData.append("email", this.form.controls['email'].value);
    partnerData.append("contact_person", this.form.controls['contact_person'].value);
    partnerData.append("contact_number", this.form.controls['contact_number'].value);

    this.addLoading = true;
    this.http.post(environment.apiUrl + '/partner/add', partnerData).subscribe((resultData: any) => {
      console.log(resultData);
      this.addLoading = false;
      this.addModal = false;
      this.addToast = true;
      this.showToast();
      this.ngOnInit();
    });
  }

  get f() {
    return this.form.controls;
  }

  //for image preview and upload
  onFileSelected2(event: any) {
    this.company_logo = event.target.files[0];
    console.log(this.company_logo);

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imagePreview2 = reader.result;

      reader.readAsDataURL(file);
    }
  }

  // View function
  viewModal: boolean = false;
  viewLoading: boolean = false;
  viewToast: boolean = false;

  moa: any;
  partnerID: any;
  partnerName: any;
  partnerStatus: any;
  partnerDescription: any;
  partnerAddress: any;
  partnerEmailAddress: any;
  partnerContactPerson: any;
  partnerContactNumber: any;
  partnerStartDate: any;
  partnerEndDate: any;



  //form initialization
  viewPartnerModal(data: any) {
    this.viewModal = true;
    this.partnerID = data.id;
    this.partnerStatus = data.status;
    this.partnerName = data.name;
    this.partnerDescription = data.description;
    this.partnerAddress = data.address;
    this.partnerEmailAddress = data.email;
    this.partnerContactPerson = data.contact_person;
    this.partnerContactNumber = data.contact_number;
    this.partnerStartDate = data.start_date;
    this.partnerEndDate = data.end_date;

    this.getMoaFiles();
  }

  getMoaFiles() {
    this.http.get(environment.apiUrl + '/partner/get-moa-files' + '/' + this.partnerID).subscribe(
      (response: any) => {
        this.moa = response;
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // getInfo() {
  //   // Make the HTTP request with the selected partner ID
  //   this.http.get(environment.apiUrl + '/partner/get-partner' + '/' + this.infoID).subscribe(
  //     (response: any) => {
  //       this.infos = response;
  //       console.log(response);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

}