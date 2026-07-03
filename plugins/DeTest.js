const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let handler = async (m) => m.reply('SORTEOS OK')
handler.help = ['ztest']
handler.tags = ['sorteos'] 
handler.command = /^ztest$/i
export default handler