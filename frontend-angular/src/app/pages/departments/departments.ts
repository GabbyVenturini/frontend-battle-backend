import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Department, DepartmentService } from '../../services/departmentService';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  departments = signal<Department[]>([]);

  departmentName = '';
  editingDepartment: Department | null = null;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
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

  saveDepartment(): void {
    if (!this.departmentName.trim()) {
      alert('Informe o nome do departamento.');
      return;
    }

    if (this.editingDepartment) {
      this.updateDepartmentInstantly();
      return;
    }

    this.createDepartmentInstantly();
  }

  private createDepartmentInstantly(): void {
    const tempId = Date.now() * -1;

    const temporaryDepartment: Department = {
      id: tempId,
      departmentName: this.departmentName,
    };

    const payload: Partial<Department> = {
      departmentName: this.departmentName,
    };

    this.departments.update((current) => [...current, temporaryDepartment]);

    this.departmentName = '';

    this.departmentService.createDepartment(payload).subscribe({
      next: (createdDepartment) => {
        this.departments.update((current) =>
          current.map((department) =>
            department.id === tempId ? createdDepartment : department
          )
        );
      },
      error: (error) => {
        console.error('Erro ao cadastrar departamento:', error);

        this.departments.update((current) =>
          current.filter((department) => department.id !== tempId)
        );

        alert('Não foi possível cadastrar o departamento.');
      },
    });
  }

  private updateDepartmentInstantly(): void {
    if (!this.editingDepartment) {
      return;
    }

    const previousDepartment: Department = { ...this.editingDepartment };

    const updatedDepartment: Department = {
      ...this.editingDepartment,
      departmentName: this.departmentName,
    };

    this.departments.update((current) =>
      current.map((department) =>
        department.id === updatedDepartment.id ? updatedDepartment : department
      )
    );

    this.cancelEdit();

    this.departmentService
      .updateDepartment(updatedDepartment.id, updatedDepartment)
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Erro ao atualizar departamento:', error);

          this.departments.update((current) =>
            current.map((department) =>
              department.id === previousDepartment.id
                ? previousDepartment
                : department
            )
          );

          alert('Não foi possível atualizar o departamento.');
        },
      });
  }

  editDepartment(department: Department): void {
    this.editingDepartment = department;
    this.departmentName = department.departmentName;
  }

  cancelEdit(): void {
    this.editingDepartment = null;
    this.departmentName = '';
  }

  deleteDepartment(id: number): void {
    const confirmDelete = confirm('Deseja excluir este departamento?');

    if (!confirmDelete) {
      return;
    }

    const removedDepartment = this.departments().find(
      (department) => department.id === id
    );

    this.departments.update((current) =>
      current.filter((department) => department.id !== id)
    );

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => {},
      error: (error) => {
        console.error('Erro ao excluir departamento:', error);

        if (removedDepartment) {
          this.departments.update((current) => [...current, removedDepartment]);
        }

        alert('Não foi possível excluir o departamento.');
      },
    });
  }
}