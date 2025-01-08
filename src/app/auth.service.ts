import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users/login'; // Node API URL

  constructor(private http: HttpClient) {}

  login(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, { user });
  }
}
