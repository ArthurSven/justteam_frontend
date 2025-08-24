import { Component } from '@angular/core';
import {UsertableComponent} from "../../../components/usertable/usertable.component";

@Component({
  selector: 'app-usermanagement',
  standalone: true,
  imports: [UsertableComponent],
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css'
})
export class UsermanagementComponent {

}
