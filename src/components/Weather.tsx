import { useEffect, useState } from 'react'

export default function Weather() {
  const [temp, setTemp] = useState<number | null>(null)
  const [desc, setDesc] = useState('Mekong air…')

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=11.5564&longitude=104.9282&current=temperature_2m,weather_code',
    )
      .then((r) => r.json())
      .then((d) => {
        setTemp(Math.round(d.current.temperature_2m))
        const code = d.current.weather_code
        setDesc(code <= 1 ? 'Clear over Diamond Island' : code < 50 ? 'Hazy, still gorgeous' : 'Bring the umbrella')
      })
      .catch(() => setDesc('Weather took a nap'))
  }, [])

  return (
    <div>
      <div className="weather">
        <span className="temp">{temp ?? '–'}°</span>
        <span>Phnom Penh</span>
      </div>
      <p className="meta" style={{ marginTop: 6 }}>
        {desc}
      </p>
    </div>
  )
}
