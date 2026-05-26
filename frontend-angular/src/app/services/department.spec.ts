/*
  Importa o TestBed, que é a ferramenta principal do Angular
  para configurar e executar testes unitários.

  Ele cria um ambiente de teste parecido com o ambiente real da aplicação,
  permitindo injetar services, providers e dependências.
*/
import { TestBed } from '@angular/core/testing';

/*
  Importa o provider do HttpClient.

  Como o DepartmentService usa HttpClient para fazer requisições HTTP,
  o teste precisa fornecer essa dependência.
*/
import { provideHttpClient } from '@angular/common/http';

/*
  Importa o service que será testado.

  DepartmentService é a classe responsável por fazer as chamadas HTTP
  para a API de departamentos.
*/
import { DepartmentService } from './departmentService';

/*
  describe cria um grupo de testes.

  Neste caso, todos os testes dentro desse bloco pertencem ao DepartmentService.
*/
describe('DepartmentService', () => {
  /*
    Declara a variável service.

    Ela vai receber uma instância do DepartmentService criada pelo Angular
    dentro do ambiente de teste.
  */
  let service: DepartmentService;

  /*
    beforeEach executa antes de cada teste.

    Isso garante que cada teste comece com um ambiente limpo
    e uma nova instância do service.
  */
  beforeEach(() => {
    /*
      Configura o módulo de teste do Angular.

      providers é onde informamos as dependências necessárias para o teste.
      Aqui usamos provideHttpClient(), porque o DepartmentService depende
      do HttpClient para fazer chamadas para a API.
    */
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ],
    });

    /*
      Injeta o DepartmentService no teste.

      TestBed.inject() pede ao Angular uma instância da classe informada.
      Como DepartmentService tem providedIn: 'root', o Angular sabe criar esse service.
    */
    service = TestBed.inject(DepartmentService);
  });

  /*
    Define um teste específico.

    "should be created" significa:
    "deve ser criado".
  */
  it('should be created', () => {
    /*
      Verifica se o service foi criado corretamente.

      toBeTruthy() passa se service tiver algum valor válido,
      ou seja, se ele não for null, undefined, false, 0 ou string vazia.
    */
    expect(service).toBeTruthy();
  });
});