/*
  Importa as ferramentas de teste do Angular.

  ComponentFixture:
  Representa uma instância do componente criada no ambiente de teste.
  Com ele é possível acessar o componente, o HTML renderizado e executar detecção de mudanças.

  TestBed:
  É o recurso principal para configurar testes no Angular.
  Ele cria um ambiente parecido com o da aplicação real.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';

/*
  Importa o provider do HttpClient.

  O componente Employees usa services:
  - EmployeeService
  - DepartmentService

  Esses services usam HttpClient para chamar a API.
  Por isso, o teste precisa registrar o HttpClient.
*/
import { provideHttpClient } from '@angular/common/http';

/*
  Importa o componente Employees que será testado.

  Este componente representa a tela de Funcionários.
*/
import { Employees } from './employees';

/*
  describe() cria um grupo de testes.

  Aqui, todos os testes dentro desse bloco estão relacionados
  ao componente Employees.
*/
describe('Employees', () => {
  /*
    Guarda a instância TypeScript do componente.

    Com essa variável, podemos acessar propriedades e métodos do componente,
    por exemplo:
    component.employeeName
    component.saveEmployee()
    component.loadEmployees()
  */
  let component: Employees;

  /*
    Guarda o ambiente de teste do componente.

    O fixture permite:
    - acessar o componente;
    - acessar o HTML;
    - executar detecção de mudanças;
    - testar interações futuras.
  */
  let fixture: ComponentFixture<Employees>;

  /*
    beforeEach() executa antes de cada teste.

    Como ele está com async, conseguimos usar await para esperar
    a compilação do componente.
  */
  beforeEach(async () => {
    /*
      Configura o módulo de teste do Angular.

      imports:
      Como Employees é um componente standalone, ele entra em imports,
      e não em declarations.

      providers:
      provideHttpClient() registra o HttpClient necessário para os services
      usados dentro do componente.
    */
    await TestBed.configureTestingModule({
      imports: [Employees],
      providers: [
        provideHttpClient()
      ],
    }).compileComponents();

    /*
      Cria uma instância do componente Employees dentro do ambiente de teste.
    */
    fixture = TestBed.createComponent(Employees);

    /*
      Acessa a instância TypeScript do componente.
    */
    component = fixture.componentInstance;

    /*
      Aguarda o componente estabilizar.

      Isso é útil quando existem operações assíncronas pendentes.
      Neste teste básico, usamos apenas para garantir que o componente
      esteja pronto antes da validação.
    */
    await fixture.whenStable();
  });

  /*
    Teste básico para verificar se o componente foi criado corretamente.
  */
  it('should create', () => {
    /*
      Verifica se o componente existe.

      Se o Angular conseguiu criar o componente sem erro,
      component será um valor válido e o teste passa.
    */
    expect(component).toBeTruthy();
  });
});