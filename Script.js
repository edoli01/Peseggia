// Salveremo qui tutti i marker per poterli mostrare/nascondere
let allMarkers = [];

  

mapboxgl.accessToken = 'pk.eyJ1Ijoib2xpdmE2IiwiYSI6ImNtOTFqYTEzajAxYWoya3F1Mm1zeTA1dWQifQ.DyZ6XSmArhO6UbgCTOa2_Q';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'Style/style.json',
  center: [12.1825, 45.5625],
  zoom: 7,
  pitch: 40,
  bearing: 50
});

const mapBtn = document.getElementById('mapBtn');
const satelliteBtn = document.getElementById('satelliteBtn');

// Funzione per applicare l'effetto di dissolvenza
function fadeMapChange() {
  const mapContainer = document.getElementById('map');
  mapContainer.classList.add('map-fade'); // Aggiungiamo la classe per la dissolvenza

  // Rimuoviamo la dissolvenza quando la mappa è pronta
  map.once('styledata', () => {
    mapContainer.classList.remove('map-fade');
  });
}

mapBtn.addEventListener('click', () => {
  fadeMapChange(); // Attiva l'effetto dissolvenza
  map.setStyle('Style/style.json'); // Stile Standard
  setActiveButton(mapBtn);
});

satelliteBtn.addEventListener('click', () => {
  fadeMapChange(); // Attiva l'effetto dissolvenza
  map.setStyle('mapbox://styles/oliva6/cm9kbch5e003d01sb1rt88h9e/draft'); // Stile Satellite
  setActiveButton(satelliteBtn);
});

function setActiveButton(activeBtn) {
  [mapBtn, satelliteBtn].forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');

  // Ricarica i marker al cambio stile
  map.once('styledata', () => {

      // Aggiungi una sorgente per la label "Peseggia"
  map.addSource('peseggia-label', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [12.1825, 45.5625]
          },
          properties: {
            title: 'Peseggia'
          }
        }
      ]
    }
  });

  // Aggiungi un layer per la label "Peseggia"
  map.addLayer({
    id: 'peseggia-label',
    type: 'symbol',
    source: 'peseggia-label',
    layout: {
      'text-field': ['get', 'title'], // Mostra il testo dalla proprietà "title"
      'text-size': 14, // Dimensione del testo
      'text-font': ['Roboto Mono Regular'], // Font
      'text-offset': [0, 0.5], // Offset per posizionare il testo sopra il punto
      'text-anchor': 'top' // Ancoraggio del testo
    },
    paint: {
      'text-color': 'rgba(255, 255, 255, 0.9)', // Colore del testo
      'text-opacity': 1 // Opacità del testo
    },
    minzoom: 0, // Visibile da zoom 0
    maxzoom: 9.5 // Visibile fino a zoom 9.5
  });

    allMarkers.forEach(({ marker }) => marker.remove());
    allMarkers = [];
    fetch('peseggia.geojson')
    .then(response => response.json())
    .then(geojsonData => {
      geojsonData.features.forEach(feature => {
        const imageUrl = feature.properties.image_url;
        const taxon = feature.properties.iconic_taxon_name;
  
        if (imageUrl && taxon) {
          const markerElement = createCustomMarker(imageUrl);
          const marker = new mapboxgl.Marker({ element: markerElement })
            .setLngLat(feature.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 50, anchor: 'left', className: 'popup-biodiversita' })
              .setHTML(`
                <div class="popup-content">
                  <img src="${imageUrl.replace('/small.', '/large.')}" class="popup-image" />
                  <h3 class="popup-title">${feature.properties.scientific_name}</h3>
                  <p class="popup-description">Coordinate: ${feature.geometry.coordinates[0].toFixed(5)}, ${feature.geometry.coordinates[1].toFixed(5)}</p>
                  <p class="popup-description"><b>Classe:</b> ${feature.properties.taxon_class_name}</p>
                  <p class="popup-description"><b>Famiglia:</b> ${feature.properties.taxon_family_name}</p>
                  <p class="popup-description"><b>Ordine:</b> ${feature.properties.taxon_order_name}</p>
                  <p class="popup-description"><b>Genere:</b> ${feature.properties.taxon_genus_name}</p>
                  <p class="popup-description"><b>Phylum:</b> ${feature.properties.taxon_phylum_name}</p>
                  <p class="popup-description"><b>Regno:</b> ${feature.properties.taxon_kingdom_name}</p>
                </div>
              `))
            .addTo(map);
  
          // Salva il marker con il suo gruppo
          allMarkers.push({ marker, taxon });
        }
      });
        updateMarkerVisibility();
      });
  });
}



