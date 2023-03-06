import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { Role } from 'src/app/Helper/models/Role';
import { AddressDetailModel } from 'src/app/Helper/models/AddressDetailModel';
import { CustomerModel } from 'src/app/Helper/models/CustomerModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { CustomerPermissionEnum } from 'src/app/shared/constant/customer-permission';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { isNullOrUndefined } from 'util';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { environment } from 'src/environments/environment';
import { InputDemoComponent } from 'src/app/demo/view/inputdemo.component';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit, OnDestroy {
  CustomerPermission = CustomerPermissionEnum;
  uploadedFiles: any[] = [];

  customer: CustomerModel;
  IsSpinner = false;
  loading: boolean;

  CustomerButtonLabel = '';
  buttonIcon = '';
  routeID: any;

  CountryDropdown: SelectItem[] = [];
  selectedCountryID: any;

  CountryDropdownNew: SelectItem[] = [];
  selectedCountryIDNew: any;



  ShippingMethodDropdown: SelectItem[] = [];
  selectedShippingMethodID: any;

  ClientSourceDropdown: SelectItem[] = [];
  selectedClientSourceID: any;

  DiscountGroupDropdown: SelectItem[] = [];
  selectedDiscountGroupID: any;

  DeliveryPersonDropdown: SelectItem[] = [];
  selectedDeliveryPersonID: any;

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

  SelectedAddressList: AddressDetailModel[] = [];
  SearchedAddressList: AddressDetailModel[] = [];

  SelectedAddressListNew: AddressDetailModel[] = [];

  netherlandAPIPostalCode = '';
  netherlandAPIHouseNo = 0;

  base64textString: IImageModel = {
    Base64String: '',
    Extention: ''
  };
  usermodel: UserModel;

  displayPasswordPopup = false;
  password = '';
  imageBasePath = '';
  IsAddForm = true;
  constructor(
    private route: ActivatedRoute, private notificationService: NotificationService,
    public router: Router,
    private apiService: vaplongapi, private storageService: StorageService) {
    this.routeID = this.route.snapshot.params.id;

    this.imageBasePath = environment.CUSTOMER_IMAGE_PATH;
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    if (this.routeID !== '0') {
      
      this.customer = new CustomerModel();
      this.IsAddForm = false;
      this.CustomerButtonLabel = 'Update Customer';
      this.buttonIcon = 'fas fa-pen';
      this.GetCountryDDNew();
      this.fillFields(this.routeID);
    }
    else {

      this.CustomerButtonLabel = 'Add Customer';
      this.buttonIcon = 'fas fa-plus';
      this.customer = new CustomerModel();
      this.GetCountryDDFunction(0);
      this.GetDiscountGroupDDFunction(0);
      this.GetShippingMethodDDFunction(0);
      this.GetClientSourceDDFunction(0);
      this.GetDeliveryPersonDDFunction(0);
      this.GetCountryDDNew();
    }

  }
  ngOnDestroy(): void {
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
  GetCountryDDFunction(id) {
    this.apiService.GetCountriesForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (id !== 0) { this.selectedCountryID = id; }
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

  GetShippingMethodDDFunction(id) {
    this.apiService.GetShippingMethodDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (id !== 0) { this.selectedShippingMethodID = id; }
        for (const item of response.DropDownData) {
          this.ShippingMethodDropdown.push({
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

  GetClientSourceDDFunction(id) {
    this.apiService.GetClientSourceDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (id !== 0) { this.selectedClientSourceID = id; }
        for (const item of response.DropDownData) {
          this.ClientSourceDropdown.push({
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

  GetDiscountGroupDDFunction(id) {
    this.apiService.GetDiscountGroupDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (id !== 0) { this.selectedDiscountGroupID = id; }
        for (const item of response.DropDownData) {
          this.DiscountGroupDropdown.push({
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

  GetDeliveryPersonDDFunction(id) {
    this.apiService.GetDeliverPersonDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (id !== 0) { this.selectedDeliveryPersonID = id; }
        for (const item of response.DropDownData) {
          this.DeliveryPersonDropdown.push({
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
  ManualInputClick() {
    this.AddressManualDisplay = true;
  }
  NetherlandAPIClick() {
    this.AddressNetherlandAPIDisplay = true;
  }
  MultipleAPIClick() {
    this.multipleAddressDisplay = true;
  }

  fillFields(id) {

    const params = { ID: id };
    this.apiService.GetCustomerbyID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        debugger;

        this.customer = response.CustomerModel;
        this.manualState = response.CustomerModel.State;
        this.manualCity = response.CustomerModel.sCityName;
        this.manualPostalCode = response.CustomerModel.PostCode;
        this.manualStreetAddress = response.CustomerModel.StreetAddress;

        if (response.CustomerModel.CountryID !== null) {
          this.GetCountryDDFunction(response.CustomerModel.CountryID);
        } else {
          this.GetCountryDDFunction(0);
        }

        if (response.CustomerModel.DeliveryPersonID !== null) {
          this.GetDeliveryPersonDDFunction(response.CustomerModel.DeliveryPersonID);
        } else {
          this.GetDeliveryPersonDDFunction(0);
        }

        if (response.CustomerModel.ShippingMethodID !== null) {
          this.GetShippingMethodDDFunction(response.CustomerModel.ShippingMethodID);
        } else {
          this.GetShippingMethodDDFunction(0);
        }

        if (response.CustomerModel.DiscountGroupID !== null) {
          this.GetDiscountGroupDDFunction(response.CustomerModel.DiscountGroupID);
        } else {
          this.GetDiscountGroupDDFunction(0);
        }

        if (response.CustomerModel.ClientSourceID !== null) {
          this.GetClientSourceDDFunction(response.CustomerModel.ClientSourceID);
        } else {
          this.GetClientSourceDDFunction(0);
        }

        // this.SelectedAddressList = response.CustomerModel.ClientAddressesDetail;
        // if (this.SelectedAddressList.length > 0) {
        //   if (this.SelectedAddressList[0].ZipCode != null) {
        //     this.netherlandAPIPostalCode = this.SelectedAddressList[0].ZipCode;
        //     this.netherlandAPIHouseNo = Number(this.SelectedAddressList[0].HouseNumber);
        //   }
        // }
         this.SelectedAddressListNew = response.CustomerModel.ClientAddressesDetail;       
      }
      else {
        console.log('internal server error ! fillFields ');
      }
    },
      error => {
        console.log('internal server error ! fillFields');
      });
  }
  SaveUpdateCustomerDetails() {

    if (this.customer.CustomerID > 0)  // for Update
    {
      this.UpdateCustomer();
    }
    else {
      this.SaveCustomer(); // for save
    }
  }

  validateFields() {

    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.customer.FirstName) || this.customer.FirstName === '') {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide first name');
      return false;
    }
    // tslint:disable-next-line: deprecation
    // if (isNullOrUndefined(this.customer.LastName) || this.customer.LastName === '') {
    //   this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide last name');
    //   return false;
    // }
    // if (isNullOrUndefined(this.customer.EmailAddress) || this.customer.EmailAddress== '')
    // {      this.notificationService.notify(NotificationEnum.INFO, 'info','please provide  email address');
    //     return false;
    // }
    // tslint:disable-next-line: deprecation
    // if (isNullOrUndefined(this.customer.PhoneNo) || this.customer.PhoneNo === '') {
    //   this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide phone no');
    //   return false;
    // }
    // if (this.customer.EmailAddress== "")
    // if ($('#txtFax').val() == "")
    // {      this.notificationService.notify(NotificationEnum.INFO, 'info','please provide fax no');

    //     return false;
    // }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.customer.sCompanyName) || this.customer.sCompanyName === '') {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide company name');

      return false;
    }
    // tslint:disable-next-line: deprecation
    // if (isNullOrUndefined(this.customer.Website) || this.customer.Website === '') {
    //   this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide website');

    //   return false;
    // }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.customer.dCreditLimit)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide credit limit ');

      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.customer.dCreditLimit)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide credit limit');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.customer.dOpeningBalance)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide opening balance ');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (this.selectedShippingMethodID === '' || isNullOrUndefined(this.selectedShippingMethodID)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide ShippingMethod');

      return false;
    }
    // tslint:disable-next-line: deprecation
    if (this.selectedClientSourceID === '' || isNullOrUndefined(this.selectedClientSourceID)) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please provide client source');

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

  async SaveCustomer() // Save Customer Method To Communicate API
  {
    
    if (!this.validateFields()) {
      return;
    }
    this.customer.IsActiveForCustomer = true;
    this.customer.IsActive = true;
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.selectedShippingMethodID)) {
      this.customer.ShippingMethodID = null;
    } else {
      this.customer.ShippingMethodID = this.selectedShippingMethodID;
    }

    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.selectedClientSourceID)) {
      this.customer.ClientSourceID = null;
    } else {
      this.customer.ClientSourceID = this.selectedClientSourceID;
    }

    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.selectedDeliveryPersonID)) {
      this.customer.DeliveryPersonID = null;
    } else {
      this.customer.DeliveryPersonID = this.selectedDeliveryPersonID;
    }

    if (isNullOrUndefined(this.selectedDiscountGroupID)) {
      this.customer.DiscountGroupID = null;
    } else {
      this.customer.DiscountGroupID = this.selectedDiscountGroupID;
    }

    if (isNullOrUndefined(this.customer.IsOrderCreater)) {
      this.customer.IsOrderCreater = false;
    }

     if (isNullOrUndefined(this.customer.IsSupplier)) {
      this.customer.IsSupplier = false;
    }

    if (this.customer.dCreditLimit !== 0 || this.customer.dOpeningBalance !== 0) {
      if (this.password === '' || this.password === null) {
        this.notificationService.notify(NotificationEnum.INFO, 'info', 'please enter password');
        this.displayPasswordPopup = true;
        return;
      }
      else {
        const res = await this.validatePassword(this.password);
        if (!res) { return; }
      }
    }
    this.customer.CreatedByUserIDForCustomer = this.usermodel.ID;
    let address = null;
    const city = null;
    let country = '';
    // tslint:disable-next-line: deprecation
    if (!isNullOrUndefined(this.selectedCountryID)) {
      country = this.CountryDropdown.find(x => x.value === this.selectedCountryID).label;
      const completeaddress = `${this.manualStreetAddress} ${this.manualPostalCode} ${this.manualCity} ${this.manualState} ${country}`;
      address = completeaddress;
      this.customer.CountryID = this.selectedCountryID;
      this.customer.sCountryName = country;

    }
    // else if (this.SelectedAddressList.length > 0) {
    //   address = `${this.SelectedAddressList[0].StreetName} ${this.SelectedAddressList[0].HouseNumber} ${this.SelectedAddressList[0].ZipCode} ${this.SelectedAddressList[0].City}`;
    //   this.customer.sCountryName = this.SelectedAddressList[0].Province;

    // }
    else if (this.SelectedAddressListNew.length > 0) {
         address = `${this.SelectedAddressListNew[0].StreetName} ${this.SelectedAddressListNew[0].HouseNumber} ${this.SelectedAddressListNew[0].ZipCode} ${this.SelectedAddressListNew[0].City}`;
         this.customer.sCountryName = this.SelectedAddressListNew[0].Province;
  
       }
       debugger;
    this.customer.Address = address;
    this.customer.City = city;
    this.customer.sCityName = this.manualCity;
    this.customer.StreetAddress = this.manualStreetAddress;
    this.customer.PostCode = this.manualPostalCode;
    this.customer.State = this.manualState;

    //this.customer.ClientAddressesDetail = this.SelectedAddressList;
    this.customer.ClientAddressesDetail = this.SelectedAddressListNew;
    this.customer.ClientAddresses = [];
    this.customer.ClientContacts = [];
    this.customer.Attachments = this.base64textString;
    
    this.apiService.AddCustomer(this.customer).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        // this.ResetFields();
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.displayPasswordPopup = false;
        this.router.navigate(['/customer/customer-index']);
      }
      else if (response.ResponseCode === -11) {
        this.notificationService.notify(NotificationEnum.INFO, 'Info', response.ResponseText);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.RespponseText);
      }
    });
  }
  async UpdateCustomer() // Update Customer Method To Communicate API
  {

    this.customer.IsActiveForCustomer = true;
    this.customer.IsActive = true;

    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.selectedShippingMethodID)) {
      this.customer.ShippingMethodID = null;
    } else {
      this.customer.ShippingMethodID = this.selectedShippingMethodID;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.selectedClientSourceID)) {
      this.customer.ClientSourceID = null;
    } else {
      this.customer.ClientSourceID = this.selectedClientSourceID;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.selectedDeliveryPersonID)) {
      this.customer.DeliveryPersonID = null;
    } else {
      this.customer.DeliveryPersonID = this.selectedDeliveryPersonID;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.selectedDiscountGroupID)) {
      this.customer.DiscountGroupID = null;
    } else {
      this.customer.DiscountGroupID = this.selectedDiscountGroupID;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.customer.IsOrderCreater)) {
      this.customer.IsOrderCreater = false;
    }


    if (this.customer.dCreditLimit !== 0 || this.customer.dOpeningBalance !== 0) {
      if (this.password === '' || this.password === null) {
        this.notificationService.notify(NotificationEnum.INFO, 'info', 'please enter password');
        this.displayPasswordPopup = true;
        return;
      }
      else {
        const res = await this.validatePassword(this.password);
        if (!res) { return; }
      }

    }

    this.customer.CreatedByUserIDForCustomer = this.usermodel.ID;
    let address = null;
    const city = null;
    let country = '';
    // tslint:disable-next-line: deprecation
    if (!isNullOrUndefined(this.selectedCountryID)) {
      country = this.CountryDropdown.find(x => x.value === this.selectedCountryID).label;
      const completeaddress = `${this.manualStreetAddress} ${this.manualPostalCode} ${this.manualCity} ${this.manualState} ${country}`;
      address = completeaddress;
      this.customer.CountryID = this.selectedCountryID;
      this.customer.sCountryName = country;

    }
    // else if (this.SelectedAddressList.length > 0) {
    //   address = `${this.SelectedAddressList[0].StreetName} ${this.SelectedAddressList[0].HouseNumber} ${this.SelectedAddressList[0].ZipCode} ${this.SelectedAddressList[0].City}`;
    //   this.customer.sCountryName = this.SelectedAddressList[0].Province
    // }

    else if (this.SelectedAddressListNew.length > 0) {
      address = `${this.SelectedAddressListNew[0].StreetName} ${this.SelectedAddressListNew[0].HouseNumber} ${this.SelectedAddressListNew[0].ZipCode} ${this.SelectedAddressListNew[0].City}`;
      this.customer.sCountryName = this.SelectedAddressListNew[0].Province;

    }

    this.customer.Address = address;
    this.customer.City = city;
    this.customer.sCityName = this.manualCity;
    this.customer.StreetAddress = this.manualStreetAddress;
    this.customer.PostCode = this.manualPostalCode;
    this.customer.State = this.manualState;

    //this.customer.ClientAddressesDetail = this.SelectedAddressList;
    this.customer.ClientAddressesDetail = this.SelectedAddressListNew;
    this.customer.ClientAddresses = [];
    this.customer.ClientContacts = [];
    this.customer.Attachments = this.base64textString;
    this.apiService.UpdateCustomer(this.customer).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        // this.ResetFields();
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.displayPasswordPopup = false;
        this.router.navigate(['/customer/customer-index']);
      }
      else if (response.ResponseCode === -11) {
        this.notificationService.notify(NotificationEnum.INFO, 'Info', response.ResponseText);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.RespponseText);
      }
    });
  }

  ResetFields() // Reset Object
  {
    this.customer = new CustomerModel();
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
    this.apiService.GetAddressDetailByAPI(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.SearchedAddressList = response.AddressDetails;
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.RespponseText);
      }
    });
  }
  addToSecleted(event: AddressDetailModel) {

    // let i = this.SelectedAddressList.findIndex(obj => obj.City == event.City && obj.Province==event.Province
    //  && obj.StreetName==event.StreetName && obj.ZipCode==event.ZipCode && obj.HouseNumber==event.HouseNumber);
    const i = this.SelectedAddressList.findIndex(obj => obj === event);
    if (i !== -1) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'this address is already added.');
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
  removeFromSecletedMultiple(event: AddressDetailModel) {
    const i = this.SelectedAddressListNew.findIndex(obj => obj === event);
    if (i !== -1) {
      this.SelectedAddressListNew.splice(i, 1);
    }
  }
  async validatePassword(password) {
    // if (this.usermodel.ID === 1)// Check Password
    // {
      const params = {
        ID:3,
        Password: password,
        Name:'',
        IsActive:true,
        UpdatedByUserID:this.usermodel.ID,
      };
      const response = await this.apiService.CheckReceivedPaymentPassword(params).toPromise();
      if (response.ResponseCode !== 0) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add customer.');
        return false;
      }
      else {
        return true;
      }

    // }
    // else {
    //   const params = {
    //     VerificationCode: password,
    //     Type: 2,
    //     UserID: this.usermodel.ID,
    //     Amount: 0,
    //     UsedFor: (this.customer.CustomerID !== 0) ? this.customer.CustomerID : 0
    //   };

    //   const response = await this.apiService.CheckValidationCode(params).toPromise();
    //   if (response.ResponseCode !== 0) {
    //     this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
    //     return false;
    //   }
    //   else {
    //     return true;
    //   }
    // }
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
  onClear(form: any) {
    this.base64textString = { Extention: '', Base64String: '' };
    form.clear();
  }
  // validatePassword():any {
  //   if(this.usermodel.ID === 1 )//Check Password
  //   {
  //     let params ={
  //      Password :this.password
  //     }
  //     this.apiService.CheckReceivedPaymentPassword(params).subscribe((response: any) => {
  //      if (response.ResponseCode != 0){
  //        return false;
  //      }
  //      else
  //      {
  //        return true;
  //      }
  //    }
  //    );
  //   }
  //   else
  //   {
  //    let params ={
  //      VerificationCode :this.password,
  //      Type :2,
  //      UserID:this.usermodel.ID,
  //      Amount:0,
  //      UsedFor : (this.customer.CustomerID != 0) ? this.customer.CustomerID : 0
  //     }

  //     this.apiService.CheckValidationCode(params).subscribe((response: any) => {

  //      if (response.ResponseCode != 0){
  //       return false;
  //      }
  //      else
  //      {
  //        return true;
  //      }

  //    }
  //    );


  //   }
  // }
}
