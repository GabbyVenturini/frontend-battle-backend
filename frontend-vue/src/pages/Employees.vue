<script setup>
/*
  Importa recursos do Vue.

  onMounted:
  Executa uma função quando o componente termina de carregar na tela.

  ref:
  Cria uma variável reativa.
  Quando uma ref muda, o Vue atualiza automaticamente a tela.
*/
import { onMounted, ref } from 'vue';

/*
  Importa as funções do service de funcionários.

  Essas funções fazem comunicação com a API .NET:
  - getEmployees: busca funcionários;
  - createEmployee: cadastra funcionário;
  - updateEmployee: atualiza funcionário;
  - deleteEmployee: exclui funcionário.
*/
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../services/employeeService';

/*
  Importa a função que busca os departamentos.

  Ela é usada para preencher o select de departamentos
  dentro do formulário de funcionários.
*/
import { getDepartments } from '../services/departmentService';

/*
  Lista reativa de funcionários.

  No script, por ser uma ref, acessamos usando:
  employees.value

  No template, o Vue permite acessar diretamente:
  employees
*/
const employees = ref([]);

/*
  Lista reativa de departamentos.

  Essa lista alimenta o campo <select>,
  permitindo escolher o departamento do funcionário.
*/
const departments = ref([]);

/*
  Campo reativo que guarda o nome digitado do funcionário.

  Está ligado ao input pelo v-model:
  v-model="employeeName"
*/
const employeeName = ref('');

/*
  Campo reativo que guarda o ID do departamento selecionado.

  Começa como string vazia porque o select tem uma opção inicial:
  value=""
*/
const departmentId = ref('');

/*
  Campo reativo que guarda a data de entrada do funcionário.

  O input type="date" trabalha com string no formato:
  yyyy-MM-dd
*/
const dateOfJoining = ref('');

/*
  Campo reativo que guarda o nome do arquivo da foto.

  Neste projeto não existe upload real de imagem.
  O sistema apenas salva o texto informado.
*/
const photoFileName = ref('');

/*
  Guarda o funcionário que está sendo editado.

  Quando for null:
  o formulário está no modo de cadastro.

  Quando tiver um objeto:
  o formulário está no modo de edição.
*/
const editingEmployee = ref(null);

/*
  Executa quando o componente é carregado.

  Aqui buscamos:
  - departamentos, para preencher o select;
  - funcionários, para preencher a tabela.
*/
onMounted(() => {
  loadDepartments();
  loadEmployees();
});

/*
  Busca os funcionários cadastrados no backend.

  Essa função chama getEmployees(), que está no employeeService.js.
*/
async function loadEmployees() {
  try {
    /*
      Aguarda a resposta da API e salva a lista na variável reativa.

      Como employees é uma ref, usamos employees.value.
    */
    employees.value = await getEmployees();
  } catch (error) {
    /*
      Se a API falhar, mostra o erro no console do navegador.
    */
    console.error('Erro ao buscar funcionários:', error);
  }
}

/*
  Busca os departamentos cadastrados no backend.

  Essa lista é necessária para montar o select de departamentos.
*/
async function loadDepartments() {
  try {
    /*
      Aguarda a resposta da API e salva os departamentos.
    */
    departments.value = await getDepartments();
  } catch (error) {
    /*
      Se a API falhar, mostra o erro no console.
    */
    console.error('Erro ao buscar departamentos:', error);
  }
}

/*
  Busca um departamento pelo ID.

  Essa função é útil porque o funcionário pode vir da API apenas com departmentId,
  sem o objeto department completo.
*/
function getDepartmentById(id) {
  /*
    departments.value acessa a lista real de departamentos.

    Number(id) garante que a comparação seja feita como número,
    porque valores vindos do select podem chegar como string.
  */
  return (
    departments.value.find((department) => department.id === Number(id)) || null
  );
}

/*
  Retorna o nome do departamento a partir do ID.

  Essa função é usada na tabela para exibir o nome do departamento
  quando employee.department não está preenchido.
*/
function getDepartmentName(id) {
  /*
    Primeiro procura o departamento pelo ID.
  */
  const department = getDepartmentById(id);

  /*
    Se encontrou o departamento, retorna o nome.
    Se não encontrou, retorna "-".
  */
  return department ? department.departmentName : '-';
}

