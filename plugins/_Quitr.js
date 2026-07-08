/*
  📂 COMANDO: Remove BG Local PNG
  👤 CREADOR: Whois Yallico
  ⚡ CANAL: For Three
*/

import { removeBackground } from 'background-removal-js'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

async function getImageBuffer(m, conn) {
  //... mismo código de antes para descargar imagen
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

const handler = async (m, { conn }) => {
  await m.react('🔄')
  let imgBuffer = await getImageBuffer(m, conn)
  if (!imgBuffer) return conn.reply(m.chat, `📸 Responde a una imagen`, m)

  try {
    // QUITAR FONDO LOCAL
    const resultBuffer = await removeBackground(imgBuffer)

    await conn.sendMessage(m.chat, {
      image: resultBuffer,
      mimetype: 'image/png',
      caption: `╭─❒「 ✨ FOR THREE REMOVE BG 」
│
│ ✅ Fondo eliminado REAL
│ 👤 Creador: Whois Yallico
╰─⬣`
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    await m.react('🔴')
    conn.reply(m.chat, `❌ Error: ${e.message}`, m)
  }
}

handler.command = /^(rmbg|removebg|ftbg)$/i
export default handler