import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {UserAuthResponse} from "./auth-service.service";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
export interface User {
  userId: string;
  firstname: string;
  lastname: string;
  dob: string;
  username: string;
  email: string;
  role: string;
  position: string;
  dept: string;
  salary: string;
  startdate: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
export interface UserRequest {
  firstname: string;
  lastname: string;
  dob: string;
  username: string;
  email: string;
  password: string;
  role: string;
  position: string;
  dept: string;
  salary: string;
  startdate: string;
}

export interface UserResponse {
  userid: string;
  firstname: string;
  lastname: string;
  dob: string;
  username: string;
  email: string;
  role: string;
  position: string;
  dept: string;
  salary: string;
  startdate: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})


export class UserService {
  private baseUrl = 'http://localhost:8081/api/v1/user'


  constructor(private http: HttpClient) {
  }



  register(userData: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(page: number = 0, size: number = 10): Observable<Page<User>> {
    // Create HTTP params for pagination
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<User>>(`${this.baseUrl}/corporate-users`, { params })
      .pipe(catchError(this.handleError));
  }



  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error.message || error.statusText;
    }
    return throwError(() => new Error(errorMessage));
  }

}
