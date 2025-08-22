const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');

const app = express();

app.use(cors());
// This line is essential to parse JSON body
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Backend API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
