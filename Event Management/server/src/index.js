require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

connectDB();

const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/checkin', require('./routes/checkin'));

app.get('/', (req, res) => res.json({ ok: true, msg: 'EventHorizon API' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server started on', PORT));
