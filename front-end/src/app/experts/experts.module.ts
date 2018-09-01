import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpertsService } from './experts.service';
import { NgbdModalContent4 } from './experts.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NgbdModalContent4],
  providers: [ExpertsService]

  
})
export class ExpertsModule { }
