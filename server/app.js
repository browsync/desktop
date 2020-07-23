const express = require('express')
const app = express()

const PORT = 3000
const routes = require("./router")


app.use(express.urlencoded({extended:true}))
app.use('/', routes)

app.listen(PORT, () => {
    console.log(`App is running on port ${3000}`)
})