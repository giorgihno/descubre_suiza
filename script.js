
// Aqui puse toda la logica para buscar las ciudades y mostrar
// los resultados en la pagina. Lo separe del index.html para
// que estuviera mas organizado, como hicimos el ejemplo de Star Wars.
// Use jQuery porque hace mas facil agarrar los elementos del DOM
// y manejar los eventos con menos codigo.

// Las ciudades se cargan al iniciar desde el backend (ver cargarCiudades).
const API_CIUDADES = 'https://descubre-suiza-back.onrender.com/api/ciudades';
const IMG_PLACEHOLDER = 'https://placehold.co/600x400?text=Imagen+no+disponible';
/** Extensiones a probar si la ruta del backend no coincide con el archivo local. */
const IMG_EXT_CANDIDATAS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

let ciudades = [];
/** true solo despues de un GET exitoso y JSON valido (la lista puede estar vacia). */
let ciudadesCargadas = false;

/**
 * Convierte rutas del tipo "img/archivo.jpg" a "./img/archivo.jpg" para el front estático.
 * URLs absolutas (http/https) se dejan igual.
 */
function normalizarRutaImagenLocal(ruta) {
  if (!ruta || typeof ruta !== 'string') return '';
  const t = ruta.trim().replace(/\\/g, '/');
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('./img/')) return t;
  if (t.startsWith('img/')) return './' + t;
  if (!t.includes('/')) return './img/' + t;
  return './img/' + t.replace(/^\.\/?/, '').replace(/^img\/?/, '');
}

/**
 * Lista de URLs a probar: primero la ruta normalizada, luego el mismo nombre con otras extensiones.
 */
function construirCandidatosImagen(rutaNormalizada) {
  if (!rutaNormalizada) return [];
  if (/^https?:\/\//i.test(rutaNormalizada)) return [rutaNormalizada];
  const m = rutaNormalizada.match(/^(.*\/)([^/]+?)(\.[^./]+)?$/i);
  const dir = m ? m[1] : './img/';
  const base = m ? m[2] : rutaNormalizada.replace(/^.*\//, '');
  const candidatos = [];
  function add(u) {
    if (u && candidatos.indexOf(u) === -1) candidatos.push(u);
  }
  add(rutaNormalizada);
  for (let i = 0; i < IMG_EXT_CANDIDATAS.length; i++) {
    add(dir + base + IMG_EXT_CANDIDATAS[i]);
  }
  return candidatos;
}

function enlazarImagenCiudadConFallback($img, candidatos) {
  if (!$img.length) return;
  let indice = 0;
  $img.off('error.descubreImg').on('error.descubreImg', function() {
    indice += 1;
    if (indice < candidatos.length) {
      this.src = candidatos[indice];
      return;
    }
    $(this).off('error.descubreImg');
    this.src = IMG_PLACEHOLDER;
  });
  const primera = candidatos.length ? candidatos[0] : IMG_PLACEHOLDER;
  $img.attr('src', primera);
  if (!candidatos.length) {
    $img.off('error.descubreImg');
  }
}

/**
 * Acepta respuesta como arreglo o envoltorios tipicos { ciudades } / { data }.
 * @returns {object[]|null}
 */
function normalizarListaCiudades(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.ciudades)) return json.ciudades;
  if (json && Array.isArray(json.data)) return json.data;
  return null;
}

function actualizarMaxRating() {
  if (ciudades.length === 0) {
    $('#maxRating').text('0');
    return;
  }
  const maxRating = Math.max(...ciudades.map(c => Number(c.rating) || 0));
  $('#maxRating').text(maxRating);
}

function cargarCiudades() {
  fetch(API_CIUDADES)
    .then(function(res) {
      if (!res.ok) {
        throw new Error('El servidor respondió con el código ' + res.status + '.');
      }
      return res.json();
    })
    .then(function(json) {
      const lista = normalizarListaCiudades(json);
      if (lista === null) {
        throw new Error('La respuesta no tiene el formato esperado (se necesita un arreglo de ciudades).');
      }
      ciudades = lista;
      ciudadesCargadas = true;
      actualizarMaxRating();
      $('#resultado').empty();
    })
    .catch(function() {
      ciudades = [];
      ciudadesCargadas = false;
      actualizarMaxRating();
      $('#resultado').html(
        '<p class="text-danger">No se pudieron cargar las ciudades. Verifica que el servidor esté en marcha en <strong>http://localhost:5050</strong> y que el endpoint <code>/api/ciudades</code> responda correctamente (CORS y ruta).</p>'
      );
    });
}

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

  cargarCiudades();
});

// Esta funcion busca la ciudad que escribio el usuario y arma la tarjeta con su info
function buscarCiudad() {
  const nombreIngresado = $('#ciudad').val().trim();

  // Si el input esta vacio le aviso al usuario
  if (!nombreIngresado) {
    $('#resultado').html('<p class="text-warning">Por favor escribe el nombre de una ciudad.</p>');
    return;
  }

  if (!ciudadesCargadas) {
    $('#resultado').html(
      '<p class="text-danger">No se pudieron cargar las ciudades desde el servidor. Comprueba que el backend esté activo en <strong>http://localhost:5050</strong> y recarga la página.</p>'
    );
    return;
  }

  // Busco la ciudad ignorando si esta en mayusculas o minusculas
  const ciudad = ciudades.find(c => c.nombre.toLowerCase() === nombreIngresado.toLowerCase());

  if (ciudad) {
    const ratingNum = Number(ciudad.rating) || 0;
    // Aqui genero las vacas segun el rating de la ciudad
    let vacas = '';
    for (let i = 0; i < ratingNum; i++) {
      // Use el emoji de vaca porque se ve en todos lados sin problema
      vacas += '<span class="vaca">🐄</span>';
    }

    // Esto lo use para convertir el arreglo de lugares en lista HTML
    const lugaresHTML = ciudad.lugaresInteres
      .map(lugar => `<li>${lugar}</li>`)
      .join('');

    const rutaImg = normalizarRutaImagenLocal(ciudad.imagen);
    const candidatosImg = construirCandidatosImagen(rutaImg);

    // Aqui armo toda la tarjeta con la informacion de la ciudad
    const tarjeta = `
      <div class="card mb-4 p-3">
        <div class="row g-3 align-items-start">
          <div class="col-md-5">
            <img class="ciudad-imagen" src="" alt="Imagen de ${ciudad.nombre}">
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
    enlazarImagenCiudadConFallback($('#resultado img.ciudad-imagen'), candidatosImg);
  } else {
    // Si no encontro la ciudad le digo cuales puede buscar
    $('#resultado').html('<p class="text-danger">No se encontró la ciudad "' + nombreIngresado + '". Intenta con Zurich, Ginebra, Lucerna, Berna o Lugano.</p>');
  }
}
