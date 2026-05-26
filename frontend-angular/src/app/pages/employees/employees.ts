/*
  Importa recursos principais do Angular.

  Component:
  Permite transformar uma classe TypeScript em um componente Angular.

  OnInit:
  Interface usada para executar uma ação quando o componente é carregado.

  signal:
  Recurso moderno do Angular para trabalhar com estado reativo.
  Quando um signal muda, a tela consegue reagir melhor à alteração.
*/
import { Component, OnInit, signal } from '@angular/core';

/*
  CommonModule libera recursos comuns no HTML, como:
  - *ngIf
  - *ngFor
  - pipes como date
*/
import { CommonModule } from '@angular/common';

/*
  FormsModule permite usar [(ngModel)] no HTML.

  O ngModel faz ligação entre os campos do formulário
  e as variáveis do TypeScript.
*/
import { FormsModule } from '@angular/forms';

/*
  Importa a interface Employee e o service EmployeeService.

  Employee:
  Define o formato de um funcionário.

  EmployeeService:
  Faz as chamadas HTTP para a API de funcionários.
*/
import { Employee, EmployeeService } from '../../services/employeeService';

/*
  Importa a interface Department e o service DepartmentService.

  Department:
  Define o formato de um departamento.

  DepartmentService:
  Faz as chamadas HTTP para a API de departamentos.
*/
import { Department, DepartmentService } from '../../services/departmentService';

