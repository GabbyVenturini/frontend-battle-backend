<template>
  <!--
    Cabeçalho principal da aplicação.

    Ele aparece em todas as telas, porque fica no App.vue,
    que é o componente base do projeto.
  -->
  <header class="app-header">
    <!--
      Bloco da marca do sistema.

      Contém:
      - ícone com as letras FB;
      - nome do projeto;
      - indicação da versão Vue.
    -->
    <div class="brand">
      <!--
        Ícone visual da aplicação.

        Aqui usamos apenas o texto "FB",
        mas o CSS transforma esse span em um quadrado estilizado.
      -->
      <span class="brand-icon">FB</span>

      <!--
        Bloco com os textos da marca.
      -->
      <div>
        <!-- Nome principal do projeto -->
        <strong>Frontend Battle</strong>

        <!-- Texto secundário indicando que esta versão usa Vue -->
        <small>Versão Vue</small>
      </div>
    </div>

    <!--
      Menu de navegação da aplicação.

      Contém os links para alternar entre as páginas.
    -->
    <nav class="navbar">
      <!--
        RouterLink é o componente de link do Vue Router.

        Ele funciona parecido com uma tag <a>,
        mas troca de página sem recarregar o navegador inteiro.

        Ao clicar, navega para:
        /departments
      -->
      <RouterLink to="/departments">Departamentos</RouterLink>

      <!--
        Link para a página de Funcionários.

        Ao clicar, o Vue Router carrega a rota:
        /employees
      -->
      <RouterLink to="/employees">Funcionários</RouterLink>
    </nav>
  </header>

  <!--
    Área principal da aplicação.

    É aqui que as páginas aparecem conforme a rota atual.
  -->
  <main class="app-main">
    <!--
      RouterView é o espaço onde o Vue Router renderiza
      o componente correspondente à rota acessada.

      Exemplos:
      - Se a URL for /departments, renderiza Departments.vue.
      - Se a URL for /employees, renderiza Employees.vue.
    -->
    <RouterView />
  </main>
</template>