// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron')
let myNotification = new Notification('标题', {
  body: '通知正文内容'
})

myNotification.onclick = () => {
  console.log('通知被点击')
}

ipcRenderer.send('aMessage', 'message from renderer')

ipcRenderer.on('aMessageReply', (event, args) => {
  document.getElementById('aMessage').innerText = args
})