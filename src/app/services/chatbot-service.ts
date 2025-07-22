import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PredictResponse } from '../models/predict-response';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) { }

  predictImage(file: File): Observable<PredictResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<PredictResponse>(`${this.apiUrl}/predict`, formData);
  }

  testConnection() {
    return this.http.get('http://127.0.0.1:3000/');
  }

  sendMessage(message: string) {
    //return this.http.post<string>(this.apiUrl, { message });

    return new Observable<string>(observer => {
      console.log("Mock API call with message:", message);
      observer.next(" This is a mock response for the message: " + message);
      observer.complete();
    });
  }
}
