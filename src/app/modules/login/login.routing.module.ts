
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { LoginVPComponent } from './LoginVP/loginvp.component';
import { LoginEOComponent } from './LoginEO/logineo.component';
import { LoginFRComponent } from './LoginFR/loginfr.component';


const routes: Routes = [
  //{ path: 'login', component: LoginComponent },
  //{ path: 'login', component: LoginVPComponent },
  { path: 'login', component: LoginEOComponent },
  //{ path: 'login', component: LoginFRComponent },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoginRoutingModule {}