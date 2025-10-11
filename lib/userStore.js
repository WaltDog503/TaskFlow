const fs = require('fs/promises');
const path = require('path');

const dataFile = process.env.USER_DATA_FILE || path.join(__dirname, '..', 'data', 'users.json');

async function ensureFile() {
  const dir = path.dirname(dataFile);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch (error) {
    await fs.writeFile(dataFile, '[]', 'utf8');
  }
}

async function readUsers() {
  await ensureFile();
  const data = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(data);
}

async function writeUsers(users) {
  await ensureFile();
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2), 'utf8');
}

async function findByUsername(username) {
  const users = await readUsers();
  return users.find((user) => user.username === username) || null;
}

async function addUser(user) {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
  return user;
}

module.exports = {
  addUser,
  findByUsername,
};
