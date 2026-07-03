const handler = async (m, { conn, text, command, isAdmin, isOwner }) => {
    if (!m.isGroup || (!isAdmin &&!isOwner)) {
        return m.reply('❌ ¡Solo los administradores o el dueño pueden usar estos comandos!');
    }

    let chat = global.db.data.chats[m.chat]??= {}

    if (command === 'setkick') {
        if (!text) return m.reply('❌ Por favor, proporciona un mensaje.\n*Placeholders:* `@user` `@group` `@count` `@desc`\n\n*Ejemplo:* .setkick @user fue expulsado de @group');
        chat.customKick = text.trim();

        return m.reply(`✅ *Kick personalizado establecido*\n\n\`\`${text.trim()}\`\n\nPara quitarlo usa: .delkick`);

    } else if (command === 'delkick') {
        if (!chat.customKick) return m.reply('⚠️ No tienes un kick editado.');
        delete chat.customKick;
        return m.reply('✅ *Listo*\n\nSe eliminó el kick personalizado. Ahora se usa el de `welcome.js`.');
    }
};
handler.help = ['setkick <mensaje>', 'delkick'];
handler.tags = ['group'];
handler.command = /^(setkick|delkick)$/i;
handler.admin = true;
handler.group = true;
export default handler;