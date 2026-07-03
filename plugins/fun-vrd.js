let handler = async (m, { conn }) => {
    let chat = m.chat
    let participants = (await conn.groupMetadata(chat)).participants.filter(v => v.id!= conn.user.jid)
    if (!participants.length) return m.reply('❌ Estás solo oe')
    
    // 1. RANDOM DEL GRUPO
    let p = participants.sort(() => 0.5 - Math.random())[0]
    
    // 2. ELIGE VERDAD O RETO
    let modo = Math.random() < 0.5? 'verdad' : 'reto'
    
    // 3. TODOS LOS RETOS
    let retos = [
        'Manda nota de voz diciendo "me gustas" al @ del top',
        'Cambia tu foto por 5 min con una de un trapito', 
        'Manda "te extraño" al último chat de WhatsApp',
        'Di "soy bien cachondo" en nota de voz',
        'Manda un audio cantando el cumpleaños',
        'Pon tu estado: "soy bien caliente"',
        'Manda captura de tu galería última foto',
        'Di cuántas veces lo hiciste esta semana',
        'Manda foto sin polo/polo',
        'Sal del grupo y vuelve a entrar'
    ]
    
    // 4. TODAS LAS VERDADES
    let verdades = [
        '¿Con quién del grupo te darías?',
        '¿Cuántas veces lo hiciste esta semana?',
        '¿Cuál fue tu última búsqueda nopor?',
        'Di tu crush del grupo y por qué',
        '¿A quién del grupo odias en secreto?',
        '¿Cuál es tu mayor secreto?',
        '¿A quién le lloraste por chat?',
        '¿Cuál es tu fetiche más raro?',
        '¿Te has metido con alguien del grupo?',
        '¿Cuál es tu peor experiencia en la cama?'
    ]
    
    let texto = modo === 'reto' 
       ? retos[Math.floor(Math.random() * retos.length)] 
        : verdades[Math.floor(Math.random() * verdades.length)]
        
    let emoji = modo === 'reto'? '😈 *RETO*' : '🔥 *VERDAD*'
    
    let txt = `${emoji} ${emoji}\n\n@${p.id.split`@`[0]} te tocó:\n${texto}\n\n*Tienes 5 min para cumplir/responder o eres 🐔*`
    conn.reply(chat, txt, m, { mentions: [p.id] })
}
handler.help = ['vrd']
handler.tags = ['fun']
handler.command = /^(vrd|verdadreto)$/i
handler.group = true
export default handler