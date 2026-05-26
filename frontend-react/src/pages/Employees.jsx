/*
  Importa dois hooks principais do React.

  useEffect:
  Executa uma função em momentos específicos do ciclo de vida do componente.
  Aqui, usamos para carregar dados assim que a tela abrir.

  useState:
  Cria estados dentro do componente.
  Sempre que um estado muda, o React renderiza a tela novamente.
*/
import { useEffect, useState } from 'react';

/*
  Importa as funções do service de funcionários.

  Essas funções fazem a comunicação com a API .NET:
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
  Importa a função que busca departamentos.

  Ela é usada para preencher o select de departamentos
  no formulário de funcionários.
*/
import { getDepartments } from '../services/departmentService';

/*
  Componente principal da tela de Funcionários.

  No React, um componente é uma função que retorna JSX,
  que é uma estrutura parecida com HTML.
*/
export default function Employees() {
  /*
    Estado que guarda a lista de funcionários cadastrados.

    employees:
    Valor atual da lista.

    setEmployees:
    Função usada para atualizar a lista.
  */
  const [employees, setEmployees] = useState([]);

  /*
    Estado que guarda a lista de departamentos.

    Essa lista é usada para montar o select de departamentos.
  */
  const [departments, setDepartments] = useState([]);

  /*
    Estado que guarda o nome digitado no campo "Nome do funcionário".
  */
  const [employeeName, setEmployeeName] = useState('');

  /*
    Estado que guarda o ID do departamento selecionado.

    Começa como string vazia porque o select usa value="" na opção inicial.
  */
  const [departmentId, setDepartmentId] = useState('');

  /*
    Estado que guarda a data de entrada do funcionário.

    O input type="date" trabalha com string no formato yyyy-MM-dd.
  */
  const [dateOfJoining, setDateOfJoining] = useState('');

  /*
    Estado que guarda o nome do arquivo da foto.

    Neste projeto, não fazemos upload real de imagem.
    Salvamos apenas o texto informado pelo usuário.
  */
  const [photoFileName, setPhotoFileName] = useState('');

  /*
    Estado que guarda o funcionário que está sendo editado.

    Quando for null:
    o formulário está em modo de cadastro.

    Quando tiver um objeto:
    o formulário está em modo de edição.
  */
  const [editingEmployee, setEditingEmployee] = useState(null);

  /*
    useEffect executa quando o componente é carregado.

    O array vazio [] faz esse efeito rodar apenas uma vez,
    quando a tela abre.

    Aqui carregamos:
    - departamentos;
    - funcionários.
  */
  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, []);

  /*
    Busca todos os funcionários na API.

    Essa função chama getEmployees(), que está no employeeService.js.
  */
  async function loadEmployees() {
    try {
      /*
        Aguarda a resposta da API.

        data deve ser uma lista de funcionários.
      */
      const data = await getEmployees();

      /*
        Atualiza o estado employees.

        Quando setEmployees é chamado, o React atualiza a tabela na tela.
      */
      setEmployees(data);
    } catch (error) {
      /*
        Se a API der erro, exibe no console do navegador.
      */
      console.error('Erro ao buscar funcionários:', error);
    }
  }

  /*
    Busca todos os departamentos na API.

    Essa lista será usada no select do formulário.
  */
  async function loadDepartments() {
    try {
      /*
        Aguarda a resposta da API de departamentos.
      */
      const data = await getDepartments();

      /*
        Atualiza a lista de departamentos no estado.
      */
      setDepartments(data);
    } catch (error) {
      /*
        Se der erro, exibe no console.
      */
      console.error('Erro ao buscar departamentos:', error);
    }
  }

  /*
    Busca um departamento pelo ID.

    Essa função é usada para encontrar o objeto completo do departamento
    quando temos apenas o departmentId do funcionário.
  */
  function getDepartmentById(id) {
    /*
      departments.find percorre a lista e retorna o primeiro departamento
      cujo id seja igual ao id recebido.

      Number(id) garante que a comparação seja feita como número,
      já que o select pode retornar o valor como string.
    */
    return departments.find((department) => department.id === Number(id)) || null;
  }

  /*
    Retorna o nome do departamento pelo ID.

    Essa função é usada na tabela quando o funcionário não vem com
    o objeto department preenchido pela API.
  */
  function getDepartmentName(id) {
    /*
      Busca o departamento pelo ID.
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
      Se não existir data, retorna "-".
    */
    if (!date) {
      return '-';
    }

    /*
      Converte a data para objeto Date e formata usando o padrão pt-BR.
    */
    return new Date(date).toLocaleDateString('pt-BR');
  }

  /*
    Função chamada quando o usuário clica em "Adicionar" ou "Atualizar".

    Ela decide se deve:
    - cadastrar um novo funcionário;
    - ou atualizar um funcionário existente.
  */
  async function saveEmployee() {
    /*
      Valida se o nome foi preenchido.

      trim() remove espaços em branco no início e no fim.
    */
    if (!employeeName.trim()) {
      alert('Informe o nome do funcionário.');
      return;
    }

    /*
      Valida se o departamento foi selecionado.
    */
    if (!departmentId) {
      alert('Selecione um departamento.');
      return;
    }

    /*
      Valida se a data de entrada foi informada.
    */
    if (!dateOfJoining) {
      alert('Informe a data de entrada.');
      return;
    }

    /*
      Se editingEmployee tiver valor, significa que o formulário
      está em modo de edição.
    */
    if (editingEmployee) {
      await updateEmployeeInstantly();
      return;
    }

    /*
      Se não estiver editando, cria um novo funcionário.
    */
    await createEmployeeInstantly();
  }

  /*
    Cria um funcionário usando atualização otimista.

    Atualização otimista significa:
    1. Mostra o funcionário na tela imediatamente.
    2. Envia o cadastro para a API.
    3. Se der certo, troca o funcionário temporário pelo funcionário real.
    4. Se der erro, remove o funcionário temporário.
  */
  async function createEmployeeInstantly() {
    /*
      Cria um ID temporário negativo.

      Como os IDs reais do banco geralmente são positivos,
      usar um valor negativo evita conflito.
    */
    const tempId = Date.now() * -1;

    /*
      Objeto enviado para o backend.

      Aqui não enviamos o ID porque ele será gerado pelo banco.
    */
    const employeePayload = {
      employeeName,
      departmentId: Number(departmentId),
      dateOfJoining,
      photoFileName: photoFileName || '',
    };

    /*
      Objeto temporário exibido na tabela antes da API responder.

      Ele já contém os dados digitados pelo usuário.
    */
    const temporaryEmployee = {
      id: tempId,
      employeeName,
      departmentId: Number(departmentId),
      department: getDepartmentById(departmentId),
      dateOfJoining,
      photoFileName: photoFileName || '',
    };

    /*
      Adiciona o funcionário temporário na tela.

      current representa a lista atual.
      [...current, temporaryEmployee] cria uma nova lista com o novo item.
    */
    setEmployees((current) => [...current, temporaryEmployee]);

    /*
      Limpa o formulário após adicionar o funcionário temporário.
    */
    clearForm();

    try {
      /*
        Envia o cadastro para a API.

        A API deve retornar o funcionário criado com ID real.
      */
      const createdEmployee = await createEmployee(employeePayload);

      /*
        Monta o funcionário final que será exibido na tela.

        Também tenta preencher o objeto department usando o departmentId.
      */
      const employeeToShow = {
        ...createdEmployee,
        department: getDepartmentById(createdEmployee.departmentId),
        photoFileName: createdEmployee.photoFileName || '',
      };

      /*
        Substitui o funcionário temporário pelo funcionário real retornado pela API.
      */
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === tempId ? employeeToShow : employee
        )
      );
    } catch (error) {
      /*
        Se a API der erro, exibe no console.
      */
      console.error('Erro ao cadastrar funcionário:', error);

      /*
        Remove o funcionário temporário da lista.
      */
      setEmployees((current) =>
        current.filter((employee) => employee.id !== tempId)
      );

      /*
        Mostra mensagem para o usuário.
      */
      alert('Não foi possível cadastrar o funcionário.');
    }
  }

  /*
    Atualiza um funcionário existente usando atualização otimista.

    A tela muda antes da resposta da API.
    Se a API falhar, a alteração é desfeita.
  */
  async function updateEmployeeInstantly() {
    /*
      Guarda uma cópia do funcionário antes da alteração.

      Essa cópia será usada para restaurar os dados se a API der erro.
    */
    const previousEmployee = { ...editingEmployee };

    /*
      Cria o funcionário atualizado com os dados atuais do formulário.
    */
    const updatedEmployee = {
      id: editingEmployee.id,
      employeeName,
      departmentId: Number(departmentId),
      department: getDepartmentById(departmentId),
      dateOfJoining,
      photoFileName: photoFileName || '',
    };

    /*
      Objeto enviado para a API no PUT.

      Ele contém os dados necessários para atualizar o funcionário.
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

      Se o ID for igual ao funcionário editado, troca pelo objeto atualizado.
    */
    setEmployees((current) =>
      current.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );

    /*
      Sai do modo de edição e limpa o formulário.
    */
    cancelEdit();

    try {
      /*
        Envia a atualização para o backend.
      */
      await updateEmployee(updatedEmployee.id, employeePayload);
    } catch (error) {
      /*
        Se a API der erro, exibe no console.
      */
      console.error('Erro ao atualizar funcionário:', error);

      /*
        Desfaz a alteração, voltando o funcionário para o estado anterior.
      */
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === previousEmployee.id ? previousEmployee : employee
        )
      );

      /*
        Mostra mensagem para o usuário.
      */
      alert('Não foi possível atualizar o funcionário.');
    }
  }

  /*
    Coloca o formulário em modo de edição.

    Essa função é chamada quando o usuário clica no botão "Editar".
  */
  function editEmployee(employee) {
    /*
      Guarda o funcionário selecionado como funcionário em edição.
    */
    setEditingEmployee(employee);

    /*
      Preenche o campo de nome com o valor atual do funcionário.
    */
    setEmployeeName(employee.employeeName);

    /*
      Preenche o select com o departamento atual.

      O valor é convertido para string porque o select trabalha melhor
      com value em formato de texto.
    */
    setDepartmentId(String(employee.departmentId));

    /*
      Preenche o input de data.

      substring(0, 10) pega apenas a parte yyyy-MM-dd.

      Exemplo:
      "2026-05-26T00:00:00" vira "2026-05-26".
    */
    setDateOfJoining(employee.dateOfJoining.substring(0, 10));

    /*
      Preenche o campo da foto.
      Se não existir valor, usa string vazia.
    */
    setPhotoFileName(employee.photoFileName || '');
  }

  /*
    Cancela a edição.

    Remove o funcionário em edição e limpa todos os campos do formulário.
  */
  function cancelEdit() {
    setEditingEmployee(null);
    clearForm();
  }

  /*
    Limpa todos os campos do formulário.
  */
  function clearForm() {
    setEmployeeName('');
    setDepartmentId('');
    setDateOfJoining('');
    setPhotoFileName('');
  }

  /*
    Exclui um funcionário pelo ID.

    Também usa atualização otimista:
    remove da tela primeiro e depois chama a API.
  */
  async function removeEmployee(id) {
    /*
      Pede confirmação antes de excluir.
    */
    const confirmDelete = confirm('Deseja excluir este funcionário?');

    /*
      Se o usuário cancelar, interrompe a função.
    */
    if (!confirmDelete) {
      return;
    }

    /*
      Guarda o funcionário removido.

      Se a API falhar, esse funcionário será recolocado na tabela.
    */
    const removedEmployee = employees.find((employee) => employee.id === id);

    /*
      Remove o funcionário da tela imediatamente.
    */
    setEmployees((current) =>
      current.filter((employee) => employee.id !== id)
    );

    try {
      /*
        Envia a exclusão para o backend.
      */
      await deleteEmployee(id);
    } catch (error) {
      /*
        Se a exclusão der erro, exibe no console.
      */
      console.error('Erro ao excluir funcionário:', error);

      /*
        Recoloca o funcionário na lista se ele foi encontrado antes da exclusão.
      */
      if (removedEmployee) {
        setEmployees((current) => [...current, removedEmployee]);
      }

      /*
        Mostra mensagem para o usuário.
      */
      alert('Não foi possível excluir o funcionário.');
    }
  }

  /*
    Retorno visual do componente.

    Tudo dentro do return é JSX.
    JSX parece HTML, mas permite usar JavaScript dentro de chaves {}.
  */
  return (
    <section className="page">
      {/* Cabeçalho da página */}
      <div className="page-header">
        <div>
          <p className="eyebrow">Gerenciamento</p>
          <h1>Funcionários</h1>
          <p className="subtitle">
            Cadastre, edite e gerencie os funcionários da empresa.
          </p>
        </div>
      </div>

      {/* Card do formulário de cadastro/edição */}
      <div className="form-card">
        <div>
          {/* Título muda conforme o modo do formulário */}
          <h2>{editingEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}</h2>

          {/* Texto auxiliar muda conforme cadastro ou edição */}
          <p>
            {editingEmployee
              ? 'Atualize o funcionário selecionado.'
              : 'Cadastre um novo funcionário.'}
          </p>
        </div>

        <div className="form-grid">
          {/*
            Campo de nome do funcionário.

            value recebe o estado employeeName.
            onChange atualiza o estado quando o usuário digita.
          */}
          <input
            type="text"
            placeholder="Nome do funcionário"
            value={employeeName}
            onChange={(event) => setEmployeeName(event.target.value)}
          />

          {/*
            Select de departamentos.

            value recebe departmentId.
            onChange atualiza o departamento selecionado.
          */}
          <select
            value={departmentId}
            onChange={(event) => setDepartmentId(event.target.value)}
          >
            <option value="">Selecione o departamento</option>

            {/*
              Percorre a lista de departamentos e cria uma option para cada um.
            */}
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.departmentName}
              </option>
            ))}
          </select>

          {/*
            Campo de data de entrada do funcionário.
          */}
          <input
            type="date"
            value={dateOfJoining}
            onChange={(event) => setDateOfJoining(event.target.value)}
          />

          {/*
            Campo para nome do arquivo da foto.
          */}
          <input
            type="text"
            placeholder="Nome do arquivo da foto"
            value={photoFileName}
            onChange={(event) => setPhotoFileName(event.target.value)}
          />

          {/* Botões do formulário */}
          <div className="buttons">
            {/*
              Botão principal.

              Chama saveEmployee(), que decide entre cadastro e edição.
            */}
            <button type="button" onClick={saveEmployee}>
              {editingEmployee ? 'Atualizar' : 'Adicionar'}
            </button>

            {/*
              Botão Cancelar.

              Só aparece quando existe um funcionário em edição.
            */}
            {editingEmployee && (
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card da tabela de funcionários */}
      <div className="table-card">
        <div className="table-header">
          <h2>Lista de Funcionários</h2>

          {/* Mostra a quantidade de funcionários */}
          <span>{employees.length} item(ns)</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Funcionário</th>
              <th>Departamento</th>
              <th>Data de Entrada</th>
              <th>Foto</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>

          <tbody>
            {/*
              Percorre a lista de funcionários e cria uma linha para cada um.
            */}
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.employeeName}</td>

                {/*
                  Exibe o nome do departamento.

                  Primeiro tenta usar employee.department?.departmentName.
                  Se não existir, busca pelo departmentId.
                */}
                <td>
                  {employee.department?.departmentName ||
                    getDepartmentName(employee.departmentId)}
                </td>

                {/* Exibe a data formatada */}
                <td>{formatDate(employee.dateOfJoining)}</td>

                {/* Exibe o nome do arquivo da foto ou "-" */}
                <td>{employee.photoFileName || '-'}</td>

                {/* Botões de ação da linha */}
                <td className="actions">
                  <button
                    type="button"
                    className="outline"
                    onClick={() => editEmployee(employee)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => removeEmployee(employee.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {/*
              Mensagem exibida quando não há funcionários cadastrados.
            */}
            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  Nenhum funcionário cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}