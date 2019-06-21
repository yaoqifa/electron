const { ipcRenderer } = require('electron')
const { $ } = require('../utils/helper.js')

const musicAudio = new Audio()
let allTracks = []
let currentTrack = null

$('addMusic').addEventListener('click', () => {
  ipcRenderer.send('add-music-window')
})

const renderListHtml = (tracks) => {
  const tracksList = $('tracksList')
  const tracksListHtml = tracks.reduce((html, track) => {
    html += `<li class="row d-flex list-group-item justify-content-between align-item-center">
      <div class="col-10">
        <i class="far fa-music mr-3">${track.fileName.slice(0, 1)}</i>
        <b>${track.fileName}</b>
      </div>
      <div class="col-2">
        <i class="far fa-play mr-3" data-id="${track.id}"></i>
        <i class="far fa-trash-alt" data-id="${track.id}">删除</i>
      </div>
    </li>`
    return html
  }, '')
  tracksList.innerHTML = tracks.length > 0 ? `<ul class="list-group">${tracksListHtml}</ul>` :
  `<div class="alert alert-primary">还没有添加任何音乐</div>`
}
const renderPlayerHtml = (name, duration) => {
  const player = $('playerStatus')
  const html = `<div class="col font-weight-bold">
      正在播放: ${name}
    </div>
    <div class="col">
      <span id="currentSeeker"> 00:00</span> / ${duration}
    </div>
  `
  player.innerHTML = html
}

const updateProgressHtml = (currentTime) => {
  const seeker = $('currentSeeker')
  seeker.innerHTML = currentTime
}

ipcRenderer.on('getTracks', (event, tracks) => {
  allTracks = tracks
  renderListHtml(tracks)
})

musicAudio.addEventListener('loadedmetadata', () => {
  // 渲染播放器状态
  renderPlayerHtml(currentTrack.fileName, musicAudio.duration)
})

musicAudio.addEventListener('timeupdate', () => {
  // 更新播放时间
  updateProgressHtml(musicAudio.currentTime)
})

$('tracksList').addEventListener('click', (event) => {
  event.preventDefault()
  const { dataset, classList } = event.target
  const id = dataset && dataset.id
  if (id && classList.contains('fa-play')) {
    if (currentTrack && currentTrack.id === id) {
      musicAudio.play()
    } else {
      currentTrack = allTracks.find(track => track.id === id)
      musicAudio.src = currentTrack.path
      musicAudio.play()
      const resetIconEle = document.querySelector('.fa-pause')
      resetIconEle && resetIconEle.classList.replace('fa-pause', 'fa-play')
    }
    classList.replace('fa-play', 'fa-pause')
  } else if (id && classList.contains('fa-pause')) {
    musicAudio.pause()
    classList.replace('fa-pause', 'fa-play')
  } else if (id && classList.contains('fa-trash-alt')) {
    ipcRenderer.send('delete-track', id)
  }
})