<script setup>
import { onMounted, ref } from 'vue';

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../services/departmentService';

const departments = ref([]);
const departmentName = ref('');
const editingDepartment = ref(null);

onMounted(() => {
  loadDepartments();
});

async function loadDepartments() {
  try {
    departments.value = await getDepartments();
  } catch (error) {
    console.error('Erro ao buscar departamentos:', error);
  }
}

async function saveDepartment() {
  if (!departmentName.value.trim()) {
    alert('Informe o nome do departamento.');
    return;
  }

  if (editingDepartment.value) {
    await updateDepartmentInstantly();
    return;
  }

  await createDepartmentInstantly();
}

async function createDepartmentInstantly() {
  const tempId = Date.now() * -1;

  const temporaryDepartment = {
    id: tempId,
    departmentName: departmentName.value,
  };

  const payload = {
    departmentName: departmentName.value,
  };

  departments.value = [...departments.value, temporaryDepartment];
  departmentName.value = '';

  try {
    const createdDepartment = await createDepartment(payload);

    departments.value = departments.value.map((department) =>
      department.id === tempId ? createdDepartment : department
    );
  } catch (error) {
    console.error('Erro ao cadastrar departamento:', error);

    departments.value = departments.value.filter(
      (department) => department.id !== tempId
    );

    alert('Não foi possível cadastrar o departamento.');
  }
}

async function updateDepartmentInstantly() {
  const previousDepartment = { ...editingDepartment.value };

  const updatedDepartment = {
    ...editingDepartment.value,
    departmentName: departmentName.value,
  };

  departments.value = departments.value.map((department) =>
    department.id === updatedDepartment.id ? updatedDepartment : department
  );

  cancelEdit();

  try {
    await updateDepartment(updatedDepartment.id, updatedDepartment);
  } catch (error) {
    console.error('Erro ao atualizar departamento:', error);

    departments.value = departments.value.map((department) =>
      department.id === previousDepartment.id ? previousDepartment : department
    );

    alert('Não foi possível atualizar o departamento.');
  }
}

function editDepartment(department) {
  editingDepartment.value = department;
  departmentName.value = department.departmentName;
}

function cancelEdit() {
  editingDepartment.value = null;
  departmentName.value = '';
}

async function removeDepartment(id) {
  const confirmDelete = confirm('Deseja excluir este departamento?');

  if (!confirmDelete) {
    return;
  }

  const removedDepartment = departments.value.find(
    (department) => department.id === id
  );

  departments.value = departments.value.filter(
    (department) => department.id !== id
  );

  try {
    await deleteDepartment(id);
  } catch (error) {
    console.error('Erro ao excluir departamento:', error);

    if (removedDepartment) {
      departments.value = [...departments.value, removedDepartment];
    }

    alert('Não foi possível excluir o departamento.');
  }
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Gerenciamento</p>
        <h1>Departamentos</h1>
        <p class="subtitle">
          Cadastre, edite e gerencie os departamentos da empresa.
        </p>
      </div>
    </div>

    <div class="form-card">
      <div>
        <h2>
          {{ editingDepartment ? 'Editar Departamento' : 'Adicionar Departamento' }}
        </h2>
        <p>
          {{
            editingDepartment
              ? 'Atualize o departamento selecionado.'
              : 'Cadastre um novo departamento.'
          }}
        </p>
      </div>

      <div class="form-row">
        <input
          v-model="departmentName"
          type="text"
          placeholder="Nome do departamento"
        />

        <button type="button" @click="saveDepartment">
          {{ editingDepartment ? 'Atualizar' : 'Adicionar' }}
        </button>

        <button
          v-if="editingDepartment"
          type="button"
          class="secondary"
          @click="cancelEdit"
        >
          Cancelar
        </button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h2>Lista de Departamentos</h2>
        <span>{{ departments.length }} item(ns)</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Departamento</th>
            <th class="actions-column">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="department in departments" :key="department.id">
            <td>{{ department.id }}</td>
            <td>{{ department.departmentName }}</td>
            <td class="actions">
              <button
                type="button"
                class="outline"
                @click="editDepartment(department)"
              >
                Editar
              </button>

              <button
                type="button"
                class="danger"
                @click="removeDepartment(department.id)"
              >
                Excluir
              </button>
            </td>
          </tr>

          <tr v-if="departments.length === 0">
            <td colspan="3" class="empty-state">
              Nenhum departamento cadastrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>