/*
  URL base da API de Funcionários.

  Essa constante centraliza o endpoint de funcionários.
  Assim, se a porta ou a rota do backend mudar, basta alterar aqui.
*/
const API_URL = 'http://localhost:5150/api/Employees';

/*
  Função auxiliar para tratar as respostas da API.

  O fetch não lança erro automaticamente quando a API retorna
  status como 400, 404 ou 500.

  Por isso, criamos essa função para verificar se a resposta foi bem-sucedida.
*/
async function handleResponse(response) {
  /*
    response.ok será true quando o status HTTP estiver entre 200 e 299.

    Exemplos de sucesso:
    - 200 OK
    - 201 Created
    - 204 No Content

    Exemplos de erro:
    - 400 Bad Request
    - 404 Not Found
    - 500 Internal Server Error
  */
  if (!response.ok) {
    /*
      Se a resposta não foi bem-sucedida, lançamos um erro.

      Esse erro pode ser capturado no try/catch da tela,
      permitindo mostrar uma mensagem para o usuário.
    */
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  /*
    Status 204 significa "No Content".

    A requisição deu certo, mas a API não retornou dados no corpo da resposta.

    Isso normalmente acontece em:
    - PUT, ao atualizar um funcionário;
    - DELETE, ao excluir um funcionário.
  */
  if (response.status === 204) {
    return null;
  }

  /*
    Se a resposta tiver conteúdo, convertemos o retorno para JSON.

    Isso transforma a resposta da API em objeto ou array JavaScript.
  */
  return response.json();
}

/*
  Busca todos os funcionários cadastrados.

  Método HTTP:
  GET

  Endpoint chamado:
  http://localhost:5150/api/Employees

  Retorno esperado:
  Uma lista de funcionários.
*/
export async function getEmployees() {
  /*
    Executa a requisição para a API.

    Como não informamos o method, o fetch usa GET por padrão.
  */
  const response = await fetch(API_URL);

  /*
    Envia a resposta para a função auxiliar.

    Ela valida o status e converte para JSON quando houver conteúdo.
  */
  return handleResponse(response);
}

/*
  Cadastra um novo funcionário.

  Método HTTP:
  POST

  Endpoint chamado:
  http://localhost:5150/api/Employees

  Parâmetro:
  employee = objeto com os dados do funcionário.

  Exemplo de objeto enviado:
  {
    employeeName: "Maria",
    departmentId: 1,
    dateOfJoining: "2026-05-26",
    photoFileName: "maria.png"
  }
*/
export async function createEmployee(employee) {
  /*
    Executa a requisição POST para criar um funcionário.
  */
  const response = await fetch(API_URL, {
    /*
      Define o método HTTP como POST.

      POST é usado para criar novos registros no backend.
    */
    method: 'POST',

    /*
      Informa para a API que o corpo da requisição será enviado em JSON.
    */
    headers: {
      'Content-Type': 'application/json',
    },

    /*
      Converte o objeto JavaScript para texto JSON.

      O fetch não envia objetos diretamente.
      Por isso usamos JSON.stringify().
    */
    body: JSON.stringify(employee),
  });

  /*
    Trata a resposta da API.

    Se der certo, normalmente retorna o funcionário criado com ID.
    Se der erro, lança uma exceção.
  */
  return handleResponse(response);
}

/*
  Atualiza um funcionário existente.

  Método HTTP:
  PUT

  Endpoint chamado:
  http://localhost:5150/api/Employees/{id}

  Exemplo:
  http://localhost:5150/api/Employees/1

  Parâmetros:
  id = ID do funcionário que será atualizado.
  employee = objeto com os dados atualizados.
*/
export async function updateEmployee(id, employee) {
  /*
    Executa a requisição PUT para atualizar o funcionário.
  */
  const response = await fetch(`${API_URL}/${id}`, {
    /*
      Define o método HTTP como PUT.

      PUT é usado para atualizar registros existentes.
    */
    method: 'PUT',

    /*
      Informa que os dados enviados estão em formato JSON.
    */
    headers: {
      'Content-Type': 'application/json',
    },

    /*
      Envia o funcionário atualizado no corpo da requisição.

      Exemplo:
      {
        id: 1,
        employeeName: "Maria Silva",
        departmentId: 2,
        dateOfJoining: "2026-05-26",
        photoFileName: "maria.png"
      }
    */
    body: JSON.stringify(employee),
  });

  /*
    Trata a resposta da API.

    Em atualizações bem-sucedidas, o backend normalmente retorna:
    204 No Content
  */
  return handleResponse(response);
}

/*
  Exclui um funcionário pelo ID.

  Método HTTP:
  DELETE

  Endpoint chamado:
  http://localhost:5150/api/Employees/{id}

  Exemplo:
  http://localhost:5150/api/Employees/1

  Parâmetro:
  id = ID do funcionário que será excluído.
*/
export async function deleteEmployee(id) {
  /*
    Executa a requisição DELETE para remover o funcionário.
  */
  const response = await fetch(`${API_URL}/${id}`, {
    /*
      Define o método HTTP como DELETE.

      DELETE é usado para excluir registros no backend.
    */
    method: 'DELETE',
  });

  /*
    Trata a resposta da API.

    Em exclusões bem-sucedidas, o backend normalmente retorna:
    204 No Content
  */
  return handleResponse(response);
}