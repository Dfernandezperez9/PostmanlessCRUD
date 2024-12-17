
// PUT
// Invoke-WebRequest -Uri http://localhost:3000/noticias/0 -Method Put -Body (ConvertTo-Json -InputObject @{titulo="Nuevo titulo"; subtitulo="Nuevo subtitulo"}) -ContentType 'application/json'

// DELETE
// Invoke-WebRequest -Uri http://localhost:3000/noticias/0 -Method Delete

// GET
// Invoke-WebRequest -Uri http://localhost:3000/0

// POST
// Invoke-WebRequest -Uri http://localhost:3000/noticias -Method Post -Body (ConvertTo-Json -InputObject @{titulo="titulo de la nueva noticia"; subtitulo="subtitulo de la nueva noticia"; imagen="href de la nueva noticia"; descripcion="descripcion de la nueva noticia"; enlace="enlace a la nueva noticia"}) -ContentType 'application/json'


const EXPRESS = require('express');
const APP = EXPRESS();
const fs = require('fs');

APP.use(EXPRESS.json());

const NOTICIAS = JSON.parse(fs.readFileSync('noticias.json', 'utf8'));

APP.get('/noticias', (req, res) => {
  const NOTICIAS_CON_INDICE = NOTICIAS.map((noticia, Indice) => ({ Indice, ...noticia }));
  res.json(NOTICIAS_CON_INDICE);
});

APP.get('/noticias/:indice', (req, res) => {
  const INDICE = req.params.indice;
  const NOTICIA = NOTICIAS[INDICE];

  if (!NOTICIA) {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  } else {
    res.json(NOTICIA);
  }
});

APP.post('/noticias', (req, res) => {
  const NOTICIA = req.body;
  NOTICIAS.push(NOTICIA);
  const INDICE = NOTICIAS.length - 1;
  const NOTICIAS_CON_INDICE = NOTICIAS.map((noticia, index) => ({ index, ...noticia }));
  fs.writeFileSync('noticias.json', JSON.stringify(NOTICIAS_CON_INDICE, null, 2));
  res.json({ INDICE, mensaje: 'Noticia creada con éxito' });
});

APP.put('/noticias/:indice', (req, res) => {
  const INDICE = req.params.indice;
  const NOTICIA = req.body;

  if (!NOTICIAS[INDICE]) {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  } else {
    Object.keys(NOTICIA).forEach(key => {
      NOTICIAS[INDICE][key] = NOTICIA[key];
    });
    fs.writeFileSync('noticias.json', JSON.stringify(NOTICIAS, null, 2));
    res.json({ mensaje: 'Noticia actualizada con éxito' });
  }
});

APP.delete('/noticias/:indice', (req, res) => {
  const INDICE = req.params.indice;

  if (!NOTICIAS[INDICE]) {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  } else {
    NOTICIAS.splice(INDICE, 1);
    fs.writeFileSync('noticias.json', JSON.stringify(NOTICIAS, null, 2));
    res.json({ mensaje: 'Noticia eliminada con éxito' });
  }
});

APP.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});