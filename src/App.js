/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import shuffle from 'lodash/shuffle'
import take from 'lodash/take'
import marcel from './marcel'
import './App.css'
import { clearTimeout } from 'timers'

const api = (driveFolderId, apikey) =>
  `https://www.googleapis.com/drive/v3/files?q='${driveFolderId}'+in+parents&key=${apikey}`

const img = (id, apikey) => `https://drive.google.com/uc?export=view&id=${id}&key=${apikey}`

class App extends React.Component {
  state = {
    availablePhotos: [],
    photos: [],
  }

  componentDidUpdate(prevProps) {
    const { apikey, driveFolderId } = this.props
    if (apikey !== prevProps.apikey || driveFolderId !== prevProps.driveFolderId) this.fetchPhotos()
  }

  componentWillUnmount() {
    clearTimeout(this.randomizerTimeout)
  }

  fetchPhotos = () => {
    const { driveFolderId, apikey } = this.props
    console.log(driveFolderId, apikey)
    if (!driveFolderId || !apikey) return

    if (this.randomizerTimeout) clearTimeout(this.randomizerTimeout)

    fetch(api(driveFolderId, apikey))
      .then(response => response.json())
      .then(this.setAvailablePhotos)
      .then(this.selectRandomPhotos)
  }

  setAvailablePhotos = directory => {
    const { apikey } = this.props
    const availablePhotos = directory.files.map(({ id }) => ({ id, src: img(id, apikey) }))
    this.setState({ availablePhotos })
    console.log('Photos found : ', availablePhotos)
  }

  selectRandomPhotos = () => {
    const { nbPhotos, duration } = this.props

    const shuffledPhotos = shuffle(this.state.availablePhotos)
    const photos = take(shuffledPhotos, nbPhotos)

    console.log('Photos randomly choosen : ', photos)
    this.setState({ photos })

    this.randomizerTimeout = setTimeout(this.selectRandomPhotos, (duration || 30) * 1000)
  }

  render() {
    const imgStyles = {
      width: `calc(${1 / this.props.columns * 100}% - 0.2em)`,
    }

    return (
      <div className="photoGallery">
        {this.state.photos.map(photo => <img key={photo.id} src={photo.src} style={imgStyles} />)}
      </div>
    )
  }
}

export default marcel(App)