map.on('load', function () {

  // Aggiungi una sorgente per la label "Peseggia"
  map.addSource('peseggia-label', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [12.1825, 45.5625]
          },
          properties: {
            title: 'Peseggia'
          }
        }
      ]
    }
  });

  // Aggiungi un layer per la label "Peseggia"
  map.addLayer({
    id: 'peseggia-label',
    type: 'symbol',
    source: 'peseggia-label',
    layout: {
      'text-field': ['get', 'title'], // Mostra il testo dalla proprietà "title"
      'text-size': 14, // Dimensione del testo
      'text-font': ['Roboto Mono Regular'], // Font
      'text-offset': [0, 0.5], // Offset per posizionare il testo sopra il punto
      'text-anchor': 'top' // Ancoraggio del testo
    },
    paint: {
      'text-color': '#000000', // Colore del testo
      'text-opacity': 1 // Opacità del testo
    },
    minzoom: 0, // Visibile da zoom 0
    maxzoom: 9.5 // Visibile fino a zoom 9.5
  });
  
  fetch('peseggia.geojson')
  .then(response => response.json())
  .then(geojsonData => {
    geojsonData.features.forEach(feature => {
      const imageUrl = feature.properties.image_url;
      const taxon = feature.properties.iconic_taxon_name;

      if (imageUrl && taxon) {
        const markerElement = createCustomMarker(imageUrl);
        const marker = new mapboxgl.Marker({ element: markerElement })
          .setLngLat(feature.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 50, anchor: 'left', className: 'popup-biodiversita' })
            .setHTML(`
              <div class="popup-content">
                <img src="${imageUrl.replace('/small.', '/large.')}" class="popup-image" />
                <h3 class="popup-title">${feature.properties.scientific_name}</h3>
                <p class="popup-description">Coordinate: ${feature.geometry.coordinates[0].toFixed(5)}, ${feature.geometry.coordinates[1].toFixed(5)}</p>
                <p class="popup-description"><b>Classe:</b> ${feature.properties.taxon_class_name}</p>
                <p class="popup-description"><b>Famiglia:</b> ${feature.properties.taxon_family_name}</p>
                <p class="popup-description"><b>Ordine:</b> ${feature.properties.taxon_order_name}</p>
                <p class="popup-description"><b>Genere:</b> ${feature.properties.taxon_genus_name}</p>
                <p class="popup-description"><b>Phylum:</b> ${feature.properties.taxon_phylum_name}</p>
                <p class="popup-description"><b>Regno:</b> ${feature.properties.taxon_kingdom_name}</p>
                <p class="popup-description"><b>Nome comune:</b> ${feature.properties.common_name}</p>
              </div>
            `))
          .addTo(map);




        // Salva il marker con il suo gruppo
        allMarkers.push({ marker, taxon });
      }
    });
      
      setupFilterLogic();
    });
});

// Controlla la visibilità dei marker in base allo zoom
map.on('zoom', updateMarkerVisibility);


// Creazione marker con immagine
function createCustomMarker(imageUrl) {
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.width = '30px';
  img.style.height = '30px';
  img.style.borderRadius = '0%';
  img.style.objectFit = 'cover';
  return img;
}

document.addEventListener('DOMContentLoaded', () => {
  setupFilterLogic(); // Configura i filtri al caricamento della pagina
});

