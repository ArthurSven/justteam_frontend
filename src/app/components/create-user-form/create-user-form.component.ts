import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {UserRequest, UserResponse} from "../../services/user.service";
import {UserService} from "../../services/user.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-create-user-form',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './create-user-form.component.html',
  standalone: true,
  styleUrl: './create-user-form.component.css'
})
export class CreateUserFormComponent implements OnInit {

  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  message: string | null = null;
  alertClass: string | null = null;
  createUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private http: HttpClient,
  ) {

    this.createUserForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      role: ['', Validators.required],
      dept: ['', Validators.required],
      position: ['', Validators.required],
      salary: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordMatchValidator
    } )
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {

    if (this.createUserForm.valid) {
      const currentDate = new Date().toISOString().split('T')[0];
      const formValue = this.createUserForm.value;

      const user: UserRequest = {
        firstname: formValue.firstname,
        lastname: formValue.lastname,
        dob: formValue.dob,
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        role: formValue.role,
        position: formValue.position,
        dept: formValue.department, // Map department to dept
        salary: formValue.salary.toString(),
        startdate: currentDate
      }
      this.userService.register(user).subscribe({
        next: (userResponse: UserResponse) => {
          console.log(userResponse);
          this.message = userResponse.message;
          this.alertClass = 'bg-green-600';
          this.createUserForm.reset();
          this.formSubmit.emit(userResponse);
        },
        error: (error) => {
          console.error('Error creating user', error);
          this.alertClass = 'bg-red-600';
          this.createUserForm.reset();
        }
      })
    } else {
      this.markFormGroupTouched(this.createUserForm);
      this.message = 'Please fill all required fields correctly';
      this.alertClass = 'bg-yellow-500';
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  ngOnInit(): void {

  }


}
