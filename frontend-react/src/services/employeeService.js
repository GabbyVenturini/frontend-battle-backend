/*
  URL base da API de Funcionários.

  Todas as funções deste arquivo usam essa URL para se comunicar
  com o backend .NET.

  Backend:
  http://localhost:5150

  Endpoint:
  /api/Employees
*/
const API_URL = 'http://localhost:5150/api/Employees';

/*
  Função auxiliar para tratar a resposta da API.

  Ela evita repetir a mesma validação em todas as funções
  de GET, POST, PUT e DELETE.

  Parâmetro:
  response: resposta retornada pelo fetch().
*/
async function handleResponse(response) {
  /*
    response.ok indica se a requisição deu certo.

    Ele será true para status HTTP entre 200 e 299, como:
    - 200 OK
    - 201 Created
    - 204 No Content

    Ele será false para erros, como:
    - 400 Bad Request
    - 404 Not Found
    - 500 Internal Server Error
  */
  if (!response.ok) {
    /*
      Lança um erro caso a API retorne falha.

      Esse erro será capturado no try/catch da tela,
      por exemplo em Employees.jsx.
    */
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  /*
    Status 204 significa "No Content".

    Ou seja, a requisição deu certo, mas a API não retornou nenhum corpo.

    Isso costuma acontecer em:
    - PUT
    - DELETE
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
        employeeName: "Maria",
        departmentId: 2,
        department: {
          id: 2,
          departmentName: "TI"
        },
        dateOfJoining: "2026-05-26",
        photoFileName: "maria.png"
      }
    ]
  */
  return response.json();
}

/*
  Busca todos os funcionários cadastrados.

  Método HTTP:
  GET

  URL chamada:
  http://localhost:5150/api/Employees

  Retorno esperado:
  Uma lista de funcionários.
*/
export async function getEmployees() {
  /*
    Faz a requisição HTTP para a API.

    Como não informamos o method, o fetch usa GET por padrão.
  */
  const response = await fetch(API_URL);

  /*
    Valida a resposta e converte para JSON, se houver conteúdo.
  */
  return handleResponse(response);
}

/*
  Cadastra um novo funcionário.

  Método HTTP:
  POST

  URL chamada:
  http://localhost:5150/api/Employees

  Parâmetro:
  employee: objeto com os dados do funcionário.

  Exemplo:
  {
    employeeName: "João",
    departmentId: 1,
    dateOfJoining: "2026-05-26",
    photoFileName: "joao.png"
  }
*/
export async function createEmployee(employee) {
  /*
    Faz a requisição POST para cadastrar um funcionário.
  */
  const response = await fetch(API_URL, {
    /*
      Define o método HTTP como POST.
      POST é usado para criar novos registros.
    */
    method: 'POST',

    /*
      Informa ao backend que o corpo da requisição está em JSON.
    */
    headers: {
      'Content-Type': 'application/json',
    },

    /*
      Converte o objeto JavaScript para texto JSON.

      O fetch não envia objetos diretamente no body.
      Por isso usamos JSON.stringify().
    */
    body: JSON.stringify(employee),
  });

  /*
    Trata a resposta da API.

    Se der certo, normalmente retorna o funcionário criado.
    Se der erro, lança uma exceção.
  */
  return handleResponse(response);
}

/*
  Atualiza um funcionário existente.

  Método HTTP:
  PUT

  URL chamada:
  http://localhost:5150/api/Employees/{id}

  Exemplo:
  http://localhost:5150/api/Employees/1

  Parâmetros:
  id: ID do funcionário que será atualizado.
  employee: objeto com os dados atualizados.
*/
export async function updateEmployee(id, employee) {
  /*
    Faz a requisição PUT para atualizar o funcionário.
  */
  const response = await fetch(`${API_URL}/${id}`, {
    /*
      Define o método HTTP como PUT.
      PUT é usado para atualizar registros existentes.
    */
    method: 'PUT',

    /*
      Informa que os dados enviados estão em JSON.
    */
    headers: {
      'Content-Type': 'application/json',
    },

    /*
      Envia os dados atualizados para o backend.

      Exemplo:
      {
        id: 1,
        employeeName: "João Silva",
        departmentId: 2,
        dateOfJoining: "2026-05-26",
        photoFileName: "joao.png"
      }
    */
    body: JSON.stringify(employee),
  });

  /*
    Trata a resposta da API.

    Em atualizações bem-sucedidas, é comum a API retornar:
    204 No Content
  */
  return handleResponse(response);
}

/*
  Exclui um funcionário pelo ID.

  Método HTTP:
  DELETE

  URL chamada:
  http://localhost:5150/api/Employees/{id}

  Exemplo:
  http://localhost:5150/api/Employees/1

  Parâmetro:
  id: ID do funcionário que será removido.
*/
export async function deleteEmployee(id) {
  /*
    Faz a requisição DELETE para remover o funcionário.
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

    Em exclusões bem-sucedidas, é comum a API retornar:
    204 No Content
  */
  return handleResponse(response);
}