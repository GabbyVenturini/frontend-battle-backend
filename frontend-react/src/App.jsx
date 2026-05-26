/*
  Importa recursos do react-router-dom.

  NavLink:
  Cria links de navegação entre páginas.
  Ele também consegue identificar automaticamente qual link está ativo.

  Navigate:
  Faz redirecionamento automático de uma rota para outra.

  Route:
  Define uma rota individual da aplicação.

  Routes:
  Agrupa todas as rotas da aplicação.
*/
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';

/*
  Importa a página de Departamentos.

  Esse componente será exibido quando o usuário acessar:
  /departments
*/
import Departments from './pages/Departments';

/*
  Importa a página de Funcionários.

  Esse componente será exibido quando o usuário acessar:
  /employees
*/
import Employees from './pages/Employees';

/*
  Componente principal da aplicação React.

  O App funciona como a estrutura base do projeto.
  Nele ficam:
  - o cabeçalho;
  - o menu de navegação;
  - as rotas que carregam as páginas.
*/
export default function App() {
  /*
    O return define o que será renderizado na tela.

    O fragmento <>...</> permite retornar mais de um elemento
    sem criar uma div extra desnecessária.
  */
  return (
    <>
      {/*
        Cabeçalho principal da aplicação.

        Ele aparece em todas as telas, pois fica fora das rotas.
      */}
      <header className="app-header">
        {/*
          Bloco da marca do projeto.

          Contém:
          - o ícone "FB";
          - o nome do projeto;
          - a identificação da versão React.
        */}
        <div className="brand">
          {/*
            Ícone visual da aplicação.

            Aqui é apenas um texto "FB", mas o CSS transforma
            esse span em um quadrado estilizado.
          */}
          <span className="brand-icon">FB</span>

          {/*
            Textos da marca.
          */}
          <div>
            {/*
              Nome principal do projeto.
            */}
            <strong>Frontend Battle</strong>

            {/*
              Texto secundário informando que esta versão foi feita em React.
            */}
            <small>Versão React</small>
          </div>
        </div>

        {/*
          Menu de navegação.

          Contém os links para alternar entre as telas do sistema.
        */}
        <nav className="navbar">
          {/*
            Link para a tela de Departamentos.

            NavLink funciona parecido com uma tag <a>,
            mas sem recarregar a página inteira.

            Quando a rota atual for /departments,
            o NavLink recebe automaticamente a classe "active".
          */}
          <NavLink to="/departments">Departamentos</NavLink>

          {/*
            Link para a tela de Funcionários.

            Ao clicar, o React Router troca a tela para Employees.
          */}
          <NavLink to="/employees">Funcionários</NavLink>
        </nav>
      </header>

      {/*
        Área principal da aplicação.

        É aqui que as páginas são renderizadas conforme a rota atual.
      */}
      <main className="app-main">
        {/*
          Routes agrupa todas as rotas disponíveis no app.

          Dentro dele ficam os Route, que ligam uma URL a um componente.
        */}
        <Routes>
          {/*
            Rota inicial da aplicação.

            Quando o usuário acessar:
            http://localhost:5173/

            Ele será redirecionado automaticamente para:
            http://localhost:5173/departments

            replace evita que a rota "/" fique no histórico do navegador.
          */}
          <Route path="/" element={<Navigate to="/departments" replace />} />

          {/*
            Rota da página de Departamentos.

            Quando a URL for /departments,
            o componente Departments será renderizado.
          */}
          <Route path="/departments" element={<Departments />} />

          {/*
            Rota da página de Funcionários.

            Quando a URL for /employees,
            o componente Employees será renderizado.
          */}
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </main>
    </>
  );
}