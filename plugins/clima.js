import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🌤️ *Ejemplo:* .clima Chimbote\n.clima Lima\n.clima Tokyo')

  let ciudad = encodeURIComponent(text)
  
  try {
    await m.reply('⏳ Buscando clima...')
    
    // API gratis sin key
    let res = await fetch(`https://wttr.in/${ciudad}?format=j1`)
    let json = await res.json()
    
    let actual = json.current_condition[0]
    let hoy = json.weather[0]
    
    let temp = actual.temp_C
    let sensacion = actual.FeelsLikeC
    let estado = actual.weatherDesc[0].value
    let humedad = actual.humidity
    let viento = actual.windspeedKmph
    let lluvia = hoy.hourly[0].chanceofrain
    
    let emoji = '🌤️'
    if(estado.includes('Rain')) emoji = '🌧️'
    if(estado.includes('Cloud')) emoji = '☁️'
    if(estado.includes('Sun')) emoji = '☀️'
    if(estado.includes('Snow')) emoji = '❄️'

    let texto = `
${emoji} *CLIMA EN ${text.toUpperCase()}*

*Estado:* ${estado}
*Temperatura:* ${temp}°C
*Sensación:* ${sensacion}°C
*Humedad:* ${humedad}%
*Viento:* ${viento} km/h
*Prob. Lluvia:* ${lluvia}%

*Max:* ${hoy.maxtempC}°C  *Min:* ${hoy.mintempC}°C
`
    await conn.reply(m.chat, texto, m)
    
  } catch(e) {
    await m.reply('❌ No encontré esa ciudad. Escribe bien el nombre.\nEj: .clima Chimbote')
  }
}

handler.help = ['clima <ciudad>']
handler.tags = ['main']
handler.command = /^(clima|weather|tiempo)$/i
export default handler