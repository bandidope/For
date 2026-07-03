let handler = async (m, { conn, command }) => {
    let chat = m.chat
    let chatData = global.db.data.chats[m.chat]??= {}
    chatData.matrimonios = chatData.matrimonios || {}
    chatData.pedidas = chatData.pedidas || {}

    // [FIX TOTAL] Sacar solo el numero sin importar si es @lid o @s.whatsapp.net
    let getNum = (jid) => jid?.split('@')[0] + '@s.whatsapp.net'
    
    let quien = getNum(m.sender)
    let conQuien = getNum(m.mentionedJid?.[0])

    // ===== PEDIR =====
    if (command == 'pedir') {
        if (!m.mentionedJid?.[0]) return m.reply('❌ Etiqueta a alguien\n*Ejemplo:*.pedir @user')
        if (quien == conQuien) return m.reply('❌ No te puedes casar contigo mismo')
        if (chatData.matrimonios[quien]) return m.reply('❌ Ya estás casado')
        if (chatData.matrimonios[conQuien]) return m.reply(`❌ @${conQuien.split('@')[0]} ya está casado/a`, null, { mentions: [conQuien] })
        if (chatData.pedidas[conQuien]) return m.reply('❌ Esa persona ya tiene una propuesta pendiente')

        chatData.pedidas[conQuien] = quien

        let txt = `💍 *PEDIDA DE MANO* 💍\n\n@${quien.split('@')[0]} le ha pedido matrimonio a @${conQuien.split('@')[0]}\n\n@${conQuien.split('@')[0]} usa.aceptar o.rechazar`
        return conn.sendMessage(chat, { text: txt, mentions: [quien, conQuien] })
    }

    // ===== ACEPTAR =====
    if (command == 'aceptar') {
        let pedidor = chatData.pedidas[quien]
        if (!pedidor) return m.reply('❌ No tienes ninguna propuesta de matrimonio')

        chatData.matrimonios[quien] = pedidor
        chatData.matrimonios[pedidor] = quien
        delete chatData.pedidas[quien]

        let txt = `💒 *SE CASARON* 💒\n\n💕 @${pedidor.split('@')[0]} y @${quien.split('@')[0]} ahora están casados! 🥂`
        return conn.sendMessage(chat, { text: txt, mentions: [pedidor, quien] })
    }

    // ===== RECHAZAR =====
    if (command == 'rechazar') {
        let pedidor = chatData.pedidas[quien]
        if (!pedidor) return m.reply('❌ No tienes ninguna propuesta de matrimonio')
        delete chatData.pedidas[quien]

        let txt = `💔 @${quien.split('@')[0]} rechazó la propuesta de @${pedidor.split('@')[0]}`
        return conn.sendMessage(chat, { text: txt, mentions: [quien, pedidor] })
    }

    // ===== DIVORCIO =====
    if (command == 'divorcio') {
        let pareja = chatData.matrimonios[quien]
        if (!pareja) return m.reply('❌ No estás casado con nadie')

        delete chatData.matrimonios[quien]
        delete chatData.matrimonios[pareja]

        let txt = `💔 *DIVORCIO* 💔\n\n@${quien.split('@')[0]} y @${pareja.split('@')[0]} se han divorciado. F 🪦`
        return conn.sendMessage(chat, { text: txt, mentions: [quien, pareja] })
    }

    // ===== PAREJA =====
    if (command == 'pareja') {
        let objetivo = getNum(m.mentionedJid?.[0]) || quien
        let pareja = chatData.matrimonios[objetivo]

        if (!pareja) return m.reply(`@${objetivo.split('@')[0]} está soltero/a`, null, { mentions: [objetivo] })

        let txt = `💍 @${objetivo.split('@')[0]} está casado con @${pareja.split('@')[0]}`
        return conn.sendMessage(chat, { text: txt, mentions: [objetivo, pareja] })
    }
}

handler.help = ['pedir @user', 'aceptar', 'rechazar', 'divorcio', 'pareja @user']
handler.tags = ['fun']
handler.command = /^(pedir|aceptar|rechazar|divorcio|pareja)$/i
handler.group = true
export default handler