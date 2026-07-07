import { readdirSync, unlinkSync, existsSync, statSync } from 'fs'
import path from 'path'

function formatBytes(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

var handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('❌ *Solo Owner*')

    if (global.conn.user.jid!== conn.user.jid) {
        return conn.reply(m.chat, '☯︎ *Utiliza este comando directamente en el número principal del Bot*', m)
    }

    await m.reply('🧹 *Limpieza Total Iniciada...*\n*No se tocará creds.json*')
    m.react('⏳')

    // TODAS LAS CARPETAS DE BASURA
    let carpetas = [
        './tmp',
        './cache',
        './database',
        './Sesiones/Principal' // <- AHORA SI LIMPIA SESIONES VIEJAS
    ]
    let totalArchivos = 0
    let totalBytes = 0

    for (let carpeta of carpetas) {
        if (!existsSync(carpeta)) continue

        let files = readdirSync(carpeta)
        for (let file of files) {
            // PROTEGER ARCHIVOS IMPORTANTES
            if (file === 'creds.json') continue
            if (file.startsWith('app-state-sync-key')) continue // Estos mantienen la sesión

            let filePath = path.join(carpeta, file)
            try {
                let stats = statSync(filePath)
                if (stats.isFile()) {
                    totalBytes += stats.size
                    unlinkSync(filePath)
                    totalArchivos++
                }
            } catch {}
        }
    }

    m.react('✅')
    await m.reply(`🗑️ *Limpieza V3 Completa*\n\n📁 Archivos eliminados: ${totalArchivos}\n💾 Espacio liberado: ${formatBytes(totalBytes)}\n\n*Sesión protegida - creds.json intacto*\n*No se reinició el bot*`)
}

handler.help = ['dsowner']
handler.tags = ['owner']
handler.command = ['dsowner', 'limpiar', 'basura', 'cleartmp', 'clearall']
handler.rowner = true

export default handler