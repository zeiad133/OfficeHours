import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ChatService } from "../services/chat.service";
declare var bc: any;
@Component({
  selector: "app-chat",
  templateUrl: "./Chat.component.html",
  styleUrls: ["./Chat.component.css"],
  providers: [ChatService]
})
export class ChatModule {
  session=true;
  user= JSON.parse(sessionStorage.getItem("userr"));
  email: String;
  room: String;
  username=JSON.parse(sessionStorage.getItem("username"));
  messageText: String;
  messageArray: Array<{ user: any; message: String }> = [];
  current = this;
  boolean = false;
  isexpert=false;
   d = new Date()
  h = this.d.getHours();
  m = this.d.getMinutes();

  
  constructor(private _chatService: ChatService) {
    this._chatService
      .newUserJoined()
      .subscribe(data => this.messageArray.push(data));

    this._chatService
      .userLeftRoom()
      .subscribe(data => this.messageArray.push(data));

    this._chatService
      .newMessageReceived()
      .subscribe(data => this.messageArray.push(data));
  }

  
  leave() {
    this._chatService.leaveRoom({
      user: JSON.parse(sessionStorage.getItem("userr")),
      room: this.room
    });
    sessionStorage.setItem("room", JSON.stringify(this.room));
    document.getElementById("joo").style.visibility = "visible";
    setTimeout(function(){
      window.location.href="#/feedback";
    });
  }
  sendMessage() {
    this._chatService.sendMessage({
      user:JSON.parse(sessionStorage.getItem("userr")),
      room: this.room,
      message: this.messageText
    });
    this.messageText='';
    this.d = new Date()
    this.h = this.d.getHours();
    this.m = this.d.getMinutes();
  }
 
  htmlRoom;
  htmlMembers;
  htmlLocalStream;
  // when Bistri API client is ready, function
  // "onBistriConferenceReady" is invoked
  onBistriConferenceReady() {
    // test if the browser is WebRTC compatible
    const current = this;
    if (!bc.isCompatible()) {
      // if the browser is not compatible, display an alert
      alert("your browser is not WebRTC compatible !");
      // then stop the script execution
      return;
    }

    // https://api.developers.bistri.com/login
    bc.init( {
      "appId": "6b8aad55",
      "appKey": "924765516f96a6637934e0b55a214ce3"
  } );

    /* Set events handler */

    // when local user is connected to the server
    bc.signaling.bind("onConnected", function() {
      // show pane with id "pane_1"
      console.log(this);
      current.showPanel("pane_1");
    });

    // when an error occured on the server side
    bc.signaling.bind("onError", function(error) {
      // display an alert message
      alert(error.text + " (" + error.code + ")");
    });

    // when the user has joined a room

    bc.signaling.bind("onJoinedRoom", function(data) {
      // set the current room name
      current.htmlRoom = data.room;
      current.htmlMembers = data.members;
      // ask the user to access to his webcam
      bc.startStream("webcam-sd", function(stream) {
        // affect stream to "localStream" var
        current.htmlLocalStream = stream;
        // when webcam access has been granted
        // show pane with id "pane_2"
        current.showPanel("pane_2");
        // insert the local webcam stream into div#video_container node
        
        bc.attachStream(stream, current.q("#video_container"), {
          mirror: true
        });
        // then, for every single members present in the room ...
        for (var i = 0, max = current.htmlMembers.length; i < max; i++) {
          // ... request a call
          bc.call(current.htmlMembers[i].id, current.htmlRoom, {
            stream: stream
          });
        }
      });
    });

    // when an error occurred while trying to join a room
    bc.signaling.bind("onJoinRoomError", function(error) {
      // display an alert message
      alert(error.text + " (" + error.code + ")");
    });

    // when the local user has quitted the room
    bc.signaling.bind("onQuittedRoom", function(room) {
      // stop the local stream
      bc.stopStream(current.htmlLocalStream, function() {
        // remove the stream from the page
        bc.detachStream(current.htmlLocalStream);
        // show pane with id "pane_1"
        current.showPanel("pane_1");
      });
    });

    // when a new remote stream is received
    bc.streams.bind("onStreamAdded", function(remoteStream) {
      // insert the new remote stream into div#video_container node
      bc.attachStream(remoteStream, current.q("#video_container_2"));
    });

    // when a remote stream has been stopped
    bc.streams.bind("onStreamClosed", function(stream) {
      // remove the stream from the page
      bc.detachStream(stream);
    });

    // when a local stream cannot be retrieved
    bc.streams.bind("onStreamError", function(error) {
      switch (error.name) {
        case "PermissionDeniedError":
          alert("Webcam access has not been allowed");
          bc.quitRoom(current.htmlRoom);
          break;
        case "DevicesNotFoundError":
          if (
            this.confirm(
              "No webcam/mic found on this machine. Process call anyway ?"
            )
          ) {
            // show pane with id "pane_2"
            current.showPanel("pane_2");
            for (var i = 0, max = current.htmlMembers.length; i < max; i++) {
              // ... request a call
              bc.call(current.htmlMembers[i].id, current.htmlRoom);
            }
          } else {
            bc.quitRoom(current.htmlRoom);
          }
          break;
      }
    });

    // bind function "joinConference" to button "Join Conference Room"
    this.q("#join").addEventListener("click", this.joinConference);

    // bind function "quitConference" to button "Quit Conference Room"
    this.q("#quit").addEventListener("click", this.quitConference);

    // open a new session on the server
    bc.connect();
  }

