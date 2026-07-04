let handler = async (m, { conn }) => {

  if (!global.dadoVotes) global.dadoVotes = {}
  let chatId = m.chat

  if (global.dadoVotes[chatId]) return m.reply('Ya hay un dado en curso 🎲 Espera a que termine')

  // [1. MANDA ENCUESTA]
  let pollMsg = await conn.sendPoll(m.chat,
    '🎲 *TIRANDO EL DADO...*\nVota 1 SOLA OPCION. 2 minutos',
    ['1', '2', '3', '4', '5', '6'],
    { quoted: m, selectableCount: 1 } // Solo 1 voto
  )

  global.dadoVotes[chatId] = { votado: false, pollId: pollMsg.key.id, quien: null, opcion: null }

  await m.reply('⏳ *2 minutos* para votar...\nSi votas 2 veces no cuenta')

  // [2. LISTENER: GUARDA EL PRIMER VOTO]
  const voteHandler = async (update) => {
    if (!global.dadoVotes[chatId]) return
    if (update.pollUpdates) {
      for (let poll of update.pollUpdates) {
        if (poll.pollId === pollMsg.key.id && poll.voters) {
          let voto = poll.vote
          if(voto &&!global.dadoVotes[chatId].votado) {
            global.dadoVotes[chatId].votado = true
            global.dadoVotes[chatId].quien = voto.voter
            global.dadoVotes[chatId].opcion = voto.selectedOptions[0]

            await conn.reply(m.chat, `✅ @${voto.voter.split('@')[0]} votó por *${voto.selectedOptions[0]}*. Votación cerrada.`, m, { mentions: [voto.voter] })
            conn.ev.off('pollUpdate', voteHandler)
          }
        }
      }
    }
  }
  conn.ev.on('pollUpdate', voteHandler)

  // [3. AVISO A 1 MINUTO]
  setTimeout(async () => {
    if(global.dadoVotes[chatId]?.votado == false)
      await conn.reply(m.chat, '⏳ *Queda 1 minuto* para votar! 🎲', m)
  }, 60000)

  // [4. TIMEOUT 2 MINUTOS = 120000ms]
  await new Promise(resolve => setTimeout(resolve, 120000))
  conn.ev.off('pollUpdate', voteHandler)
  
  if(!global.dadoVotes[chatId]) return

  // [5. TIRA EL DADO]
  let numero = Math.floor(Math.random() * 6) + 1
  await conn.sendMessage(m.chat, { react: { text: '🎲', key: m.key } })

  let texto = `🎲 *RESULTADO* 🎲\n\nSalió el: *${numero}*`
  if (numero === 6) texto += '\n\n🔥 *CRÍTICO!*'
  if (numero === 1) texto += '\n\n💀 *F*'

  if(global.dadoVotes[chatId]?.quien) {
    let acerto = global.dadoVotes[chatId].opcion == numero
    texto += `\n\n@${global.dadoVotes[chatId].quien.split('@')[0]} votó por: *${global.dadoVotes[chatId].opcion}* ${acerto? '✅ ACERTÓ!' : '❌ Falló'}`
  }

  await conn.reply(m.chat, texto, m, { mentions: global.dadoVotes[chatId]?.quien? [global.dadoVotes[chatId].quien] : [] })
  delete global.dadoVotes[chatId]
}

handler.help = ['dado']
handler.tags = ['sticker']
handler.command = /^(dado|dice|roll)$/i
handler.group = true
export default handler