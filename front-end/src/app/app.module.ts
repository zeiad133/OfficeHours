import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UserOb } from "../app/objects/UserObject";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { HeaderComponent } from "./header/header.component";
import { Home2Component } from "./home2/home2.component";
import { MessagesComponent } from "./messages/messages.component";
import { FooterComponent } from "./footer/footer.component";
import { topics } from "./topic/topic.component";

import {
  ProfileComponent,
  NgbdModalContent,
  NgbdModalContent2,
  NgbdModalContent3,
  NgbdModalContent6
} from "./profile/profile.component";
import { InboxComponent } from "./inbox/inbox.component";
import {
  ExpertsComponent,
  NgbdModalContent4
} from "./experts/experts.component";
import { FavoriteExpertComponent } from "./favoriteExpert/favoriteExpert.component";
import { BlockedUserComponent } from "./blockeduser/blockeduser.component";

import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth-guard.service";
import { httpInterceptorProviders } from "./http-interceptors";
import {
  DlDateTimePickerDateModule,
  DlDateTimePickerComponent
} from "angular-bootstrap-datetimepicker";
import { AngularDateTimePickerModule } from "angular2-datetimepicker";
import { ChatModule } from "./Chat/Chat.component";
import { Ng2SmartTableModule, LocalDataSource } from "ng2-smart-table";
import { ViewProfileComponent } from "./view-profile/view-profile.component";
import {
  ScheduleComponent,
  NgbdModalContent5
} from "./schedule/schedule.component";
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
  declarations: [
    topics,
    BlockedUserComponent,
    AppComponent,
    HomeComponent,
    Home2Component,
    InboxComponent,
    SignupComponent,
    LoginComponent,
    HeaderComponent,
    MessagesComponent,
    FooterComponent,
    ProfileComponent,
    NgbdModalContent,
    NgbdModalContent3,
    NgbdModalContent2,
    NgbdModalContent4,
    NgbdModalContent5,
    NgbdModalContent6,
    InboxComponent,
    ChatModule,
    ExpertsComponent,
    FavoriteExpertComponent,
    ViewProfileComponent,
    ScheduleComponent,
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    DlDateTimePickerDateModule,
    AngularDateTimePickerModule,
    Ng2SmartTableModule
  ],
  bootstrap: [AppComponent,NgbdModalContent,
    NgbdModalContent3,
    NgbdModalContent2,
    NgbdModalContent4,
    NgbdModalContent5,
    NgbdModalContent6,],
  providers: [httpInterceptorProviders, AuthService, AuthGuard]
})
export class AppModule {}
