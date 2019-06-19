const { ipcRenderer } = require('electron')
const { $ } = require('../utils/helper.js')

$('selectMusic').addEventListener('click', () => {
  ipcRenderer.send('open-music-file')
})