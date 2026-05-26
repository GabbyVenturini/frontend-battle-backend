/*
  Importa a função createApp do Vue.

  createApp é responsável por criar a aplicação Vue
  a partir do componente principal App.vue.
*/
import { createApp } from 'vue';

/*
  Importa recursos do Vue Router.

  createRouter:
  Cria o sistema de rotas da aplicação.

  createWebHistory:
  Configura o roteamento usando o histórico do navegador.
  Com isso, as URLs ficam limpas, por exemplo:
  /departments
  /employees
*/
import { createRouter, createWebHistory } from 'vue-router';

/*
  Importa o componente principal da aplicação.

  App.vue funciona como o layout base do projeto.
  Nele normalmente ficam:
  - cabeçalho;
  - menu;
  - router-view, onde as páginas são carregadas.
*/
import App from './App.vue';

/*
  Importa a página de Departamentos.

  Essa página será exibida quando o usuário acessar:
  /departments
*/
import Departments from './pages/Departments.vue';

/*
  Importa a página de Funcionários.

  Essa página será exibida quando o usuário acessar:
  /employees
*/
import Employees from './pages/Employees.vue';

/*
  Importa o CSS global da aplicação.

  Esse arquivo pode conter estilos gerais para:
  - body;
  - cabeçalho;
  - menu;
  - formulários;
  - tabelas;
  - botões.
*/
import './style.css';

/*
  Lista de rotas da aplicação Vue.

  Cada objeto dentro do array representa uma rota.
  Uma rota liga um caminho da URL a um componente.
*/
const routes = [
  {
    /*
      Rota inicial da aplicação.

      Quando o usuário acessar:
      http://localhost:5174/

      Ele será redirecionado automaticamente para:
      http://localhost:5174/departments
    */
    path: '/',

    /*
      Define para qual rota o usuário será enviado.
    */
    redirect: '/departments',
  },
  {
    /*
      Rota da tela de Departamentos.

      Quando o usuário acessar:
      http://localhost:5174/departments

      O Vue Router vai renderizar o componente Departments.
    */
    path: '/departments',

    /*
      Componente que será exibido nessa rota.
    */
    component: Departments,
  },
  {
    /*
      Rota da tela de Funcionários.

      Quando o usuário acessar:
      http://localhost:5174/employees

      O Vue Router vai renderizar o componente Employees.
    */
    path: '/employees',

    /*
      Componente que será exibido nessa rota.
    */
    component: Employees,
  },
];

/*
  Cria a instância do roteador da aplicação.

  O router é o responsável por controlar a navegação
  entre as páginas sem recarregar o navegador.
*/
const router = createRouter({
  /*
    Define o modo de histórico da navegação.

    createWebHistory() usa URLs normais do navegador,
    sem hash (#).

    Exemplo:
    /departments

    Em vez de:
    /#/departments
  */
  history: createWebHistory(),

  /*
    Informa ao Vue Router quais rotas existem na aplicação.
  */
  routes,
});

/*
  Cria a aplicação Vue usando o componente principal App.

  Depois:
  .use(router) registra o Vue Router na aplicação.
  .mount('#app') renderiza a aplicação dentro do elemento HTML com id="app".

  Esse elemento normalmente fica no arquivo index.html:

  <div id="app"></div>
*/
createApp(App).use(router).mount('#app');