import { Component, OnInit } from "@angular/core";
import { viewtopicsservice } from "./viewtopics.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-topics",
  templateUrl: "./topics.component.html",
  styleUrls: ["./topics.component.scss"],
  providers: [viewtopicsservice]
})
export class topics implements OnInit {
  topics = [];
  chosentopics = [];
  message = "";
  responseMessage: string;
  

  constructor(
    private viewtopicsservice: viewtopicsservice,
    private router: Router,
    private as: AuthService
  ) {
    if (!this.as.authorized) this.router.navigateByUrl("/home");
  }

  ngOnInit() {
    this.viewtopicsservice.viewtopics().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        
        this.topics = res.data;
        for (var i = 0; i < this.topics.length; i++) {
          this.topics[i].view_id = i;
          this.topics[i].selected = false;
          
        }
      }
      var color; // hexadecimal starting symbol
      var letters = ['000000','FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF','C0C0C0']; //Set your colors here
      var x= document.getElementsByClassName("gallery-item");
                for(var i=0;i<x.length;i++)
                {
                    color="#";
                    color += letters[Math.floor(Math.random() * letters.length)];
                    (<HTMLInputElement>x[i]).style.backgroundColor = color;
                }

    });
  }

  //
  // sendRequest(){
  //       this.viewtopicsservice.viewTopics(this.chosentopics);
  //         const modalRef = this.modalService.open( NgbdModalContent4 );
  //
  //
  // }
  addtopic(topic) {
    this.viewtopicsservice.ExpertSelectTopic(topic._id).subscribe(
      (res: any) => {
        // document.getElementById("modal").style.display = "block";
        
        // this.message =topic.topicTitle + " was added to your topic's list";
        alert(topic.topicTitle + " was added to your topic's list");
      },
      error => {
        // document.getElementById("modal").style.display = "block";
        // this.message = JSON.parse(error._body).msg;
        window.alert(error.error.msg);
  
      }
    );
  }

  onClick() {
    var contactDiv = document.getElementById("done");
    scrollTo({ left: 0, top: contactDiv.offsetTop, behavior: "smooth" });
  }
  
  toggleTopic(topic) {
    if (!this.chosentopics.includes(topic))
      if (this.chosentopics.length < 3) {
        topic.selected = true;
        topic.activity = "active";
        this.chosentopics.push(topic);
        var topicView = document.getElementById("topicView" + topic.view_id);
        topicView.setAttribute("checked", "true");
        sessionStorage.setItem(
          "chosenTopics",
          JSON.stringify(this.chosentopics)
        );
      } else {
        topic.selected = false;
        topic.activity = "inactive";
        this.chosentopics.forEach((item, index) => {
          if (item === topic) this.chosentopics.splice(index, 1);
        });
        var topicView = document.getElementById("topicView" + topic.view_id);
        topicView.removeAttribute("checked");
        this.message = "You can only choose three topics to address.";
        document.getElementById("modal").style.display = "block";
      }
    else {
      topic.selected = false;
      this.chosentopics.forEach((item, index) => {
        if (item.id == topic.id) this.chosentopics.splice(index, 1);
      });
      var topicView = document.getElementById("topicView" + topic.view_id);
      topicView.removeAttribute("checked");
    }
    var requestButton = document.getElementById("requester");
    if (this.chosentopics.length > 0) {
      requestButton.setAttribute("style", "visibility: visible");
    } else {
      requestButton.setAttribute("style", "visibility: hidden");
    }
  }
}
