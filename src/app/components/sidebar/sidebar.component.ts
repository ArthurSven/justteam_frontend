import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthServiceService} from "../../services/auth-service.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  constructor(private authService: AuthServiceService) {

  }

  logout(): void {
    this.authService.performLogout();
  }

}
