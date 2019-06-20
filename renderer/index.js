const { ipcRenderer } = require('electron')
const { $ } = require('../utils/helper.js')
$('addMusic').addEventListener('click', () => {
  ipcRenderer.send('add-music-window')
})

const renderListHtml = (tracks) => {
  const tracksList = $('tracksList')
  const tracksListHtml = tracks.reduce((html, track) => {
    html += `<li class="row d-flex list-group-item justify-content-between align-item-center">
      <div class="col-10">
        <i class="far fa-music mr-2"></i>
        <b>${track.fileName}</b>
      </div>
      <div class="col-2">
        <i class="far fa-play mr-3"></i>
        <i class="far fa-trash-alt"></i>
      </div>
    </li>`
    return html
  }, '')
  tracksList.innerHTML = tracks.length > 0 ? `<ul class="list-group">${tracksListHtml}</ul>` :
  `<div class="alert alert-primary">还没有添加任何音乐</div>`
}

ipcRenderer.on('getTracks', (event, tracks) => {
  renderListHtml(tracks)
})