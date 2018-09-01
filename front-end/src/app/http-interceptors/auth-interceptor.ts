import { Injectable } from "@angular/core";
import { AuthService } from "../auth.service";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.getAuthorizationToken();

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    var authReq;
    if (this.auth.authorized) {
      authReq = req.clone({
        headers: req.headers.set("Authorization", authToken)
      });
    } else {
      authReq = req.clone({});
    }

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
