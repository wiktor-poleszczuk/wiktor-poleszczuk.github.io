const rozmiar = 4 // rozmiar siatki 4x4

// sekcje html
let rasterMap = document.getElementById("rasterMap");
let pieces = document.getElementById("pieces");
let board = document.getElementById("board");

// === MAPA LEAFLET ===

// tworzenie mapy
let map = L.map('map').setView([53.430127, 14.564802], 18);
// dodajemy widok z góry z stylem OpenStreetMap.DE
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
// dodajemy znacznik startowy na mapie
let marker = L.marker([53.430127, 14.564802]).addTo(map);
// popup do markera
marker.bindPopup("<strong>Hej!</strong><br>");

// === GEOLOKALIZACJA I DZIAŁANIE PRZYCISKÓW ===

document.getElementById("getLocation").addEventListener("click", function(event) {
  // sprawdzamy wspracie przeglądarki dla geolokalizacji
  if (! navigator.geolocation) {
    console.log("No geolocation.");
  }
  // pobieranie aktualnej lokalizacji użytkownika
  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    // odczytujemy szerokość i długość geograficzną
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    // odczytane wartości ustawiamy na mapie
    map.setView([lat, lon]);
    // przesunięcie pinezki
    marker.setLatLng([lat, lon]);
  }, positionError => {
    // obsgługa błędu pozycji
    console.error(positionError);
  });
});

// === ZAPIS MAPY DO RASTRU ===

document.getElementById("saveButton").addEventListener("click", function() {
  // screenshot leaflet image
  leafletImage(map, function (err, canvas) {
    let rasterContext = rasterMap.getContext("2d"); // pobranie interfejsu do rysowania 2D
    rasterContext.clearRect(0, 0, rasterMap.width, rasterMap.height) // czyszczenie canvas przed narysowaniem nowej mapy
    rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

    // reset starej układanki
    board.innerHTML = "";
    // tworzeniu puzzli z rastru
    createBoard();
    createPuzzle();
  });
});

// == TWORZENIE PLANSZY ==

function createBoard() {
  board.innerHTML = "";

  for (let i = 0; i < 16; i++) {
    let slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.index = i;

    // pozwalamy na upuszczanie elementów na slot
    slot.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("hovered"); // efekt gdy element nad slotem
    });

    slot.addEventListener("dragleave", function () {
      this.classList.remove("hovered"); // usuwamy efekt gdy element opuszcza slot
    });

    // obsługa upuszczenia elementu
    slot.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("hovered"); // usunięcie efektu po upuszczeniu
      let pieceId = e.dataTransfer.getData("text"); // id przeciąganego
      let dragged = document.getElementById(pieceId); // znajdujemy ten element w DOM

      let currentPiece = this.firstChild; // sprawdzamy czy na polu jest już jakiś element

      if(!currentPiece) {
        this.appendChild(dragged); // jeśli pole jest puste to po prostu dodajemy element
      } else {
        let draggedParent = dragged.parentElement;
        this.appendChild(dragged);
        draggedParent.appendChild(currentPiece); // jeśli pole jest zajęte to zamieniamy elementy miejscami
      }
      // sprawdzamy czy wygraliśmy przy kazdym upuszczeniu
      checkWin();
    })
    board.appendChild(slot); // dodajemy pole do planszy
  }
}

// == OBSŁUGA POWROTU PUZZLI DO PULI ==
pieces.addEventListener("dragover", function (e) {
  e.preventDefault();
});

pieces.addEventListener("drop", function (e) {
  e.preventDefault();
  let pieceId = e.dataTransfer.getData("text");
  let piece = document.getElementById(pieceId);
  pieces.appendChild(piece);
});

// === TWORZENIE PUZZLI ===

function createPuzzle() {
  pieces.innerHTML = ""; // czyszczenie puli przed dodaniem nowych elementów

  // obliczamy szerokość i wysokość jednego kafelka
  let w = rasterMap.width / rozmiar;
  let h = rasterMap.height / rozmiar;

  let arr = []; //tablica indeksów 0-15

  for (let i = 0; i < 16; i++) {
    arr.push(i);
  }

  // mieszanie
  arr.sort(() => Math.random() - 0.5);

  // tworzenie kafelków
  for (let i = 0; i < 16; i++) {
    let index = arr[i];
    // obliczamy wiersz i kolumne
    let row = Math.floor(index / rozmiar);
    let col = index % rozmiar;

    // tworzymy kawałek puzzla z canvas
    let c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.id = "piece" + index;
    c.className = "piece";
    c.draggable = true;
    c.dataset.index = index; // zapisujemy poprawną pozycje do sprawdzenia wygranej

    let pieceContext = c.getContext("2d");
    pieceContext.drawImage(rasterMap, col * w, row * h, w, h, 0, 0, w, h);

    // zapamiętujemy ID przeciąganego elementu by go później odczytać

    c.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text", this.id);
    });

    pieces.appendChild(c);
  }
}

// === SPRAWDZANIE WYGRANEJ I NOTIFICATION ===
function checkWin() {
  let slots = document.querySelectorAll("#board .slot"); // pobieramy wszystkie pola

  for (let slot of slots) {
    let piece = slot.firstChild;

    if (!piece) {
      return; // jeśli puste to jeszcze nie ułożone
    }

    if (piece.dataset.index !== slot.dataset.index) {
      return; // jeśli któryś element jest na złym miejscu to jeszcze nie ułożone
    }
  }

  // jak przejdziemy przez wszystkie pola i każdy element będzie na swoim miejscu to wygrana

  Notification.requestPermission().then(function (result) {
    // zgoda na powiadomienia
    if (result === "granted") {
      console.log("Permission:", result); // sprawdzenie w konsoli
      new Notification("Gratulacje!", {
        body: "Ułożyłeś puzzle! 🎉",
      });
    }
  });
}

createBoard();
