//import { Injector } from '@angular/core';
import { Injectable } from "@angular/core";
//import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Http, Headers } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment.prod";

@Injectable()
export class SignupService {
  constructor(private http: Http) {}
  public addReg(UserOb) {
    var headers = new Headers();
    headers.append("content-type", "application/json");
    return this.http
      .post("http://localhost:3000/authentication/register", UserOb)
      .map(res => {
        return res.json();
      });
  }
  public googleReg(UserOb) {
    var headers = new Headers();
    headers.append("content-type", "application/json");

    return this.http
      .post(environment.apiUrl + "/auth/googlereg", UserOb)
      .map(res => res.json());
  }
}
