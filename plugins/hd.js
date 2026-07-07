/**
 * 📂 COMANDO: Uchiha AI Image Upscaler
 * 📝 DESCRIPCIÓN: Mejora la calidad de una imagen (Upscale) x2 x4
 * 👤 CREADOR: Whois Yallico
 * ⚡ CANAL: For Three
 * 🔌 API: https://api.evogb.org
 */
import fetch from "node-fetch"
import FormData from "form-data"
import crypto from "crypto"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    const start = Date.now()
    let q = m.quoted? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    let args = text? text.trim().split(' ') : []
    let urlTarget = args[0] || ''
    let scale = args[1] || 'x4' // x2 o x4

    if (!urlTarget &&!/image\/(jpe?g|png)/.test(mime)) {
        return conn.reply(m.chat, `*☁️ For Three - AI HD*\n\n*Uso:* ${usedPrefix + command}