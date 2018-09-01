import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable()
export class BlockedUserService {


  constructor(private httpClient: HttpClient) { }

  unblockuser(userid:object){
    return this.httpClient.delete(environment.apiUrl+'/expert/unblockuser/'+userid );
  }

  getblockedusers(){

    return this.httpClient.get(environment.apiUrl+'/expert/getblockedusers');

  }


}
