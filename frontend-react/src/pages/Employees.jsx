import { useEffect, useState } from 'react';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../services/employeeService';
import { getDepartments } from '../services/departmentService';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [employeeName, setEmployeeName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');

  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    }
  }

  async function loadDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
    }
  }

  function getDepartmentById(id) {
    return departments.find((department) => department.id === Number(id)) || null;
  }

  function getDepartmentName(id) {
    const department = getDepartmentById(id);
    return department ? department.departmentName : '-';
  }

  function formatDate(date) {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('pt-BR');
  }

  async function saveEmployee() {
    if (!employeeName.trim()) {
      alert('Informe o nome do funcionário.');
      return;
    }

    if (!departmentId) {
      alert('Selecione um departamento.');
      return;
    }

    if (!dateOfJoining) {
      alert('Informe a data de entrada.');
      return;
    }

    if (editingEmployee) {
      await updateEmployeeInstantly();
      return;
    }

    await createEmployeeInstantly();
  }

  async function createEmployeeInstantly() {
    const tempId = Date.now() * -1;

    const employeePayload = {
      employeeName,
      departmentId: Number(departmentId),
      dateOfJoining,
      photoFileName: photoFileName || '',
    };

    const temporaryEmployee = {
      id: tempId,
      employeeName,
      departmentId: Number(departmentId),
      department: getDepartmentById(departmentId),
      dateOfJoining,
      photoFileName: photoFileName || '',
    };

    setEmployees((current) => [...current, temporaryEmployee]);
    clearForm();

    try {
      const createdEmployee = await createEmployee(employeePayload);

      const employeeToShow = {
        ...createdEmployee,
        department: getDepartmentById(createdEmployee.departmentId),
        photoFileName: createdEmployee.photoFileName || '',
      };

      setEmployees((current) =>
        current.map((employee) =>
          employee.id === tempId ? employeeToShow : employee
        )
      );
    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error);

      setEmployees((current) =>
        current.filter((employee) => employee.id !== tempId)
      );

      alert('Não foi possível cadastrar o funcionário.');
    }
  }

  async function updateEmployeeInstantly() {
    const previousEmployee = { ...editingEmployee };

    const updatedEmployee = {
      id: editingEmployee.id,
      employeeName,
      departmentId: Number(departmentId),
      department: getDepartmentById(departmentId),
      dateOfJoining,
      photoFileName: photoFileName || '',
    };

    const employeePayload = {
      id: updatedEmployee.id,
      employeeName: updatedEmployee.employeeName,
      departmentId: updatedEmployee.departmentId,
      dateOfJoining: updatedEmployee.dateOfJoining,
      photoFileName: updatedEmployee.photoFileName,
    };

    setEmployees((current) =>
      current.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );

    cancelEdit();

    try {
      await updateEmployee(updatedEmployee.id, employeePayload);
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);

      setEmployees((current) =>
        current.map((employee) =>
          employee.id === previousEmployee.id ? previousEmployee : employee
        )
      );

      alert('Não foi possível atualizar o funcionário.');
    }
  }

  function editEmployee(employee) {
    setEditingEmployee(employee);
    setEmployeeName(employee.employeeName);
    setDepartmentId(String(employee.departmentId));
    setDateOfJoining(employee.dateOfJoining.substring(0, 10));
    setPhotoFileName(employee.photoFileName || '');
  }

  function cancelEdit() {
    setEditingEmployee(null);
    clearForm();
  }

  function clearForm() {
    setEmployeeName('');
    setDepartmentId('');
    setDateOfJoining('');
    setPhotoFileName('');
  }

  async function removeEmployee(id) {
    const confirmDelete = confirm('Deseja excluir este funcionário?');

    if (!confirmDelete) {
      return;
    }

    const removedEmployee = employees.find((employee) => employee.id === id);

    setEmployees((current) =>
      current.filter((employee) => employee.id !== id)
    );

    try {
      await deleteEmployee(id);
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);

      if (removedEmployee) {
        setEmployees((current) => [...current, removedEmployee]);
      }

      alert('Não foi possível excluir o funcionário.');
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Gerenciamento</p>
          <h1>Funcionários</h1>
          <p className="subtitle">
            Cadastre, edite e gerencie os funcionários da empresa.
          </p>
        </div>
      </div>

      <div className="form-card">
        <div>
          <h2>{editingEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}</h2>
          <p>
            {editingEmployee
              ? 'Atualize o funcionário selecionado.'
              : 'Cadastre um novo funcionário.'}
          </p>
        </div>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Nome do funcionário"
            value={employeeName}
            onChange={(event) => setEmployeeName(event.target.value)}
          />

          <select
            value={departmentId}
            onChange={(event) => setDepartmentId(event.target.value)}
          >
            <option value="">Selecione o departamento</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.departmentName}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateOfJoining}
            onChange={(event) => setDateOfJoining(event.target.value)}
          />

          <input
            type="text"
            placeholder="Nome do arquivo da foto"
            value={photoFileName}
            onChange={(event) => setPhotoFileName(event.target.value)}
          />

          <div className="buttons">
            <button type="button" onClick={saveEmployee}>
              {editingEmployee ? 'Atualizar' : 'Adicionar'}
            </button>

            {editingEmployee && (
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h2>Lista de Funcionários</h2>
          <span>{employees.length} item(ns)</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Funcionário</th>
              <th>Departamento</th>
              <th>Data de Entrada</th>
              <th>Foto</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.employeeName}</td>
                <td>
                  {employee.department?.departmentName ||
                    getDepartmentName(employee.departmentId)}
                </td>
                <td>{formatDate(employee.dateOfJoining)}</td>
                <td>{employee.photoFileName || '-'}</td>
                <td className="actions">
                  <button
                    type="button"
                    className="outline"
                    onClick={() => editEmployee(employee)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => removeEmployee(employee.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  Nenhum funcionário cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}