const { ipcRenderer } = require('electron')
const { $ } = require('../utils/helper.js')
const path = require('path')

let musicFilesPath = []

$('selectMusic').addEventListener('click', () => {
  ipcRenderer.send('open-music-file')
})

$('addMusic').addEventListener('click', () => {
  ipcRenderer.send('add-tracks', musicFilesPath)
})
const renderListHtml = (paths) => {
  const musicList = $('musicList')
  const musicItems = paths.reduce((html, music) => {
    html += `<li class="list-group-item">${path.basename(music)}</li>`
    return html
  }, '')
  musicList.innerHTML = `<ul class="list-group">${musicItems}</ul>`
}
ipcRenderer.on('selected-files', ( event, musicPath) => {
  if (Array.isArray(musicPath)) {
    renderListHtml(musicPath)
    musicFilesPath = musicPath
  }
})