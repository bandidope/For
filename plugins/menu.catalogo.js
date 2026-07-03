let handler = async (m, { conn }) => {
  let txt = `*📋 [ CATÁLOGO FOR THREE ]*\n\n`
  txt += `*🥉 BASIC* S/10\n> Bot limpio +20 cmds\n`
  txt += `*🥈 PREMIUM* S/15\n> Bot full +40 cmds + Autoresponder\n`
  txt += `*🥇 VIP* S/25\n> Bot full + Menú custom + Tu logo\n`
  txt += `*Paga al:* Yape/Plin +51 936 994 155\n`
  txt += `*Comprar:*.comprarbot`
  m.reply(txt)
}
handler.help = ['catalogo']
handler.tags = ['ventas bot']
handler.command = /^(catalogo|planes)$/i
export default handler