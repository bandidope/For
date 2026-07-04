let handler = async (m, { conn }) => {

  if (!global.dadoVotes) global.dadoVotes = {}
  let chatId = m.chat

  // Anti spam
  if (global.dadoVotes[chatId]) return m.reply('Ya hay un dado en curso 🎲 Espera a que termine')

  // [1. MANDA ENCUESTA]
  let pollMsg = await conn.sendPoll(m.chat,
    '🎲 *TIRANDO EL DADO...*\nVota rápido! 10 segundos',
    ['1', '2', '3', '4', '5', '6'],
    { quoted: m, selectableCount: 1 }
  )

  global.dadoVotes[chatId] = { votado: false, pollId: pollMsg.key.id }

  await m.reply('⏳ *10 segundos* para votar...\n*Solo 1 voto y se cierra*')

  // [2. LISTENER: AL PRIMER VOTO CIERRA TODO]
  const voteHandler = async (update) => {
    if (!global.dadoVotes[chatId]) return
    if (update.pollUpdates) {
      for (let poll of update.pollUpdates) {
        if (poll.pollId === pollMsg.key.id && poll.voters && poll.voters.length > 0 &&!global.dadoVotes[chatId].votado) {
          global.dadoVotes[chatId].votado = true
          let quienVoto = poll.voters[0]

          await conn.sendMessage(m.chat, { delete: pollMsg.key }).catch(_=>{})
          await conn.reply(m.chat, `✅ @${quienVoto.split('@')[0]} votó. Se cerró.`, m, { mentions: [quienVoto] })
          conn.ev.off('pollUpdate', voteHandler)
        }
      }
    }
  }
  conn.ev.on('pollUpdate', voteHandler)

  // [3. TIMEOUT DE 10 SEG]
  setTimeout(async () => {
    if(global.dadoVotes[chatId]) {
      await conn.sendMessage(m.chat, { delete: pollMsg.key }).catch(_=>{})
      if(!global.dadoVotes[chatId].votado) await conn.reply(m.chat, '⏰ Tiempo acabado. Nadie votó.', m)
      conn.ev.off('pollUpdate', voteHandler)
      delete global.dadoVotes[chatId]
    }
  }, 10000) // 10 segundos

  // [4. ESPERAR 10 SEG Y TIRAR DADO]
  await new Promise(resolve => setTimeout(resolve, 10000))
  if(!global.dadoVotes[chatId]) return

  let numero = Math.floor(Math.random() * 6) + 1
  await conn.sendMessage(m.chat, { react: { text: '🎲', key: m.key } })

  let texto = `🎲 *RESULTADO* 🎲\n\nSalió el: *${numero}*`
  if (numero === 6) texto += '\n\n🔥 *CRÍTICO!*'
  if (numero === 1) texto += '\n\n💀 *F*'

  await conn.reply(m.chat, texto, m)
  delete global.dadoVotes[chatId]
}

handler.help = ['dado']
handler.tags = ['sticker']
handler.command = /^(dado|dice|roll)$/i
handler.group = true
export default handler