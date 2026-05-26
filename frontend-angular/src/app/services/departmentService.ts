/*
  Injectable permite que esta classe seja injetada em outros lugares da aplicação.

  Neste caso, o DepartmentService poderá ser usado dentro de componentes,
  como a tela de Departamentos.
*/
import { Injectable } from '@angular/core';

/*
  HttpClient é o serviço do Angular usado para fazer requisições HTTP.

  Com ele conseguimos chamar a API do backend usando:
  - GET
  - POST
  - PUT
  - DELETE
*/
import { HttpClient } from '@angular/common/http';

/*
  Observable representa uma resposta assíncrona.

  Quando fazemos uma requisição HTTP, a resposta não vem imediatamente.
  O Observable permite "assinar" essa resposta usando .subscribe().
*/
import { Observable } from 'rxjs';

/*
  Interface que representa o formato de um Departamento.

  Essa interface ajuda o TypeScript a entender quais campos um departamento possui.
  Ela também ajuda a evitar erros de digitação no código.
*/
export interface Department {
  /*
    ID do departamento.

    Esse valor normalmente é gerado automaticamente pelo banco de dados.
  */
  id: number;

  /*
    Nome do departamento.

    Exemplo:
    - TI
    - RH
    - Financeiro
  */
  departmentName: string;
}

/*
  Decorator que transforma esta classe em um service injetável no Angular.

  providedIn: 'root' significa que o Angular cria uma única instância desse service
  para toda a aplicação.
*/
@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  /*
    URL base da API de departamentos.

    Todas as funções deste service usam essa URL para conversar com o backend .NET.
  */
  private readonly apiUrl = 'http://localhost:5150/api/Departments';

  /*
    O constructor injeta o HttpClient dentro do service.

    Com isso, conseguimos usar:
    this.http.get()
    this.http.post()
    this.http.put()
    this.http.delete()
  */
  constructor(private http: HttpClient) {}

  /*
    Busca todos os departamentos cadastrados.

    Método HTTP usado:
    GET http://localhost:5150/api/Departments

    Retorno:
    Observable<Department[]>

    Ou seja, a API deve retornar uma lista de departamentos.
  */
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  /*
    Cadastra um novo departamento.

    Método HTTP usado:
    POST http://localhost:5150/api/Departments

    Parâmetro:
    department: Partial<Department>

    Partial<Department> significa que não é obrigatório enviar todos os campos.
    No cadastro, normalmente enviamos apenas o departmentName,
    porque o id será criado automaticamente pelo banco.

    Exemplo de payload enviado:
    {
      departmentName: "TI"
    }

    Retorno:
    Observable<Department>

    A API retorna o departamento criado, geralmente já com o id.
  */
  createDepartment(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  /*
    Atualiza um departamento existente.

    Método HTTP usado:
    PUT http://localhost:5150/api/Departments/{id}

    Parâmetros:
    id: ID do departamento que será atualizado.
    department: objeto completo com os dados atualizados.

    Exemplo de URL:
    http://localhost:5150/api/Departments/1

    Exemplo de payload:
    {
      id: 1,
      departmentName: "Recursos Humanos"
    }

    Retorno:
    Observable<void>

    void significa que a API não precisa retornar conteúdo.
    Normalmente, em atualizações, o backend responde apenas com status 204 No Content.
  */
  updateDepartment(id: number, department: Department): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, department);
  }

  /*
    Exclui um departamento pelo ID.

    Método HTTP usado:
    DELETE http://localhost:5150/api/Departments/{id}

    Exemplo de URL:
    http://localhost:5150/api/Departments/1

    Retorno:
    Observable<void>

    Como na atualização, o backend normalmente não retorna conteúdo,
    apenas confirma que a exclusão foi feita.
  */
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}