/*
  Formata a data para o padrão brasileiro.

  Exemplo:
  2026-05-26 -> 26/05/2026
*/
function formatDate(date) {
  /*
    Se a data vier vazia, mostra "-".
  */
  if (!date) {
    return '-';
  }

  /*
    Converte a data para objeto Date e formata no padrão pt-BR.
  */
  return new Date(date).toLocaleDateString('pt-BR');
}

/*
  Função chamada quando o usuário clica no botão:
  - Adicionar;
  - Atualizar.

  Ela decide se vai cadastrar um novo funcionário
  ou atualizar um funcionário existente.
*/
async function saveEmployee() {
  /*
    Valida se o nome foi preenchido.

    trim() remove espaços em branco do início e do fim.
  */
  if (!employeeName.value.trim()) {
    alert('Informe o nome do funcionário.');
    return;
  }

  /*
    Valida se o departamento foi selecionado.
  */
  if (!departmentId.value) {
    alert('Selecione um departamento.');
    return;
  }

  /*
    Valida se a data de entrada foi preenchida.
  */
  if (!dateOfJoining.value) {
    alert('Informe a data de entrada.');
    return;
  }

  /*
    Se existe um funcionário em edição,
    chama a função de atualização.
  */
  if (editingEmployee.value) {
    await updateEmployeeInstantly();
    return;
  }

  /*
    Se não existe funcionário em edição,
    chama a função de cadastro.
  */
  await createEmployeeInstantly();
}

/*
  Cadastra um novo funcionário usando atualização otimista.

  Atualização otimista significa:
  1. O funcionário aparece na tela imediatamente.
  2. O cadastro é enviado para a API.
  3. Se a API responder com sucesso, o item temporário é trocado pelo real.
  4. Se a API der erro, o item temporário é removido da tela.
*/
async function createEmployeeInstantly() {
  /*
    Cria um ID temporário negativo.

    Como os IDs reais do banco normalmente são positivos,
    usar um negativo evita conflito.
  */
  const tempId = Date.now() * -1;

  /*
    Payload enviado para o backend.

    Não enviamos ID porque ele será criado automaticamente pelo banco.
  */
  const employeePayload = {
    employeeName: employeeName.value,
    departmentId: Number(departmentId.value),
    dateOfJoining: dateOfJoining.value,
    photoFileName: photoFileName.value || '',
  };

  /*
    Funcionário temporário exibido na tabela antes da API responder.

    Ele já contém os dados digitados pelo usuário.
  */
  const temporaryEmployee = {
    id: tempId,
    employeeName: employeeName.value,
    departmentId: Number(departmentId.value),
    department: getDepartmentById(departmentId.value),
    dateOfJoining: dateOfJoining.value,
    photoFileName: photoFileName.value || '',
  };

  /*
    Adiciona o funcionário temporário na lista da tela.
  */
  employees.value = [...employees.value, temporaryEmployee];

  /*
    Limpa o formulário depois de adicionar o item temporário.
  */
  clearForm();

  try {
    /*
      Envia o funcionário para a API.

      A API deve retornar o funcionário criado com ID real.
    */
    const createdEmployee = await createEmployee(employeePayload);

    /*
      Monta o funcionário final que será mostrado na tabela.

      Também tenta preencher o objeto department com base no departmentId.
    */
    const employeeToShow = {
      ...createdEmployee,
      department: getDepartmentById(createdEmployee.departmentId),
      photoFileName: createdEmployee.photoFileName || '',
    };

    /*
      Substitui o funcionário temporário pelo funcionário real retornado pela API.
    */
    employees.value = employees.value.map((employee) =>
      employee.id === tempId ? employeeToShow : employee
    );
  } catch (error) {
    /*
      Se o cadastro falhar, mostra o erro no console.
    */
    console.error('Erro ao cadastrar funcionário:', error);

    /*
      Remove o funcionário temporário da tabela,
      porque ele não foi salvo no backend.
    */
    employees.value = employees.value.filter((employee) => employee.id !== tempId);

    /*
      Mostra mensagem para o usuário.
    */
    alert('Não foi possível cadastrar o funcionário.');
  }
}