  showPanel(id) {
    var panes = document.querySelectorAll(".pane");
    // for all nodes matching the query ".pane"
    for (var i = 0, max = panes.length; i < max; i++) {
      // hide all nodes except the one to show
      (<HTMLElement>panes[i]).style.display =
        panes[i].id == id ? "block" : "none";
    }
  }
  // when button "Join Conference Room" has been clicked
  joinConference() {
   
    var panes = document.querySelectorAll(".pane");
    for (var i = 0, max = panes.length; i < max; i++) {
      // hide all nodes except the one to show
      (<HTMLElement>panes[i]).style.display =
        panes[i].id == "pane_1" ? "block" : "none";
    }
    var roomToJoin = this.room;
    // if "Conference Name" field is not empty ...
    if (roomToJoin) {
      // ... join the room
      bc.joinRoom(roomToJoin);
    } else {
      // otherwise, display an alert
    }
  }

  // when button "Quit Conference Room" has been clicked
  quitConference() {
    // quit the current conference room
    bc.quitRoom(this.htmlRoom);
  }

  q(query) {
    // return the DOM node matching the query
    return document.querySelector(query);
  }
  join() {
    this._chatService.joinRoom({
      user:JSON.parse(sessionStorage.getItem("userr")) ,
      room: this.room
    });
    //Button leave only appear when the user joined a room
    document.getElementById("leave").style.visibility = "visible";
    this._chatService.checkRoom(this.room).subscribe(
      (res: any) =>{
       console.log(res.data.typeOfSession);
       if(res.data.typeOfSession=="Video"){
         //Video call option only allowed when the type of the sessions is Video
        document.getElementById("ready").style.visibility = "visible";
       }
  });
    document.getElementById("joo").style.visibility = "hidden";
    document.getElementById("session").style.visibility = "hidden";
    document.getElementById("session2").style.visibility = "hidden";
  }


  ngOnInit() {
    document.getElementById("leave").style.visibility = "hidden";
    document.getElementById("join").style.visibility = "hidden";
    document.getElementById("ready").style.visibility = "hidden";

  
}
ready(){
  if (!this.boolean) {
    this.boolean = true;
    this.onBistriConferenceReady();
    alert('video is ready')
  }
  document.getElementById("join").style.visibility = "visible";
  document.getElementById("session").style.visibility = "hidden";
  document.getElementById("ready").style.visibility = "hidden";
  document.getElementById("session2").style.visibility = "hidden";

}
}
