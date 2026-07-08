/*
  📂 COMANDO: Sharpify Remove BG PNG
  👤 CREADOR: Whois Yallico
  ⚡ CANAL: For Three
*/

import fetch from 'node-fetch'
import FormData from 'form-data'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import sharp from 'sharp' // Para forzar PNG con transparencia

const apiHeaders = {
  'User-Agent': 'okhttp/4.9.2',
  'Accept-Encoding': 'gzip'
}

async function getImageBuffer(m, conn) {
  const msg = m.message
  const types = ['imageMessage', 'ephemeralMessage', 'viewOnceMessage', 'viewOnceMessageV2']
  let imageMsg = null
  for (const t of types) {
    if (msg?.[t]) {
      imageMsg = t === 'ephemeralMessage'? msg[t]?.message?.imageMessage : t.startsWith('viewOnce')? msg[t]?.message?.imageMessage : msg[t]
      if (imageMsg) break
    }
  }
  if (!imageMsg && m.quoted) {
    const q = m.quoted
    const qMsg = q.message || q.msg || q
    for (const t of types) {
      if (qMsg?.[t]) {
        imageMsg = t === 'ephemeralMessage'? qMsg[t]?.message?.imageMessage : t.startsWith('viewOnce')? qMsg[t]?.message?.imageMessage : qMsg[t]
        if (imageMsg) break
      }
    }
    if (!imageMsg && (q.mimetype || '').startsWith('image/')) imageMsg = q
  }
  if (!imageMsg) return null
  const stream = await downloadContentFromMessage(imageMsg, 'image')
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks)
}

async function sharpifyRemoveBg(imgBuffer) {
  const form = new FormData()
  form.append('file', imgBuffer, { filename: 'source.jpg', contentType: 'image/jpeg' })

  const res = await fetch('https://sharpify-api.vercel.app/api/enhance/bgrem', {
    method: 'POST',
    headers: {...apiHeaders,...form.getHeaders() },
    body: form
  })

  if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)
  const data = await res.json()
  return data
}

const handler = async (m, { conn }) => {
  await m.react('🔄')
  let imgBuffer = await getImageBuffer(m, conn)
  if (!imgBuffer) {
    await m.react('🔴')
    return conn.reply(m.chat, `📸 Responde a una imagen para quitarle el fondo`, m)
  }

  try {
    const data = await sharpifyRemoveBg(imgBuffer)
    const imgUrl = data?.url || data?.image || data?.result || data?.output
    if (!imgUrl) throw new Error('La API no devolvió imagen')

    // 1. Descargar imagen
    const imgRes = await fetch(imgUrl)
    const buffer = Buffer.from(await imgRes.arrayBuffer())

    // 2. FORZAR A PNG CON TRANSPARENCIA usando sharp
    const pngBuffer = await sharp(buffer).png().toBuffer()

    // 3. Mandar como imagen PNG
    await conn.sendMessage(m.chat, {
      image: pngBuffer,
      mimetype: 'image/png', // IMPORTANTE
      caption: `╭─❒「 ✨ FOR THREE REMOVE BG 」
│
│ ✅ Fondo eliminado - Formato PNG
│ 👤 Creador: Whois Yallico
╰─⬣`
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    await m.react('🔴')
    console.error('[Sharpify] Error:', e)
    return conn.reply(m.chat, `❌ Error: ${e.message}`, m)
  }
}

handler.help = ['removebgpng']
handler.tags = ['tools', 'for three']
handler.command = /^(removebgpng|rbg|ftpng)$/i
handler.limit = true

export default handler