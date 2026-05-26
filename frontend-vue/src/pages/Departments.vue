<script setup>
/*
  Importa recursos do Vue.

  onMounted:
  Executa uma função quando o componente é carregado na tela.

  ref:
  Cria uma variável reativa.
  Quando uma variável ref muda, o Vue atualiza a tela automaticamente.
*/
import { onMounted, ref } from 'vue';

/*
  Importa as funções do service de departamentos.

  Essas funções fazem a comunicação com a API .NET:
  - getDepartments: busca departamentos;
  - createDepartment: cadastra departamento;
  - updateDepartment: atualiza departamento;
  - deleteDepartment: exclui departamento.
*/
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../services/departmentService';

/*
  Lista reativa de departamentos.

  Como é uma ref, no JavaScript acessamos e alteramos usando:
  departments.value

  No template, o Vue permite usar apenas:
  departments
*/
const departments = ref([]);

/*
  Guarda o nome digitado no input do formulário.

  Está ligado ao campo pelo v-model:
  v-model="departmentName"
*/
const departmentName = ref('');

/*
  Guarda o departamento que está sendo editado.

  Quando for null:
  o formulário está em modo de cadastro.

  Quando tiver um objeto:
  o formulário está em modo de edição.
*/
const editingDepartment = ref(null);

/*
  onMounted executa quando o componente termina de carregar.

  Aqui usamos para buscar os departamentos assim que a tela abre.
*/
onMounted(() => {
  loadDepartments();
});

/*
  Busca a lista de departamentos no backend.

  Essa função chama getDepartments(), que está no service.
  O service faz a requisição GET para a API .NET.
*/
async function loadDepartments() {
  try {
    /*
      Aguarda a resposta da API e salva o resultado na lista reativa.

      Como departments é uma ref, precisamos usar departments.value.
    */
    departments.value = await getDepartments();
  } catch (error) {
    /*
      Se a API falhar, mostra o erro no console do navegador.
    */
    console.error('Erro ao buscar departamentos:', error);
  }
}

/*
  Função chamada ao clicar no botão "Adicionar" ou "Atualizar".

  Ela decide se deve:
  - criar um novo departamento;
  - ou atualizar um departamento existente.
*/
async function saveDepartment() {
  /*
    Valida se o campo foi preenchido.

    trim() remove espaços em branco no início e no fim.
  */
  if (!departmentName.value.trim()) {
    alert('Informe o nome do departamento.');
    return;
  }

  /*
    Se editingDepartment tiver valor, significa que o usuário
    está editando um departamento existente.
  */
  if (editingDepartment.value) {
    await updateDepartmentInstantly();
    return;
  }

  /*
    Se não estiver editando, cria um novo departamento.
  */
  await createDepartmentInstantly();
}

/*
  Cria um novo departamento usando atualização otimista.

  Atualização otimista significa:
  1. O item aparece na tela imediatamente.
  2. A requisição é enviada para o backend.
  3. Se der certo, o item temporário é trocado pelo item real da API.
  4. Se der erro, o item temporário é removido.
*/
async function createDepartmentInstantly() {
  /*
    Cria um ID temporário negativo.

    Os IDs reais do banco normalmente são positivos.
    Por isso, usar um número negativo evita conflito.
  */
  const tempId = Date.now() * -1;

  /*
    Objeto temporário exibido imediatamente na tabela.
  */
  const temporaryDepartment = {
    id: tempId,
    departmentName: departmentName.value,
  };

  /*
    Objeto enviado para o backend.

    No cadastro, enviamos apenas o nome.
    O ID será criado automaticamente pelo banco.
  */
  const payload = {
    departmentName: departmentName.value,
  };

  /*
    Adiciona o departamento temporário na tela.

    [...departments.value, temporaryDepartment]
    cria uma nova lista contendo os departamentos atuais
    mais o novo item temporário.
  */
  departments.value = [...departments.value, temporaryDepartment];

  /*
    Limpa o input após adicionar o item na tela.
  */
  departmentName.value = '';

  try {
    /*
      Envia o cadastro para a API.

      A API deve retornar o departamento criado com o ID real.
    */
    const createdDepartment = await createDepartment(payload);

    /*
      Substitui o departamento temporário pelo departamento real
      retornado pela API.

      map percorre a lista:
      - se encontrar o tempId, troca pelo createdDepartment;
      - se não, mantém o departamento como está.
    */
    departments.value = departments.value.map((department) =>
      department.id === tempId ? createdDepartment : department
    );
  } catch (error) {
    /*
      Se o cadastro falhar, mostra o erro no console.
    */
    console.error('Erro ao cadastrar departamento:', error);

    /*
      Remove o departamento temporário da lista,
      pois ele não foi salvo no backend.
    */
    departments.value = departments.value.filter(
      (department) => department.id !== tempId
    );

    /*
      Mostra uma mensagem simples para o usuário.
    */
    alert('Não foi possível cadastrar o departamento.');
  }
}

