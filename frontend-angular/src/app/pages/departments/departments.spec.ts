/*
  Importa as ferramentas de teste do Angular.

  ComponentFixture:
  Representa uma instância do componente criada dentro do ambiente de teste.
  Com ele, conseguimos acessar o componente, o HTML renderizado e disparar detecção de mudanças.

  TestBed:
  É o utilitário principal do Angular para configurar e montar testes.
  Ele simula um módulo de teste onde o componente será criado.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';

/*
  Importa o componente Departments que será testado.

  Este teste verifica se o componente consegue ser criado corretamente.
*/
import { Departments } from './departments';

/*
  describe() cria um grupo de testes.

  Aqui, todos os testes dentro desse bloco são relacionados ao componente Departments.
*/
describe('Departments', () => {
  /*
    Variável que vai guardar a instância real do componente.
    Com ela, podemos acessar propriedades e métodos do Departments.
  */
  let component: Departments;

  /*
    Variável que guarda o "ambiente" do componente no teste.

    O fixture permite:
    - acessar o componente;
    - acessar o HTML renderizado;
    - rodar detecção de mudanças;
    - testar interações da tela.
  */
  let fixture: ComponentFixture<Departments>;

  /*
    beforeEach() roda antes de cada teste.

    Como está com async, ele permite aguardar configurações assíncronas,
    como a compilação do componente.
  */
  beforeEach(async () => {
    /*
      Configura o ambiente de testes do Angular.

      Como Departments é um componente standalone,
      ele entra em imports, e não em declarations.
    */
    await TestBed.configureTestingModule({
      imports: [Departments],
    }).compileComponents();

    /*
      Cria uma instância do componente Departments dentro do ambiente de teste.
    */
    fixture = TestBed.createComponent(Departments);

    /*
      Acessa a instância TypeScript do componente.
      A partir daqui, seria possível chamar métodos como:
      component.loadDepartments()
      component.saveDepartment()
      component.cancelEdit()
    */
    component = fixture.componentInstance;

    /*
      Aguarda o componente estabilizar.

      Isso é útil quando existem tarefas assíncronas pendentes,
      como inicialização, promises ou carregamentos.
    */
    await fixture.whenStable();
  });

  /*
    it() define um teste específico.

    Este teste verifica se o componente foi criado com sucesso.
  */
  it('should create', () => {
    /*
      expect(component).toBeTruthy() verifica se o componente existe.

      Em outras palavras:
      se o Angular conseguiu criar o componente sem erro,
      o teste passa.
    */
    expect(component).toBeTruthy();
  });
});