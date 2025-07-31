import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import { CookieService } from "ngx-cookie-service";
import {Router} from "@angular/router";



export interface UserAuthRequest {
  username: string;
  password: string;
}

export interface UserAuthResponse {
  token?: string | null;
  username: string;
  message: string;
  role: string;
}




@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  private currentUserSubject: BehaviorSubject<UserAuthResponse | null>;
  public currentUser: Observable<UserAuthResponse | null>;
  private baseUrl = 'http://localhost:8080/api/v1/user/'

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router) {

    this.currentUserSubject = new BehaviorSubject<UserAuthResponse | null>(
      this.getUserFromCookies()
    );
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): UserAuthResponse | null {
    return this.currentUserSubject.value;
  }

  private getUserFromCookies(): UserAuthResponse | null {
    const userData = this.cookieService.get('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  login(credentials: UserAuthRequest): Observable<UserAuthResponse> {
    return this.http.post<UserAuthResponse>(`${this.baseUrl}/login`, credentials, {
      withCredentials: true // This is crucial for cookies to be handled properly
    }).pipe(
      tap((response) => {
        // The token is in the HTTP-only cookie, not in the response body
        const userData = {
          username: response.username,
          message: response.message,
          role: response.role,
          token: null // Token is in HTTP-only cookie
        };
        this.cookieService.set('currentUser', JSON.stringify(userData));
        this.currentUserSubject.next(userData);
      }),
      catchError(this.handleError)
    );
  }

  register(userData: any): Observable<UserAuthResponse> {
    return this.http.post<UserAuthResponse>(`${this.baseUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  logout() {
    // Clear the HTTP-only cookie by setting an expired cookie
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.cookieService.delete('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
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

  // Add this method to check authentication status
  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Add this method to get the JWT cookie (though it's HTTP-only)
  getAuthToken(): string | null {
    return this.cookieService.get('jwt') || null;
  }
}
