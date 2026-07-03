import { WAMessageStubType } from '@whiskeysockets/baileys'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const TU_FOTO_URL = 'https://tu-url.com/tu-foto.jpg' // <-- PON TU URL AQUÍ

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) throw "⚠️ Solo los administradores pueden usar este comando."

  let chat = global.db.data.chats[m.chat]??= {}
  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    await conn.reply(m.chat, "✅ *Bienvenida activada* en este grupo.", m)
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    await conn.reply(m.chat, "❌ *Bienvenida desactivada*.", m)
  } else {
    await conn.reply(m.chat, "📌 Uso: *.bienvenida on* / *.bienvenida off*", m)
  }
}

handler.help = ['bienvenida <on/off>']
handler.tags = ['config']
handler.command = /^(bienvenida|welcome|bye)$/i

handler.before = async function (m, { conn, groupMetadata }) {
  try {
    if (!m.messageStubType ||!m.isGroup) return true
    const chat = global.db?.data?.chats?.[m.chat]
    if (!chat ||!chat.bienvenida) return true

    const userJid = m.messageStubParameters?.[0] || m.participant
    if (!userJid) return true

    // 1. PFP DEL USER O TU FOTO
    let ppUser
    try {
      ppUser = await conn.profilePictureUrl(userJid, 'image')
    } catch {
      ppUser = { url: TU_FOTO_URL }
    }

    const userTag = `@${userJid.split('@')[0]}`
    const groupName = groupMetadata.subject
    const membersCount = groupMetadata.participants.length

    let txt = ''
    let ttsText = '' // Texto limpio para el audio

    // 2. FORMATO IGUAL A TU FOTO STORM
    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        txt = `😏 *BIENVENIDO* 😏 |\n\n${userTag} entró a:\n\n🎮 *Grupo:* ${groupName}\n👥 *Somos:* ${membersCount} integrantes\n> Porta tu grimorio con honor.`
        ttsText = `Bienvenido. ${userJid.split('@')[0]} entró al grupo ${groupName}. Somos ${membersCount} integrantes.`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        txt = `😭 *SE FUE* 😭 |\n\n${userTag} salió de:\n\n🎮 *Grupo:* ${groupName}\n👥 *Quedamos:* ${membersCount} integrantes\n📜 *Motivo:* Salió por su cuenta\n🕊️ Que te vaya bien donde estés`
        ttsText = `Se fue. ${userJid.split('@')[0]} salió del grupo ${groupName}. Quedamos ${membersCount} integrantes. Motivo: Salió por su cuenta. Que te vaya bien donde estés`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        txt = `⚡ *KICK* ⚡ |\n\n${userTag} fue eliminado de:\n\n🎮 *Grupo:* ${groupName}\n👥 *Quedamos:* ${membersCount} integrantes\n📜 *Motivo:* Fue expulsado\n\n🚮 Causa: Estorbaba`
        ttsText = `Kick. ${userJid.split('@')[0]} fue eliminado del grupo ${groupName}. Quedamos ${membersCount} integrantes. Motivo: Fue expulsado.`
        break
    }

    if (txt) {
      // 3. IMAGEN CON PFP + RECUADRO DE TEXTO
      await conn.sendMessage(m.chat, {
        image: typeof ppUser === 'string'? { url: ppUser } : ppUser,
        caption: txt,
        mentions: [userJid]
      })

      // 4. AUDIO TTS FORMATO STORM 0:27s PTT
      try {
        const audioBuffer = await conn.getAudio(ttsText, 'es')
        await conn.sendMessage(m.chat, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: true // <-- Esto lo hace nota de voz naranja
        })
      } catch (e) {
        console.error("Error TTS:", e)
        // Fallback mp3 si TTS falla
        const audioFile = m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD? 'bienvenida.mp3' : 'despedida.mp3'
        if (existsSync(join(process.cwd(), audioFile))) {
          const audioBuffer = readFileSync(join(process.cwd(), audioFile))
          await conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg', ptt: true })
        }
      }
    }

  } catch (e) {
    console.error("Error en Bienvenida:", e)
  }
  return true
}

export default handler