/*
  Atualiza um funcionário existente usando atualização otimista.

  A tela é atualizada antes da resposta da API.
  Se a API falhar, a alteração é desfeita.
*/
async function updateEmployeeInstantly() {
  /*
    Guarda uma cópia do funcionário antes da alteração.

    Essa cópia será usada para restaurar os dados
    se a API retornar erro.
  */
  const previousEmployee = { ...editingEmployee.value };

  /*
    Cria o funcionário atualizado com os dados atuais do formulário.
  */
  const updatedEmployee = {
    id: editingEmployee.value.id,
    employeeName: employeeName.value,
    departmentId: Number(departmentId.value),
    department: getDepartmentById(departmentId.value),
    dateOfJoining: dateOfJoining.value,
    photoFileName: photoFileName.value || '',
  };

  /*
    Cria o payload enviado para o backend.

    Aqui enviamos apenas os dados necessários para atualizar.
  */
  const employeePayload = {
    id: updatedEmployee.id,
    employeeName: updatedEmployee.employeeName,
    departmentId: updatedEmployee.departmentId,
    dateOfJoining: updatedEmployee.dateOfJoining,
    photoFileName: updatedEmployee.photoFileName,
  };

  /*
    Atualiza a lista na tela imediatamente.
  */
  employees.value = employees.value.map((employee) =>
    employee.id === updatedEmployee.id ? updatedEmployee : employee
  );

  /*
    Sai do modo de edição e limpa o formulário.
  */
  cancelEdit();

  try {
    /*
      Envia a atualização para a API.
    */
    await updateEmployee(updatedEmployee.id, employeePayload);
  } catch (error) {
    /*
      Se a atualização falhar, mostra o erro no console.
    */
    console.error('Erro ao atualizar funcionário:', error);

    /*
      Reverte a alteração na tabela,
      voltando o funcionário para o estado anterior.
    */
    employees.value = employees.value.map((employee) =>
      employee.id === previousEmployee.id ? previousEmployee : employee
    );

    /*
      Mostra mensagem para o usuário.
    */
    alert('Não foi possível atualizar o funcionário.');
  }
}

/*
  Coloca o formulário em modo de edição.

  Essa função é chamada ao clicar no botão "Editar" da tabela.
*/
function editEmployee(employee) {
  /*
    Guarda o funcionário selecionado como funcionário em edição.
  */
  editingEmployee.value = employee;

  /*
    Preenche o campo de nome com o valor atual.
  */
  employeeName.value = employee.employeeName;

  /*
    Preenche o select com o departamento atual.

    Convertemos para string porque o select trabalha naturalmente
    com valores em texto.
  */
  departmentId.value = String(employee.departmentId);

  /*
    Preenche o input de data.

    substring(0, 10) pega apenas a parte yyyy-MM-dd.

    Exemplo:
    "2026-05-26T00:00:00" vira "2026-05-26".
  */
  dateOfJoining.value = employee.dateOfJoining.substring(0, 10);

  /*
    Preenche o campo da foto.
    Se não tiver valor, usa string vazia.
  */
  photoFileName.value = employee.photoFileName || '';
}

/*
  Cancela a edição.

  Remove o funcionário em edição e limpa o formulário.
*/
function cancelEdit() {
  editingEmployee.value = null;
  clearForm();
}

/*
  Limpa todos os campos do formulário.
*/
function clearForm() {
  employeeName.value = '';
  departmentId.value = '';
  dateOfJoining.value = '';
  photoFileName.value = '';
}

/*
  Exclui um funcionário pelo ID.

  Também usa atualização otimista:
  1. Remove o funcionário da tela.
  2. Envia DELETE para a API.
  3. Se a API falhar, recoloca o funcionário na tabela.
*/
async function removeEmployee(id) {
  /*
    Pede confirmação antes da exclusão.
  */
  const confirmDelete = confirm('Deseja excluir este funcionário?');

  /*
    Se o usuário cancelar, interrompe a função.
  */
  if (!confirmDelete) {
    return;
  }

  /*
    Guarda o funcionário que será removido.

    Se a API falhar, esse objeto será usado para restaurar a linha.
  */
  const removedEmployee = employees.value.find((employee) => employee.id === id);

  /*
    Remove o funcionário da tabela imediatamente.
  */
  employees.value = employees.value.filter((employee) => employee.id !== id);

  try {
    /*
      Envia a exclusão para a API.
    */
    await deleteEmployee(id);
  } catch (error) {
    /*
      Se a exclusão falhar, mostra o erro no console.
    */
    console.error('Erro ao excluir funcionário:', error);

    /*
      Recoloca o funcionário na tabela se ele foi encontrado antes.
    */
    if (removedEmployee) {
      employees.value = [...employees.value, removedEmployee];
    }

    /*
      Mostra mensagem para o usuário.
    */
    alert('Não foi possível excluir o funcionário.');
  }
}
</script>

