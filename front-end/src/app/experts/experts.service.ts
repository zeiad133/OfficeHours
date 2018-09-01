import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class ExpertsService {
  chosenExperts: any;
  constructor(private httpClient: HttpClient) {}

  getExperts() {
    return this.httpClient.get(
      environment.apiUrl + "user/getUserByType/expert"
    );
  }

  filterByTopicTitle(title) {
    return this.httpClient.get(
      environment.apiUrl + "expert/filterByTopicTitle/" + title
    );
  }
  sortExpertsUsername(type: Number) {
    return this.httpClient.get(
      environment.apiUrl + "/expert/sortExpertsUsername/" + type
    );
  }

    sortExpertsRating(type: Number) {
        return this.httpClient.get(
            environment.apiUrl + "/expert/sortExpertsRating/" + type
        );
    }

  getallExperts() {
    return this.httpClient.get(environment.apiUrl + "/expert/getExperts");
  }

  filterByTopicTitleAndUsernameHighToLow(title) {
    return this.httpClient.get(
      environment.apiUrl +
        "/expert/filterByTopicTitleAndUsernameHighToLow/" +
        title
    );
  }

  filterByTopicTitleAndUsernameLowToHigh(title) {
    return this.httpClient.get(
      environment.apiUrl +
        "/expert/filterByTopicTitleAndUsernameLowToHigh/" +
        title
    );
  }

  getExpertByUsername(username: String) {
    return this.httpClient.get(
      environment.apiUrl + "/expert/getExpertsByUsername/" + username
    );
  }

  getExpertsByTopic(topicTitle: String) {
    return this.httpClient.get(
      environment.apiUrl + "/topic/getExpertsByTopic/" + topicTitle
    );
  }

  addFavourite(name: String) {
    return this.httpClient.post(environment.apiUrl + "user/AddFavoriteExpert", {
      name
    });
  }

  sendRequest(questionSubject: String, questionContent: String, user, expert) {
    return this.httpClient.post(
      environment.apiUrl + "question/createQuestion",
      { questionSubject, questionContent, user, expert }
    );
  }

  saveExperts(chosenExperts: any) {
    this.chosenExperts = chosenExperts;
    window.sessionStorage.chosenExperts = chosenExperts;
    sessionStorage.setItem("chosenExperts", JSON.stringify(chosenExperts));
  }

  getEx() {
    return this.chosenExperts;
  }
}
