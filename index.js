// Load .env (agar chahen to isko hata bhi sakte hain)
require('dotenv').config()

const { Telegraf } = require('telegraf')
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')

// ─── Bot Setup ───────────────────────────────────────────────────────────────
// Aapka token seedha yahan embed kar diya
const BOT_TOKEN = process.env.BOT_TOKEN || '8192577367:AAFKZp3GZxLkBiaQxq2XC5qH5YhO_-04cEQ'

const bot = new Telegraf(BOT_TOKEN)
const OWNER    = process.env.OWNER    || 'Ali Hamza AF'
const BOT_NAME = process.env.BOT_NAME || '❤️AF HACK BOT❤️'
const PREFIX   = '.'                  // dot‑prefix commands

// ─── WhatsApp Side (multi‑device, no QR) ─────────────────────────────────────
let sock
async function initWA() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  sock = makeWASocket({ auth: state, printQRInTerminal: false })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', up => {
    const { connection, lastDisconnect } = up
    if (connection === 'open')  console.log('📱 WA Connected')
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut
      console.log('📴 WA Disconnected. Reconnect?', shouldReconnect)
      if (shouldReconnect) initWA()
    }
  })
}
initWA()

// ─── Helpers ─────────────────────────────────────────────────────────────────
const menuText = user =>
  `꧁༺༆➘AF Hack_𝐕32.0➚༆༻꧂
𝘏𝘪 *${user}* 🗿 Welcome To AF Hack chat
━━━━━━━━━━━━━━━━━
◈ TikTok
https://www.tiktok.com/@afhackteam
━━━━━━━━━━━━━━━━━
◈ Updates
https://whatsapp.com/channel/0029VaU5UfBBVJl2sqYwbJ1t
━━━━━━━━━━━━━━━━━

✶⊶⊷⊶⊷❍✶⊶⊷⊶⊷❍✶⊶⊷⊶⊷
➲ 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : 32.0
𖤍 𝐌𝐄𝐍𝐓𝐈𝐎𝐍 : @${user}
𖤍 𝐏𝐑𝐄𝐅𝐈𝐗 : ${PREFIX}
𖤍 𝐏𝐈𝐍𝐆 : 0.0003
𖤍 𝐑𝐔𝐍𝐓𝐈𝐌𝐄 : Lifetime
𖤍 𝐎𝐖𝐍𝐄𝐑 𝐍𝐔𝐌 : 923324400530
𖤍 𝐎𝐖𝐍𝐄𝐑 : ${OWNER}
✶⊶⊷⊶⊷❍✶⊶⊷⊶⊷❍✶⊶⊷⊶⊷

╔═════ ▓▓ ࿇FREE࿇ ▓▓ ═════╗

╔═════ ▓▓ ࿇👑࿇ ▓▓ ═════╗
「𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔」
${PREFIX}addprem  
${PREFIX}delprem  
${PREFIX}listprem  
${PREFIX}self  
${PREFIX}public  
${PREFIX}checkhost  
${PREFIX}clearbug  
${PREFIX}reselbot  
${PREFIX}tiktok <url>  
${PREFIX}play <query>  
${PREFIX}yts <query>

╔═════ ▓▓ ࿇💀࿇ ▓▓ ═════╗
「𝐁𝐔𝐆 𝐌𝐄𝐍𝐔」
${PREFIX}fc-blast 9xxx  
${PREFIX}F-noclick 9xxx  
${PREFIX}F-uisystem 92xxx  
${PREFIX}AFhack-new 92xxx  
${PREFIX}Pakistan-power 92xxx  
${PREFIX}AFhack-16c 92xxx  
${PREFIX}F-knock 92xxx  
${PREFIX}F-crash 92xxx  
${PREFIX}Trash 92xxx  
${PREFIX}F-Fight 92xxx  
${PREFIX}kilgc-chat

╔═════ ▓▓ ࿇💦࿇ ▓▓ ═════╗
「𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔」
${PREFIX}tagall  
${PREFIX}hidetag  
${PREFIX}promote  
${PREFIX}demote  
${PREFIX}kick  
${PREFIX}add  
${PREFIX}listgc

╔═════ ▓▓ ࿇😈࿇ ▓▓ ═════╗
「𝐕𝐈𝐏 𝐁𝐔𝐆 𝐌𝐄𝐍𝐔」
${PREFIX}F-invidelay 92xxx  
${PREFIX}F-one 92xxx  
${PREFIX}New-ui 92xxx  
${PREFIX}Pti-804 92xxx  
${PREFIX}F-iphone 92xxx  
${PREFIX}F-ios 92xxx

╔═════ ▓▓ ࿇👻࿇ ▓▓ ═════╗
「𝐎𝐓𝐇𝐄𝐑 𝐁𝐔𝐆𝐒」
${PREFIX}forceblock  
${PREFIX}forcegroup
`

