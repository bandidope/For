import { WAMessageStubType } from '@whiskeysockets/baileys'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const TU_FOTO_URL = 'https://tu-url.com/tu-foto.jpg'

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) throw "⚠️ Solo los administradores pueden usar este comando."
  let chat = global.db.data.chats[m.chat]??= {}
  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    await conn.reply(m.chat, "✅ *Bienvenida activada*", m)
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    await conn.reply(m.chat, "❌ *Bienvenida desactivada*.", m)
  }
}

handler.command = /^(bienvenida|welcome|bye)$/i // <- NO TOCAMOS ESTO

handler.before = async function (m, { conn, groupMetadata }) {
  try {
    if (!m.messageStubType ||!m.isGroup) return true
    const chat = global.db?.data?.chats?.[m.chat]
    if (!chat ||!chat.bienvenida) return true

    const userJid = m.messageStubParameters?.[0] || m.participant
    if (!userJid) return true

    // 1. FOTO
    let ppUser
    try { ppUser = await conn.profilePictureUrl(userJid, 'image') }
    catch { ppUser = { url: TU_FOTO_URL } }

    const userTag = `@${userJid.split('@')[0]}`
    const groupName = groupMetadata.subject
    const membersCount = groupMetadata.participants.length
    const groupDesc = groupMetadata.desc || 'Disfruta tu estadía.'

    // TEXTOS DEFAULT
    const defaultWelcome = `😏 *Vaya, alguien nuevo...*\n\nBienvenido ${userTag} a *${groupName}*.\n\n📂 *REGISTRO:*\n│ 👤 *Miembro:* #${membersCount}\n│ 🛠️ *Creador: Whois*\n│ 📝 *Info:* ${groupDesc}`
    const defaultBye = `🏃‍♂️ *Uno menos.*\n\n${userTag} salió de *${groupName}*.\n\n📉 *Quedamos:* ${membersCount}`
    const defaultKick = `⚡ *ACCESO DENEGADO*\n\n${userTag} fue expulsado de *${groupName}*.\n\n🚮 *Causa:* Estorbaba.`

    let txt = ''
    let audioFile = ''

    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        txt = (chat.sWelcome || defaultWelcome) // <- SOLO AGREGUÉ ESTO
       .replace(/@user/g, userTag).replace(/@group/g, groupName).replace(/@count/g, membersCount).replace(/@desc/g, groupDesc)
        audioFile = 'bienvenida.mp3'
        break
      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        txt = (chat.sBye || defaultBye) // <- SOLO AGREGUÉ ESTO
       .replace(/@user/g, userTag).replace(/@group/g, groupName).replace(/@count/g, membersCount)
        audioFile = 'despedida.mp3'
        break
      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        txt = (chat.sBye || defaultKick) // <- SOLO AGREGUÉ ESTO
       .replace(/@user/g, userTag).replace(/@group/g, groupName).replace(/@count/g, membersCount)
        audioFile = 'despedida.mp3'
        break
    }

    if (txt) {
      await conn.sendMessage(m.chat, {
        image: typeof ppUser === 'string'? { url: ppUser } : ppUser,
        caption: txt,
        mentions: [userJid]
      })

      const audioPath = join(process.cwd(), audioFile)
      if (existsSync(audioPath)) {
        const audioBuffer = readFileSync(audioPath)
        await conn.sendMessage(m.chat, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: false
        })
      }
    }

  } catch (e) {
    console.error("Error:", e)
  }
  return true
}

export default handler