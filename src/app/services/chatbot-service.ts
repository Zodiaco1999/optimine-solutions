import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PredictResponse } from '../models/predict-response';
import { ModelResponse } from '../models/model-response';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private API_URL = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  testConnection() {
    return this.http.get(this.API_URL);
  }

  predictImage(file: File): Observable<PredictResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<PredictResponse>(`${this.API_URL}/predict`, formData);
  }

  sendMessage(question: string) {
    const params = new HttpParams().set('text', question);
    return this.http.get<ModelResponse>(`${this.API_URL}/ask`, { params });
  }
}
