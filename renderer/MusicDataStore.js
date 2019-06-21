const Store = require('electron-store')
const uuidv4 = require('uuid/v4')
const path = require('path')

class DataStore extends Store {
  constructor(settings) {
    super(settings)
    this.tracks = this.get('tracks') || []
  }

  saveTracks() {
    this.set('tracks', this.tracks)
    return this
  }

  getTracks() {
    return this.get('tracks') || []
  }

  addTracks(tracks) {
    const currentTracksPath = this.getTracks('tracks').map(track => track.path)
    const tracksWithProps = tracks.map(track => {
      return {
        id: uuidv4(),
        path: track,
        fileName: path.basename(track)
      }
    }).filter(track => {
      return currentTracksPath.indexOf(track.path) < 0
    })
    this.tracks = this.tracks.concat(tracksWithProps)
    return this.saveTracks()
  }

  deleteTrack(deletedId) {
    this.tracks = this.tracks.filter(track => track.id !== deletedId)
    return this.saveTracks()
  }
}

module.exports = DataStore