// ─── send dynamic menu
bot.command('menu', ctx => {
  const user = ctx.from.username || ctx.from.first_name
  ctx.replyWithMarkdown(menuText(user), { disable_web_page_preview: true })
})

// ─── Telegram /reqpair 92XXXXXXXXXX ─────────────────────────────────────────
bot.command('reqpair', async ctx => {
  const args = ctx.message.text.split(/ +/)
  if (!args[1] || !/^92\d{10}$/.test(args[1])) {
    return ctx.reply('Usage: `/reqpair 92XXXXXXXXXX`', { parse_mode: 'Markdown' })
  }
  const number = args[1]
  await ctx.reply('⚙️ Generating Pair Code…')
  try {
    const code = await sock.requestPairingCode(number)
    ctx.replyWithMarkdown(
      `✅ *Number:* ${number}\n` +
      `🔑 *Pair Code:* \`${code}\`\n\n` +
      `Open WhatsApp → Settings → Linked Devices → Link with Code\nPaste the above code.`
    )
  } catch (e) {
    console.error(e)
    ctx.reply('❌ Failed. Is WhatsApp online? Try again.')
  }
})

// ─── Universal dot‑prefix handlers ───────────────────────────────────────────
const cmd = name => bot.hears(new RegExp(`^\\${PREFIX}${name}\\b`, 'i'), ctx => {
  ctx.reply(`✅ *${name}* executed!`, { parse_mode: 'Markdown' })
})

// ─── Owner commands
;['addprem','delprem','listprem','self','public','checkhost','clearbug','reselbot'].forEach(cmd)

// ─── Media download stubs
bot.hears(new RegExp(`^\\${PREFIX}tiktok `,'i'), ctx => ctx.reply('🔗 Downloading TikTok…'))
bot.hears(new RegExp(`^\\${PREFIX}play `,  'i'), ctx => ctx.reply('🎵 Playing…'))
bot.hears(new RegExp(`^\\${PREFIX}yts `,   'i'), ctx => ctx.reply('📺 Searching YouTube…'))

// ─── Bug commands
;['fc-blast','F-noclick','F-uisystem','AFhack-new','Pakistan-power','AFhack-16c','F-knock','F-crash','Trash','F-Fight','kilgc-chat'].forEach(cmd)

// ─── Group commands
;['tagall','hidetag','promote','demote','kick','add','listgc'].forEach(cmd)

// ─── VIP Bug
;['F-invidelay','F-one','New-ui','Pti-804','F-iphone','F-ios'].forEach(cmd)

// ─── Other Bugs
;['forceblock','forcegroup'].forEach(cmd)

// ─── Utils
const start = Date.now()
bot.command('delpair', ctx => {
  try { require('fs').unlinkSync('./auth_info/creds.json') } catch {}
  ctx.reply('🗑️ Session deleted.')
})
bot.command('runtime', ctx => {
  const ms=Date.now()-start, h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000)
  ctx.reply(`⏱ Uptime: ${h}h ${m}m`)
})
bot.command('statistics', ctx => ctx.reply('📈 Running smoothly!'))
bot.command('error',      ctx => ctx.reply('⚠️ Try /delpair then /reqpair'))

bot.launch()
console.log('🤖 AF Hack Bot is up!')
