export const fetchLogin = async (formData) => {
  const response = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  return { data, status: response.status };
};

export const fetchFiles = async (userId) => {
  const response = await fetch(`http://localhost:5000/storage/${userId}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
 
  return response.json();
};

export const fetchDeleteFile = async (fileId) => {
  const response = await fetch(`http://localhost:5000/storage/${fileId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete file with ID ${fileId}: ${response.statusText}`);
  }

  return response.json();
};

export const fetchUsers = async (userId) => {
  const response = await fetch(`http://localhost:5000/dashboard/${userId}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
 
  return response.json();
};

export const fetchRegister = async (formData) => {
  const response = await fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  return { data, status: response.status };
};