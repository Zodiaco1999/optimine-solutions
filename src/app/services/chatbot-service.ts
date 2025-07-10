import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'https://api.example.com/chat';

  constructor(private http: HttpClient) { }

  sendMessage(message: string) {
    //return this.http.post<string>(this.apiUrl, { message });
    return new Observable<string>(observer => {
      console.log("Mock API call with message:", message);
      observer.next(" This is a mock response for the message: " + message);
      observer.complete();
    });
  }
}
