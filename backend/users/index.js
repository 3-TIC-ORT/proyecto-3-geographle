import fs from "fs";

let users = [];

function loadUsers() {
  if (fs.existsSync('backend/data/users.json')) {
    let data = fs.readFileSync('backend/data/users.json', 'utf8');
    users = JSON.parse(data);
  } else {
    console.log('users.json not found, starting with empty user list');
  }
}

function saveUsers() {
  if (fs.existsSync('backend/data/users.json')) {
    fs.writeFileSync('backend/data/users.json', JSON.stringify(users, null, 2));
  } else {
    console.error('Error: users.json no existe. Creando el archivo...');
    fs.writeFileSync('backend/data/users.json', JSON.stringify(users, null, 2));
  }
}

function isValidUsername(username) {
  return /^[a-zA-Z0-9]+$/.test(username);
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8 && /\d/.test(password);
}

export function registerUser(data) {
  console.log(data)
  let { username, password } = data;

  if (!isValidUsername(username)) {
    return { success: false, message: 'El nombre de usuario solo puede contener letras y números' };
  }

  if (!isValidPassword(password)) {
    return { success: false, message: 'La contraseña debe tener al menos 8 caracteres y contener al menos un número' };
  }

    if (users.some(user => user.username === username)) {
      return { success: false, message: 'El nombre de usuario ya existe' };
    }

  users.push({ username, password });
  saveUsers();
  return { success: true, message: 'Registro exitoso' };
}

export function loginUser(data) {
  let { username, password } = data;
  let user = users.find(user => user.username === username && user.password === password);
  return user
    ? { success: true, message: 'Inicio de sesión exitoso', username: user.username }
    : { success: false, message: 'Usuario o contraseña inválidos' };
}

export function checkUserSession(data) {
  let { username } = data;
  let user = users.find(user => user.username === username);
  return user
    ? { success: true, message: 'Sesión válida', username: user.username }
    : { success: false, message: 'Sesión inválida' };
}

loadUsers();
