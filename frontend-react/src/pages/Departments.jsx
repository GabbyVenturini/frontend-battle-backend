import { useEffect, useState } from 'react';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../services/departmentService';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
    }
  }

  async function saveDepartment() {
    if (!departmentName.trim()) {
      alert('Informe o nome do departamento.');
      return;
    }

    if (editingDepartment) {
      await updateDepartmentInstantly();
      return;
    }

    await createDepartmentInstantly();
  }

  async function createDepartmentInstantly() {
    const tempId = Date.now() * -1;

    const temporaryDepartment = {
      id: tempId,
      departmentName,
    };

    const payload = {
      departmentName,
    };

    setDepartments((current) => [...current, temporaryDepartment]);
    setDepartmentName('');

    try {
      const createdDepartment = await createDepartment(payload);

      setDepartments((current) =>
        current.map((department) =>
          department.id === tempId ? createdDepartment : department
        )
      );
    } catch (error) {
      console.error('Erro ao cadastrar departamento:', error);

      setDepartments((current) =>
        current.filter((department) => department.id !== tempId)
      );

      alert('Não foi possível cadastrar o departamento.');
    }
  }

  async function updateDepartmentInstantly() {
    const previousDepartment = { ...editingDepartment };

    const updatedDepartment = {
      ...editingDepartment,
      departmentName,
    };

    setDepartments((current) =>
      current.map((department) =>
        department.id === updatedDepartment.id ? updatedDepartment : department
      )
    );

    cancelEdit();

    try {
      await updateDepartment(updatedDepartment.id, updatedDepartment);
    } catch (error) {
      console.error('Erro ao atualizar departamento:', error);

      setDepartments((current) =>
        current.map((department) =>
          department.id === previousDepartment.id ? previousDepartment : department
        )
      );

      alert('Não foi possível atualizar o departamento.');
    }
  }

  function editDepartment(department) {
    setEditingDepartment(department);
    setDepartmentName(department.departmentName);
  }

  function cancelEdit() {
    setEditingDepartment(null);
    setDepartmentName('');
  }

  async function removeDepartment(id) {
    const confirmDelete = confirm('Deseja excluir este departamento?');

    if (!confirmDelete) {
      return;
    }

    const removedDepartment = departments.find((department) => department.id === id);

    setDepartments((current) =>
      current.filter((department) => department.id !== id)
    );

    try {
      await deleteDepartment(id);
    } catch (error) {
      console.error('Erro ao excluir departamento:', error);

      if (removedDepartment) {
        setDepartments((current) => [...current, removedDepartment]);
      }

      alert('Não foi possível excluir o departamento.');
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Gerenciamento</p>
          <h1>Departamentos</h1>
          <p className="subtitle">
            Cadastre, edite e gerencie os departamentos da empresa.
          </p>
        </div>
      </div>

      <div className="form-card">
        <div>
          <h2>{editingDepartment ? 'Editar Departamento' : 'Adicionar Departamento'}</h2>
          <p>
            {editingDepartment
              ? 'Atualize o departamento selecionado.'
              : 'Cadastre um novo departamento.'}
          </p>
        </div>

        <div className="form-row">
          <input
            type="text"
            placeholder="Nome do departamento"
            value={departmentName}
            onChange={(event) => setDepartmentName(event.target.value)}
          />

          <button type="button" onClick={saveDepartment}>
            {editingDepartment ? 'Atualizar' : 'Adicionar'}
          </button>

          {editingDepartment && (
            <button type="button" className="secondary" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h2>Lista de Departamentos</h2>
          <span>{departments.length} item(ns)</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Departamento</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td>{department.id}</td>
                <td>{department.departmentName}</td>
                <td className="actions">
                  <button
                    type="button"
                    className="outline"
                    onClick={() => editDepartment(department)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => removeDepartment(department.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {departments.length === 0 && (
              <tr>
                <td colSpan="3" className="empty-state">
                  Nenhum departamento cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}