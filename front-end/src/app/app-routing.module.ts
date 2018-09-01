import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { Home2Component } from "./home2/home2.component";
import { MessagesComponent } from "./messages/messages.component";
import { ProfileComponent } from "./profile/profile.component";
import { InboxComponent } from "./inbox/inbox.component";
import { ExpertsComponent } from "./experts/experts.component";
import { FavoriteExpertComponent } from "./favoriteExpert/favoriteExpert.component";
import { ViewProfileComponent } from "./view-profile/view-profile.component";
import { ChatModule } from "./Chat/Chat.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { BlockedUserComponent } from "./blockeduser/blockeduser.component";
import { topics } from "./topic/topic.component";
import { APP_BASE_HREF } from "@angular/common";
import { FeedbackComponent } from "./feedback/feedback.component";

const routes: Routes = [
  {
    path: "topics",
    component: topics
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "blockedusers",
    component: BlockedUserComponent
  },
  {
    path: "home2",
    component: Home2Component
  },
  {
    path: "experts",
    component: ExpertsComponent
  },
  {
    path: "favourites",
    component: FavoriteExpertComponent
  },
  {
    path: "profile",
    component: ProfileComponent
  },
  {
    path: "view-profile",
    component: ViewProfileComponent
  },
  {
    path: "schedule",
    component: ScheduleComponent
  },
  {
    path: "inbox",
    component: InboxComponent
  },
  {
    path: "messages",
    component: MessagesComponent
  },

  {
    path: "auth",
    children: [
      {
        path: "signin",
        component: LoginComponent
      },
      {
        path: "signup",
        component: SignupComponent
      }
    ]
  },
  {
    path: "chat",
    component: ChatModule
  },

  {
    path: "feedback",
    component: FeedbackComponent
  },

  {
    path: "home",
    loadChildren: "./home/home.module#HomeModule"
  },

  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: "home"
  }
];

const config: ExtraOptions = {
  useHash: true
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: []
})
// { provide: APP_BASE_HREF, useValue: "/" }
export class AppRoutingModule {}
