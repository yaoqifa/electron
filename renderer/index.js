const { ipcRenderer } = require('electron')
const { $ } = require('../utils/helper.js')
$('addMusic').addEventListener('click', () => {
  ipcRenderer.send('add-music-window')
})