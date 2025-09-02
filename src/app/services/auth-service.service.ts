import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { HttpErrorResponse, provideHttpClient, withFetch } from '@angular/common/http';
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

  public currentUserSubject = new BehaviorSubject<UserAuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private authCheckComplete = new BehaviorSubject<boolean>(false);
  public authCheckComplete$ = this.authCheckComplete.asObservable();

  private baseUrl = 'http://localhost:8081/api/v1/user'

  constructor(
    private http: HttpClient,
    private router: Router) {

    this.initializeAuthState()

  }

  private initializeAuthState(): void {
    this.checkAuthStatus().subscribe({
      next: (user) => {
        console.log('Auth initialization successful:', user);
        this.authCheckComplete.next(true);
      },
      error: (error) => {
        console.log('Auth initialization completed - user not authenticated');
        this.authCheckComplete.next(true);
      }
    });
  }

  private checkAuthStatus(): Observable<UserAuthResponse> {
    return this.http.get<UserAuthResponse>(`${this.baseUrl}/auth-user`, {
      withCredentials: true
    }).pipe(
      tap(user => {
        console.log('User is authenticated', user);
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.log('User is not authenticated');
        this.currentUserSubject.next(null);
        return throwError(() => error);
      })
    );
  }



  login(credentials: UserAuthRequest): Observable<UserAuthResponse> {
    return this.http.post<UserAuthResponse>(`${this.baseUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        this.checkAuthStatus().subscribe();

      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true, responseType: 'text' }).pipe(
      tap(() => {
        this.clearFrontendState();
      }),
      catchError((error) => {
        console.error('Logout failed:', error);
        this.clearFrontendState(); // Still clear state even if API call fails
        return throwError(() => error);
      })
    );
  }

  performLogout(): void {
    this.logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/']);
      }
    });
  }

  public clearFrontendState(): void {
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
  getUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }
  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
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

  isAuthCheckComplete(): boolean {
    return this.authCheckComplete.value;
  }
}
