import { WAMessageStubType } from '@whiskeysockets/baileys'
import { readFileSync } from 'fs'
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

    // 1. PFP DEL USER O TU FOTO
    let ppUser
    try {
      ppUser = await conn.profilePictureUrl(m.messageStubParameters?.[0], 'image')
    } catch {
      ppUser = { url: TU_FOTO_URL }
    }

    const userJid = m.messageStubParameters?.[0] || m.participant
    if (!userJid) return true

    const userTag = `@${userJid.split('@')[0]}`
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || 'Disfruta tu estadía.'
    const membersCount = groupMetadata.participants.length

    let txt = ''
    let audioFile = ''

    // 2. TUS MISMOS TEXTOS
    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        txt = chat.customWelcome? chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc) :
        `😏 *Vaya, alguien nuevo...*\n\nBienvenido ${userTag} a *${groupName}*.\n\n📂 *REGISTRO DE ACCESO:*\n│ 👤 *Miembro:* #${membersCount}\n│ 🛠️ *Creador: Whois*\n│ 📝 *Info:* ${groupDesc}\n\n> Intenta no hacer que te echen rápido.`
        audioFile = 'bienvenida.mp3' // <-- directo en raíz
        break

      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        txt = chat.customBye? chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
        `🏃‍♂️ *Uno menos, ni falta que hacía.*\n\n${userTag} no aguantó el nivel de *${groupName}*.\n\n📉 *Quedamos:* ${membersCount} sobrevivientes.`
        audioFile = 'despedida.mp3' // <-- directo en raíz
        break

      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        txt = chat.customKick? chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
        `⚡ *SISTEMA: ACCESO DENEGADO*\n\n${userTag} fue borrado de la existencia en *${groupName}*.\n\n🚮 *Causa:* Estorbaba.\n👥 *Población actual:* ${membersCount}`
        audioFile = 'despedida.mp3' // <-- directo en raíz
        break
    }

    if (txt) {
      // 3. IMAGEN CON PFP
      await conn.sendMessage(m.chat, {
        image: typeof ppUser === 'string'? { url: ppUser } : ppUser,
        caption: txt,
        mentions: [userJid]
      })

      // 4. AUDIO DIRECTO DESDE RAÍZ COMO PTT
      try {
        const audioPath = join(process.cwd(), audioFile) // <-- sin /media
        const audioBuffer = readFileSync(audioPath)
        await conn.sendMessage(m.chat, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: true
        })
      } catch (e) {
        console.error("Error mandando audio:", e)
      }
    }

  } catch (e) {
    console.error("Error en Bienvenida:", e)
  }
  return true
}

export default handler