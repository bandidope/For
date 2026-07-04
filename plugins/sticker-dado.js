let handler = async (m, { conn }) => {

  if (!global.dadoVotes) global.dadoVotes = {}
  let chatId = m.chat

  if (global.dadoVotes[chatId]) return m.reply('Ya hay un dado en curso 🎲')

  // [1. MANDA ENCUESTA CON SOLO 1 OPCION]
  let pollMsg = await conn.sendPoll(m.chat,
    '🎲 *TIRANDO EL DADO...*\nVota 1 SOLA OPCION. 10 seg',
    ['1', '2', '3', '4', '5', '6'],
    { quoted: m, selectableCount: 1 } // <-- Esto fuerza 1 sola
  )

  global.dadoVotes[chatId] = { votado: false, pollId: pollMsg.key.id, quien: null, opcion: null }

  await m.reply('⏳ *10 segundos* para votar...')

  // [2. LISTENER: GUARDA EL PRIMER VOTO Y YA]
  const voteHandler = async (update) => {
    if (!global.dadoVotes[chatId]) return
    if (update.pollUpdates) {
      for (let poll of update.pollUpdates) {
        if (poll.pollId === pollMsg.key.id && poll.voters) {
          let voto = poll.vote
          if(voto &&!global.dadoVotes[chatId].votado) {
            global.dadoVotes[chatId].votado = true
            global.dadoVotes[chatId].quien = voto.voter
            global.dadoVotes[chatId].opcion = voto.selectedOptions[0] // guarda que numero marco

            await conn.reply(m.chat, `✅ @${voto.voter.split('@')[0]} votó por *${voto.selectedOptions[0]}*. Cerrado.`, m, { mentions: [voto.voter] })
            conn.ev.off('pollUpdate', voteHandler)
          }
        }
      }
    }
  }
  conn.ev.on('pollUpdate', voteHandler)

  // [3. TIMEOUT 10 SEG]
  await new Promise(resolve => setTimeout(resolve, 10000))
  conn.ev.off('pollUpdate', voteHandler)
  
  if(!global.dadoVotes[chatId]) return

  let numero = Math.floor(Math.random() * 6) + 1
  await conn.sendMessage(m.chat, { react: { text: '🎲', key: m.key } })

  let texto = `🎲 *RESULTADO* 🎲\n\nSalió el: *${numero}*`
  if (numero === 6) texto += '\n\n🔥 *CRÍTICO!*'
  if (numero === 1) texto += '\n\n💀 *F*'

  if(global.dadoVotes[chatId]?.quien) {
    let acerto = global.dadoVotes[chatId].opcion == numero
    texto += `\n\n@${global.dadoVotes[chatId].quien.split('@')[0]} votó por: *${global.dadoVotes[chatId].opcion}* ${acerto? '✅ ACERTÓ' : '❌ Falló'}`
  }

  await conn.reply(m.chat, texto, m, { mentions: global.dadoVotes[chatId]?.quien? [global.dadoVotes[chatId].quien] : [] })
  delete global.dadoVotes[chatId]
}

handler.help = ['dado']
handler.tags = ['sticker']
handler.command = /^(dado|dice|roll)$/i
handler.group = true
export default handler