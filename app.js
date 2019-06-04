const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const port = 3000

app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
