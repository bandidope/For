let handler = async (m, { conn }) => {
  let txt = `*🛒 [ VENTA DE BOTS FOR THREE ]* 🛒\n\n`
  txt += `━━━━━━━━━━\n`
  txt += `🤖 *Bot For Three MD* Full Plugins\n`
  txt += `💰 *Precio:* S/30 soles o $11 USD\n`
  txt += `📦 *Incluye:* +10p Comandos, Menú, Autoresponder Funcionales Sin Errores\n`
  txt += `⚡ *Instalación:* 10 min vía Hosting\n`
  txt += `🛡️ *Soporte:* 24/7\n`
  txt += `━━━━━━━━━━\n\n`
  txt += `👤 *Vendedor:* Yallico\n`
  txt += `📱 *WhatsApp:* wa.me/51936994155\n`
txt += `🌀 *Link:* \n`
  txt += `👥 *Grupo:* https://chat.whatsapp.com/LjPhgjqCM934QEzYz3vrVk\n\n`
  txt += `> *Info:*.catalogo | *Garantía:*.garantia`
  
  await conn.reply(m.chat, txt, m)
}
handler.help = ['comprarbot']
handler.tags = ['ventas bot'] // <-- CATEGORÍA NUEVA
handler.command = /^(comprarbot|preciosbot|comprar)$/i
export default handler