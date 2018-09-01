import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {

  }
  canActivate() {
    // will only allow navigation if user is authorized
    return this.auth.authorized
  }
}
