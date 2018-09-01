//import { Injector } from '@angular/core';
import { Injectable } from '@angular/core';
//import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UserOb } from '../objects/UserObject';
import 'rxjs/add/operator/map';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';





@Injectable()
export class regService {
  constructor(private http: Http) {
    this.token = window.localStorage.token;
    if (this.token) {
      this.authorized = true;
    } else {
      this.authorized = false;

    }
  }
  private token: string;
  public authorized: boolean;

  getAuthorizationToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    window.localStorage.token = this.token;
    this.authorized = true;
  }

 
  logout() {
    this.authorized = false;
    this.token = null;
    delete window.localStorage.token;

  }
  public LogIn(UserOb) {
    var headers = new Headers();
    headers.append('content-type', 'application/json');

    return this.http.post(environment.apiUrl + "auth/login", UserOb).map(res =>

      res.json());
  }

  public googleLogIn(UserOb) {
    var headers = new Headers();
    headers.append('content-type', 'application/json');

    return this.http.post(environment.apiUrl + "auth/googlelogin", UserOb).map(res =>

      res.json());
  }

  public addReg(UserOb) {
    var headers = new Headers();
    headers.append('content-type', 'application/json');

    return this.http.post(environment.apiUrl + "auth/register", UserOb).map(res => { console.log(res); return res });
  }

  public googleReg(UserOb) {
    var headers = new Headers();
    headers.append('content-type', 'application/json');

    return this.http.post(environment.apiUrl + "auth/googlereg", UserOb).map(res =>

      res.json());
  }
}
