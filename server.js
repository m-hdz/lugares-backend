const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/lugares_contactos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

// Esquema para lugares
const placeSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    placeName: String,
    placeLink: String,
    contacts: [{ name: String, phone: String }],
    image: String
});
const Place = mongoose.model('Place', placeSchema);

// Esquema para mensajes del chat
const messageSchema = new mongoose.Schema({
    sender: String,
    message: String,
    timestamp: String
});
const Message = mongoose.model('Message', messageSchema);

// Contraseña hasheada (equivalente a "0406")
const hashedPassword = "$2b$10$3XF/vjykf4GLqEzXxL4X2eCW2sTsifE/UGfVS4v8fsvJscJXiGTjC" ; // Generar con bcrypt.hashSync('0406', 10)

// Autenticación
app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    if (await bcrypt.compare(password, hashedPassword)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
});

// Obtener todos los lugares
app.get('/api/places', async (req, res) => {
    const places = await Place.find();
    res.json(places);
});

// Guardar un lugar
app.post('/api/places', async (req, res) => {
    const place = new Place(req.body);
    await place.save();
    res.json({ success: true });
});

// Eliminar un lugar
app.delete('/api/places/:id', async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// Obtener todos los mensajes del chat
app.get('/api/messages', async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
});

// Enviar un mensaje
app.post('/api/messages', async (req, res) => {
    const message = new Message(req.body);
    await message.save();
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});