
// Aqui puse toda la logica para buscar las ciudades y mostrar
// los resultados en la pagina. Lo separe del index.html para
// que estuviera mas organizado, como hicimos el ejemplo de Star Wars.
// Use jQuery porque hace mas facil agarrar los elementos del DOM
// y manejar los eventos con menos codigo.

// Aqui tengo las ciudades con toda su informacion
const ciudades = [
  {
    nombre: 'Zurich',
    rating: 5,
    razon: 'Centro financiero y cultural con un casco antiguo encantador y museos de renombre.',
    // Las imagenes las guarde en la carpeta img para que siempre carguen
    imagen: './img/zurich.png',
    lugaresInteres: [
      'Bahnhofstrasse – una de las calles comerciales más famosas del mundo',
      'Casco antiguo (Altstadt) – callejuelas medievales a orillas del río Limmat',
      'Kunsthaus Zürich – uno de los museos de arte más grandes de Suiza',
      'Lake Zurich – paseos en barco y zonas de baño en verano',
      'Grossmünster – catedral románica con vistas panorámicas desde sus torres'
    ],
    gastronomia: 'Prueba el Zürcher Geschnetzeltes (ternera en salsa de crema) y el Tirggel (galletas de miel típicas navideñas). La calle Langstrasse concentra restaurantes de todo el mundo.',
    tip: 'La ZürichCARD te da transporte público ilimitado y entrada gratuita a más de 40 museos. Vale mucho la pena si te quedas 2–3 días.',
    clima: 'Veranos agradables (18–25 °C) e inviernos fríos con posibilidad de nieve. La mejor época para visitar es de mayo a septiembre.',
    transporte: 'Conectada por tren directo con Ginebra (3 h), Berna (1 h) y Lucerna (50 min). El aeropuerto tiene conexión directa al centro en 10 minutos.'
  },
  {
    nombre: 'Ginebra',
    rating: 4,
    razon: 'Ciudad diplomática junto al lago Léman, sede de la ONU y hogar del Jet d\'Eau.',
    imagen: './img/ginebra.png',
    lugaresInteres: [
      'Jet d\'Eau – el icónico chorro de agua de 140 metros sobre el lago Léman',
      'Palacio de las Naciones (ONU) – visitas guiadas disponibles al público',
      'Barrio de la Vieille-Ville – calles empedradas con la Catedral de San Pedro',
      'CERN – el laboratorio de física de partículas más grande del mundo (tours gratuitos)',
      'Musée International de la Croix-Rouge – historia conmovedora de la Cruz Roja'
    ],
    gastronomia: 'Ginebra es famosa por su fondue y raclette. El barrio de Carouge tiene cafés bohemios y restaurantes mediterráneos. No salgas sin probar el chocolate artesanal en alguna chocolatería local.',
    tip: 'El Geneva Transport Card es gratuito para todos los huéspedes de hotel y cubre transporte público ilimitado durante tu estancia.',
    clima: 'Temperatura templada por el lago. Veranos cálidos (20–28 °C) e inviernos fríos. Primavera y otoño son temporadas ideales con menos turistas.',
    transporte: 'El aeropuerto de Ginebra tiene tren al centro en 7 minutos. Desde allí se llega en tren a Berna (2 h) y Zurich (3 h).'
  },
  {
    nombre: 'Lucerna',
    rating: 5,
    razon: 'El Puente de la Capilla, el lago de Lucerna y las vistas alpinas la convierten en un destino obligatorio.',
    imagen: './img/lucerna.png',
    lugaresInteres: [
      'Kapellbrücke (Puente de la Capilla) – puente de madera cubierto del siglo XIV, símbolo de Suiza',
      'Monte Pilatus – accesible en el tren de cremallera más empinado del mundo',
      'Monte Rigi – llamado la "Reina de las Montañas", con vistas a los Alpes y varios lagos',
      'Museo de Transportes (Verkehrshaus) – el museo más visitado de Suiza',
      'Murallas medievales – torres y murallas con vistas panorámicas de la ciudad'
    ],
    gastronomia: 'Kügeli-Pastete es el plato local por excelencia: un vol-au-vent relleno de carne y setas. El mercado semanal junto al río Reuss ofrece quesos, embutidos y productos regionales.',
    tip: 'El Swiss Travel Pass te da acceso ilimitado a trenes, barcos y la mayoría de los medios de transporte, incluyendo los barcos panorámicos por el lago de Lucerna.',
    clima: 'Muy agradable en verano (18–24 °C). En invierno puede nevar, lo que le da un aspecto de cuento de hadas. La nieve en el Pilatus es garantizada de noviembre a abril.',
    transporte: 'A solo 50 minutos de Zurich en tren. Los barcos del lago conectan pueblos pintorescos como Weggis, Vitznau y Flüelen.'
  },
  {
    nombre: 'Berna',
    rating: 4,
    razon: 'Capital federal con casco medieval Patrimonio de la Humanidad y el río Aare serpenteando a sus pies.',
    imagen: './img/berna.png',
    lugaresInteres: [
      'Zytglogge (Torre del Reloj) – reloj astronómico medieval con autómatas que se activan cada hora',
      'Foso de los Osos (Bärengraben) – los osos son el símbolo de la ciudad y viven junto al río',
      'Rosengarten – jardín de rosas con más de 200 variedades y vistas privilegiadas al casco antiguo',
      'Parlamento Federal (Bundeshaus) – visitas guiadas gratuitas cuando no hay sesión parlamentaria',
      'Soportales (Lauben) – 6 km de arcadas cubiertas que recorren toda la ciudad vieja'
    ],
    gastronomia: 'La Bernese Platte es el plato típico: una selección de carnes curadas y ahumadas con chucrut. En el Mercado de Waisenhausplatz encontrarás productos frescos de la región todos los martes y sábados.',
    tip: 'Berna es perfecta para recorrer a pie. Los soportales protegen del sol y de la lluvia todo el año. Deja al menos medio día para explorar el casco histórico sin prisa.',
    clima: 'Clima continental con veranos moderados (16–22 °C) e inviernos fríos. La primavera es especialmente bonita cuando florecen las flores en el Rosengarten.',
    transporte: 'Centro neurálgico de la red ferroviaria suiza. A 1 hora de Zurich, 2 horas de Ginebra y 1 hora de Lucerna en tren. Ideal como base para explorar el país.'
  },
  {
    nombre: 'Lugano',
    rating: 3,
    razon: 'Ambiente mediterráneo, clima suave y un lago espectacular hacen de Lugano un lugar ideal para relajarse.',
    imagen: './img/lugano.png',
    lugaresInteres: [
      'Monte San Salvatore – "El Gibraltar de los Alpes", con vistas al lago y a los Alpes italianos',
      'Monte Brè – el monte más soleado de Suiza, accesible en funicular',
      'Parque Civico – hermoso parque frente al lago con palmeras y flores exóticas',
      'Lugano Centro – calles peatonales con boutiques, cafés y una arquitectura italianizante',
      'Gandria – pequeño pueblo de pescadores accesible solo en barco o a pie por senderos panorámicos'
    ],
    gastronomia: 'Al estar en el cantón italófono del Ticino, la gastronomía es italiana. Prueba la polenta con funghi, la pasta fresca y el risotto. Los grotti (restaurantes rurales de piedra) son la experiencia gastronómica imperdible de la región.',
    tip: 'En verano el lago alcanza los 24 °C y se puede nadar directamente desde la orilla. El Festival de Jazz de Lugano (julio) atrae a artistas internacionales y es de acceso gratuito en muchos escenarios.',
    clima: 'El más cálido de Suiza gracias al efecto mediterráneo. Veranos calurosos (25–30 °C), inviernos suaves y pocas nevadas. Ideal de abril a octubre.',
    transporte: 'Conectada por tren con Zurich (2.5 h) y Milán (1 h). El aeropuerto de Lugano opera vuelos regionales. Los barcos del lago conectan con pueblos como Morcote, Gandria y Campione d\'Italia.'
  }
];

