import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class InboxService {
  constructor(private httpClient: HttpClient) {}

  getProfile(username: string) {
    return this.httpClient.get(
      environment.apiUrl + "user/getUserByUsername/" + username
    );
  }

  getQuestions() {
    return this.httpClient.get(
      environment.apiUrl + "/question/getQuestionUser"
    );
  }

  getQuestionsUsers() {
    return this.httpClient.get(environment.apiUrl + "/question/getQuestionExp");
  }
}
