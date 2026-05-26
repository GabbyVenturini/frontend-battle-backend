const API_URL = 'http://localhost:5150/api/Employees';

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getEmployees() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

export async function createEmployee(employee) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employee),
  });

  return handleResponse(response);
}

export async function updateEmployee(id, employee) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employee),
  });

  return handleResponse(response);
}

export async function deleteEmployee(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
}