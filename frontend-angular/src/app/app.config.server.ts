/*
  Importa recursos de configuração do Angular.

  ApplicationConfig:
  Representa a configuração da aplicação Angular.

  mergeApplicationConfig:
  Junta duas configurações diferentes em uma só.
  Neste caso, junta a configuração principal da aplicação com a configuração do servidor.
*/
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';

/*
  Importa recursos de Server-Side Rendering, conhecido como SSR.

  provideServerRendering:
  Ativa a renderização da aplicação pelo servidor.

  withRoutes:
  Permite informar quais rotas serão usadas na renderização do lado do servidor.
*/
import { provideServerRendering, withRoutes } from '@angular/ssr';

/*
  Importa a configuração principal da aplicação.

  Normalmente esse arquivo contém:
  - provideRouter(routes)
  - provideHttpClient()
  - outras configurações globais do Angular
*/
import { appConfig } from './app.config';

/*
  Importa as rotas específicas do servidor.

  Esse arquivo normalmente define como o Angular deve tratar as rotas
  quando a aplicação for renderizada no servidor.
*/
import { serverRoutes } from './app.routes.server';

/*
  Configuração específica para o ambiente de servidor.

  Aqui são adicionados providers usados apenas quando a aplicação
  roda com SSR.
*/
const serverConfig: ApplicationConfig = {
  providers: [
    /*
      Ativa o Server-Side Rendering da aplicação.

      withRoutes(serverRoutes) informa ao Angular quais rotas devem ser
      consideradas no processo de renderização pelo servidor.
    */
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

/*
  Exporta a configuração final da aplicação para o servidor.

  mergeApplicationConfig(appConfig, serverConfig) faz a união de:
  - appConfig: configuração principal da aplicação;
  - serverConfig: configuração específica do servidor.

  O resultado é usado pelo Angular quando a aplicação roda com SSR.
*/
export const config = mergeApplicationConfig(appConfig, serverConfig);