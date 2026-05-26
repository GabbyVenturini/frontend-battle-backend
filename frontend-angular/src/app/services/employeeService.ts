/*
  Injectable permite que esta classe seja usada como um service no Angular.

  Um service é uma classe separada da tela, usada para centralizar regras
  ou chamadas para API. Neste caso, este service cuida das requisições
  relacionadas a funcionários.
*/
import { Injectable } from '@angular/core';

/*
  HttpClient é o recurso do Angular usado para fazer requisições HTTP.

  Ele permite chamar o backend usando métodos como:
  - GET
  - POST
  - PUT
  - DELETE
*/
import { HttpClient } from '@angular/common/http';

/*
  Observable representa uma operação assíncrona.

  Quando fazemos uma chamada HTTP, a resposta não chega imediatamente.
  Por isso, o Angular retorna um Observable, e o componente usa .subscribe()
  para receber a resposta.
*/
import { Observable } from 'rxjs';

/*
  Interface que representa o departamento vinculado ao funcionário.

  No retorno da API, o funcionário pode vir junto com os dados do departamento.
  Exemplo:

  {
    id: 1,
    departmentName: "TI"
  }
*/
export interface EmployeeDepartment {
  /*
    ID do departamento.
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
  Interface que representa um funcionário.

  Essa interface define quais campos um funcionário possui.
  Ela ajuda o TypeScript a validar o código e evitar erros de digitação.
*/
export interface Employee {
  /*
    ID do funcionário.

    Normalmente é gerado automaticamente pelo banco de dados.
  */
  id: number;

  /*
    Nome do funcionário.
  */
  employeeName: string;

  /*
    ID do departamento ao qual o funcionário pertence.

    Esse campo cria o relacionamento entre Employee e Department.
  */
  departmentId: number;

  /*
    Objeto opcional com os dados do departamento.

    O ponto de interrogação (?) significa que esse campo pode existir ou não.

    Ele pode ser:
    - um objeto EmployeeDepartment;
    - null;
    - undefined.
  */
  department?: EmployeeDepartment | null;

  /*
    Data de entrada do funcionário.

    No frontend, trabalhamos com string porque o input type="date"
    também usa formato de texto, geralmente "yyyy-MM-dd".

    Exemplo:
    "2026-05-26"
  */
  dateOfJoining: string;

  /*
    Nome do arquivo da foto do funcionário.

    Neste projeto, estamos salvando apenas o nome do arquivo,
    não fazendo upload real de imagem.
  */
  photoFileName: string;
}

/*
  Decorator que transforma a classe EmployeeService em um service injetável.

  providedIn: 'root' significa que o Angular cria uma única instância
  desse service para toda a aplicação.
*/
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  /*
    URL base da API de funcionários.

    Todas as requisições deste service usam essa rota do backend .NET.
  */
  private readonly apiUrl = 'http://localhost:5150/api/Employees';

  /*
    O constructor injeta o HttpClient neste service.

    Assim podemos usar:
    this.http.get()
    this.http.post()
    this.http.put()
    this.http.delete()
  */
  constructor(private http: HttpClient) {}

  /*
    Busca todos os funcionários cadastrados.

    Método HTTP usado:
    GET http://localhost:5150/api/Employees

    Retorno:
    Observable<Employee[]>

    Ou seja, a API retorna uma lista de funcionários.
  */
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  /*
    Cadastra um novo funcionário.

    Método HTTP usado:
    POST http://localhost:5150/api/Employees

    Parâmetro:
    employee: Partial<Employee>

    Partial<Employee> significa que não é obrigatório enviar todos os campos
    da interface Employee.

    No cadastro, normalmente enviamos:
    {
      employeeName: "Gabrielly",
      departmentId: 1,
      dateOfJoining: "2026-05-26",
      photoFileName: "foto.png"
    }

    O ID não precisa ser enviado, porque será criado pelo banco.

    Retorno:
    Observable<Employee>

    A API retorna o funcionário criado, geralmente já com o ID.
  */
  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  /*
    Atualiza um funcionário existente.

    Método HTTP usado:
    PUT http://localhost:5150/api/Employees/{id}

    Parâmetros:
    id: ID do funcionário que será atualizado.
    employee: objeto com os dados atualizados.

    Exemplo de URL:
    http://localhost:5150/api/Employees/1

    Exemplo de payload:
    {
      id: 1,
      employeeName: "Gabrielly Silva",
      departmentId: 2,
      dateOfJoining: "2026-05-26",
      photoFileName: "foto.png"
    }

    Retorno:
    Observable<void>

    void significa que a API não precisa retornar conteúdo.
    Em atualizações, é comum o backend responder apenas com status 204 No Content.
  */
  updateEmployee(id: number, employee: Partial<Employee>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee);
  }

  /*
    Exclui um funcionário pelo ID.

    Método HTTP usado:
    DELETE http://localhost:5150/api/Employees/{id}

    Exemplo de URL:
    http://localhost:5150/api/Employees/1

    Retorno:
    Observable<void>

    O backend normalmente apenas confirma a exclusão, sem devolver conteúdo.
  */
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}