function setupFilterLogic() {
  const buttons = document.querySelectorAll('.filter-button');
  console.log('Filtri trovati:', buttons); // Debug

  buttons.forEach(button => {
    button.classList.remove('active'); // Rimuovi la classe 'active' all'inizio
    button.addEventListener('click', () => {
      button.classList.toggle('active'); // Attiva/disattiva il filtro
      updateMarkerVisibility(); // Aggiorna la visibilità dei marker
    });
  });
}

function updateMarkerVisibility() {
  if (ignoreFilters) return; // Non fare nulla se i filtri sono ignorati

  const activeFilters = Array.from(document.querySelectorAll('.filter-button.active'))
    .map(btn => btn.dataset.taxon);

  console.log('Filtri attivi:', activeFilters); // Debug

  allMarkers.forEach(({ marker, taxon }) => {
    const shouldShow = activeFilters.length === 0 || activeFilters.includes(taxon);
    marker.getElement().style.display = shouldShow ? '' : 'none';
  });
}

// Navigazione tra punti
let currentIndex = 0;
const locations = [
  {
    coords: [12.1822, 45.56236], 
    titolo: "Il cuore verde",
    descrizione: `
      <span class="testi-narrazione">Tutto comincia dove ce lo aspettiamo: un prato, qualche albero, una zona tranquilla.
      Ma basta fermarsi un attimo per accorgersi che la vita qui è tutt’altro che silenziosa.

      <span class="highlight">Un merlo si muove tra i fili d’erba, attento e rapido.</span></span>
    `
  },
  { coords: [12.180784, 45.560929], titolo: "Il cuore verde", descrizione:`
      <span class="testi-narrazione">Tutto comincia dove ce lo aspettiamo: un prato, qualche albero, una zona tranquilla.
      Ma basta fermarsi un attimo per accorgersi che la vita qui è tutt’altro che silenziosa.

      Un merlo si muove tra i fili d’erba, attento e rapido.
      <span class="highlight">Sotto le foglie, minuscoli funghi si affacciano dal suolo.</span></span>
   ` },
  { coords: [12.184359, 45.560119], titolo: "Il cuore verde", descrizione: `
      <span class="testi-narrazione">Tutto comincia dove ce lo aspettiamo: un prato, qualche albero, una zona tranquilla.
      Ma basta fermarsi un attimo per accorgersi che la vita qui è tutt’altro che silenziosa.

      Un merlo si muove tra i fili d’erba, attento e rapido.
      Sotto le foglie, minuscoli funghi si affacciano dal suolo.
      <span class="highlight" data-id="insetti-foglia" id="insetti-foglia">Una coppia di insetti si incontra sulla superficie vellutata di una foglia.</span></span>
     ` },
  { coords: [12.18106, 45.560853], titolo: "Il cuore verde", descrizione: `
      <span class="testi-narrazione">Tutto comincia dove ce lo aspettiamo: un prato, qualche albero, una zona tranquilla.
      Ma basta fermarsi un attimo per accorgersi che la vita qui è tutt’altro che silenziosa.

      Un merlo si muove tra i fili d’erba, attento e rapido.
      Sotto le foglie, minuscoli funghi si affacciano dal suolo.
      Una coppia di insetti si incontra sulla superficie vellutata di una foglia.
      <span class="highlight">E c’è chi si nasconde meglio: un gruppo di piccoli esseri vive nella crepa di una corteccia.</span></span>
      ` },
      
  { coords: [12.186814, 45.559878], titolo: "Il cuore verde", descrizione: `
      <span class="testi-narrazione">Tutto comincia dove ce lo aspettiamo: un prato, qualche albero, una zona tranquilla.
      Ma basta fermarsi un attimo per accorgersi che la vita qui è tutt’altro che silenziosa.

      Un merlo si muove tra i fili d’erba, attento e rapido.
      Sotto le foglie, minuscoli funghi si affacciano dal suolo.
      Una coppia di insetti si incontra sulla superficie vellutata di una foglia.
      E c’è chi si nasconde meglio: un gruppo di piccoli esseri vive nella crepa di una corteccia.

      <span class="highlight">Anche le panchine, che sembrano fatte solo per noi, ospitano altre presenze: due uccelli le abitano con naturalezza.</span></span>
    ` },

    { coords: [12.192693, 45.56064], titolo: "Linee di confine", descrizione: 
      `<span class="testi-narrazione">Appena ci si allontana dalle aree verdi più riconoscibili, la biodiversità continua a manifestarsi nei luoghi di passaggio: ai bordi delle strade, lungo i fossati, tra le case e i campi.     
      <span class="highlight">Una cornacchia si muove sul ciglio della strada, attento ai movimenti.</span></span>
      ` 
      },

      { coords: [12.192695,
        45.560477], titolo: "Linee di confine", descrizione: 
        `<span class="testi-narrazione">Appena ci si allontana dalle aree verdi più riconoscibili, la biodiversità continua a manifestarsi nei luoghi di passaggio: ai bordi delle strade, lungo i fossati, tra le case e i campi.     
        Una cornacchia si muove sul ciglio della strada, attento ai movimenti.
        <span class="highlight">Una nutria nuota silenziosa nel fossato, tra le rive erbose.</span></span>
        ` 
        },

        { coords: [12.192141,
          45.559881], titolo: "Linee di confine", descrizione: 
          `<span class="testi-narrazione">Appena ci si allontana dalle aree verdi più riconoscibili, la biodiversità continua a manifestarsi nei luoghi di passaggio: ai bordi delle strade, lungo i fossati, tra le case e i campi.     
          Una cornacchia si muove sul ciglio della strada, attento ai movimenti.
          Una nutria nuota silenziosa nel fossato, tra le rive erbose.
          <span class="highlight">Sull’asfalto, un bruco avanza lentamente, a pochi passi da noi.
          Questi spazi di confine ospitano forme di vita capaci di adattarsi ai margini del nostro paesaggio.
          Luoghi spesso ignorati, ma pieni di presenze.</span></span>` 
          },

          { coords: [12.185421,
            45.558929], titolo: "Vita sul cemento", descrizione: 
            `<span class="testi-narrazione">Anche gli spazi più urbanizzati, come muretti e marciapiedi, ospitano forme di vita che spesso ignoriamo.
              <span class="highlight">Una lucertola si scalda immobile sul cemento, confondendosi con la parete.</span></span>
              ` 
            },

            { coords: [12.185453, 45.560884], titolo: "Vita sul cemento", descrizione: 
              `<span class="testi-narrazione">Anche gli spazi più urbanizzati, come muretti e marciapiedi, ospitano forme di vita che spesso ignoriamo.
                Una lucertola si scalda immobile sul cemento, confondendosi con la parete.
                <span class="highlight">Un riccio attraversa il marciapiede nelle ore più tranquille, cercando riparo tra gli angoli.</span></span>
                ` 
              },

              { coords: [12.179198, 45.562333], titolo: "Vita sul cemento", descrizione: 
                `<span class="testi-narrazione">Anche gli spazi più urbanizzati, come muretti e marciapiedi, ospitano forme di vita che spesso ignoriamo.
                  Una lucertola si scalda immobile sul cemento, confondendosi con la parete.
                  Un riccio attraversa il marciapiede nelle ore più tranquille, cercando riparo tra gli angoli.
                  <span class="highlight">Una lumaca avanza lenta vicino a un muro, tracciando un percorso lucido sul grigio.
                  Sono incontri quotidiani e silenziosi, che ci ricordano come la biodiversità non sia mai lontana nemmeno dove tutto sembra artificiale.</span></span>` 
                },

                { coords: [12.185517, 45.560615], titolo: "Presenze domestiche", descrizione: 
                  `<span class="testi-narrazione">Infine, anche nei luoghi più familiari, la biodiversità continua a sorprenderci.
                    <span class="highlight">Un piccolo merlo si muove nel giardino di casa, tra erba e rami bassi.</span></span>
                    ` 
                  },
                
                  { coords: [12.185559, 45.560683], titolo: "Presenze domestiche", descrizione: 
                    `<span class="testi-narrazione">Infine, anche nei luoghi più familiari, la biodiversità continua a sorprenderci.
                      Un piccolo merlo si muove nel giardino di casa, tra erba e rami bassi.
                      <span class="highlight">Una tortora si ferma sul davanzale di una finestra, osservando tranquilla.</span></span>
                      ` 
                    },

                    { coords: [12.185486, 45.560402], titolo: "Presenze domestiche", descrizione: 
                      `<span class="testi-narrazione">Infine, anche nei luoghi più familiari, la biodiversità continua a sorprenderci.
                        Un piccolo merlo si muove nel giardino di casa, tra erba e rami bassi.
                        Una tortora si ferma sul davanzale di una finestra, osservando tranquilla.
                        <span class="highlight">Una farfalla si posa su una ruota d’auto parcheggiata, per poi ripartire.</span></span>
                        ` 
                      },

                      { coords: [12.185573, 45.560575], titolo: "Presenze domestiche", descrizione: 
                        `<span class="testi-narrazione">Infine, anche nei luoghi più familiari, la biodiversità continua a sorprenderci.
                          Un piccolo merlo si muove nel giardino di casa, tra erba e rami bassi.
                          Una tortora si ferma sul davanzale di una finestra, osservando tranquilla.
                          Una farfalla si posa su una ruota d’auto parcheggiata, per poi ripartire.
                          <span class="highlight">Una lucertola sbuca rapida tra i gradini delle scale di casa.
                          Sono presenze quotidiane, vicinissime, eppure spesso ignorate.
                          Riconoscerle significa iniziare a vedere casa nostra come parte di un ecosistema più ampio.</span></span>` 
                        },

                      
    // 12.18542, 45.55893 lucertola sul muretto  12.18552, 45.56061 merlo picclo 12.18555, 45.56068 tortora finestra di casa 12.18545, 45.56088 riccio sul marciapiede 12.18549, 45.56040 farfalla su una ruota di una macchina 12.17920, 45.56233 lumaca su marciapiede 12.18557, 45.56058 lucertola su scale di casa
];

