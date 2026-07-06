import axios from 'axios'
let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('✨ Ingresa el nombre de la canción')
    await m.react('🎵')
    try {
        let { data } = await axios.get(`https://api.delirius.store/search/lyrics?query=${encodeURIComponent(text)}`)
        let res = data.data
        
        if(!res) return m.reply('❌ No se encontró la letra')
        
        let txt = `*Letra* \n\n📃 *Título:* ${res.title}\n👥 *Autor:* ${res.artists}\n\n🛸╞═════ 𝗟𝗲𝘁𝗿𝗮 ═════╡🛸\n\n${res.lyrics}\n\n> *Solecito Shopp Bot*`
        
        await m.reply(txt)
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