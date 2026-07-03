let handler = async (m, { conn }) => {
    let users = m.mentionedJid.sort(() => Math.random() - 0.5)
    if (users.length < 2) return m.reply('Menciona a 2 personas oe')
    let porsen = Math.floor(Math.random() * 101)
    m.reply(`💘 *Ship*\n\n@${users[0].split`@`[0]} + @${users[1].split`@`[0]} = ${porsen}%\n${porsen > 80? 'Son pareja ya' : porsen > 50? 'Hay chance' : 'F nomás' }`, null, { mentions: users })
}
handler.help = ['ship']
handler.tags = ['fun']
handler.command = /^(ship)$/i
handler.group = true
export default handler