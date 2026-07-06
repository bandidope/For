import axios from 'axios'
let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('✨ Ingresa el nombre de la canción')
    await m.react('🎵')
    try {
        let { data } = await axios.get(`https://api.delirius.store/search/lyrics?query=${encodeURIComponent(text)}`)
        let res = data.data
        
        if(!res) return m.reply('❌ No se encontró la letra')
        
        let txt = `📃 *Título:* ${res.title}
👥 *Autor:* ${res.artists}

🛸╞═════ 𝗟𝗲𝘁𝗿𝗮 ═════╡🛸

${res.lyrics}

> *For Three Bot*`
        
        await conn.sendMessage(m.chat, { 
            image: { url: res.thumbnail }, 
            caption: txt 
        }, { quoted: m })
        
        await m.react('✅')
        
    } catch (e) { 
        console.log(e)
        await m.react('❌')
        m.reply('❌ No se pudo obtener la letra. Intenta con otro nombre')
    }
}
handler.help = ['letra <cancion>']
handler.tags = ['search']
handler.command = /^(letra|lyrics)$/i
export default handler 