import { Routes } from '@angular/router';

import { Departments } from './pages/departments/departments';
import { Employees } from './pages/employees/employees';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'departments',
    pathMatch: 'full',
  },
  {
    path: 'departments',
    component: Departments,
  },
  {
    path: 'employees',
    component: Employees,
  },
];