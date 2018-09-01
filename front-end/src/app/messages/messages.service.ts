import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class MessagesService {

  constructor(private httpClient: HttpClient) {}

  getQuestions(username:string) {
    return this.httpClient.get(environment.apiUrl + "/question/getQuestion/"+JSON.parse(sessionStorage.getItem("username")));
  }

  acceptRequest(questionId:any){
    return this.httpClient.patch(environment.apiUrl + "/question/acceptQuestion/"+ questionId,{});

  }

  rejectRequest(questionId:any){
    return this.httpClient.patch(environment.apiUrl + "/question/rejectQuestion/"+ questionId,{});

  }

  addSlots(questionId:any,slots:any){
    return this.httpClient.patch(environment.apiUrl + "/question/addSlots/"+ questionId,{slots});

  }

  sendMessage(questionId:any,message:string){
    return this.httpClient.patch(environment.apiUrl + "/question/sendMessage/"+ questionId,{message});

  }

  addRoom(questionId:any,sessionRoom:string,typeOfSession:string){
    return this.httpClient.patch(environment.apiUrl + "/question/addroom/"+ questionId,{sessionRoom,typeOfSession});

  }

  sendSlot(questionId:any,selectedSlot:string){
    return this.httpClient.patch(environment.apiUrl + "/question/selectSlot/"+ questionId,{selectedSlot});

  }
}