/*
  Atualiza um departamento existente usando atualização otimista.

  A tela é atualizada antes da resposta da API.
  Se a API falhar, o valor anterior é restaurado.
*/
async function updateDepartmentInstantly() {
  /*
    Guarda uma cópia do departamento antes da alteração.

    Essa cópia será usada para desfazer a alteração
    caso a API retorne erro.
  */
  const previousDepartment = { ...editingDepartment.value };

  /*
    Monta o departamento atualizado.

    Mantém os dados anteriores e troca apenas o departmentName
    pelo valor digitado no input.
  */
  const updatedDepartment = {
    ...editingDepartment.value,
    departmentName: departmentName.value,
  };

  /*
    Atualiza a lista na tela imediatamente.

    Se o ID for o mesmo do departamento editado,
    troca pelo updatedDepartment.
  */
  departments.value = departments.value.map((department) =>
    department.id === updatedDepartment.id ? updatedDepartment : department
  );

  /*
    Sai do modo de edição e limpa o formulário.
  */
  cancelEdit();

  try {
    /*
      Envia a atualização para o backend.
    */
    await updateDepartment(updatedDepartment.id, updatedDepartment);
  } catch (error) {
    /*
      Se a atualização falhar, mostra o erro no console.
    */
    console.error('Erro ao atualizar departamento:', error);

    /*
      Reverte a alteração na tela,
      voltando o departamento para o valor anterior.
    */
    departments.value = departments.value.map((department) =>
      department.id === previousDepartment.id ? previousDepartment : department
    );

    /*
      Mostra uma mensagem simples para o usuário.
    */
    alert('Não foi possível atualizar o departamento.');
  }
}

/*
  Coloca o formulário em modo de edição.

  Essa função é chamada quando o usuário clica no botão "Editar".
*/
function editDepartment(department) {
  /*
    Guarda o departamento selecionado como departamento em edição.
  */
  editingDepartment.value = department;

  /*
    Preenche o input com o nome atual do departamento.
  */
  departmentName.value = department.departmentName;
}

/*
  Cancela a edição atual.

  Limpa o departamento em edição e limpa o input.
*/
function cancelEdit() {
  /*
    Remove o modo de edição.
  */
  editingDepartment.value = null;

  /*
    Limpa o campo de nome.
  */
  departmentName.value = '';
}

/*
  Remove um departamento pelo ID.

  Também usa atualização otimista:
  1. Remove da tela imediatamente.
  2. Chama a API para excluir.
  3. Se a API falhar, recoloca o item na tabela.
*/
async function removeDepartment(id) {
  /*
    Pede confirmação antes de excluir.
  */
  const confirmDelete = confirm('Deseja excluir este departamento?');

  /*
    Se o usuário cancelar, a função para aqui.
  */
  if (!confirmDelete) {
    return;
  }

  /*
    Guarda o departamento que será removido.

    Se a API falhar, esse objeto será usado para restaurar o item.
  */
  const removedDepartment = departments.value.find(
    (department) => department.id === id
  );

  /*
    Remove o departamento da tela imediatamente.
  */
  departments.value = departments.value.filter(
    (department) => department.id !== id
  );

  try {
    /*
      Envia a exclusão para o backend.
    */
    await deleteDepartment(id);
  } catch (error) {
    /*
      Se a exclusão falhar, mostra o erro no console.
    */
    console.error('Erro ao excluir departamento:', error);

    /*
      Se o departamento removido foi encontrado,
      adiciona ele novamente na lista.
    */
    if (removedDepartment) {
      departments.value = [...departments.value, removedDepartment];
    }

    /*
      Mostra uma mensagem simples para o usuário.
    */
    alert('Não foi possível excluir o departamento.');
  }
}
</script>

