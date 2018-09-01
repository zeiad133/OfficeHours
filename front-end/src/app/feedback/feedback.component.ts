import { Component, OnInit } from '@angular/core';
import { FeedbackService } from './feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  providers: [FeedbackService]

})
export class FeedbackComponent implements OnInit {
  feedback:string;
  stars=false;
  user = JSON.parse(sessionStorage.getItem("userr"));
  requests=[];
  questions=[];
  question:any;
  constructor(private feedbackService:FeedbackService) { }

  ngOnInit() {

    this.feedbackService.getQuestionsUsers().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        console.log(res.data)

        this.requests = res.data;
      }
    });

    this.feedbackService.getQuestionExpert().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        console.log(res.data)
        this.questions = res.data;
      }
    });

  }

  selectQuestion(question): void {
    this.question = question;
    console.log(this.question);
  }

  selectRequest(request): void {
    this.question = request;
  }

  submitFeedbackUser(){
    if ((<HTMLInputElement>document.getElementById("star-1")).checked) {
      this.feedbackService.rateUser(1,this.question.user.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );

      this.feedbackService.submitFeedback(1,this.question.user.username,this.question.expert.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );

          
    }

    if ((<HTMLInputElement>document.getElementById("star-2")).checked) {
      this.feedbackService.rateUser(2,this.question.user.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );
      this.feedbackService.submitFeedback(2,this.question.user.username,this.question.expert.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );
    }
    if ((<HTMLInputElement>document.getElementById("star-3")).checked) {
      this.feedbackService.rateUser(3,this.question.user.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );
      this.feedbackService.submitFeedback(3,this.question.user.username,this.question.expert.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );
    }
    if ((<HTMLInputElement>document.getElementById("star-4")).checked) {
    
      this.feedbackService.rateUser(4,this.question.user.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );
      this.feedbackService.submitFeedback(4,this.question.user.username,this.question.expert.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );
    }
    if ((<HTMLInputElement>document.getElementById("star-5")).checked) {
      this.feedbackService.rateUser(5,this.question.user.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );
      this.feedbackService.submitFeedback(5,this.question.user.username,this.question.expert.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );
    }

   
      var index = this.questions.indexOf(this.question);
      if (index > -1) {
        this.questions.splice(index, 1);
      }
      if(this.questions.length==0){
        
      window.location.href="/#/experts"
    } 
  }



  submitFeedbackExpert(){
    if ((<HTMLInputElement>document.getElementById("star-1")).checked) {
      this.feedbackService.rateUser(1,this.question.expert.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );

      this.feedbackService.submitFeedback(1,this.question.expert.username,this.question.user.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        }
       
      );
      
    }

    if ((<HTMLInputElement>document.getElementById("star-2")).checked) {
      this.feedbackService.rateUser(2,this.question.expert.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );

      this.feedbackService.submitFeedback(2,this.question.expert.username,this.question.user.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        }
       
      );
    }
    if ((<HTMLInputElement>document.getElementById("star-3")).checked) {
      this.feedbackService.rateUser(3,this.question.expert.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );
      this.feedbackService.submitFeedback(3,this.question.expert.username,this.question.user.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        }
       
      );
    }
    if ((<HTMLInputElement>document.getElementById("star-4")).checked) {
    
      this.feedbackService.rateUser(4,this.question.expert.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );

      this.feedbackService.submitFeedback(4,this.question.expert.username,this.question.user.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        }
       
      );
    }
    if ((<HTMLInputElement>document.getElementById("star-5")).checked) {
      this.feedbackService.rateUser(5,this.question.expert.username).subscribe(
        (res: any) => {
          console.log(res.data)
        },
       
      );

      this.feedbackService.submitFeedback(5,this.question.expert.username,this.question.user.username,this.feedback,this.question.sessionRoom,this.question.selectedSlot).subscribe(
        (res: any) => {
          console.log(res.data)
        }
       
      );
    }

    var index = this.questions.indexOf(this.question);
    if (index > -1) {
      this.questions.splice(index, 1);
    }
  
  if(this.questions.length==0){
        
    window.location.href="/#/experts"
  } 
  }

}
