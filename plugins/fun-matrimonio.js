import fs from 'fs';
import path from 'path';

const marryFile = path.resolve('storage/databases/marry.json');
let marriages = loadMarry();
let proposals = {}; // { proposee: {proposer, timeout} }

function loadMarry() {
    try {
        return fs.existsSync(marryFile)? JSON.parse(fs.readFileSync(marryFile, 'utf8')) : {};
    } catch { return {} }
}

function saveMarry() {
    fs.writeFileSync(marryFile, JSON.stringify(marriages, null, 2));
}

const toNum = (jid) => jid?.split('@')[0] + '@s.whatsapp.net'

const handler = async (m, { conn, command, usedPrefix }) => {
    const isMarry = /^marry$/i.test(command);
    const isDivorce = /^divorce$/i.test(command);
    const isAccept = /^aceptarmarry$/i.test(command);
    const isReject = /^rechazarmarry$/i.test(command);

    const sender = toNum(m.sender);
    const target = toNum(m.mentionedJid?.[0] || m.quoted?.sender);

    const isMarried = (user) => marriages[user]!== undefined;

    try {
        // ===== MARRY CON BOTONES =====
        if (isMarry) {
            if (!m.mentionedJid?.[0] &&!m.quoted) {
                if (isMarried(sender)) {
                    return await conn.reply(m.chat, `《✧》 Ya estás casado con *@${marriages[sender].split('@')[0]}*\n> Divórciate con: *${usedPrefix}divorce*`, m, { mentions: [marriages[sender]] });
                }
                throw new Error(`Debes mencionar a alguien.\n> Ejemplo » *${usedPrefix}marry @usuario*`);
            }
            if (sender === target) throw new Error('《✧》 No puedes casarte contigo mismo 😅');
            if (isMarried(sender)) throw new Error(`《✧》 Ya estás casado con *@${marriages[sender].split('@')[0]}*`);
            if (isMarried(target)) throw new Error(`《✧》 *@${target.split('@')[0]}* ya está casado con *@${marriages[target].split('@')[0]}*`);
            if (proposals[target]) throw new Error(`《✧》 *@${target.split('@')[0]}* ya tiene una propuesta pendiente.`);

            proposals[target] = {
                proposer: sender,
                timeout: setTimeout(() => {
                    if (proposals[target]) {
                        conn.reply(m.chat, `*《✧》Se acabó el tiempo. @${sender.split('@')[0]} tu propuesta fue cancelada.*`, null, { mentions: [sender] });
                        delete proposals[target];
                    }
                }, 300000) // 5 MINUTOS
            };

            let txt = `♡ *@${sender.split('@')[0]}* te ha propuesto matrimonio. @${target.split('@')[0]} ¿aceptas? •(=^●ω●^=)•\n\n*Tienes 5 minutos para responder*`

            // AQUI VAN LOS BOTONES
            await conn.sendMessage(m.chat, {
                text: txt,
                mentions: [sender, target],
                buttons: [
                    { buttonId: `${usedPrefix}aceptarmarry`, buttonText: { displayText: '💍 Si' }, type: 1 },
                    { buttonId: `${usedPrefix}rechazarmarry`, buttonText: { displayText: '💔 No' }, type: 1 }
                ],
                headerType: 1
            })

        // ===== ACEPTAR CON BOTON =====
        } else if (isAccept) {
            const proposee = sender;
            if (!proposals[proposee]) return m.reply('❌ No tienes ninguna propuesta pendiente');

            const { proposer, timeout } = proposals[proposee];
            if (marriages[proposer] || marriages[proposee]) {
                clearTimeout(timeout);
                delete proposals[proposee];
                return conn.reply(m.chat, `《✧》 Uno de los dos ya se casó con otra persona mientras esperaban.`, m);
            }

            clearTimeout(timeout);
            delete proposals[proposee];

            marriages[proposer] = proposee;
            marriages[proposee] = proposer;
            saveMarry();

            return conn.reply(m.chat, `✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩
¡SE HAN CASADO! ฅ^•ﻌ•^ฅ*:･ﾟ✧

*•.¸♡ Esposo:* @${proposer.split('@')[0]}
*•.¸♡ Esposa:* @${proposee.split('@')[0]}

\`Disfruten su luna de miel\`
✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩`, m, { mentions: [proposer, proposee] });

        // ===== RECHAZAR CON BOTON =====
        } else if (isReject) {
            const proposee = sender;
            if (!proposals[proposee]) return m.reply('❌ No tienes ninguna propuesta pendiente');

            const { proposer, timeout } = proposals[proposee];
            clearTimeout(timeout);
            delete proposals[proposee];

            return conn.reply(m.chat, `*《✧》 @${proposee.split('@')[0]} rechazó la propuesta de @${proposer.split('@')[0]} 💔`, m, { mentions: [proposee, proposer] });

        // ===== DIVORCE =====
        } else if (isDivorce) {
            if (!isMarried(sender)) throw new Error('《✧》 No estás casado con nadie.');
            const partner = marriages[sender];
            delete marriages[sender];
            delete marriages[partner];
            saveMarry();
            await conn.reply(m.chat, `✐ *@${sender.split('@')[0]}* y *@${partner.split('@')[0]}* se han divorciado 💔`, m, { mentions: [sender, partner] });
        }
    } catch (e) {
        await conn.reply(m.chat, `《✧》 ${e.message}`, m);
    }
}

// Ya no necesitamos el before porque ahora usamos botones
// handler.before = async (m, { conn }) => {... }

handler.help = ['marry @tag', 'divorce'];
handler.tags = ['fun'];
handler.command = /^(marry|divorce|casar|divorciar|aceptarmarry|rechazarmarry)$/i;
handler.group = true;

export default handler;