import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class ProfileService {
  constructor(private httpClient: HttpClient) {}
  BlockUser(username: string) {
    return this.httpClient.post(environment.apiUrl + "/expert/BlockUser", {
      username: username
    });
  }
  getProfile() {
    return this.httpClient.get(environment.apiUrl + "user/profile");
  }
  getExpertByUsername(username) {
    return this.httpClient.get(
      environment.apiUrl + "expert/getExpertByUsername/" + username
    );
  }
  editProfile(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    job: string,
    about: string
  ) {
    return this.httpClient.patch(environment.apiUrl + "user/updateUser", {
      firstName,
      lastName,
      username,
      email,
      job,
      about
    });
  }

  editContact(username: string, phoneNumber: Number, address: string) {
    return this.httpClient.patch(environment.apiUrl + "user/updateUser", {
      username,
      phoneNumber,
      address
    });
  }
  getQuestions() {
    return this.httpClient.get(
      environment.apiUrl + "question/getQuestionsByStatus/accepted"
    );
  }
  getExperiences() {
    return this.httpClient.get(environment.apiUrl + "user/getExperience");
  }
  getUsers() {
    return this.httpClient.get(environment.apiUrl + "user/getUsers");
  }
  getExperts() {
    return this.httpClient.get(environment.apiUrl + "expert/getExperts");
  }

  updateUser(data) {
    return this.httpClient.patch(environment.apiUrl + "user/updateUser", {
      data
    });
  }
  createExperience(
    job: string,
    Date: String,
    Details: string,
    CompanyName: String
  ) {
    return this.httpClient.post(environment.apiUrl + "user/createExperience", {
      job,
      Date,
      Details,
      CompanyName
    });
  }
  updateExperience(
    job: string,
    Date: String,
    Details: string,
    CompanyName: String,
    ExpId: Object
  ) {
    return this.httpClient.patch(
      environment.apiUrl + "user/updateExperience" + ExpId,
      {
        job,
        Date,
        Details,
        CompanyName
      }
    );
  }
  deleteExperience(ExpId: Object) {
    return this.httpClient.delete(
      environment.apiUrl + "user/deleteExperience" + ExpId,
      {}
    );
  }

  createNotes(note: string, noteTitle: String) {
    return this.httpClient.post(environment.apiUrl + "user/createNotes", {
      note,
      noteTitle
    });
  }
  viewNotes() {
    return this.httpClient.get(environment.apiUrl + "user/getNotes");
  }
  updateNotes(notes) {
    return this.httpClient.patch(environment.apiUrl + "user/updateNotes", {
      notes
    });
  }
  updateExperiences(experiences) {
    return this.httpClient.patch(
      environment.apiUrl + "user/updateExperiences",
      {
        experiences
      }
    );
  }
  deleteNotes(NoteId: Object) {
    return this.httpClient.delete(
      environment.apiUrl + "user/deleteNote" + NoteId,
      {}
    );
  }

  updatePrivacy(privacy: string) {
    return this.httpClient.patch(environment.apiUrl + "user/updatePrivacy", {
      privacy
    });
  }
  applyForExpert(reason: string) {
    return this.httpClient.post(
      environment.apiUrl + "/application/applyForExpert",
      { reason }
    );
  }
  getApplications() {
    return this.httpClient.get(
      environment.apiUrl + "application/getApplications"
    );
  }
  getFeedbacks() {
    return this.httpClient.get(environment.apiUrl + "admin/getFeedbacks");
  }
  deleteApplication(requestId: any) {
    return this.httpClient.delete(
      environment.apiUrl + "application/deleteApplication/" + requestId
    );
  }
  deleteUser(userId: any) {
    return this.httpClient.delete(
      environment.apiUrl + "user/deleteUser/" + userId
    );
  }
  deleteExpert(username) {
    return this.httpClient.delete(
      environment.apiUrl + "expert/deleteExpert/" + username
    );
  }
  deleteFeedback(feedbackId) {
    return this.httpClient.delete(
      environment.apiUrl + "admin/deleteFeedback/" + feedbackId
    );
  }
  acceptExpert(requestId: any) {
    return this.httpClient.patch(environment.apiUrl + "admin/acceptExpert", {
      requestId
    });
  }
  AddAdmin(username: string) {
    return this.httpClient.post(environment.apiUrl + "admin/addAdmin", {
      username: username
    });
  }

  updateUserPassword(
    email: string,
    oldpassword: string,
    newpassword: string,
    confirmnewpassword: string
  ) {
    return this.httpClient.patch(
      environment.apiUrl + "user/updateUserPassword",
      {
        email: email,
        password: oldpassword,
        newPassword: newpassword,
        confirmPassword: confirmnewpassword
      }
    );
  }

  setAvatar(Image: FormData) {
    return this.httpClient.post(
      environment.apiUrl + "user/setAvatar", Image
    );
  }
  CreateTopic(topicTitle: string, topicDescription: string) {
    return this.httpClient.post(environment.apiUrl + "topic/createTopic", {
      topicTitle,
      topicDescription
    });
  }
  getExpertTopics() {
    return this.httpClient.get(environment.apiUrl + "expert/getExpertTopics");
  }
}
