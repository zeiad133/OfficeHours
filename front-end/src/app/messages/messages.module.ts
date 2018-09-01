import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

@NgModule({
  imports: [
    CommonModule,
    DlDateTimePickerDateModule,
    AngularDateTimePickerModule

  ],
  declarations: []
})
export class MessagesModule { }
