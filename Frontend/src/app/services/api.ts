import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'https://sports-court-booking-final-project.onrender.com/api';

  constructor(private http: HttpClient) {}

  getCourts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/courts`);
  }
}