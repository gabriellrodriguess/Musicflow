// Lista de músicas
const musicas = [
  { id: 1, titulo: "Blinding Lights", artista: "The Weeknd", duracao: "3:20", emoji: "🌙" },
  { id: 2, titulo: "Flowers", artista: "Miley Cyrus", duracao: "3:21", emoji: "🌸" },
  { id: 3, titulo: "As It Was", artista: "Harry Styles", duracao: "2:47", emoji: "🌊" },
  { id: 4, titulo: "Anti-Hero", artista: "Taylor Swift", duracao: "3:21", emoji: "🦋" },
  { id: 5, titulo: "Unholy", artista: "Sam Smith", duracao: "2:36", emoji: "🔥" },
  { id: 6, titulo: "Levitating", artista: "Dua Lipa", duracao: "3:24", emoji: "✨" },
  { id: 7, titulo: "Stay", artista: "The Kid LAROI", duracao: "2:21", emoji: "💫" },
  { id: 8, titulo: "Heat Waves", artista: "Glass Animals", duracao: "3:59", emoji: "🎸" },
  { id: 9, titulo: "Midnight Rain", artista: "Taylor Swift", duracao: "3:53", emoji: "🌧️" },
  { id: 10, titulo: "Bad Habit", artista: "Steve Lacy", duracao: "3:52", emoji: "🎵" },
]

// Estado da aplicação
let indiceAtual = 0
let tocando = false
let aleatorio = false
let repetir = false
let abaAtual = "todas"
let progresso = 0
let intervalo = null

// Favoritos salvos no localStorage
let favoritos = JSON.parse(localStorage.getItem("musicflow_favoritos")) || []

// Salva os favoritos no localStorage
function salvarFavoritos() {
  localStorage.setItem("musicflow_favoritos", JSON.stringify(favoritos))
}

// Verifica se uma música é favorita
function ehFavorita(id) {
  return favoritos.includes(id)
}

// Favorita ou desfavorita uma música pelo id
function toggleFavorito(id) {
  if (ehFavorita(id)) {
    favoritos = favoritos.filter(function(f) {
      return f !== id
    })
  } else {
    favoritos.push(id)
  }

  salvarFavoritos()
  atualizarBotaoFavoritoPlayer()
  renderizarLista()
}

// Favorita ou desfavorita a música que está tocando
function favoritarAtual() {
  const musica = musicas[indiceAtual]
  toggleFavorito(musica.id)
}

// Atualiza o botão de favorito no player principal
function atualizarBotaoFavoritoPlayer() {
  const musica = musicas[indiceAtual]
  const btn = document.getElementById("btnFavoritar")

  if (ehFavorita(musica.id)) {
    btn.textContent = "❤️"
  } else {
    btn.textContent = "🤍"
  }
}

// Carrega uma música no player pelo índice
function carregarMusica(indice) {
  indiceAtual = indice
  const musica = musicas[indice]

  document.getElementById("tituloAtual").textContent = musica.titulo
  document.getElementById("artistaAtual").textContent = musica.artista
  document.getElementById("tempoDuracao").textContent = musica.duracao
  document.getElementById("albumArte").textContent = musica.emoji
  document.getElementById("progressoFill").style.width = "0%"
  document.getElementById("tempoAtual").textContent = "0:00"

  progresso = 0

  atualizarBotaoFavoritoPlayer()
  renderizarLista()
}

// Inicia ou pausa a música
function togglePlay() {
  tocando = !tocando
  const btn = document.getElementById("btnPlay")

  if (tocando) {
    btn.textContent = "⏸"
    iniciarProgresso()
  } else {
    btn.textContent = "▶"
    pararProgresso()
  }
}

// Simula o progresso da música
function iniciarProgresso() {
  pararProgresso()

  const partes = musicas[indiceAtual].duracao.split(":")
  const minutos = parseInt(partes[0])
  const segundos = parseInt(partes[1])
  const totalSegundos = minutos * 60 + segundos

  intervalo = setInterval(function() {
    progresso += (100 / totalSegundos) * 0.5

    if (progresso >= 100) {
      progresso = 100
      pararProgresso()

      setTimeout(function() {
        if (repetir) {
          progresso = 0
          iniciarProgresso()
        } else {
          proximaMusica()
        }
      }, 500)
    }

    // Atualiza o tempo na tela
    const segundosPassados = Math.floor((progresso / 100) * totalSegundos)
    const m = Math.floor(segundosPassados / 60)
    const s = segundosPassados % 60
    const sFormatado = s.toString().padStart(2, "0")

    document.getElementById("tempoAtual").textContent = m + ":" + sFormatado
    document.getElementById("progressoFill").style.width = progresso + "%"

  }, 500)
}

