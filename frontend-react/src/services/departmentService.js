/*
  URL base da API de Departamentos.

  Todas as funções deste arquivo usam essa URL para conversar
  com o backend .NET.

  Backend:
  http://localhost:5150

  Endpoint:
  /api/Departments
*/
const API_URL = 'http://localhost:5150/api/Departments';

/*
  Função auxiliar para tratar a resposta da API.

  Ela centraliza a validação das respostas HTTP para evitar repetir
  a mesma lógica em todas as funções.

  Parâmetro:
  response: resposta retornada pelo fetch().
*/
async function handleResponse(response) {
  /*
    response.ok indica se a requisição teve sucesso.

    Ele será true para status HTTP na faixa 200-299, por exemplo:
    - 200 OK
    - 201 Created
    - 204 No Content

    Se for false, significa que a API retornou erro, como:
    - 400 Bad Request
    - 404 Not Found
    - 500 Internal Server Error
  */
  if (!response.ok) {
    /*
      Lança um erro com o status da resposta.

      Esse erro será capturado pelo try/catch nas telas,
      por exemplo em Departments.jsx.
    */
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  /*
    Status 204 significa "No Content".

    Ou seja, a requisição deu certo, mas a API não retornou corpo.
    Isso normalmente acontece em PUT e DELETE.
  */
  if (response.status === 204) {
    return null;
  }

  /*
    Se a resposta tiver conteúdo, converte o corpo da resposta para JSON.

    Exemplo de retorno esperado:
    [
      {
        id: 1,
        departmentName: "TI"
      }
    ]
  */
  return response.json();
}

/*
  Busca todos os departamentos cadastrados.

  Método HTTP:
  GET

  URL chamada:
  http://localhost:5150/api/Departments

  Retorno esperado:
  Lista de departamentos.
*/
export async function getDepartments() {
  /*
    fetch faz a requisição HTTP para a API.

    Como não informamos method, o padrão é GET.
  */
  const response = await fetch(API_URL);

  /*
    Envia a resposta para handleResponse,
    que valida se deu certo e converte para JSON.
  */
  return handleResponse(response);
}

/*
  Cadastra um novo departamento.

  Método HTTP:
  POST

  URL chamada:
  http://localhost:5150/api/Departments

  Parâmetro:
  department: objeto com os dados do departamento.

  Exemplo:
  {
    departmentName: "Financeiro"
  }
*/
export async function createDepartment(department) {
  /*
    Faz a requisição POST para cadastrar um departamento.
  */
  const response = await fetch(API_URL, {
    /*
      Define o método HTTP como POST.
      POST é usado para criar novos registros.
    */
    method: 'POST',

    /*
      Define que o corpo da requisição será enviado em JSON.
    */
    headers: {
      'Content-Type': 'application/json',
    },

    /*
      Converte o objeto JavaScript para string JSON.

      O backend espera receber os dados neste formato:
      {
        "departmentName": "Financeiro"
      }
    */
    body: JSON.stringify(department),
  });

  /*
    Trata a resposta da API.

    Se der certo, retorna o departamento criado.
    Se der erro, lança uma exceção.
  */
  return handleResponse(response);
}

/*
  Atualiza um departamento existente.

  Método HTTP:
  PUT

  URL chamada:
  http://localhost:5150/api/Departments/{id}

  Exemplo:
  http://localhost:5150/api/Departments/1

  Parâmetros:
  id: ID do departamento que será atualizado.
  department: objeto com os dados atualizados.
*/
export async function updateDepartment(id, department) {
  /*
    Faz a requisição PUT para atualizar o departamento.
  */
  const response = await fetch(`${API_URL}/${id}`, {
    /*
      Define o método HTTP como PUT.
      PUT é usado para atualizar registros existentes.
    */
    method: 'PUT',

    /*
      Informa que o corpo da requisição está em JSON.
    */
    headers: {
      'Content-Type': 'application/json',
    },

    /*
      Envia os dados atualizados para o backend.

      Exemplo:
      {
        "id": 1,
        "departmentName": "Recursos Humanos"
      }
    */
    body: JSON.stringify(department),
  });

  /*
    Trata a resposta da API.

    Normalmente, em um PUT bem-sucedido, a API retorna 204 No Content.
  */
  return handleResponse(response);
}

/*
  Exclui um departamento pelo ID.

  Método HTTP:
  DELETE

  URL chamada:
  http://localhost:5150/api/Departments/{id}

  Exemplo:
  http://localhost:5150/api/Departments/1

  Parâmetro:
  id: ID do departamento que será removido.
*/
export async function deleteDepartment(id) {
  /*
    Faz a requisição DELETE para remover o departamento.
  */
  const response = await fetch(`${API_URL}/${id}`, {
    /*
      Define o método HTTP como DELETE.
      DELETE é usado para excluir registros.
    */
    method: 'DELETE',
  });

  /*
    Trata a resposta da API.

    Normalmente, em uma exclusão bem-sucedida,
    a API retorna 204 No Content.
  */
  return handleResponse(response);
}