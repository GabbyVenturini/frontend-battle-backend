/*
  Importa o tipo Routes do Angular Router.

  Routes é usado para definir a lista de rotas da aplicação.
  Cada rota informa qual componente deve ser exibido para determinado caminho da URL.
*/
import { Routes } from '@angular/router';

/*
  Importa o componente da tela de Departamentos.

  Esse componente será carregado quando o usuário acessar:
  /departments
*/
import { Departments } from './pages/departments/departments';

/*
  Importa o componente da tela de Funcionários.

  Esse componente será carregado quando o usuário acessar:
  /employees
*/
import { Employees } from './pages/employees/employees';

/*
  Define as rotas principais da aplicação Angular.

  Essa constante é usada no app.config.ts através de:
  provideRouter(routes)

  Assim, o Angular sabe qual tela abrir de acordo com a URL.
*/
export const routes: Routes = [
  {
    /*
      path: '' representa a rota inicial da aplicação.

      Ou seja, quando o usuário acessar apenas:
      http://localhost:4200

      Sem nenhum caminho depois da porta.
    */
    path: '',

    /*
      redirectTo redireciona automaticamente o usuário para outra rota.

      Neste caso, quando acessar a rota vazia,
      o Angular redireciona para:
      /departments
    */
    redirectTo: 'departments',

    /*
      pathMatch: 'full' significa que o redirecionamento só deve acontecer
      quando o caminho estiver completamente vazio.

      Sem isso, o Angular poderia interpretar parcialmente outras rotas
      e causar redirecionamentos incorretos.
    */
    pathMatch: 'full',
  },
  {
    /*
      Rota da tela de Departamentos.

      Quando o usuário acessar:
      http://localhost:4200/departments

      O Angular vai renderizar o componente Departments
      dentro do <router-outlet>.
    */
    path: 'departments',

    /*
      Componente que será exibido para essa rota.
    */
    component: Departments,
  },
  {
    /*
      Rota da tela de Funcionários.

      Quando o usuário acessar:
      http://localhost:4200/employees

      O Angular vai renderizar o componente Employees
      dentro do <router-outlet>.
    */
    path: 'employees',

    /*
      Componente que será exibido para essa rota.
    */
    component: Employees,
  },
];