let ignoreFilters = false; // Indica se i filtri devono essere ignorati



// Funzione di utilità per verificare se due coordinate sono vicine
function areCoordinatesClose(coord1, coord2, tolerance = 0.00000001) {
  return Math.abs(coord1[0] - coord2[0]) <= tolerance && Math.abs(coord1[1] - coord2[1]) <= tolerance;
}

function gotoLocation(index) {
  ignoreFilters = true; // Disattiva i filtri durante la navigazione
  const [lng, lat] = locations[index].coords;

  // Imposta una durata maggiore solo per il punto 1 ("Il cuore verde")
  const animationDuration = index === 0 ? 10000 : 2000; // 10 secondi per il punto 1, 2 secondi per gli altri

  map.flyTo({ 
    center: [lng, lat], 
    zoom: 18.5, 
    pitch: 40, 
    bearing: 50, 
    essential: true, 
    duration: animationDuration 
  });

  // Cambia il contenuto del riquadro informativo
  const infoContent = document.getElementById('info-content');
  const location = locations[index];
  infoContent.innerHTML = `
    <h2>${location.titolo}</h2>
    <p>${location.descrizione}</p>
  `;

  // Nascondi tutti i marker, ripristina la dimensione originale e chiudi i popup
  allMarkers.forEach(({ marker }) => {
    const markerElement = marker.getElement();
    markerElement.style.display = 'none'; // Nascondi tutti i marker
    markerElement.style.width = '30px'; // Dimensione originale
    markerElement.style.height = '30px'; // Dimensione originale

    // Chiudi il popup se è aperto
    const popup = marker.getPopup();
    if (popup) {
      popup.remove(); // Rimuovi il popup dalla mappa
    }
  });

  // Mostra solo il marker associato alla posizione corrente e ingrandiscilo
  allMarkers.forEach(({ marker }) => {
    const markerCoords = [marker.getLngLat().lng, marker.getLngLat().lat];
    const shouldShow = areCoordinatesClose(markerCoords, [lng, lat]); // Usa la tolleranza per verificare la corrispondenza
    if (shouldShow) {
      const markerElement = marker.getElement();
      markerElement.style.display = ''; // Mostra il marker corrente
      markerElement.style.width = '50px'; // Dimensione maggiore
      markerElement.style.height = '50px'; // Dimensione maggiore

  // Mostra il popup dopo un ritardo
  setTimeout(() => {
    const popup = marker.getPopup();
    if (popup) {
      popup.addTo(map); // Aggiungi il popup alla mappa
    }
  }, 2000); // Ritardo di 2 secondi
}
});
}

