const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { addUser, findByUsername } = require('./lib/userStore');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const TOKEN_EXPIRATION = '1h';

function validateCredentials(username, password) {
  if (!username || !password) {
    return 'Username and password are required.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  return null;
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const validationError = validateCredentials(username, password);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const existingUser = await findByUsername(username);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await addUser({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const validationError = validateCredentials(username, password);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const existingUser = await findByUsername(username);
  if (!existingUser) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: existingUser.username }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });

  res.json({
    message: 'Login successful',
    token,
    expiresIn: TOKEN_EXPIRATION,
  });
});

module.exports = router;
