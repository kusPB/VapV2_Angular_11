import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { AddressDetailModel } from 'src/app/Helper/models/AddressDetailModel';
import { SupplierModel } from 'src/app/Helper/models/SupplierModel';
import { UserModel } from 'src/app/Helper/models/UserModel';

import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { isNullOrUndefined } from 'util';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss'],
  providers: []
})
export class AddSupplierComponent implements OnInit, OnDestroy {

  uploadedFiles: any[] = [];

  supplier: SupplierModel;
  IsSpinner = false;
  loading: boolean;

  SupplierButtonLabel = '';
  buttonIcon = '';
  routeID: any;

  CountryDropdown: any[] = [];
  selectedCountryID: any;

  CountryDropdownNew: SelectItem[] = [];
  selectedCountryIDNew: any;

  predicatedPostCodesResults: any[] = [];
  predicatedPostCodes: any[] = [];
  selectedPostCode: any;

  predicatedCities: any[] = [];
  selectedCity: any;

  predicatedStreetResults: any[] = [];
  predicatedStreet: any[] = [];
  selectedStreet: any;
  selectedHouse: any;

  AddressNetherlandAPIDisplay = false;
  AddressManualDisplay = false;
  multipleAddressDisplay = false;

  manualState = '';
  manualCity = '';
  manualPostalCode = '';
  manualStreetAddress = '';
  manualCountry = '';
  SelectedAddressList: AddressDetailModel[] = [];
  SearchedAddressList: AddressDetailModel[] = [];

  SelectedAddressListNew: AddressDetailModel[] = [];

