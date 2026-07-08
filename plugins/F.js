/*
  📂 COMANDO:.ig.instagram
  👤 CREADOR: Whois Yallico
  ⚡ CANAL: For Three
*/

import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`📎 *Ejemplo:* ${usedPrefix + command} https://www.instagram.com/reel/xxxxx`)
  if (!text.includes('instagram.com')) return m.reply(`❌ *Manda un link de Instagram válido*`)

  await m.react('🔄')

  try {
    const api = `https://senko-apiserverg5.onrender.com/api/instagram?url=${encodeURIComponent(text)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json.status ||!json.data) throw json

    const data = json.data
    let caption = `╭─❒「 📸 INSTAGRAM DOWNLOADER 」
│
│ 👤 Usuario: @${data.username || '-'}
│ ❤️ Likes: ${data.like_count || 0}
│ 💬 Comentarios: ${data.comment_count || 0}
│ 📝 ${data.caption || 'Sin descripción'}
│ 👤 Creador: Whois Yallico
╰─⬣`

    // Si es video
    if (data.type === 'video' || data.video_url) {
      await conn.sendMessage(m.chat, {
        video: { url: data.video_url || data.url },
        caption: caption
      }, { quoted: m })
    } 
    // Si es imagen
    else if (data.type === 'image' || data.image_url) {
      await conn.sendMessage(m.chat, {
        image: { url: data.image_url || data.url },
        caption: caption
      }, { quoted: m })
    }
    // Si es carrousel
    else if (data.type === 'carousel' && data.carousel) {
      for (let i = 0; i < data.carousel.length; i++) {
        const item = data.carousel[i]
        if (item.type === 'video') {
          await conn.sendMessage(m.chat, { video: { url: item.url } }, { quoted: m })
        } else {
          await conn.sendMessage(m.chat, { image: { url: item.url } }, { quoted: m })
        }
        await new Promise(resolve => setTimeout(resolve, 1500)) // delay para no ban
      }
      await conn.reply(m.chat, caption, m)
    }

    await m.react('✅')

  } catch (e) {
    await m.react('🔴')
    console.log(e)
    m.reply(`❌ Error al descargar. El link puede ser privado o el API está caído.`)
  }
}

handler.help = ['ig <link>']
handler.tags = ['downloader']
handler.command = /^(ig|instagram|igdl)$/i
handler.limit = true
export default handler