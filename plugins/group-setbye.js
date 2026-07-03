const handler = async (m, { conn, text, command, isAdmin, isOwner, usedPrefix }) => {
    if (!m.isGroup || (!isAdmin &&!isOwner)) {
        return m.reply('❌ ¡Solo los administradores o el dueño pueden usar estos comandos!');
    }

    let chat = global.db.data.chats[m.chat]??= {}

    // Para que agarre el botón.delbye
    let cmd = command.toLowerCase()
    let args = text? text.trim().split(/ +/) : []

    if (cmd === 'setbye') {
        if (!args[0]) return m.reply('❌ Por favor, proporciona un mensaje. Placeholders: `@user`, `@group`, `@count`, `@desc`');
        chat.customBye = args.join(' ')

        await conn.sendMessage(m.chat, {
          text: `✅ *Despedida personalizada establecida*\n\n\`\`${chat.customBye}\`\``,
          footer: 'Toca el botón para volver al mensaje por defecto',
          buttons: [{buttonId: `${usedPrefix}delbye`, buttonText: {displayText: '🗑️ Quitar editada'}, type: 1}], // <- usé usedPrefix
          headerType: 1
        }, { quoted: m });

    } else if (cmd === 'delbye') {
        if (!chat.customBye) return m.reply('⚠️ No tienes una despedida editada.');
        delete chat.customBye;
        m.reply('✅ *Listo*\n\nSe eliminó la despedida personalizada. Ahora se usa la de `welcome.js`.');
    }
};
handler.help = ['setbye <mensaje>', 'delbye'];
handler.tags = ['group', 'config'];
handler.command = /^(setbye|delbye)$/i; // <- lo puse en regex para que agarre mejor
handler.admin = true;
handler.group = true;
export default handler;