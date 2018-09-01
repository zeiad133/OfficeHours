import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class FavoriteExpertService {

  constructor(private httpClient: HttpClient) { }

  addFavoriteExpert(name:string) {
    return this.httpClient.post(environment.apiUrl + '/user/AddFavoriteExpert', {'name':name});
  }

  deleteFavoriteExpert(id:object){
    return this.httpClient.delete(environment.apiUrl+'/user/deleteFavoriteExpert'+id);
  }

}
