import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmployeeDepartment {
  id: number;
  departmentName: string;
}

export interface Employee {
  id: number;
  employeeName: string;
  departmentId: number;
  department?: EmployeeDepartment | null;
  dateOfJoining: string;
  photoFileName: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:5150/api/Employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}