import { exec } from 'child_process'
import { readdirSync, unlinkSync, existsSync, statSync } from 'fs'
import path from 'path'

var handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('❌ *Solo Owner*')
    
    if (global.conn.user.jid !== conn.user.jid) {
        return conn.reply(m.chat, '☯︎ *Utiliza este comando directamente en el número principal del Bot*', m)
    }

    await m.reply('🔄 *Reiniciando + Limpiando basura...*\n*La sesión NO se borrará*')
    m.react('⏳')

    // 1. LIMPIAR BASURA: tmp, cache, logs
    let carpetas = ['./tmp', './cache'] 
    let total = 0

    for (let carpeta of carpetas) {
        if (!existsSync(carpeta)) continue
        
        let files = readdirSync(carpeta)
        for (let file of files) {
            let filePath = path.join(carpeta, file)
            try {
                if (statSync(filePath).isFile()) {
                    unlinkSync(filePath)
                    total++
                }
            } catch {}
        }
    }

    await m.reply(`🗑️ *Basura eliminada:* ${total} archivos`)

    // 2. REINICIAR BOT: sin cerrar sesión
    // OPCION 1: Si usas PM2
    exec('pm2 restart all', (err) => {
        if (err) {
            console.error(err)
            // OPCION 2: Si NO usas PM2 en Pterodactyl
            exec('kill 1', (err2) => { 
                if (err2) conn.reply(m.chat, '𖠌 *Error al reiniciar*', m)
            })
        }
    })

    m.react('✅')
}

handler.help = ['dsowner']
handler.tags = ['owner']
handler.command = ['dsowner', 'restart', 'reiniciar']
handler.rowner = true

export default handler