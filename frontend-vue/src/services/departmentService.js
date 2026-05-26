/*
  URL base da API de Departamentos.

  Essa constante centraliza o endereço do endpoint.
  Assim, se a URL do backend mudar, basta alterar em um único lugar.
*/
const API_URL = 'http://localhost:5150/api/Departments';

/*
  Função auxiliar responsável por tratar a resposta da API.

  O fetch sempre retorna uma resposta HTTP, mesmo quando a requisição falha.
  Por isso, precisamos verificar manualmente se a resposta foi bem-sucedida.
*/
async function handleResponse(response) {
  /*
    response.ok será true quando o status HTTP estiver entre 200 e 299.

    Exemplos de sucesso:
    200 OK
    201 Created
    204 No Content

    Exemplos de erro:
    400 Bad Request
    404 Not Found
    500 Internal Server Error
  */
  if (!response.ok) {
    /*
      Se a resposta não foi bem-sucedida, lançamos um erro.

      Esse erro será capturado pelo try/catch da tela,
      permitindo exibir uma mensagem para o usuário.
    */
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  /*
    Status 204 significa que a requisição deu certo,
    mas a API não retornou nenhum conteúdo.

    Isso normalmente acontece em operações de:
    - atualização;
    - exclusão.
  */
  if (response.status === 204) {
    return null;
  }

  /*
    Se a resposta tiver conteúdo, convertemos o retorno para JSON.

    Isso transforma a resposta da API em um objeto ou array JavaScript.
  */
  return response.json();
}

/*
  Busca todos os departamentos cadastrados.

  Método HTTP:
  GET

  Endpoint chamado:
  http://localhost:5150/api/Departments
*/
export async function getDepartments() {
  /*
    Executa a requisição para a API.

    Como não foi informado nenhum método, o fetch usa GET por padrão.
  */
  const response = await fetch(API_URL);

  /*
    Envia a resposta para a função auxiliar,
    que valida o status e converte o retorno para JSON.
  */
  return handleResponse(response);
}

/*
  Cadastra um novo departamento.

  Método HTTP:
  POST

  Parâmetro:
  department = objeto com os dados do departamento.

  Exemplo:
  {
    departmentName: "Financeiro"
  }
*/
export async function createDepartment(department) {
  /*
    Executa a requisição POST para criar um novo departamento.
  */
  const response = await fetch(API_URL, {
    /*
      Define que a requisição será do tipo POST.
      POST é usado para criar novos registros.
    */
    method: 'POST',

    /*
      Informa para a API que o conteúdo enviado está no formato JSON.
    */
    headers: {
      'Content-Type': 'application/json',
    },

    /*
      Converte o objeto JavaScript para JSON em formato de texto.

      O backend não recebe objetos JavaScript diretamente,
      ele recebe texto JSON no corpo da requisição.
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

  Endpoint chamado:
  http://localhost:5150/api/Departments/{id}

  Parâmetros:
  id = ID do departamento que será atualizado.
  department = objeto com os dados atualizados.
*/
export async function updateDepartment(id, department) {
  /*
    Executa a requisição PUT para atualizar o departamento.
  */
  const response = await fetch(`${API_URL}/${id}`, {
    /*
      Define o método HTTP como PUT.
      PUT é usado para atualizar registros existentes.
    */
    method: 'PUT',

    /*
      Informa que os dados enviados estão no formato JSON.
    */
    headers: {
      'Content-Type': 'application/json',
    },

    /*
      Envia o departamento atualizado no corpo da requisição.

      Exemplo:
      {
        id: 1,
        departmentName: "Recursos Humanos"
      }
    */
    body: JSON.stringify(department),
  });

  /*
    Trata a resposta da API.

    Em uma atualização bem-sucedida, o backend normalmente retorna:
    204 No Content
  */
  return handleResponse(response);
}

/*
  Exclui um departamento pelo ID.

  Método HTTP:
  DELETE

  Endpoint chamado:
  http://localhost:5150/api/Departments/{id}

  Parâmetro:
  id = ID do departamento que será excluído.
*/
export async function deleteDepartment(id) {
  /*
    Executa a requisição DELETE para excluir o departamento.
  */
  const response = await fetch(`${API_URL}/${id}`, {
    /*
      Define o método HTTP como DELETE.
      DELETE é usado para remover registros.
    */
    method: 'DELETE',
  });

  /*
    Trata a resposta da API.

    Em uma exclusão bem-sucedida, o backend normalmente retorna:
    204 No Content
  */
  return handleResponse(response);
}