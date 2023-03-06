import { SharedModule } from './../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginVPComponent } from './LoginVP/loginvp.component';
import { LoginEOComponent } from './LoginEO/logineo.component';
import { LoginFRComponent } from './LoginFR/loginfr.component';

import { LoginRoutingModule } from './login.routing.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';

import { ButtonModule } from 'primeng/button';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    InputNumberModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    PasswordModule,
    ButtonModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    LoginVPComponent,
    LoginEOComponent,
    LoginFRComponent
  ]
})
export class LoginModule { }
