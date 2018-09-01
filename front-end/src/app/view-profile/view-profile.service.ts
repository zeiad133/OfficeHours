import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class ViewProfileService {
  constructor(private httpClient: HttpClient) {}

  getProfile() {
    return this.httpClient.get(environment.apiUrl + "user/profile");
  }


 
  getExperiences() {
    return this.httpClient.get(environment.apiUrl + "user/getExperience");
  }

 

  viewNotes() {
    return this.httpClient.get(environment.apiUrl + "user/getNotes");
  }
 

 
}
