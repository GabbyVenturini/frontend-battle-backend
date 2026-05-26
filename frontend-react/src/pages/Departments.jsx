/*
  Importa dois Hooks do React.

  useEffect:
  Executa uma ação em determinado momento do ciclo de vida do componente.
  Aqui, usamos para carregar os departamentos quando a tela abre.

  useState:
  Cria estados dentro do componente.
  Estados são variáveis que, quando mudam, fazem a tela renderizar novamente.
*/
import { useEffect, useState } from 'react';

/*
  Importa as funções do service de departamentos.

  Essas funções são responsáveis por conversar com a API .NET:
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
  Componente principal da tela de Departamentos.

  No React, um componente é uma função que retorna JSX,
  que é a estrutura visual parecida com HTML.
*/
export default function Departments() {
  /*
    Estado que guarda a lista de departamentos.

    departments:
    Valor atual da lista.

    setDepartments:
    Função usada para atualizar essa lista.
  */
  const [departments, setDepartments] = useState([]);

  /*
    Estado que guarda o texto digitado no input de nome do departamento.
  */
  const [departmentName, setDepartmentName] = useState('');

  /*
    Estado que guarda o departamento que está sendo editado.

    Quando for null:
    o formulário está em modo de cadastro.

    Quando tiver um objeto:
    o formulário está em modo de edição.
  */
  const [editingDepartment, setEditingDepartment] = useState(null);

  /*
    useEffect executa uma função quando o componente é renderizado.

    O array vazio [] no final significa:
    executar apenas uma vez, quando a tela abrir.

    Aqui, ao abrir a tela de Departamentos, buscamos os dados na API.
  */
  useEffect(() => {
    loadDepartments();
  }, []);

  /*
    Busca a lista de departamentos no backend.

    Essa função chama getDepartments(), que está no service.
    O service faz a requisição GET para a API .NET.
  */
  async function loadDepartments() {
    try {
      /*
        Aguarda a resposta da API.

        data deve ser uma lista de departamentos.
      */
      const data = await getDepartments();

      /*
        Atualiza o estado departments com os dados vindos da API.

        Quando setDepartments é chamado, o React atualiza a tela.
      */
      setDepartments(data);
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

      trim() remove espaços em branco do início e do fim.
    */
    if (!departmentName.trim()) {
      alert('Informe o nome do departamento.');
      return;
    }

    /*
      Se editingDepartment tiver valor, significa que o usuário está editando.
      Então chama a função de atualização.
    */
    if (editingDepartment) {
      await updateDepartmentInstantly();
      return;
    }

    /*
      Se não estiver editando, cria um novo departamento.
    */
    await createDepartmentInstantly();
  }

  /*
    Cria um novo departamento com atualização otimista.

    Atualização otimista significa:
    1. adiciona o item na tela imediatamente;
    2. envia para a API;
    3. se der certo, troca o item temporário pelo item real;
    4. se der erro, remove o item temporário.
  */
  async function createDepartmentInstantly() {
    /*
      Cria um ID temporário negativo.

      Como os IDs reais do banco normalmente são positivos,
      um ID negativo evita conflito visual na tabela.
    */
    const tempId = Date.now() * -1;

    /*
      Objeto temporário que será mostrado na tabela imediatamente.
    */
    const temporaryDepartment = {
      id: tempId,
      departmentName,
    };

    /*
      Objeto enviado para o backend.

      No cadastro, enviamos apenas o departmentName.
      O id será gerado pelo banco de dados.
    */
    const payload = {
      departmentName,
    };

    /*
      Adiciona o departamento temporário na lista atual.

      current representa a lista atual de departamentos.
      [...current, temporaryDepartment] cria uma nova lista
      com todos os departamentos atuais + o novo temporário.
    */
    setDepartments((current) => [...current, temporaryDepartment]);

    /*
      Limpa o input depois de adicionar na tela.
    */
    setDepartmentName('');

    try {
      /*
        Envia o cadastro para o backend.

        A API deve retornar o departamento criado com o ID real.
      */
      const createdDepartment = await createDepartment(payload);

      /*
        Substitui o departamento temporário pelo departamento real
        retornado pela API.

        map percorre a lista:
        - se encontrar o tempId, troca pelo createdDepartment;
        - se não, mantém o item como está.
      */
      setDepartments((current) =>
        current.map((department) =>
          department.id === tempId ? createdDepartment : department
        )
      );
    } catch (error) {
      /*
        Se o cadastro falhar, mostra o erro no console.
      */
      console.error('Erro ao cadastrar departamento:', error);

      /*
        Remove da lista o item temporário que foi colocado na tela.
      */
      setDepartments((current) =>
        current.filter((department) => department.id !== tempId)
      );

      /*
        Informa o usuário que o cadastro falhou.
      */
      alert('Não foi possível cadastrar o departamento.');
    }
  }

  /*
    Atualiza um departamento existente com atualização otimista.

    A tela é atualizada antes da resposta da API.
    Se a API falhar, o valor anterior é restaurado.
  */
  async function updateDepartmentInstantly() {
    /*
      Guarda uma cópia do departamento antes da alteração.

      Essa cópia será usada para desfazer a alteração se a API der erro.
    */
    const previousDepartment = { ...editingDepartment };

    /*
      Monta o departamento atualizado.

      Mantém os dados anteriores e troca apenas o departmentName.
    */
    const updatedDepartment = {
      ...editingDepartment,
      departmentName,
    };

    /*
      Atualiza a lista na tela imediatamente.

      Percorre os departamentos:
      - se o ID for o mesmo do departamento editado, troca pelo atualizado;
      - senão, mantém o item original.
    */
    setDepartments((current) =>
      current.map((department) =>
        department.id === updatedDepartment.id ? updatedDepartment : department
      )
    );

    /*
      Sai do modo de edição e limpa o input.
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
        Reverte a alteração na tela, voltando para o departamento anterior.
      */
      setDepartments((current) =>
        current.map((department) =>
          department.id === previousDepartment.id ? previousDepartment : department
        )
      );

      /*
        Informa o usuário que a atualização falhou.
      */
      alert('Não foi possível atualizar o departamento.');
    }
  }

  /*
    Coloca o formulário em modo de edição.

    Essa função é chamada ao clicar no botão "Editar" da tabela.
  */
  function editDepartment(department) {
    /*
      Guarda o departamento selecionado como departamento em edição.
    */
    setEditingDepartment(department);

    /*
      Preenche o input com o nome atual do departamento.
    */
    setDepartmentName(department.departmentName);
  }

  /*
    Cancela a edição.

    Limpa o departamento em edição e também limpa o input.
  */
  function cancelEdit() {
    setEditingDepartment(null);
    setDepartmentName('');
  }

  /*
    Remove um departamento.

    Também usa atualização otimista:
    remove da tela imediatamente e depois chama a API.
  */
  async function removeDepartment(id) {
    /*
      Pede confirmação antes de excluir.
    */
    const confirmDelete = confirm('Deseja excluir este departamento?');

    /*
      Se o usuário cancelar, interrompe a função.
    */
    if (!confirmDelete) {
      return;
    }

    /*
      Guarda o departamento que será removido.

      Se a API falhar, esse objeto será usado para recolocar o item na tabela.
    */
    const removedDepartment = departments.find((department) => department.id === id);

    /*
      Remove o departamento da tela imediatamente.
    */
    setDepartments((current) =>
      current.filter((department) => department.id !== id)
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
        Recoloca o departamento na lista caso ele tenha sido encontrado antes.
      */
      if (removedDepartment) {
        setDepartments((current) => [...current, removedDepartment]);
      }

      /*
        Informa o usuário que a exclusão falhou.
      */
      alert('Não foi possível excluir o departamento.');
    }
  }

  /*
    Retorno visual do componente.

    Tudo dentro do return é JSX, que é a estrutura de tela do React.
  */
  return (
    <section className="page">
      {/* Cabeçalho da página */}
      <div className="page-header">
        <div>
          <p className="eyebrow">Gerenciamento</p>
          <h1>Departamentos</h1>
          <p className="subtitle">
            Cadastre, edite e gerencie os departamentos da empresa.
          </p>
        </div>
      </div>

      {/* Card do formulário de cadastro/edição */}
      <div className="form-card">
        <div>
          {/* Título muda conforme o modo: cadastro ou edição */}
          <h2>{editingDepartment ? 'Editar Departamento' : 'Adicionar Departamento'}</h2>

          {/* Texto auxiliar também muda conforme o modo */}
          <p>
            {editingDepartment
              ? 'Atualize o departamento selecionado.'
              : 'Cadastre um novo departamento.'}
          </p>
        </div>

        <div className="form-row">
          {/*
            Input controlado pelo estado departmentName.

            value mostra o valor atual.
            onChange atualiza o estado quando o usuário digita.
          */}
          <input
            type="text"
            placeholder="Nome do departamento"
            value={departmentName}
            onChange={(event) => setDepartmentName(event.target.value)}
          />

          {/*
            Botão principal.

            Ao clicar, chama saveDepartment().
            O texto muda entre "Adicionar" e "Atualizar".
          */}
          <button type="button" onClick={saveDepartment}>
            {editingDepartment ? 'Atualizar' : 'Adicionar'}
          </button>

          {/*
            Botão Cancelar.

            Só aparece quando editingDepartment tem valor.
          */}
          {editingDepartment && (
            <button type="button" className="secondary" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Card da tabela de departamentos */}
      <div className="table-card">
        <div className="table-header">
          <h2>Lista de Departamentos</h2>

          {/* Mostra a quantidade de departamentos cadastrados */}
          <span>{departments.length} item(ns)</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Departamento</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>

          <tbody>
            {/*
              Percorre a lista departments e renderiza uma linha para cada item.

              key={department.id} ajuda o React a identificar cada linha.
            */}
            {departments.map((department) => (
              <tr key={department.id}>
                <td>{department.id}</td>
                <td>{department.departmentName}</td>

                <td className="actions">
                  {/*
                    Botão Editar.

                    Envia o departamento atual para editDepartment().
                  */}
                  <button
                    type="button"
                    className="outline"
                    onClick={() => editDepartment(department)}
                  >
                    Editar
                  </button>

                  {/*
                    Botão Excluir.

                    Envia o ID do departamento para removeDepartment().
                  */}
                  <button
                    type="button"
                    className="danger"
                    onClick={() => removeDepartment(department.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {/*
              Mensagem exibida quando a lista está vazia.
            */}
            {departments.length === 0 && (
              <tr>
                <td colSpan="3" className="empty-state">
                  Nenhum departamento cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}