let handler = async (m, { conn, command, usedPrefix }) => {
    if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos');

    let chat = global.db.data.chats[m.chat]??= {}
    chat.matrimonios = chat.matrimonios || {}
    chat.pedidas = chat.pedidas || {}

    let quien = m.sender
    let conQuien = m.mentionedJid[0]

    // ===== PEDIR MATRIMONIO =====
    if (command === 'pedir') {
        if (!conQuien) return m.reply(`❌ Etiqueta a quien le quieres pedir matrimonio\n*Ejemplo:* ${usedPrefix}pedir @user`)
        if (conQuien === quien) return m.reply('❌ No te puedes casar contigo mismo xd')
        if (chat.matrimonios[quien]) return m.reply('❌ Ya estás casado')
        if (chat.matrimonios[conQuien]) return m.reply(`❌ @${conQuien.split('@')[0]} ya está casado/a`, null, { mentions: [conQuien] })
        if (chat.pedidas[conQuien] === quien) return m.reply('❌ Ya le pediste matrimonio, espera a que responda')

        chat.pedidas[conQuien] = quien

        return m.reply(`
╭───────────────────╮
│ 💍 *PEDIDA DE MANO* 💍 │
╰───────────────────╯

@${quien.split('@')[0]} le ha pedido matrimonio a @${conQuien.split('@')[0]}

@${conQuien.split('@')[0]} usa *${usedPrefix}aceptar* o *${usedPrefix}rechazar* para responder
        `.trim(), null, { mentions: [quien, conQuien] })
    }

    // ===== ACEPTAR =====
    if (command === 'aceptar') {
        let pedidor = chat.pedidas[quien]
        if (!pedidor) return m.reply('❌ No tienes ninguna solicitud de matrimonio pendiente')

        chat.matrimonios[quien] = pedidor
        chat.matrimonios[pedidor] = quien
        delete chat.pedidas[quien]

        return m.reply(`
╭───────────────────╮
│ 💒 *SE CASARON* 💒 │
╰───────────────────╯

💕 @${pedidor.split('@')[0]} y @${quien.split('@')[0]} ahora están casados!

*Deseenles mucha felicidad* 🥂
        `.trim(), null, { mentions: [pedidor, quien] })
    }

    // ===== RECHAZAR =====
    if (command === 'rechazar') {
        let pedidor = chat.pedidas[quien]
        if (!pedidor) return m.reply('❌ No tienes ninguna solicitud de matrimonio pendiente')

        delete chat.pedidas[quien]
        return m.reply(`💔 @${quien.split('@')[0]} rechazó la propuesta de @${pedidor.split('@')[0]}`, null, { mentions: [quien, pedidor] })
    }

    // ===== DIVORCIO =====
    if (command === 'divorcio') {
        let pareja = chat.matrimonios[quien]
        if (!pareja) return m.reply('❌ No estás casado con nadie')

        delete chat.matrimonios[quien]
        delete chat.matrimonios[pareja]

        return m.reply(`
╭───────────────────╮
│ 💔 *DIVORCIO* 💔 │
╰───────────────────╯

@${quien.split('@')[0]} y @${pareja.split('@')[0]} se han divorciado.

*F* 🪦
        `.trim(), null, { mentions: [quien, pareja] })
    }

    // ===== VER PAREJA =====
    if (command === 'pareja') {
        let objetivo = conQuien || quien
        let pareja = chat.matrimonios[objetivo]

        if (!pareja) return m.reply(`@${objetivo.split('@')[0]} está soltero/a`, null, { mentions: [objetivo] })
        return m.reply(`💍 @${objetivo.split('@')[0]} está casado con @${pareja.split('@')[0]}`, null, { mentions: [objetivo, pareja] })
    }
}

handler.help = ['pedir @user', 'aceptar', 'rechazar', 'divorcio', 'pareja @user'];
handler.tags = ['fun'];
handler.command = /^(pedir|aceptar|rechazar|divorcio|pareja)$/i;
handler.group = true;
export default handler;