import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { catchError } from 'rxjs/operators';
import { Http, Headers } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';




@Injectable()


export class ChatService{
    constructor(private http:Http){
    }

    private socket = io('http://localhost:3000'); 
    joinRoom(data)
    {
        this.socket.emit('join',data);
    }
    newUserJoined()
    {
        let observable = new Observable<{user:any, message:String}>(observer=>{
            this.socket.on('new user joined', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
    
    leaveRoom(data){
        this.socket.emit('leave',data);
    }

    userLeftRoom(){
        let observable = new Observable<{user:any, message:String}>(observer=>{
            this.socket.on('left room', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
    sendMessage(data)
    {
        this.socket.emit('message',data);
    }

    newMessageReceived(){
        let observable = new Observable<{user:any, message:String}>(observer=>{
            this.socket.on('new message', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
    

    check(email:string){
        var headers=new Headers();
        headers.append('content-type','application/json');

        return this.http.post('http://localhost:3000/api/expert/isExpert',{'email':email}).map(res=>

    res.json());
    }
    checkRoom(sessionRoom:String){
        var headers=new Headers();
        headers.append('content-type','application/json');

        return this.http.post('http://localhost:3000/api/question/getroom',{'sessionRoom':sessionRoom}).map(res=>

    res.json());
    }
    
}