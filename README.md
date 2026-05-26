# Frontend Battle

Projeto de estudo desenvolvido para comparar a implementação de uma mesma aplicação frontend usando três frameworks diferentes: **Angular**, **React** e **Vue**.

A aplicação consome uma mesma API backend feita em **.NET 8 Web API**, permitindo cadastrar, listar, editar e excluir **departamentos** e **funcionários**.

---

## Objetivo do Projeto

A ideia do projeto é praticar o desenvolvimento frontend criando a mesma aplicação em três tecnologias diferentes:

- Angular
- React
- Vue

Todas as versões do frontend consomem o mesmo backend, utilizando os mesmos endpoints da API.

Esse projeto foi criado com foco em estudo, comparação de estrutura, organização de código, componentização, consumo de API e funcionamento de CRUD.

---

## Tecnologias Utilizadas

### Backend

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- Swagger
- CORS

### Frontend

- Angular
- React
- Vue
- JavaScript / TypeScript
- HTML
- CSS
- Fetch API
- Angular HttpClient
- Vue Router
- React Router DOM

---

## Estrutura Geral do Projeto

```txt
frontend-battle-backend/
│
├── backend/
│   ├── Controllers/
│   │   ├── DepartmentsController.cs
│   │   └── EmployeesController.cs
│   │
│   ├── Data/
│   │   └── AppDbContext.cs
│   │
│   ├── Models/
│   │   ├── Department.cs
│   │   └── Employee.cs
│   │
│   ├── Program.cs
│   ├── appsettings.json
│   └── FrontendBattle.Api.csproj
│
├── frontend-angular/
│   └── src/
│       └── app/
│           ├── pages/
│           │   ├── departments/
│           │   └── employees/
│           │
│           ├── services/
│           │   ├── departmentService.ts
│           │   └── employeeService.ts
│           │
│           ├── app.config.ts
│           ├── app.routes.ts
│           └── app.html
│
├── frontend-react/
│   └── src/
│       ├── pages/
│       │   ├── Departments.jsx
│       │   └── Employees.jsx
│       │
│       ├── services/
│       │   ├── departmentService.js
│       │   └── employeeService.js
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── frontend-vue/
│   └── src/
│       ├── pages/
│       │   ├── Departments.vue
│       │   └── Employees.vue
│       │
│       ├── services/
│       │   ├── departmentService.js
│       │   └── employeeService.js
│       │
│       ├── App.vue
│       ├── main.js
│       └── style.css
│
├── .gitignore
└── README.md