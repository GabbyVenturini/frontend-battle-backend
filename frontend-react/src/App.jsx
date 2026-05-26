import { NavLink, Navigate, Route, Routes } from 'react-router-dom';

import Departments from './pages/Departments';
import Employees from './pages/Employees';

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">FB</span>

          <div>
            <strong>Frontend Battle</strong>
            <small>Versão React</small>
          </div>
        </div>

        <nav className="navbar">
          <NavLink to="/departments">Departamentos</NavLink>
          <NavLink to="/employees">Funcionários</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/departments" replace />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </main>
    </>
  );
}