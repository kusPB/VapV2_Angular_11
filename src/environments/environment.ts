// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//const serverurl = 'http://85.214.36.134:443/'; // test server
//const serverurl = 'http://87.106.157.215:443/';  // live server
// const serverurl = 'https://87.106.157.215:443/';  // new live server
//const serverurl = 'https://vaplong.com/';  // new live server
//const serverurl = 'http://85.215.227.16:3001/';  // MC live server
// const serverurl = 'http://85.215.230.111:443/'; // new test server

const serverurl = 'http://85.215.230.111:543/'; // new test server for testing

//const serverurl = 'http://85.215.165.202:543/'; // new server 
//const serverurl = 'http://85.215.230.111:700/'; // new test server for frontend developer

    
export const environment = {
  production: true,
   
  API_URL: serverurl,
  url: serverurl + 'api',
  imageBasePath: serverurl + 'Content/',
  USER_IMAGE_PATH: serverurl + 'Images/UserImages/',
  
  HELP_IMAGE_PATH: serverurl + 'Images/Help/',
  CUSTOMER_IMAGE_PATH: serverurl + 'Images/CustomerImages/',
  SUPPLIER_IMAGE_PATH: serverurl + 'Images/SupplierImages/',
  CUSTOMER_DOCUMENT_PATH: serverurl + 'Images/CustomerDocuments/',
  SHIPMENT_PATH: serverurl + 'Images/Shipment/',


  companyName: 'Euro Mobile Company',
  companyAddress: 'Innsbruckweg 40 3047AH Rotterdam',
  vatNo: 'NL854260936B01',
  telephone: '0104151550',
  email: 'info@emcgsm.fr',
  website: 'https://emcparts.shop',
  SECRET_KEY: 'y_#U$.&^$*fcx@t28mu',


  // system static variable changes

  //For Vaplong System 
  MENU_THEME : 'layout-sidebar-darkgray',
  APP_LOGO: 'assets/layout/images/logo.png',
  //Menu_Name: 'Vaplong',
  Menu_Name:'Software',
  //FOOTER_TEXT:'Vaplong - 2020',
  FOOTER_TEXT:'Software - 2020',

	// for mcservices 
  //MENU_THEME : 'layout-sidebar-blue',
  //APP_LOGO: 'assets/layout/images/mc_logo.png',
  //Menu_Name: 'MC',
  //FOOTER_TEXT:'MC Services - 2021',



 
};
/* 
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
