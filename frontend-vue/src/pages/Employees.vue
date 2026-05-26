<script setup>
import { onMounted, ref } from 'vue';

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../services/employeeService';

import { getDepartments } from '../services/departmentService';

const employees = ref([]);
const departments = ref([]);

const employeeName = ref('');
const departmentId = ref('');
const dateOfJoining = ref('');
const photoFileName = ref('');

const editingEmployee = ref(null);

onMounted(() => {
  loadDepartments();
  loadEmployees();
});

async function loadEmployees() {
  try {
    employees.value = await getEmployees();
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
  }
}

async function loadDepartments() {
  try {
    departments.value = await getDepartments();
  } catch (error) {
    console.error('Erro ao buscar departamentos:', error);
  }
}

function getDepartmentById(id) {
  return (
    departments.value.find((department) => department.id === Number(id)) || null
  );
}

function getDepartmentName(id) {
  const department = getDepartmentById(id);

  return department ? department.departmentName : '-';
}

function formatDate(date) {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleDateString('pt-BR');
}

async function saveEmployee() {
  if (!employeeName.value.trim()) {
    alert('Informe o nome do funcionário.');
    return;
  }

  if (!departmentId.value) {
    alert('Selecione um departamento.');
    return;
  }

  if (!dateOfJoining.value) {
    alert('Informe a data de entrada.');
    return;
  }

  if (editingEmployee.value) {
    await updateEmployeeInstantly();
    return;
  }

  await createEmployeeInstantly();
}

async function createEmployeeInstantly() {
  const tempId = Date.now() * -1;

  const employeePayload = {
    employeeName: employeeName.value,
    departmentId: Number(departmentId.value),
    dateOfJoining: dateOfJoining.value,
    photoFileName: photoFileName.value || '',
  };

  const temporaryEmployee = {
    id: tempId,
    employeeName: employeeName.value,
    departmentId: Number(departmentId.value),
    department: getDepartmentById(departmentId.value),
    dateOfJoining: dateOfJoining.value,
    photoFileName: photoFileName.value || '',
  };

  employees.value = [...employees.value, temporaryEmployee];

  clearForm();

  try {
    const createdEmployee = await createEmployee(employeePayload);

    const employeeToShow = {
      ...createdEmployee,
      department: getDepartmentById(createdEmployee.departmentId),
      photoFileName: createdEmployee.photoFileName || '',
    };

    employees.value = employees.value.map((employee) =>
      employee.id === tempId ? employeeToShow : employee
    );
  } catch (error) {
    console.error('Erro ao cadastrar funcionário:', error);

    employees.value = employees.value.filter((employee) => employee.id !== tempId);

    alert('Não foi possível cadastrar o funcionário.');
  }
}

async function updateEmployeeInstantly() {
  const previousEmployee = { ...editingEmployee.value };

  const updatedEmployee = {
    id: editingEmployee.value.id,
    employeeName: employeeName.value,
    departmentId: Number(departmentId.value),
    department: getDepartmentById(departmentId.value),
    dateOfJoining: dateOfJoining.value,
    photoFileName: photoFileName.value || '',
  };

  const employeePayload = {
    id: updatedEmployee.id,
    employeeName: updatedEmployee.employeeName,
    departmentId: updatedEmployee.departmentId,
    dateOfJoining: updatedEmployee.dateOfJoining,
    photoFileName: updatedEmployee.photoFileName,
  };

  employees.value = employees.value.map((employee) =>
    employee.id === updatedEmployee.id ? updatedEmployee : employee
  );

  cancelEdit();

  try {
    await updateEmployee(updatedEmployee.id, employeePayload);
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);

    employees.value = employees.value.map((employee) =>
      employee.id === previousEmployee.id ? previousEmployee : employee
    );

    alert('Não foi possível atualizar o funcionário.');
  }
}

function editEmployee(employee) {
  editingEmployee.value = employee;
  employeeName.value = employee.employeeName;
  departmentId.value = String(employee.departmentId);
  dateOfJoining.value = employee.dateOfJoining.substring(0, 10);
  photoFileName.value = employee.photoFileName || '';
}

function cancelEdit() {
  editingEmployee.value = null;
  clearForm();
}

function clearForm() {
  employeeName.value = '';
  departmentId.value = '';
  dateOfJoining.value = '';
  photoFileName.value = '';
}

async function removeEmployee(id) {
  const confirmDelete = confirm('Deseja excluir este funcionário?');

  if (!confirmDelete) {
    return;
  }

  const removedEmployee = employees.value.find((employee) => employee.id === id);

  employees.value = employees.value.filter((employee) => employee.id !== id);

  try {
    await deleteEmployee(id);
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);

    if (removedEmployee) {
      employees.value = [...employees.value, removedEmployee];
    }

    alert('Não foi possível excluir o funcionário.');
  }
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Gerenciamento</p>
        <h1>Funcionários</h1>
        <p class="subtitle">
          Cadastre, edite e gerencie os funcionários da empresa.
        </p>
      </div>
    </div>

    <div class="form-card">
      <div>
        <h2>
          {{ editingEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário' }}
        </h2>
        <p>
          {{
            editingEmployee
              ? 'Atualize o funcionário selecionado.'
              : 'Cadastre um novo funcionário.'
          }}
        </p>
      </div>

      <div class="form-grid">
        <input
          v-model="employeeName"
          type="text"
          placeholder="Nome do funcionário"
        />

        <select v-model="departmentId">
          <option value="">Selecione o departamento</option>

          <option
            v-for="department in departments"
            :key="department.id"
            :value="department.id"
          >
            {{ department.departmentName }}
          </option>
        </select>

        <input v-model="dateOfJoining" type="date" />

        <input
          v-model="photoFileName"
          type="text"
          placeholder="Nome do arquivo da foto"
        />

        <div class="buttons">
          <button type="button" @click="saveEmployee">
            {{ editingEmployee ? 'Atualizar' : 'Adicionar' }}
          </button>

          <button
            v-if="editingEmployee"
            type="button"
            class="secondary"
            @click="cancelEdit"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h2>Lista de Funcionários</h2>
        <span>{{ employees.length }} item(ns)</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Funcionário</th>
            <th>Departamento</th>
            <th>Data de Entrada</th>
            <th>Foto</th>
            <th class="actions-column">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>{{ employee.id }}</td>
            <td>{{ employee.employeeName }}</td>
            <td>
              {{
                employee.department?.departmentName ||
                getDepartmentName(employee.departmentId)
              }}
            </td>
            <td>{{ formatDate(employee.dateOfJoining) }}</td>
            <td>{{ employee.photoFileName || '-' }}</td>
            <td class="actions">
              <button
                type="button"
                class="outline"
                @click="editEmployee(employee)"
              >
                Editar
              </button>

              <button
                type="button"
                class="danger"
                @click="removeEmployee(employee.id)"
              >
                Excluir
              </button>
            </td>
          </tr>

          <tr v-if="employees.length === 0">
            <td colspan="6" class="empty-state">
              Nenhum funcionário cadastrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>