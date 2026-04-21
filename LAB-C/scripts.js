const statusText = document.getElementById("status")
const coordsText = document.getElementById("coords")
const notificationButton = document.getElementById("notificationButton")
const locationButton = document.getElementById("locationButton")
const downloadButton = document.getElementById("downloadButton")
const rasterPreview = document.getElementById("rasterPreview")
const piecesBox = document.getElementById("pieces")
const board = document.getElementById("board")

let map
let marker = null
let draggedPiece = null
let gameFinished = false

function setStatus(text) {
  statusText.textContent = text
}

function updateNotificationText() {
  if (!("Notification" in window)) {
    notificationButton.textContent = "Powiadomienia niedostępne"
    return
  }

  if (Notification.permission === "granted") {
    notificationButton.textContent = "Powiadomienia włączone"
  } else {
    notificationButton.textContent = "Włącz powiadomienia"
  }
}

function requestNotifications() {
  if (!("Notification" in window)) {
    setStatus("Ta przeglądarka nie obsługuje powiadomień.")
    return
  }

  Notification.requestPermission().then(() => {
    updateNotificationText()
    setStatus("Sprawdzono zgodę na powiadomienia.")
  })
}

function initMap() {
  map = L.map("map").setView([0, 0], 13)

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    crossOrigin: true
  }).addTo(map)
}

function showMyLocation() {
  if (!navigator.geolocation) {
    setStatus("Geolokalizacja nie jest dostępna.")
    return
  }

  setStatus("Pobieranie lokalizacji...")

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      coordsText.textContent = "Współrzędne: " + lat.toFixed(5) + ", " + lng.toFixed(5)
      map.setView([lat, lng], 15)

      if (marker) {
        map.removeLayer(marker)
      }

      marker = L.marker([lat, lng]).addTo(map)
      marker.bindPopup("Tu jesteś").openPopup()

      setStatus("Pobrano lokalizację.")
    },
    () => {
      setStatus("Nie udało się pobrać lokalizacji.")
    }
  )
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[randomIndex]
    array[randomIndex] = temp
  }
}

function allowDrop(event) {
  event.preventDefault()
}

function checkBoard() {
  const cells = board.querySelectorAll(".drop-cell")
  let good = 0

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    const piece = cell.querySelector(".piece")

    if (piece && piece.dataset.id === cell.dataset.id) {
      cell.classList.add("correct")
      good += 1
    } else {
      cell.classList.remove("correct")
    }

    if (!piece) {
      cell.textContent = cell.dataset.label
    }
  }

  if (good === 16 && !gameFinished) {
    gameFinished = true
    console.debug("Puzzle ułożone poprawnie")
    setStatus("Brawo! Puzzle są ułożone poprawnie.")

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("LAB C", {
        body: "Puzzle zostały ułożone poprawnie."
      })
    }
  }
}

function createBoard() {
  board.innerHTML = ""

  for (let i = 0; i < 16; i++) {
    const cell = document.createElement("div")
    cell.className = "drop-cell"
    cell.dataset.id = String(i)
    cell.dataset.label = "Pole " + (i + 1)
    cell.textContent = cell.dataset.label

    cell.addEventListener("dragover", allowDrop)
    cell.addEventListener("drop", (event) => {
      event.preventDefault()

      if (!draggedPiece) {
        return
      }

      if (cell.querySelector(".piece")) {
        return
      }

      cell.textContent = ""
      cell.appendChild(draggedPiece)
      checkBoard()
    })

    board.appendChild(cell)
  }
}

function makePiece(canvas, id) {
  canvas.className = "piece"
  canvas.dataset.id = String(id)
  canvas.draggable = true

  canvas.addEventListener("dragstart", (event) => {
    draggedPiece = canvas
    event.dataTransfer.setData("text/plain", canvas.dataset.id)
  })

  canvas.addEventListener("dragend", () => {
    draggedPiece = null
  })
}

function createPuzzle(sourceCanvas) {
  piecesBox.innerHTML = ""
  gameFinished = false
  createBoard()

  const sourceWidth = Math.floor(sourceCanvas.width / 4)
  const sourceHeight = Math.floor(sourceCanvas.height / 4)
  const list = []

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const id = row * 4 + col
      const piece = document.createElement("canvas")
      piece.width = 120
      piece.height = 120

      const ctx = piece.getContext("2d")
      ctx.drawImage(sourceCanvas, col * sourceWidth, row * sourceHeight, sourceWidth, sourceHeight, 0, 0, 120, 120)

      makePiece(piece, id)
      list.push(piece)
    }
  }

  shuffle(list)

  for (let i = 0; i < list.length; i++) {
    piecesBox.appendChild(list[i])
  }
}

function downloadMap() {
  setStatus("Pobieranie mapy...")

  leafletImage(map, (error, canvas) => {
    if (error) {
      setStatus("Nie udało się pobrać mapy.")
      return
    }

    rasterPreview.innerHTML = ""
    rasterPreview.appendChild(canvas)
    createPuzzle(canvas)
    setStatus("Mapa została pobrana i podzielona na puzzle.")
  })
}

notificationButton.addEventListener("click", requestNotifications)
locationButton.addEventListener("click", showMyLocation)
downloadButton.addEventListener("click", downloadMap)
piecesBox.addEventListener("dragover", allowDrop)
piecesBox.addEventListener("drop", (event) => {
  event.preventDefault()

  if (!draggedPiece) {
    return
  }

  piecesBox.appendChild(draggedPiece)
  checkBoard()
})

updateNotificationText()
initMap()
