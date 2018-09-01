import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class viewtopicsservice {

  constructor(private httpClient: HttpClient) { }

  viewtopics() {
    return this.httpClient.get(environment.apiUrl + '/topic/getTopics');
  }
  ExpertSelectTopic(topic_id:object) {
      return this.httpClient.post(environment.apiUrl+'/user/ExpertSelectTopic',{'topic_id':topic_id});
    }



}