@Component({
  /*
    Nome do seletor do componente.

    Esse componente poderia ser usado em outro HTML assim:
    <app-employees></app-employees>
  */
  selector: 'app-employees',

  /*
    Como este componente é standalone, os módulos necessários
    precisam ser importados diretamente aqui.
  */
  imports: [CommonModule, FormsModule],

  /*
    Arquivo HTML responsável pela estrutura visual da tela.
  */
  templateUrl: './employees.html',

  /*
    Arquivo CSS responsável pelo estilo da tela.
  */
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  /*
    Lista reativa de funcionários.

    Como é um signal, no TypeScript usamos:
    this.employees.set(...)
    this.employees.update(...)
    this.employees()

    No HTML, usamos:
    employees()
  */
  employees = signal<Employee[]>([]);

  /*
    Lista reativa de departamentos.

    Essa lista é usada para preencher o select de departamentos
    no formulário de funcionário.
  */
  departments = signal<Department[]>([]);

  /*
    Guarda o nome digitado no campo "Nome do funcionário".

    Está ligado ao input no HTML por:
    [(ngModel)]="employeeName"
  */
  employeeName = '';

  /*
    Guarda o ID do departamento selecionado no select.

    Começa como null porque nenhum departamento vem selecionado inicialmente.
  */
  departmentId: number | null = null;

  /*
    Guarda a data de entrada do funcionário.

    O input type="date" trabalha com string no formato:
    yyyy-MM-dd
  */
  dateOfJoining = '';

  /*
    Guarda o nome do arquivo da foto.

    Neste projeto, não há upload real de imagem.
    Salvamos apenas o nome do arquivo informado.
  */
  photoFileName = '';

  /*
    Guarda o funcionário que está sendo editado.

    Quando for null:
    o formulário está em modo de cadastro.

    Quando tiver um Employee:
    o formulário está em modo de edição.
  */
  editingEmployee: Employee | null = null;

  /*
    Injeta os services necessários no componente.

    employeeService:
    Usado para buscar, cadastrar, editar e excluir funcionários.

    departmentService:
    Usado para buscar os departamentos e montar o select.
  */
  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  /*
    ngOnInit é executado automaticamente quando o componente abre na tela.

    Aqui carregamos:
    - os departamentos;
    - os funcionários.
  */
  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
  }

  /*
    Busca todos os funcionários cadastrados na API.

    A API chamada fica no EmployeeService:
    GET http://localhost:5150/api/Employees
  */
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      /*
        next executa quando a API responde com sucesso.

        data é a lista de funcionários retornada pelo backend.
      */
      next: (data) => {
        /*
          Atualiza o signal employees com os dados vindos da API.

          Como employees é signal, usamos .set().
        */
        this.employees.set(data);
      },

      /*
        error executa quando a API falha.

        O erro é exibido no console para ajudar na depuração.
      */
      error: (error) => {
        console.error('Erro ao buscar funcionários:', error);
      },
    });
  }

  /*
    Busca todos os departamentos cadastrados na API.

    Essa lista será usada no select do formulário de funcionários.
  */
  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      /*
        Se a API responder corretamente, salva a lista no signal departments.
      */
      next: (data) => {
        this.departments.set(data);
      },

      /*
        Se a API der erro, mostra no console.
      */
      error: (error) => {
        console.error('Erro ao buscar departamentos:', error);
      },
    });
  }

  /*
    Função chamada quando o usuário clica no botão
    "Adicionar" ou "Atualizar".

    Ela decide se deve:
    - cadastrar um novo funcionário;
    - ou atualizar um funcionário existente.
  */
  saveEmployee(): void {
    /*
      Valida se o nome foi preenchido.

      trim() remove espaços em branco no início e no fim.
    */
    if (!this.employeeName.trim()) {
      alert('Informe o nome do funcionário.');
      return;
    }

    /*
      Valida se o usuário selecionou um departamento.
    */
    if (!this.departmentId) {
      alert('Selecione um departamento.');
      return;
    }

    /*
      Valida se a data de entrada foi informada.
    */
    if (!this.dateOfJoining) {
      alert('Informe a data de entrada.');
      return;
    }

    /*
      Se editingEmployee tiver valor, significa que o formulário
      está editando um funcionário existente.
    */
    if (this.editingEmployee) {
      this.updateEmployeeInstantly();
      return;
    }

    /*
      Se não estiver editando, cria um novo funcionário.
    */
    this.createEmployeeInstantly();
  }

  /*
    Cria um funcionário usando atualização otimista.

    Atualização otimista significa:
    1. Mostra o novo funcionário na tela imediatamente.
    2. Envia o cadastro para o backend.
    3. Se o backend salvar, troca o item temporário pelo item real.
    4. Se o backend der erro, remove o item temporário da tela.
  */
  private createEmployeeInstantly(): void {
    /*
      Cria um ID temporário negativo.

      Como os IDs reais do banco geralmente são positivos,
      usar um ID negativo evita conflito.
    */
    const tempId = Date.now() * -1;

    /*
      Objeto enviado para a API.

      Usamos Partial<Employee> porque no cadastro não precisamos
      enviar todos os campos do funcionário.

      O ID, por exemplo, será criado pelo backend.
    */
    const employeePayload: Partial<Employee> = {
      employeeName: this.employeeName,
      departmentId: Number(this.departmentId),
      dateOfJoining: this.dateOfJoining,
      photoFileName: this.photoFileName || '',
    };

    /*
      Funcionário temporário exibido imediatamente na tabela.

      Ele usa o tempId enquanto o backend ainda não retornou
      o ID real do banco.
    */
    const temporaryEmployee: Employee = {
      id: tempId,
      employeeName: this.employeeName,
      departmentId: Number(this.departmentId),
      department: this.getDepartmentById(Number(this.departmentId)),
      dateOfJoining: this.dateOfJoining,
      photoFileName: this.photoFileName || '',
    };

    /*
      Adiciona o funcionário temporário na lista da tela.

      update() recebe a lista atual e retorna uma nova lista.
    */
    this.employees.update((current) => [...current, temporaryEmployee]);

    /*
      Limpa o formulário logo depois de atualizar a tela.
    */
    this.clearForm();

    /*
      Envia o cadastro para o backend.
    */
    this.employeeService.createEmployee(employeePayload).subscribe({
      /*
        Se o backend salvar corretamente, ele retorna o funcionário criado,
        geralmente com o ID real do banco.
      */
      next: (createdEmployee) => {
        /*
          Monta o funcionário final que será exibido na tela.

          Também tenta preencher o objeto department com base no departmentId.
        */
        const employeeToShow: Employee = {
          ...createdEmployee,
          department: this.getDepartmentById(Number(createdEmployee.departmentId)),
          photoFileName: createdEmployee.photoFileName || '',
        };

        /*
          Substitui o funcionário temporário pelo funcionário real
          retornado pela API.
        */
        this.employees.update((current) =>
          current.map((employee) =>
            employee.id === tempId ? employeeToShow : employee
          )
        );
      },

      /*
        Se o backend der erro, desfaz a atualização otimista.
      */
      error: (error) => {
        console.error('Erro ao cadastrar funcionário:', error);

        /*
          Remove da tela o funcionário temporário que tinha sido adicionado.
        */
        this.employees.update((current) =>
          current.filter((employee) => employee.id !== tempId)
        );

        alert('Não foi possível cadastrar o funcionário.');
      },
    });
  }

  /*
    Atualiza um funcionário existente usando atualização otimista.

    A tela é atualizada antes da resposta da API.
    Se a API falhar, a alteração é revertida.
  */
  private updateEmployeeInstantly(): void {
    /*
      Segurança extra:
      se não existir funcionário em edição, interrompe a função.
    */
    if (!this.editingEmployee) {
      return;
    }

    /*
      Guarda uma cópia do funcionário antes da edição.

      Essa cópia será usada para desfazer a alteração
      caso a API retorne erro.
    */
    const previousEmployee: Employee = { ...this.editingEmployee };

    /*
      Monta o funcionário atualizado com os valores atuais do formulário.
    */
    const updatedEmployee: Employee = {
      id: this.editingEmployee.id,
      employeeName: this.employeeName,
      departmentId: Number(this.departmentId),
      department: this.getDepartmentById(Number(this.departmentId)),
      dateOfJoining: this.dateOfJoining,
      photoFileName: this.photoFileName || '',
    };

    /*
      Monta o payload que será enviado para a API.

      Ele contém os campos necessários para atualizar o funcionário.
    */
    const employeePayload: Partial<Employee> = {
      id: updatedEmployee.id,
      employeeName: updatedEmployee.employeeName,
      departmentId: updatedEmployee.departmentId,
      dateOfJoining: updatedEmployee.dateOfJoining,
      photoFileName: updatedEmployee.photoFileName,
    };

    /*
      Atualiza a lista na tela imediatamente.
    */
    this.employees.update((current) =>
      current.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );

    /*
      Sai do modo de edição e limpa o formulário.
    */
    this.cancelEdit();

    /*
      Envia a atualização para o backend.
    */
    this.employeeService.updateEmployee(updatedEmployee.id, employeePayload).subscribe({
      /*
        Se der certo, não precisa fazer nada,
        porque a tela já foi atualizada.
      */
      next: () => {},

      /*
        Se der erro, desfaz a alteração e volta o funcionário anterior.
      */
      error: (error) => {
        console.error('Erro ao atualizar funcionário:', error);

        /*
          Reverte a lista para o funcionário antigo.
        */
        this.employees.update((current) =>
          current.map((employee) =>
            employee.id === previousEmployee.id ? previousEmployee : employee
          )
        );

        alert('Não foi possível atualizar o funcionário.');
      },
    });
  }

  /*
    Coloca o formulário em modo de edição.

    Essa função é chamada quando o usuário clica em "Editar"
    na tabela.
  */
  editEmployee(employee: Employee): void {
    /*
      Guarda o funcionário selecionado como funcionário em edição.
    */
    this.editingEmployee = employee;

    /*
      Preenche o campo de nome com o valor atual do funcionário.
    */
    this.employeeName = employee.employeeName;

    /*
      Preenche o select com o departamento atual do funcionário.
    */
    this.departmentId = employee.departmentId;

    /*
      Preenche o campo de data.

      substring(0, 10) pega apenas a parte yyyy-MM-dd.

      Exemplo:
      "2026-05-26T00:00:00" vira "2026-05-26".
    */
    this.dateOfJoining = employee.dateOfJoining.substring(0, 10);

    /*
      Preenche o campo da foto.
      Se não houver valor, usa string vazia.
    */
    this.photoFileName = employee.photoFileName || '';
  }

  /*
    Cancela a edição atual.

    Também limpa o formulário e volta para o modo de cadastro.
  */
  cancelEdit(): void {
    this.editingEmployee = null;
    this.clearForm();
  }

  /*
    Limpa todos os campos do formulário.
  */
  clearForm(): void {
    this.employeeName = '';
    this.departmentId = null;
    this.dateOfJoining = '';
    this.photoFileName = '';
  }

  /*
    Exclui um funcionário pelo ID.

    Também usa atualização otimista:
    remove da tela primeiro e depois chama a API.
  */
  deleteEmployee(id: number): void {
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
      Guarda o funcionário que será removido.

      Se a API der erro, usamos essa cópia para recolocar
      o funcionário na tabela.
    */
    const employeeToRemove = this.employees().find(
      (employee) => employee.id === id
    );

    /*
      Remove o funcionário da tela imediatamente.
    */
    this.employees.update((current) =>
      current.filter((employee) => employee.id !== id)
    );

    /*
      Envia a exclusão para o backend.
    */
    this.employeeService.deleteEmployee(id).subscribe({
      /*
        Se der certo, não precisa fazer nada,
        porque o item já foi removido da tela.
      */
      next: () => {},

      /*
        Se der erro, recoloca o funcionário na tabela.
      */
      error: (error) => {
        console.error('Erro ao excluir funcionário:', error);

        /*
          Se o funcionário removido foi encontrado,
          adiciona ele novamente na lista.
        */
        if (employeeToRemove) {
          this.employees.update((current) => [...current, employeeToRemove]);
        }

        alert('Não foi possível excluir o funcionário.');
      },
    });
  }

  /*
    Retorna o nome do departamento pelo ID.

    Essa função é usada no HTML quando o objeto employee.department
    não vem preenchido pela API.
  */
  getDepartmentName(departmentId: number): string {
    const department = this.getDepartmentById(departmentId);

    /*
      Se encontrou o departamento, retorna o nome.
      Se não encontrou, retorna "-".
    */
    return department ? department.departmentName : '-';
  }

  /*
    Busca um departamento dentro da lista departments pelo ID.

    departments é um signal, então usamos:
    this.departments()

    Isso retorna a lista atual de departamentos.
  */
  getDepartmentById(departmentId: number): Department | null {
    return (
      this.departments().find((department) => department.id === departmentId) ||
      null
    );
  }
}