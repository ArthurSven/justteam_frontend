import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import path from 'path';
import { AdminhomeComponent } from './pages/admin/adminhome/adminhome.component';
import {RoleGuard} from "./guards/role.guard";
import {data} from "autoprefixer";
import {UsermanagementComponent} from "./pages/admin/usermanagement/usermanagement.component";
import {DepartmentsComponent} from "./pages/admin/departments/departments.component";

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'adminlayout',
    component: AdminLayoutComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
    children: [
      {
        path: '',
        component: AdminhomeComponent,
      },
      {
        path: 'departments',
        component: DepartmentsComponent,
      },
      {
        path: 'usermanagement',
        component: UsermanagementComponent
      }
    ],
  },
];
