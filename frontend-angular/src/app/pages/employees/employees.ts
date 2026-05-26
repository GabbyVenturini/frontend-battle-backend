import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Employee, EmployeeService } from '../../services/employeeService';
import { Department, DepartmentService } from '../../services/departmentService';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  employees = signal<Employee[]>([]);
  departments = signal<Department[]>([]);

  employeeName = '';
  departmentId: number | null = null;
  dateOfJoining = '';
  photoFileName = '';

  editingEmployee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
      },
      error: (error) => {
        console.error('Erro ao buscar funcionários:', error);
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments.set(data);
      },
      error: (error) => {
        console.error('Erro ao buscar departamentos:', error);
      },
    });
  }

  saveEmployee(): void {
    if (!this.employeeName.trim()) {
      alert('Informe o nome do funcionário.');
      return;
    }

    if (!this.departmentId) {
      alert('Selecione um departamento.');
      return;
    }

    if (!this.dateOfJoining) {
      alert('Informe a data de entrada.');
      return;
    }

    if (this.editingEmployee) {
      this.updateEmployeeInstantly();
      return;
    }

    this.createEmployeeInstantly();
  }

  private createEmployeeInstantly(): void {
    const tempId = Date.now() * -1;

    const employeePayload: Partial<Employee> = {
      employeeName: this.employeeName,
      departmentId: Number(this.departmentId),
      dateOfJoining: this.dateOfJoining,
      photoFileName: this.photoFileName || '',
    };

    const temporaryEmployee: Employee = {
      id: tempId,
      employeeName: this.employeeName,
      departmentId: Number(this.departmentId),
      department: this.getDepartmentById(Number(this.departmentId)),
      dateOfJoining: this.dateOfJoining,
      photoFileName: this.photoFileName || '',
    };

    this.employees.update((current) => [...current, temporaryEmployee]);

    this.clearForm();

    this.employeeService.createEmployee(employeePayload).subscribe({
      next: (createdEmployee) => {
        const employeeToShow: Employee = {
          ...createdEmployee,
          department: this.getDepartmentById(Number(createdEmployee.departmentId)),
          photoFileName: createdEmployee.photoFileName || '',
        };

        this.employees.update((current) =>
          current.map((employee) =>
            employee.id === tempId ? employeeToShow : employee
          )
        );
      },
      error: (error) => {
        console.error('Erro ao cadastrar funcionário:', error);

        this.employees.update((current) =>
          current.filter((employee) => employee.id !== tempId)
        );

        alert('Não foi possível cadastrar o funcionário.');
      },
    });
  }

  private updateEmployeeInstantly(): void {
    if (!this.editingEmployee) {
      return;
    }

    const previousEmployee: Employee = { ...this.editingEmployee };

    const updatedEmployee: Employee = {
      id: this.editingEmployee.id,
      employeeName: this.employeeName,
      departmentId: Number(this.departmentId),
      department: this.getDepartmentById(Number(this.departmentId)),
      dateOfJoining: this.dateOfJoining,
      photoFileName: this.photoFileName || '',
    };

    const employeePayload: Partial<Employee> = {
      id: updatedEmployee.id,
      employeeName: updatedEmployee.employeeName,
      departmentId: updatedEmployee.departmentId,
      dateOfJoining: updatedEmployee.dateOfJoining,
      photoFileName: updatedEmployee.photoFileName,
    };

    this.employees.update((current) =>
      current.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );

    this.cancelEdit();

    this.employeeService.updateEmployee(updatedEmployee.id, employeePayload).subscribe({
      next: () => {},
      error: (error) => {
        console.error('Erro ao atualizar funcionário:', error);

        this.employees.update((current) =>
          current.map((employee) =>
            employee.id === previousEmployee.id ? previousEmployee : employee
          )
        );

        alert('Não foi possível atualizar o funcionário.');
      },
    });
  }

  editEmployee(employee: Employee): void {
    this.editingEmployee = employee;
    this.employeeName = employee.employeeName;
    this.departmentId = employee.departmentId;
    this.dateOfJoining = employee.dateOfJoining.substring(0, 10);
    this.photoFileName = employee.photoFileName || '';
  }

  cancelEdit(): void {
    this.editingEmployee = null;
    this.clearForm();
  }

  clearForm(): void {
    this.employeeName = '';
    this.departmentId = null;
    this.dateOfJoining = '';
    this.photoFileName = '';
  }

  deleteEmployee(id: number): void {
    const confirmDelete = confirm('Deseja excluir este funcionário?');

    if (!confirmDelete) {
      return;
    }

    const employeeToRemove = this.employees().find(
      (employee) => employee.id === id
    );

    this.employees.update((current) =>
      current.filter((employee) => employee.id !== id)
    );

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {},
      error: (error) => {
        console.error('Erro ao excluir funcionário:', error);

        if (employeeToRemove) {
          this.employees.update((current) => [...current, employeeToRemove]);
        }

        alert('Não foi possível excluir o funcionário.');
      },
    });
  }

  getDepartmentName(departmentId: number): string {
    const department = this.getDepartmentById(departmentId);

    return department ? department.departmentName : '-';
  }

  getDepartmentById(departmentId: number): Department | null {
    return (
      this.departments().find((department) => department.id === departmentId) ||
      null
    );
  }
}