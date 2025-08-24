import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn, GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {Injectable} from "@angular/core";
import {AuthServiceService} from "../services/auth-service.service";
import {state} from "@angular/animations";
import {CookieService} from "ngx-cookie-service";
import {filter, map, Observable, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router,
  ) {

  }

  canActivate(): Observable<boolean> {
    return this.authService.authCheckComplete$.pipe(
      filter(complete => complete), // Wait for auth check to complete
      take(1),
      map(() => {
        if (this.authService.isAuthenticated()) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }

}