// Para o progresso
function pararProgresso() {
  if (intervalo) {
    clearInterval(intervalo)
    intervalo = null
  }
}

// Clica na barra de progresso para pular
function pularPara(event) {
  const barra = event.currentTarget
  const rect = barra.getBoundingClientRect()
  const clique = event.clientX - rect.left
  progresso = (clique / rect.width) * 100

  const partes = musicas[indiceAtual].duracao.split(":")
  const minutos = parseInt(partes[0])
  const segundos = parseInt(partes[1])
  const totalSegundos = minutos * 60 + segundos

  const segundosPassados = Math.floor((progresso / 100) * totalSegundos)
  const m = Math.floor(segundosPassados / 60)
  const s = segundosPassados % 60
  const sFormatado = s.toString().padStart(2, "0")

  document.getElementById("tempoAtual").textContent = m + ":" + sFormatado
  document.getElementById("progressoFill").style.width = progresso + "%"
}

// Vai para a próxima música
function proximaMusica() {
  pararProgresso()
  progresso = 0

  let proximo

  if (aleatorio) {
    proximo = Math.floor(Math.random() * musicas.length)
  } else {
    proximo = (indiceAtual + 1) % musicas.length
  }

  carregarMusica(proximo)

  if (tocando) {
    iniciarProgresso()
  }
}

// Vai para a música anterior
function musicaAnterior() {
  pararProgresso()
  progresso = 0

  const anterior = (indiceAtual - 1 + musicas.length) % musicas.length
  carregarMusica(anterior)

  if (tocando) {
    iniciarProgresso()
  }
}

// Liga ou desliga o modo aleatório
function toggleAleatorio() {
  aleatorio = !aleatorio
  const btn = document.getElementById("btnAleatorio")

  if (aleatorio) {
    btn.classList.add("ativo")
  } else {
    btn.classList.remove("ativo")
  }
}

// Liga ou desliga o modo repetir
function toggleRepetir() {
  repetir = !repetir
  const btn = document.getElementById("btnRepetir")

  if (repetir) {
    btn.classList.add("ativo")
  } else {
    btn.classList.remove("ativo")
  }
}

// Muda a aba (todas ou favoritas)
function mostrarAba(aba) {
  abaAtual = aba

  document.getElementById("abaTodasBtn").classList.remove("ativa")
  document.getElementById("abaFavoritasBtn").classList.remove("ativa")

  if (aba === "todas") {
    document.getElementById("abaTodasBtn").classList.add("ativa")
  } else {
    document.getElementById("abaFavoritasBtn").classList.add("ativa")
  }

  renderizarLista()
}

// Seleciona uma música da lista
function selecionarMusica(indice) {
  pararProgresso()
  carregarMusica(indice)

  if (!tocando) {
    tocando = true
    document.getElementById("btnPlay").textContent = "⏸"
  }

  iniciarProgresso()
}

// Renderiza a lista de músicas na tela
function renderizarLista() {
  const lista = document.getElementById("listaMusicas")

  let musicasFiltradas

  if (abaAtual === "favoritas") {
    musicasFiltradas = musicas.filter(function(m) {
      return ehFavorita(m.id)
    })
  } else {
    musicasFiltradas = musicas
  }

  if (musicasFiltradas.length === 0) {
    lista.innerHTML = `
      <div class="estado-vazio">
        <div class="icone">💔</div>
        <p>Nenhuma música favorita ainda.<br>Toque ❤️ para favoritar!</p>
      </div>
    `
    return
  }

  lista.innerHTML = ""

  musicasFiltradas.forEach(function(musica) {
    const indiceReal = musicas.indexOf(musica)
    const estaAtiva = indiceAtual === indiceReal
    const eFavorita = ehFavorita(musica.id)

    const div = document.createElement("div")
    div.classList.add("item-musica")

    if (estaAtiva) {
      div.classList.add("ativa")
    }

    div.innerHTML = `
      <div class="emoji-musica">${musica.emoji}</div>
      <div class="meta-musica">
        <div class="nome-musica">${musica.titulo}</div>
        <div class="artista-musica">${musica.artista}</div>
      </div>
      <div class="direita-musica">
        <span class="duracao-musica">${musica.duracao}</span>
        <button class="btn-fav-item ${eFavorita ? "favoritada" : ""}" onclick="event.stopPropagation(); toggleFavorito(${musica.id})">${eFavorita ? "❤️" : "🤍"}</button>
      </div>
    `

    div.addEventListener("click", function() {
      selecionarMusica(indiceReal)
    })

    lista.appendChild(div)
  })
}

// Inicia o app
carregarMusica(0)
renderizarLista()
