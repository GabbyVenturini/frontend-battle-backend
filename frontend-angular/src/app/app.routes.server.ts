/*
  Importa recursos do Angular SSR.

  SSR significa Server-Side Rendering, ou seja,
  renderização do lado do servidor.

  RenderMode:
  Define como uma rota será renderizada.

  ServerRoute:
  Define o tipo/estrutura de uma rota usada no servidor.
*/
import { RenderMode, ServerRoute } from '@angular/ssr';

/*
  Lista de rotas usadas pelo Angular no ambiente de servidor.

  Esse arquivo é usado quando o projeto Angular tem SSR habilitado.
*/
export const serverRoutes: ServerRoute[] = [
  {
    /*
      path: '**' significa "qualquer rota".

      Ou seja, essa configuração vale para todas as rotas da aplicação,
      como:
      - /departments
      - /employees
      - qualquer outra rota criada futuramente.
    */
    path: '**',

    /*
      RenderMode.Prerender indica que as páginas podem ser pré-renderizadas.

      Pré-renderizar significa gerar o HTML da página antes,
      durante o processo de build, em vez de gerar tudo apenas no navegador.

      Isso pode ajudar em:
      - carregamento inicial;
      - SEO;
      - performance em alguns cenários.

      Para o seu projeto de estudo, esse arquivo não interfere diretamente
      no CRUD de Departamentos e Funcionários.
    */
    renderMode: RenderMode.Prerender
  }
];