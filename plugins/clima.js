import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🌤️ *Ejemplo:* .clima Chimbote\n.clima Lima\n.clima Ica')

  let ciudad = encodeURIComponent(text)
  
  // Traductor rápido
  const traducir = {
    'Sunny': 'Soleado',
    'Clear': 'Despejado',
    'Partly cloudy': 'Parcialmente nublado',
    'Cloudy': 'Nublado',
    'Overcast': 'Muy nublado',
    'Rain': 'Lluvia',
    'Light rain': 'Lluvia ligera',
    'Heavy rain': 'Lluvia fuerte',
    'Thundery': 'Tormenta',
    'Snow': 'Nieve',
    'Fog': 'Niebla',
    'Mist': 'Neblina'
  }
  
  try {
    await m.reply('⏳ Buscando clima...')
    
    let res = await fetch(`https://wttr.in/${ciudad}?format=j1`)
    let json = await res.json()
    
    let actual = json.current_condition[0]
    let hoy = json.weather[0]
    
    let temp = actual.temp_C
    let sensacion = actual.FeelsLikeC
    let estadoRaw = actual.weatherDesc[0].value
    let estado = traducir[estadoRaw] || estadoRaw // traduce si existe
    let humedad = actual.humidity
    let viento = actual.windspeedKmph
    let lluvia = hoy.hourly[0].chanceofrain
    
    let emoji = '🌤️'
    if(estadoRaw.includes('Rain')) emoji = '🌧️'
    if(estadoRaw.includes('Cloud')) emoji = '☁️'
    if(estadoRaw.includes('Sun') || estadoRaw.includes('Clear')) emoji = '☀️'
    if(estadoRaw.includes('Snow')) emoji = '❄️'
    if(estadoRaw.includes('Thunder')) emoji = '⛈️'

    let texto = `
${emoji} *CLIMA EN ${text.toUpperCase()}*

*Estado:* ${estado}
*Temperatura:* ${temp}°C
*Sensación térmica:* ${sensacion}°C
*Humedad:* ${humedad}%
*Viento:* ${viento} km/h
*Probabilidad de lluvia:* ${lluvia}%

*Máxima:* ${hoy.maxtempC}°C  *Mínima:* ${hoy.mintempC}°C
`
    await conn.reply(m.chat, texto, m)
    
  } catch(e) {
    await m.reply('❌ No encontré esa ciudad. Escribe bien el nombre.\nEj: .clima Ica')
  }
}

handler.help = ['clima <ciudad>']
handler.tags = ['main']
handler.command = /^(clima|weather|tiempo)$/i
export default handler