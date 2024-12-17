const AXIOS = require('axios');
const CHEERIO = require('cheerio');
const FS = require('fs');

const URL = 'https://elpais.com/ultimas-noticias/';

AXIOS.get(URL)
  .then(response => {
    const $ = CHEERIO.load(response.data);
    const NOTICIAS = [];

    $('article').each((index, element) => { 
      const Titulo = $(element).find('h2').text().trim();
      const Imagen = $(element).find('img').attr('src');
      const Descripcion = $(element).find('p').text().trim();
      const Enlace = $(element).find('a').attr('href');

      const NOTICIA = {
        Titulo,
        Imagen,
        Descripcion,
        Enlace
      };

      NOTICIAS.push(NOTICIA);
    });

    FS.writeFileSync('noticias.json', JSON.stringify(NOTICIAS, null, 2));
  })
  .catch(error => {
    console.error(error);
  });