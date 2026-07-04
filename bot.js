const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

// IMPORTANTE: Importamos el sock de tu index.js
const { sock } = require('./index.js') 

app.post('/join', async (req, res) => {
  let { link, dias } = req.body
  console.log(`Nuevo pedido: ${link} - ${dias} dias`)
  
  try {
    let code = link.split('/').pop()
    await sock.groupAcceptInvite(code)
    res.json({msg: `✅ Bot unido al grupo por ${dias} días`})
  } catch(e) {
    res.json({msg: '❌ Error: ' + e.message})
  }
})

app.listen(3000, () => console.log('Servidor del Panel corriendo en puerto 3000'))