  netherlandAPIPostalCode = '';
  netherlandAPIHouseNo = 0;
  usermodel: UserModel;
  base64textString: IImageModel = {
    Base64String: '',
    Extention: ''
  };
  imageBasePath = '';
  IsAddForm = true;
  constructor(
    private route: ActivatedRoute, private apiService: vaplongapi,
    private notificationService: NotificationService, private router: Router, private storageService: StorageService) {
    this.routeID = this.route.snapshot.params.id;
    this.imageBasePath = environment.SUPPLIER_IMAGE_PATH;
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    if (this.routeID !== '0') {   
      this.supplier = new SupplierModel();
      this.IsAddForm = false;
      this.SupplierButtonLabel = 'Update Supplier';
      this.buttonIcon = 'fas fa-pen';
      this.GetCountryDDNew();
      this.fillFields(this.routeID);
    }
    else {

      this.SupplierButtonLabel = 'Add Supplier';
      this.buttonIcon = 'fas fa-plus';
      this.supplier = new SupplierModel();
      this.GetCountryDDFunction(0);
      this.GetCountryDDNew();
    }

  }
  ngOnDestroy(): void {
  }
  GetCountryDDFunction(id) {
    this.apiService.GetCountriesForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (id !== 0) { this.selectedCountryID = id; }
        else if (this.manualCountry !== '' && this.manualCountry !== null) {
          this.selectedCountryID = response.DropDownData.find(x => x.Name === this.manualCountry).ID;
        }
        for (const item of response.DropDownData) {
          this.CountryDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }
  GetCountryDDNew() {
    this.selectedCountryIDNew = "DE";
    this.CountryDropdownNew.push({ value: "AT", label: "Austria", });
    this.CountryDropdownNew.push({ value: "BE", label: "Belgium",});
    this.CountryDropdownNew.push({ value: "BG", label: "Bulgaria",});
    this.CountryDropdownNew.push({ value: "CY", label: "Cyprus",});
    this.CountryDropdownNew.push({ value: "CZ", label: "Czechia",});
    this.CountryDropdownNew.push({ value: "DE", label: "Germany",});
    this.CountryDropdownNew.push({ value: "DK", label: "Denmark",});
    this.CountryDropdownNew.push({ value: "EE", label: "Estonia",});
    this.CountryDropdownNew.push({ value: "ES", label: "Spain",});
    this.CountryDropdownNew.push({ value: "FI", label: "Finland",});
    this.CountryDropdownNew.push({ value: "FR", label: "France", });
    this.CountryDropdownNew.push({ value: "GR", label: "Greece",});
    this.CountryDropdownNew.push({ value: "HR", label: "Croatia",});
    this.CountryDropdownNew.push({ value: "HU", label: "Hungary",});
    this.CountryDropdownNew.push({ value: "IE", label: "Ireland",});
    this.CountryDropdownNew.push({ value: "IT", label: "Italy",});
    this.CountryDropdownNew.push({ value: "LT", label: "Lithuania", });
    this.CountryDropdownNew.push({ value: "LU", label: "Luxembourg", });
    this.CountryDropdownNew.push({ value: "LV", label: "Latvia", });
    this.CountryDropdownNew.push({ value: "MT", label: "Malta", });
    this.CountryDropdownNew.push({ value: "NL", label: "Netherlands", });
    this.CountryDropdownNew.push({ value: "PO", label: "Poland", });
    this.CountryDropdownNew.push({ value: "PT", label: "Portugal", });
    this.CountryDropdownNew.push({ value: "RO", label: "Romania", });
    this.CountryDropdownNew.push({ value: "SE", label: "Sweden", });
    this.CountryDropdownNew.push({ value: "SI", label: "Slovenia", });
    this.CountryDropdownNew.push({ value: "SK", label: "Slovakia", });


   }
  ManualInputClick() {
    this.AddressManualDisplay = true;
  }
  NetherlandAPIClick() {
    this.AddressNetherlandAPIDisplay = true;
  }

  fillFields(id) {

    const params = { ID: id };
    this.apiService.GetSupplierByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.supplier = response.SupplierModel;
        this.manualState = response.SupplierModel.State;
        this.manualCity = response.SupplierModel.sCityName;
        this.manualPostalCode = response.SupplierModel.PostCode;
        this.manualStreetAddress = response.SupplierModel.StreetAddress;
        this.manualCountry = this.supplier.sCountryName;

        if (response.SupplierModel.CountryID !== null) {
          this.GetCountryDDFunction(response.SupplierModel.CountryID);
        }
        else {
          this.GetCountryDDFunction(0);
        }
        // this.SelectedAddressList = response.SupplierModel.ClientAddressesDetail;
        // if (this.SelectedAddressList.length > 0) {
        //   if (this.SelectedAddressList[0].ZipCode != null) {
        //     this.netherlandAPIPostalCode = this.SelectedAddressList[0].ZipCode;
        //     this.netherlandAPIHouseNo = Number(this.SelectedAddressList[0].HouseNumber);
        //   }
        // }

        this.SelectedAddressListNew = response.SupplierModel.ClientAddressesDetail;       

      }
      else {
        // console.log('internal server error ! fillFields ');
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please specify password');

      }
    },
      error => {
        console.log('internal server error ! fillFields');
      }
    );

  }
  onUpload(event) {
    const file = event.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.readAsDataURL(file);
    const self = this;
    // tslint:disable-next-line: only-arrow-functions
    reader.onload = function (e) {
      self.base64textString = { Base64String: reader.result.toString(), Extention: file.type.split('/')[1] };
    };
  }
  SaveUpdateSupplierDetails() {

    if (this.supplier.SupplierID > 0)  // for Update
    {
      this.UpdateSupplier();
    }
    else {
      this.SaveSupplier(); // for save
    }
  }

  validateFields() {

    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.supplier.FirstName) || this.supplier.FirstName === '') {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide first name');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.supplier.LastName) || this.supplier.LastName === '') {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide last name');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.supplier.EmailAddress) || this.supplier.EmailAddress === '') {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide email address');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.supplier.PhoneNo) || this.supplier.PhoneNo === '') {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide phone no');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.supplier.sCompanyName) || this.supplier.sCompanyName === '') {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide company name');

      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.supplier.Website) || this.supplier.Website === '') {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide website');

      return false;
    }

    // if (this.SelectedAddressList.length <= 0 && (this.selectedCountryID === '' || this.selectedCountryID == undefined)) {
    //   this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide address');
    //   return false;
    // }

    if (this.SelectedAddressListNew.length <= 0 && (this.selectedCountryID === '' || this.selectedCountryID == undefined)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide address');
      return false;
    }
    return true;
  }


  SaveSupplier() // Save Supplier Method To Communicate API
  {
    if (!this.validateFields()) {
      return;
    }
    this.supplier.IsActiveForSupplier = true;
    this.supplier.IsActive = true;
    this.supplier.sFax = '';
    this.supplier.Mobile = '';
    this.supplier.sSalesTax = '';
    this.supplier.sTaxNo = '';
    this.supplier.VATNumber = '';
    this.supplier.BankAccountDescription = '';
    this.supplier.BankAccountNo = '';
    this.supplier.BICCode = '';
    this.supplier.dCreditLimit = 0;
    this.supplier.dOpeningBalance = 0;
    this.supplier.ShippingMethodID = 1;
    this.supplier.ClientSourceID = 1;
    this.supplier.CreatedByUserIDForSupplier = this.usermodel.ID;

    let address = null;
    const city = null;
    let country = '';
    //if (this.SelectedAddressList.length <= 0) {
      if (!isNullOrUndefined(this.selectedCountryID)) {
      country = this.CountryDropdown.filter(x => x.value === this.selectedCountryID)[0].label;
      const completeaddress = this.manualStreetAddress + ' ' + this.manualPostalCode +
        ' ' + this.manualCity + ' ' + this.manualState + ' ' + country;
        address = completeaddress;
        this.supplier.CountryID = this.selectedCountryID;
      this.supplier.sCountryName = country;
    }
    // else if (this.SelectedAddressList.length > 0) {
    //   address = this.SelectedAddressList[0].StreetName + ' ' + this.SelectedAddressList[0].HouseNumber + ' ' +
    //     this.SelectedAddressList[0].ZipCode + ' ' + this.SelectedAddressList[0].City;
    // }

    else if (this.SelectedAddressListNew.length > 0) {
      address = `${this.SelectedAddressListNew[0].StreetName} ${this.SelectedAddressListNew[0].HouseNumber} ${this.SelectedAddressListNew[0].ZipCode} ${this.SelectedAddressListNew[0].City}`;
      this.supplier.sCountryName = this.SelectedAddressListNew[0].Province;

      }
  
    this.supplier.Address = address;
    this.supplier.City = city;
    this.supplier.sCityName = this.manualCity;
    this.supplier.StreetAddress = this.manualStreetAddress;
    this.supplier.PostCode = this.manualPostalCode;
    this.supplier.State = this.manualState;

    this.supplier.ClientAddressesDetail = this.SelectedAddressListNew;

    if (isNullOrUndefined(this.supplier.IsCustomer)) {
      this.supplier.IsCustomer = false;
    }


    this.supplier.ClientAddresses = [];
    this.supplier.ClientContacts = [];
    this.supplier.Attachments = this.base64textString;

    this.apiService.AddSupplier(this.supplier).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        // this.ResetFields();
        this.notificationService.notify(NotificationEnum.SUCCESS, 'success', response.ResponseText);
        this.router.navigate(['/supplier/supplier-index']);
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        // console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  UpdateSupplier() // Update Supplier Method To Communicate API
  {
    if (!this.validateFields()) {
      return;
    }
    this.supplier.SupplierID = this.routeID;
    this.supplier.IsActiveForSupplier = true;
    this.supplier.IsActive = true;
    this.supplier.sFax = '';
    this.supplier.Mobile = '';
    this.supplier.sSalesTax = '';
    this.supplier.sTaxNo = '';
    this.supplier.VATNumber = '';
    this.supplier.BankAccountDescription = '';
    this.supplier.BankAccountNo = '';
    this.supplier.BICCode = '';
    this.supplier.dCreditLimit = 0;
    this.supplier.dOpeningBalance = 0;
    this.supplier.ShippingMethodID = 1;
    this.supplier.ClientSourceID = 1;
    this.supplier.CreatedByUserIDForSupplier = this.usermodel.ID;

    let address = null;
    const city = null;
    let country = '';
    //if (this.SelectedAddressList.length <= 0) {
      if (!isNullOrUndefined(this.selectedCountryID)) {
      country = this.CountryDropdown.filter(x => x.value === this.selectedCountryID)[0].label;
      const completeaddress = this.manualStreetAddress + ' ' + this.manualPostalCode +
        ' ' + this.manualCity + ' ' + this.manualState + ' ' + country;
        address = completeaddress;
        this.supplier.CountryID = this.selectedCountryID;
        this.supplier.sCountryName = country;
    }
    //else if (this.SelectedAddressList.length > 0) {
     // address = this.SelectedAddressList[0].StreetName + ' ' + this.SelectedAddressList[0].HouseNumber + ' ' +
     //   this.SelectedAddressList[0].ZipCode + ' ' + this.SelectedAddressList[0].City;
    //}

 
    else if (this.SelectedAddressListNew.length > 0) {
      address = `${this.SelectedAddressListNew[0].StreetName} ${this.SelectedAddressListNew[0].HouseNumber} ${this.SelectedAddressListNew[0].ZipCode} ${this.SelectedAddressListNew[0].City}`;
      this.supplier.sCountryName = this.SelectedAddressListNew[0].Province;
    }

    this.supplier.Address = address;
    this.supplier.City = city;
    this.supplier.sCityName = this.manualCity;
    this.supplier.StreetAddress = this.manualStreetAddress;
    this.supplier.PostCode = this.manualPostalCode;
    this.supplier.State = this.manualState;
    
    this.supplier.ClientAddressesDetail = this.SelectedAddressListNew;
    this.supplier.ClientAddresses = [];
    this.supplier.ClientContacts = [];

    this.supplier.Attachments = this.base64textString;

    this.apiService.UpdateSupplier(this.supplier).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.ResetFields();
        this.notificationService.notify(NotificationEnum.SUCCESS, 'success', response.ResponseText);
        this.router.navigate(['/supplier/supplier-index']);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        // console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.supplier = new SupplierModel();
  }

  getAddressByPostalCode() {
    const postalCode = this.netherlandAPIPostalCode;
    if (/\s/.test(postalCode)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'please provide postal code without spaces');
      return;
    }
    // tslint:disable-next-line: deprecation
    if (postalCode === '' || isNullOrUndefined(postalCode)) {
      return;
    }
    const Params = {
      PostCode: postalCode,
      HouseNo: this.netherlandAPIHouseNo,
    };

    this.IsSpinner = true;
    this.apiService.GetAddressDetailByAPI(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.SearchedAddressList = response.AddressDetails;

        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        // console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  addToSecleted(event: AddressDetailModel) {

    // let i = this.SelectedAddressList.findIndex(obj => obj.City === event.City &&
    // obj.Province==event.Province && obj.StreetName==event.StreetName && obj.ZipCode==event.ZipCode &&
    // obj.HouseNumber==event.HouseNumber);
    const i = this.SelectedAddressList.findIndex(obj => obj === event);
    if (i !== -1) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'this address is already added.');
      return;
    }
    this.SelectedAddressList.push(event);

  }

  removeFromSecleted(event: AddressDetailModel) {

    const i = this.SelectedAddressList.findIndex(obj => obj === event);
    if (i !== -1) {
      this.SelectedAddressList.splice(i, 1);
    }
  }
  onClear(form: any) {
    this.base64textString = { Extention: '', Base64String: '' };
    form.clear();
  }
  filterPostCodes(event) {
    let request = {
      country: this.selectedCountryIDNew,
      language: this.selectedCountryIDNew,
      postCode: event.query,
      cityName: "",
      street: ""
    };
    let filtered: any[] = [];
    this.apiService.autoPostCodeComplete(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.predicatedPostCodesResults = response.predications;
        this.predicatedCities = [];
        for (const item of response.predications) {
          filtered.push({ 'name': item.postCode, 'code': item.postCode });
          this.predicatedCities.push({'name':item.cityName,'code':item.cityName});
        }
        
        this.predicatedPostCodes= filtered;
      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );   
  }
  onPostalCodeSelect(event)
  {
      let query = event.name;
      for (let i = 0; i < this.predicatedPostCodesResults.length; i++) {
        let item = this.predicatedPostCodesResults[i];
        if (item.postCode.indexOf(query) == 0) {
          this.selectedCity = {'name':item.cityName,'code':item.cityName};
        }
      }
   }

  filterCities(event) {
    if (this.predicatedCities.length <= 0) {
      let request = {
        country: this.selectedCountryIDNew,
        language: this.selectedCountryIDNew,
        postCode: this.selectedPostCode.name,
        cityName: event.query,
        street: ""
      };
      let filtered1: any[] = [];
      this.apiService.autoCityComplete(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          this.predicatedPostCodes = [];
          this.predicatedPostCodesResults = response.predications;
          for (const item of response.predications) {
            this.predicatedPostCodes.push({'name':item.postCode,'code':item.postCode});
            filtered1.push({'name':item.cityName,'code':item.cityName});
          }
          this.predicatedCities= filtered1;

        }
        else {
          console.log('internal serve Error', response);
        }
  
      }
      );
    }
    else
    {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.predicatedCities.length; i++) {
        let city = this.predicatedCities[i];
        if (city.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(city);
        }
      }
      this.predicatedCities = filtered;
     }
    
   
  }
  filterStreet(event) {
    let request = {
      country: this.selectedCountryIDNew,
      language: this.selectedCountryIDNew,
      postCode: this.selectedPostCode.name,
      cityName: this.selectedCity.name,
      street: event.query
    };
    let filtered1: any[] = [];
    this.apiService.autoStreetComplete(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.predicatedStreetResults = response.predications;
        for (const item of response.predications) {
          filtered1.push({'name':item.streetName,'code':item.streetName});
        }
        this.predicatedStreet = filtered1;

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
   
  }
  MultipleAPIClick() {
    this.multipleAddressDisplay = true;
  }
  AddAddressClick() {
    if (this.selectedCity === '' || isNullOrUndefined(this.selectedCity)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please fill city info');
      return ;
    }
    if (this.selectedStreet === '' || isNullOrUndefined(this.selectedStreet)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please fill street info');
      return ;
    }
    if (this.selectedPostCode === '' || isNullOrUndefined(this.selectedPostCode)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please fill postal code info');
      return ;
    }
    if (this.selectedHouse === '' || isNullOrUndefined(this.selectedHouse)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please fill house info');
      return ;
    }
    
    let model = new AddressDetailModel();
    model.City = (this.selectedCity.name === '' || isNullOrUndefined(this.selectedCity.name))?this.selectedCity:this.selectedCity.name;
    model.HouseNumber = this.selectedHouse;
    model.ID = 0;
    model.StreetName = (this.selectedStreet.name === '' || isNullOrUndefined(this.selectedStreet.name))?this.selectedStreet:this.selectedStreet.name;
    model.ZipCode = (this.selectedPostCode.name === '' || isNullOrUndefined(this.selectedPostCode.name))?this.selectedPostCode:this.selectedPostCode.name;

    model.Province =this.CountryDropdownNew.find(x => x.value === this.selectedCountryIDNew).label;
    model.ProvinceShortCode = this.selectedCountryIDNew;
    
    const i = this.SelectedAddressListNew.findIndex(obj => obj === model);
    if (i !== -1) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'this address is already added.');
      return;
    }
    this.SelectedAddressListNew.push(model);

    this.selectedCity='';
    this.selectedHouse='';
    this.selectedStreet='';
    this.selectedPostCode = '';
    
    this.predicatedPostCodesResults = [];
    this.predicatedPostCodes = [];
    this.predicatedStreet = [];
    this.predicatedStreetResults = [];
    this.predicatedCities = [];
    
  }
}
