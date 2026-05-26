/*
  Importa o StrictMode do React.

  StrictMode é uma ferramenta de desenvolvimento que ajuda a encontrar
  possíveis problemas no código.

  Ele não altera o comportamento final da aplicação em produção,
  mas em desenvolvimento pode executar algumas verificações extras.
*/
import { StrictMode } from 'react';

/*
  Importa createRoot do React DOM.

  createRoot é responsável por conectar a aplicação React
  ao HTML principal do projeto.

  Ele informa ao React onde o app deve ser renderizado.
*/
import { createRoot } from 'react-dom/client';

/*
  Importa o BrowserRouter do react-router-dom.

  BrowserRouter habilita o sistema de rotas no React usando a URL do navegador.

  Com ele, a aplicação consegue navegar entre páginas como:
  - /departments
  - /employees

  Sem recarregar a página inteira.
*/
import { BrowserRouter } from 'react-router-dom';

/*
  Importa o componente principal da aplicação.

  O App.jsx contém:
  - cabeçalho;
  - menu;
  - configuração das rotas;
  - páginas de Departamentos e Funcionários.
*/
import App from './App.jsx';

/*
  Importa o CSS global da aplicação.

  Esse arquivo aplica estilos gerais, como:
  - fonte;
  - cores;
  - layout do cabeçalho;
  - formulários;
  - tabelas;
  - botões.
*/
import './index.css';

/*
  Busca no HTML o elemento com id="root".

  No projeto React com Vite, esse elemento normalmente fica no arquivo:
  index.html

  Exemplo:
  <div id="root"></div>

  É dentro desse elemento que toda a aplicação React será renderizada.
*/
createRoot(document.getElementById('root')).render(
  /*
    StrictMode envolve a aplicação para ativar verificações extras
    durante o desenvolvimento.
  */
  <StrictMode>
    {/*
      BrowserRouter envolve o App para permitir navegação entre rotas.

      Ele é necessário para que componentes como:
      - Routes
      - Route
      - NavLink
      - Navigate

      funcionem corretamente dentro do App.jsx.
    */}
    <BrowserRouter>
      {/*
        App é o componente principal renderizado na tela.

        A partir dele, o React carrega o cabeçalho, menu e páginas.
      */}
      <App />
    </BrowserRouter>
  </StrictMode>
);