/*
  ApplicationConfig é o tipo usado pelo Angular para definir
  as configurações globais da aplicação.

  Neste arquivo configuramos recursos que serão usados no app inteiro,
  como rotas e HttpClient.
*/
import { ApplicationConfig } from '@angular/core';

/*
  provideRouter registra o sistema de rotas da aplicação.

  Ele permite navegar entre telas, por exemplo:
  - /departments
  - /employees
*/
import { provideRouter } from '@angular/router';

/*
  provideHttpClient registra o HttpClient na aplicação.

  O HttpClient é usado pelos services para fazer requisições HTTP
  para a API .NET.

  withFetch() configura o HttpClient para usar a API fetch por baixo.
  Isso é recomendado em projetos Angular mais novos, principalmente
  quando o projeto tem suporte a SSR.
*/
import { provideHttpClient, withFetch } from '@angular/common/http';

/*
  Importa a lista de rotas da aplicação.

  Esse arquivo normalmente define qual componente deve abrir
  para cada caminho da URL.
*/
import { routes } from './app.routes';

/*
  Configuração principal da aplicação Angular.

  Os providers registrados aqui ficam disponíveis para o projeto inteiro.
*/
export const appConfig: ApplicationConfig = {
  providers: [
    /*
      Registra as rotas da aplicação.

      Sem isso, o Angular não saberia qual tela carregar quando acessamos:
      http://localhost:4200/departments
      ou
      http://localhost:4200/employees
    */
    provideRouter(routes),

    /*
      Registra o HttpClient para permitir chamadas HTTP.

      Isso é necessário para os services:
      - DepartmentService
      - EmployeeService

      Esses services usam HttpClient para consumir a API:
      http://localhost:5150/api/Departments
      http://localhost:5150/api/Employees
    */
    provideHttpClient(withFetch())
  ]
};