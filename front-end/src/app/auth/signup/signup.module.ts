import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import {GoogleSignInComponent} from 'angular-google-signin';
import { SignupService } from './signup.service';
import { regService } from '../../services/reg.services';
@NgModule({
  imports: [ FormsModule],
  declarations: [SignupComponent, GoogleSignInComponent],
  providers: [regService,SignupService]

})
export class SignupModule {


}
