import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class ScheduleService {

  constructor(private httpClient: HttpClient) {}

  getProfile(username:string) {
    console.log(username);
    return this.httpClient.get(environment.apiUrl + "user/getUserByUsername/" + username);
  }

  getQuestions() {
    return this.httpClient.get(environment.apiUrl + "/question/getQuestionUser");
  }

  getQuestionsUsers() {
    return this.httpClient.get(environment.apiUrl + "/question/getQuestionExp");
  }

  sendSlot(questionId:any,selectedSlot:string){
    return this.httpClient.patch(environment.apiUrl + "/question/selectSlot/"+ questionId,{selectedSlot});

  }

  cancel(questionId:any){
    return this.httpClient.delete(environment.apiUrl + "/question/deleteQuestion/"+ questionId);
  }
  
}
