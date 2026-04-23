const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos en memoria (podés reemplazarla por una DB real)
let guests = [];

// GET /api/guests - Obtener todos los invitados (admin)
app.get('/api/guests', (req, res) => {
  res.json(guests);
});

// POST /api/guests - Confirmar asistencia (invitados)
app.post('/api/guests', (req, res) => {
  const { name, phone, attending } = req.body;

  if (!name || !attending) {
    return res.status(400).json({ error: 'Nombre y asistencia son requeridos' });
  }

  const valid = ['si', 'no', 'talvez'];
  if (!valid.includes(attending)) {
    return res.status(400).json({ error: 'Valor de asistencia inválido' });
  }

  const newGuest = {
    id: guests.length + 1,
    name,
    phone: phone || null,
    attending,
    date: new Date().toLocaleDateString('es-AR'),
  };

  guests.push(newGuest);
  res.status(201).json(newGuest);
});

// GET /api/stats - Estadísticas rápidas
app.get('/api/stats', (req, res) => {
  const total = guests.length;
  const confirmed = guests.filter((g) => g.attending === 'si').length;
  const declined = guests.filter((g) => g.attending === 'no').length;
  const maybe = guests.filter((g) => g.attending === 'talvez').length;
  res.json({ total, confirmed, declined, maybe });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
