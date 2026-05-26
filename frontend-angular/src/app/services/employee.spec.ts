/*
  Importa o TestBed, que é a ferramenta principal do Angular
  para configurar o ambiente de testes unitários.

  Ele permite criar um ambiente parecido com a aplicação real,
  onde conseguimos injetar services e dependências.
*/
import { TestBed } from '@angular/core/testing';

/*
  Importa o provider do HttpClient.

  O EmployeeService usa HttpClient para fazer requisições HTTP
  para a API de funcionários.

  Por isso, o teste precisa fornecer o HttpClient.
*/
import { provideHttpClient } from '@angular/common/http';

/*
  Importa o service que será testado.

  EmployeeService é responsável por chamar a API de funcionários:
  - buscar funcionários
  - cadastrar funcionário
  - atualizar funcionário
  - excluir funcionário
*/
import { EmployeeService } from './employeeService';

/*
  describe cria um grupo de testes.

  Aqui, todos os testes dentro desse bloco pertencem ao EmployeeService.
*/
describe('EmployeeService', () => {
  /*
    Variável que vai guardar a instância do EmployeeService.

    Essa instância será criada pelo Angular dentro do ambiente de teste.
  */
  let service: EmployeeService;

  /*
    beforeEach executa antes de cada teste.

    Ele configura o ambiente e cria uma nova instância do service
    para garantir que cada teste comece limpo.
  */
  beforeEach(() => {
    /*
      Configura o módulo de teste do Angular.

      Em providers, informamos as dependências necessárias para o teste.

      provideHttpClient() é necessário porque o EmployeeService depende
      do HttpClient para fazer chamadas HTTP.
    */
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ],
    });

    /*
      Injeta o EmployeeService no teste.

      TestBed.inject() pede ao Angular para criar ou recuperar
      uma instância da classe informada.
    */
    service = TestBed.inject(EmployeeService);
  });

  /*
    Teste básico para verificar se o service foi criado corretamente.
  */
  it('should be created', () => {
    /*
      Verifica se a variável service contém uma instância válida.

      Se o Angular conseguiu criar o EmployeeService sem erro,
      esse teste passa.
    */
    expect(service).toBeTruthy();
  });
});