// Esto se ejecuta cuando ya cargo todo el documento
$(function() {
  // Esto lo puse para que el formulario no recargue la pagina al darle submit
  $('#frmBuscar').on('submit', function(e) {
    e.preventDefault();
  });

  // Aqui le asigne el evento al boton de buscar
  $('#btnBuscar').on('click', function() {
    buscarCiudad();
  });

  // Tambien lo hice para que funcione si el usuario presiona Enter
  $('#ciudad').on('keypress', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      buscarCiudad();
    }
  });

  // Aqui saco el rating mas alto para mostrarlo en la leyenda de las vacas
  const maxRating = Math.max(...ciudades.map(c => c.rating));
  $('#maxRating').text(maxRating);
});

// Esta funcion busca la ciudad que escribio el usuario y arma la tarjeta con su info
function buscarCiudad() {
  const nombreIngresado = $('#ciudad').val().trim();

  // Si el input esta vacio le aviso al usuario
  if (!nombreIngresado) {
    $('#resultado').html('<p class="text-warning">Por favor escribe el nombre de una ciudad.</p>');
    return;
  }

  // Busco la ciudad ignorando si esta en mayusculas o minusculas
  const ciudad = ciudades.find(c => c.nombre.toLowerCase() === nombreIngresado.toLowerCase());

  if (ciudad) {
    // Aqui genero las vacas segun el rating de la ciudad
    let vacas = '';
    for (let i = 0; i < ciudad.rating; i++) {
      // Use el emoji de vaca porque se ve en todos lados sin problema
      vacas += '<span class="vaca">🐄</span>';
    }

    // Esto lo use para convertir el arreglo de lugares en lista HTML
    const lugaresHTML = ciudad.lugaresInteres
      .map(lugar => `<li>${lugar}</li>`)
      .join('');

    // Aqui armo toda la tarjeta con la informacion de la ciudad
    const tarjeta = `
      <div class="card mb-4 p-3">
        <div class="row g-3 align-items-start">
          <div class="col-md-5">
            <img src="${ciudad.imagen}" alt="Imagen de ${ciudad.nombre}" onerror="this.src='https://placehold.co/600x400?text=Imagen+no+disponible';">
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <h2 class="card-title">${ciudad.nombre}</h2>
              <div class="rating mb-2">${vacas}</div>
              <p class="card-text"><strong>¿Por qué visitarla?</strong> ${ciudad.razon}</p>

              <hr>

              <h5>📍 Lugares de interés</h5>
              <ul>${lugaresHTML}</ul>

              <h5>🍽️ Gastronomía</h5>
              <p>${ciudad.gastronomia}</p>

              <h5>☀️ Clima</h5>
              <p>${ciudad.clima}</p>

              <h5>🚆 Cómo llegar y moverse</h5>
              <p>${ciudad.transporte}</p>

              <div class="alert alert-info mt-3 mb-0">
                <strong>💡 Tip de viaje:</strong> ${ciudad.tip}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    $('#resultado').html(tarjeta);
  } else {
    // Si no encontro la ciudad le digo cuales puede buscar
    $('#resultado').html('<p class="text-danger">No se encontró la ciudad "' + nombreIngresado + '". Intenta con Zurich, Ginebra, Lucerna, Berna o Lugano.</p>');
  }
}