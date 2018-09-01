import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgbdModalContent,
  NgbdModalContent2,
  NgbdModalContent3
} from "./profile.component";
import { FileSelectDirective, FileDropDirective } from "ng2-file-upload";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule, LocalDataSource } from "ng2-smart-table";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule
  ],
  declarations: [
    NgbdModalContent,
    NgbdModalContent2,
    NgbdModalContent3,
    FileSelectDirective
  ]
})
export class ProfileModule {}
