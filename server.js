const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Base de datos SQLite
const db = new sqlite3.Database('./users.db');
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)');

// Registro
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
    if (err) return res.status(400).json({ message: 'Usuario ya existe' });
    res.json({ message: 'Registro exitoso' });
  });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (row) return res.json({ message: 'Login correcto' });
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  });
});

// Eliminar usuario
app.delete('/user/:username', (req, res) => {
  const username = req.params.username;
  db.run('DELETE FROM users WHERE username = ?', [username], function(err) {
    if (err) return res.status(500).json({ message: 'Error al eliminar usuario' });
    if (this.changes === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  });
});

app.listen(3001, () => console.log('Servidor iniciado en http://localhost:3001'));