<template>
  <!--
    Section principal da página de Departamentos.

    A classe "page" é usada para aplicar o layout geral da tela.
  -->
  <section class="page">
    <!--
      Cabeçalho da página.

      Contém:
      - identificador da área;
      - título;
      - descrição da tela.
    -->
    <div class="page-header">
      <div>
        <!-- Texto pequeno acima do título principal -->
        <p class="eyebrow">Gerenciamento</p>

        <!-- Título principal da tela -->
        <h1>Departamentos</h1>

        <!-- Descrição curta da funcionalidade -->
        <p class="subtitle">
          Cadastre, edite e gerencie os departamentos da empresa.
        </p>
      </div>
    </div>

    <!--
      Card do formulário.

      Usado para cadastrar ou editar um departamento.
    -->
    <div class="form-card">
      <div>
        <!--
          Título dinâmico.

          Se editingDepartment tiver valor:
          mostra "Editar Departamento".

          Se editingDepartment for null:
          mostra "Adicionar Departamento".
        -->
        <h2>
          {{ editingDepartment ? 'Editar Departamento' : 'Adicionar Departamento' }}
        </h2>

        <!--
          Texto auxiliar dinâmico.

          Também muda conforme o modo do formulário.
        -->
        <p>
          {{
            editingDepartment
              ? 'Atualize o departamento selecionado.'
              : 'Cadastre um novo departamento.'
          }}
        </p>
      </div>

      <!--
        Linha do formulário.

        Contém:
        - input de nome;
        - botão principal;
        - botão de cancelar edição.
      -->
      <div class="form-row">
        <!--
          Campo de nome do departamento.

          v-model="departmentName" faz ligação de mão dupla:
          - quando o usuário digita, departmentName muda;
          - quando departmentName muda no script, o input também atualiza.
        -->
        <input
          v-model="departmentName"
          type="text"
          placeholder="Nome do departamento"
        />

        <!--
          Botão principal.

          Ao clicar, chama saveDepartment.

          O texto muda entre:
          - Atualizar;
          - Adicionar.
        -->
        <button type="button" @click="saveDepartment">
          {{ editingDepartment ? 'Atualizar' : 'Adicionar' }}
        </button>

        <!--
          Botão Cancelar.

          v-if="editingDepartment" faz o botão aparecer somente
          quando existe um departamento sendo editado.
        -->
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

    <!--
      Card da tabela.

      Exibe a lista de departamentos cadastrados.
    -->
    <div class="table-card">
      <!--
        Cabeçalho da tabela.

        Mostra o título e a quantidade de departamentos.
      -->
      <div class="table-header">
        <h2>Lista de Departamentos</h2>

        <!--
          Mostra a quantidade de itens na lista.

          No template do Vue, uma ref pode ser usada diretamente
          sem escrever .value.
        -->
        <span>{{ departments.length }} item(ns)</span>
      </div>

      <!-- Tabela de departamentos -->
      <table>
        <thead>
          <tr>
            <!-- Coluna do ID -->
            <th>ID</th>

            <!-- Coluna do nome do departamento -->
            <th>Nome do Departamento</th>

            <!-- Coluna dos botões de ação -->
            <th class="actions-column">Ações</th>
          </tr>
        </thead>

        <tbody>
          <!--
            Percorre a lista de departamentos.

            Para cada departamento dentro de departments,
            cria uma linha na tabela.

            :key="department.id" ajuda o Vue a identificar cada linha.
          -->
          <tr v-for="department in departments" :key="department.id">
            <!-- Exibe o ID do departamento -->
            <td>{{ department.id }}</td>

            <!-- Exibe o nome do departamento -->
            <td>{{ department.departmentName }}</td>

            <!-- Coluna com botões de editar e excluir -->
            <td class="actions">
              <!--
                Botão Editar.

                Ao clicar, envia o departamento atual para editDepartment().
              -->
              <button
                type="button"
                class="outline"
                @click="editDepartment(department)"
              >
                Editar
              </button>

              <!--
                Botão Excluir.

                Ao clicar, envia o ID do departamento para removeDepartment().
              -->
              <button
                type="button"
                class="danger"
                @click="removeDepartment(department.id)"
              >
                Excluir
              </button>
            </td>
          </tr>

          <!--
            Linha exibida quando não existe nenhum departamento cadastrado.

            v-if="departments.length === 0" mostra essa linha somente
            quando a lista está vazia.
          -->
          <tr v-if="departments.length === 0">
            <!--
              colspan="3" faz esta célula ocupar todas as 3 colunas da tabela.
            -->
            <td colspan="3" class="empty-state">
              Nenhum departamento cadastrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>