function gotoNext() {
  if (currentIndex === locations.length - 1) {
    resetMap(); // Ripristina la mappa alla fine del viaggio
  } else {
    currentIndex = (currentIndex + 1) % locations.length;
    gotoLocation(currentIndex);
  }
}

function gotoPrev() {
  currentIndex = (currentIndex - 1 + locations.length) % locations.length;
  gotoLocation(currentIndex);
}

function startJourney() {
  // Nascondi il bottone "Inizia"
  const startBtn = document.getElementById('startBtn');
  startBtn.style.display = 'none';

  // Mostra le frecce di navigazione
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';

  // Vai al Punto 1 con la logica di `gotoLocation`
  currentIndex = 0; // Imposta l'indice al primo punto
  gotoLocation(currentIndex); // Chiama esplicitamente `gotoLocation` per gestire i marker e la mappa
}



  const toggleButton = document.getElementById("filter-toggle");
  const filterPanel = document.getElementById("filterPanel");
  const filterIcon = document.getElementById("filter-icon");

  toggleButton.addEventListener("click", () => {
    const isOpen = filterPanel.classList.contains("open");

    if (isOpen) {
      filterPanel.classList.remove("open");
      filterPanel.classList.add("hidden");
      filterIcon.textContent = "tune";
    } else {
      filterPanel.classList.add("open");
      filterPanel.classList.remove("hidden");
      filterIcon.textContent = "close";
    }
  });


  function resetMap() {
    ignoreFilters = false; // Riattiva i filtri
  
    // Mostra tutti i marker e resetta dimensioni
    allMarkers.forEach(({ marker }) => {
      const markerElement = marker.getElement();
      markerElement.style.display = '';
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      // Chiudi il popup se è aperto
    const popup = marker.getPopup();
    if (popup) {
      popup.remove(); // Rimuovi il popup dalla mappa
    }
    });
  
    
  
    
  
    // Aggiorna visibilità dei marker (tutti visibili)
    updateMarkerVisibility();
  
    // Aggiorna contenuto informativo
    const infoContent = document.getElementById('info-content');
    infoContent.innerHTML = `
      <h2>Natura urbana: un ecosistema da comprendere</h2>
      <p>Anche gli ambienti antropizzati ospitano una sorprendente varietà di specie. Osservare dove e come si manifestano permette di comprendere i meccanismi di adattamento, coesistenza e resilienza della vita in contesti urbani. Raccogliere dati, riconoscere pattern ecologici e valorizzare la presenza del selvatico nei nostri spazi quotidiani è essenziale per promuovere pratiche sostenibili e preservare la biodiversità</p>
    `;
  
    // Mostra bottone "Inizia", nasconde le frecce
    const homeBtn = document.getElementById('homeBtn');
  homeBtn.style.display = 'inline-block';
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
  }
  
  
  document.getElementById('filterPanel').addEventListener('click', e => {
    if (e.target.classList.contains('filter-button')) {
      e.target.classList.toggle('active');
      updateMarkerVisibility();
    }
  });
  

  function goHome() {
    location.reload(); // Ricarica la pagina
  }


