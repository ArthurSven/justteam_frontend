import { Component } from '@angular/core';
import {UsertableComponent} from "../../../components/usertable/usertable.component";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {CreateUserFormComponent} from "../../../components/create-user-form/create-user-form.component";


@Component({
  selector: 'app-usermanagement',
  standalone: true,
  imports: [UsertableComponent, CreateUserFormComponent],
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css'
})
export class UsermanagementComponent {

  showModal = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }

  openCreateUserDialog() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onFormCancel() {
    this.closeModal();
  }

  onFormSubmit(userData: any) {
    // Handle form submission here
    console.log('User data:', userData);
    // You can call your userService to create the user
    this.userService.register(userData).subscribe({
      next: (response) => {
        console.log('User created successfully', response);
        this.closeModal();
        // Optionally refresh the user table
      },
      error: (error) => {
        console.error('Error creating user', error);
      }
    });
  }

}
