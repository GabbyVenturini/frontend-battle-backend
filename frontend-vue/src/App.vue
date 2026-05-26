<template>
  <header class="app-header">
    <div class="brand">
      <span class="brand-icon">FB</span>

      <div>
        <strong>Frontend Battle</strong>
        <small>Versão Vue</small>
      </div>
    </div>

    <nav class="navbar">
      <RouterLink to="/departments">Departamentos</RouterLink>
      <RouterLink to="/employees">Funcionários</RouterLink>
    </nav>
  </header>

  <main class="app-main">
    <RouterView />
  </main>
</template>