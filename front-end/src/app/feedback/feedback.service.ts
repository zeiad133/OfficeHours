import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class FeedbackService {

    sessionRoom=JSON.parse(sessionStorage.getItem("room"));
  constructor(private httpClient: HttpClient) {}

  getProfile(username:string) {
    return this.httpClient.get(environment.apiUrl + "user/getUserByUsername/" + username);
  }

  getQuestionExpert() {
    return this.httpClient.get(environment.apiUrl + "/question/getQuestionsByRoomEx/"+this.sessionRoom);
  }

  getQuestionsUsers() {
      console.log(this.sessionRoom)
    return this.httpClient.get(environment.apiUrl + "/question/getQuestionsByRoomUser/"+this.sessionRoom);
  }

  rateUser(rate:Number,username:String){
      return this.httpClient.patch(environment.apiUrl + "/user/rateUser",{"rating":rate,'username':username});
  }

  submitFeedback(rate:Number,reviewee:String,reviewer:String,feedback:String,room:String,selectedSlot:String){
    return this.httpClient.post(environment.apiUrl + "/question/createFeedback",{"rate":rate,'reviewee':reviewee,'reviewer':reviewer,'feedback':feedback,'room':room,'selectedSlot':selectedSlot});
}


}