<template>
  <!--
    Section principal da página de Funcionários.
  -->
  <section class="page">
    <!--
      Cabeçalho da página.
    -->
    <div class="page-header">
      <div>
        <p class="eyebrow">Gerenciamento</p>

        <h1>Funcionários</h1>

        <p class="subtitle">
          Cadastre, edite e gerencie os funcionários da empresa.
        </p>
      </div>
    </div>

    <!--
      Card do formulário.
    -->
    <div class="form-card">
      <div>
        <!--
          Título dinâmico.

          Se existe editingEmployee:
          mostra "Editar Funcionário".

          Caso contrário:
          mostra "Adicionar Funcionário".
        -->
        <h2>
          {{ editingEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário' }}
        </h2>

        <!--
          Texto auxiliar dinâmico do formulário.
        -->
        <p>
          {{
            editingEmployee
              ? 'Atualize o funcionário selecionado.'
              : 'Cadastre um novo funcionário.'
          }}
        </p>
      </div>

      <!--
        Grid do formulário.
      -->
      <div class="form-grid">
        <!--
          Campo de nome do funcionário.

          v-model liga o input à variável employeeName.
        -->
        <input
          v-model="employeeName"
          type="text"
          placeholder="Nome do funcionário"
        />

        <!--
          Select de departamentos.

          v-model liga o valor selecionado à variável departmentId.
        -->
        <select v-model="departmentId">
          <!-- Opção inicial sem departamento selecionado -->
          <option value="">Selecione o departamento</option>

          <!--
            Percorre a lista de departamentos e cria uma option para cada item.
          -->
          <option
            v-for="department in departments"
            :key="department.id"
            :value="department.id"
          >
            {{ department.departmentName }}
          </option>
        </select>

        <!--
          Campo de data de entrada do funcionário.
        -->
        <input v-model="dateOfJoining" type="date" />

        <!--
          Campo do nome do arquivo da foto.
        -->
        <input
          v-model="photoFileName"
          type="text"
          placeholder="Nome do arquivo da foto"
        />

        <!--
          Botões do formulário.
        -->
        <div class="buttons">
          <!--
            Botão principal.

            Chama saveEmployee, que decide entre criar ou atualizar.
          -->
          <button type="button" @click="saveEmployee">
            {{ editingEmployee ? 'Atualizar' : 'Adicionar' }}
          </button>

          <!--
            Botão Cancelar.

            Aparece somente quando existe funcionário em edição.
          -->
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

    <!--
      Card da tabela de funcionários.
    -->
    <div class="table-card">
      <div class="table-header">
        <h2>Lista de Funcionários</h2>

        <!--
          Mostra a quantidade de funcionários na lista.
        -->
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
          <!--
            Percorre a lista de funcionários e cria uma linha para cada item.
          -->
          <tr v-for="employee in employees" :key="employee.id">
            <td>{{ employee.id }}</td>

            <td>{{ employee.employeeName }}</td>

            <!--
              Exibe o nome do departamento.

              Primeiro tenta usar employee.department?.departmentName.
              Se não existir, usa getDepartmentName(employee.departmentId).
            -->
            <td>
              {{
                employee.department?.departmentName ||
                getDepartmentName(employee.departmentId)
              }}
            </td>

            <!--
              Exibe a data formatada em pt-BR.
            -->
            <td>{{ formatDate(employee.dateOfJoining) }}</td>

            <!--
              Exibe a foto ou "-" caso esteja vazio.
            -->
            <td>{{ employee.photoFileName || '-' }}</td>

            <!--
              Botões de ação da linha.
            -->
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

          <!--
            Mensagem exibida quando não há funcionários cadastrados.
          -->
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