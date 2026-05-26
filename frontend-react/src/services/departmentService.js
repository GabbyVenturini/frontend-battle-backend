const API_URL = 'http://localhost:5150/api/Departments';

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getDepartments() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

export async function createDepartment(department) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(department),
  });

  return handleResponse(response);
}

export async function updateDepartment(id, department) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(department),
  });

  return handleResponse(response);
}

export async function deleteDepartment(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
}