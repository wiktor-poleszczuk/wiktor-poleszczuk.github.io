const GRID_SIZE = 4;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

const rasterMap = document.getElementById('rasterMap');
const puzzlePieces = document.getElementById('puzzlePieces');
const puzzleBoard = document.getElementById('puzzleBoard');
const saveButton = document.getElementById('saveButton');
const getLocationButton = document.getElementById('getLocation');

const map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
L.marker([53.430127, 14.564802]).addTo(map).bindPopup('<strong>Hello!</strong><br>This is a popup.');

function centerMapOnUserLocation() {
  // Krok 1: sprawdzamy, czy przegladarka udostepnia API geolokalizacji.
  if (!navigator.geolocation) {
    console.log('No geolocation.');
    return;
  }

  // Krok 2: prosimy przegladarke o aktualna pozycje uzytkownika.
  navigator.geolocation.getCurrentPosition(
    // Krok 3: gdy lokalizacja sie powiedzie, pobieramy wspolrzedne.
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Krok 4: centrujemy mape na pozycji uzytkownika i dodajemy znacznik.
      map.setView([lat, lon], 18);
      L.marker([lat, lon]).addTo(map);
    },
    // Krok 5: gdy lokalizacja sie nie uda, logujemy szczegoly bledu.
    (positionError) => {
      console.error(positionError);
    },
    {
      // Opcja: mniejsza dokladnosc zwykle dziala szybciej i zuzywa mniej baterii.
      enableHighAccuracy: false
    }
  );
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
  event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event) {
  event.preventDefault();
}

function removeDropHighlight(event) {
  event.currentTarget.classList.remove('drag-over');
}

function addDropHighlight(event) {
  event.currentTarget.classList.add('drag-over');
}

function movePieceToContainer(pieceId, destination) {
  const draggedPiece = document.getElementById(pieceId);
  if (!draggedPiece || !destination) {
    return;
  }

  if (destination.classList.contains('puzzle-slot')) {
    const existingPiece = destination.querySelector('.puzzle-piece');
    if (existingPiece) {
      puzzlePieces.appendChild(existingPiece);
    }
  }

  destination.appendChild(draggedPiece);
}

function handleDropOnSlot(event) {
  event.preventDefault();
  removeDropHighlight(event);
  const pieceId = event.dataTransfer.getData('text/plain');
  movePieceToContainer(pieceId, event.currentTarget);
}

function handleDropOnPieces(event) {
  event.preventDefault();
  removeDropHighlight(event);
  const pieceId = event.dataTransfer.getData('text/plain');
  movePieceToContainer(pieceId, puzzlePieces);
}

function buildBoardSlots() {
  puzzleBoard.innerHTML = '';

  for (let i = 0; i < TILE_COUNT; i += 1) {
    const slot = document.createElement('div');
    slot.className = 'puzzle-slot';
    slot.dataset.slotIndex = String(i);
    slot.addEventListener('dragover', handleDragOver);
    slot.addEventListener('dragenter', addDropHighlight);
    slot.addEventListener('dragleave', removeDropHighlight);
    slot.addEventListener('drop', handleDropOnSlot);
    puzzleBoard.appendChild(slot);
  }

  puzzlePieces.addEventListener('dragover', handleDragOver);
  puzzlePieces.addEventListener('dragenter', addDropHighlight);
  puzzlePieces.addEventListener('dragleave', removeDropHighlight);
  puzzlePieces.addEventListener('drop', handleDropOnPieces);
}

function createPuzzleTilesFromCanvas() {
  // Dzielimy zapisany obraz mapy na siatke GRID_SIZE x GRID_SIZE.
  const tileWidth = Math.floor(rasterMap.width / GRID_SIZE);
  const tileHeight = Math.floor(rasterMap.height / GRID_SIZE);

  // Tworzymy liste poprawnych indeksow kafelkow i tasujemy ja,
  // aby elementy startowo byly pomieszane.
  const tileIndices = [];
  for (let i = 0; i < TILE_COUNT; i += 1) {
    tileIndices.push(i);
  }
  shuffle(tileIndices);

  // Czyscimy kontener i tworzymy nowe puzzle dla aktualnego zrzutu mapy.
  puzzlePieces.innerHTML = '';

  for (let i = 0; i < tileIndices.length; i += 1) {
    const tileIndex = tileIndices[i];
    const row = Math.floor(tileIndex / GRID_SIZE);
    const col = tileIndex % GRID_SIZE;

    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = tileWidth;
    tileCanvas.height = tileHeight;
    tileCanvas.className = 'puzzle-piece';
    tileCanvas.id = 'piece-' + i;
    tileCanvas.draggable = true;
    // Zapamietujemy, gdzie ten element powinien trafic po ulozeniu.
    tileCanvas.dataset.correctIndex = String(tileIndex);

    const tileCtx = tileCanvas.getContext('2d');
    // Wycinamy odpowiedni fragment z calego rastra mapy i rysujemy go na kafelku.
    tileCtx.drawImage(
      rasterMap,
      col * tileWidth,
      row * tileHeight,
      tileWidth,
      tileHeight,
      0,
      0,
      tileWidth,
      tileHeight
    );

    tileCanvas.addEventListener('dragstart', handleDragStart);
    puzzlePieces.appendChild(tileCanvas);
  }
}

function saveRasterAndBuildPuzzle() {
  // 1) leafletImage renderuje aktualny widok Leaflet do tymczasowego canvas.
  leafletImage(map, function (err, canvas) {
    if (err) {
      console.error(err);
      return;
    }

    const rasterContext = rasterMap.getContext('2d');
    // 2) Czyscimy docelowy raster i kopiujemy do niego zrzut mapy.
    rasterContext.clearRect(0, 0, rasterMap.width, rasterMap.height);
    rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

    // 3) Na bazie zapisanego rastra tworzymy i mieszamy puzzle.
    createPuzzleTilesFromCanvas();
  });
}

getLocationButton.addEventListener('click', centerMapOnUserLocation);
// Klikniecie "Save" uruchamia pelny proces: zrzut mapy -> podzial na puzzle.
saveButton.addEventListener('click', saveRasterAndBuildPuzzle);

buildBoardSlots();
