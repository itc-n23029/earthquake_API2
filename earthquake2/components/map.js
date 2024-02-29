import React, { useState, useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const EarthquakeMap = () => {
  const [earthquakes, setEarthquakes] = useState([])
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    if (selectedDate) {
      fetchEarthquakes()
    }
  }, [selectedDate])

  const fetchEarthquakes = async () => {
    try {
      const response = await fetch(
        `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.atom`
      )
      const xmlData = await response.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlData, 'text/xml')
      const entries = xmlDoc.getElementsByTagName('entry')
      const eqData = []
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const title = entry.getElementsByTagName('title')[0].textContent
        const summary = entry.getElementsByTagName('summary')[0].textContent
        const point = entry
          .getElementsByTagName('georss:point')[0]
          .textContent.split(' ')
        const latitude = parseFloat(point[0])
        const longitude = parseFloat(point[1])
        const eventTime = new Date(
          entry.getElementsByTagName('updated')[0].textContent
        )
        if (eventTime.toISOString().split('T')[0] === selectedDate) {
          eqData.push({ title, summary, latitude, longitude })
        }
      }
      setEarthquakes(eqData)
    } catch (error) {
      console.error('Error fetching earthquake data:', error)
    }
  }

  const handleDateChange = event => {
    setSelectedDate(event.target.value)
  }

  // カスタムアイコンを作成
  const customIcon = L.icon({
    iconUrl: '../images/shingentimark.jpg', // アイコンの URL
    iconSize: [30, 30], // アイコンのサイズ
    iconAnchor: [15, 30] // アイコンのアンカー位置
  })

  return (
    <div>
      <input type='date' value={selectedDate} onChange={handleDateChange} />
      <button onClick={fetchEarthquakes}>地震情報を確認</button>
      <MapContainer
        center={[35, 1]}
        zoom={3}
        style={{ height: '95vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {earthquakes.map((earthquake, index) => (
          <Marker
            key={index}
            position={[earthquake.latitude, earthquake.longitude]}
            icon={customIcon} // カスタムアイコンを指定
          >
            <Popup>
              <div>
                <h3>{earthquake.title}</h3>
                <p>{earthquake.summary}</p>
                <p>
                  Latitude: {earthquake.latitude}, Longitude:{' '}
                  {earthquake.longitude}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default EarthquakeMap

