import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import path from 'path';
import { AdminhomeComponent } from './pages/admin/adminhome/adminhome.component';
import {RoleGuard} from "./guards/role.guard";
import {data} from "autoprefixer";

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'adminlayout',
    component: AdminLayoutComponent,
    // canActivate: [RoleGuard],
    // data: {roles: ['Admin']},
    children: [
      {
        path: '',
        component: AdminhomeComponent,
      },
    ],
  },
];
