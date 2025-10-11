const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./auth');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Welcome to the TaskFlow API' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
