import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class HeaderService {
  constructor(private httpClient: HttpClient) {}

  getProfile() {
    return this.httpClient.get(environment.apiUrl + "user/profile");
  }
}
