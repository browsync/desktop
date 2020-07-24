const express = require('express')
const app = express()
const routes = require(`./router`)
const port = process.env.PORT || 3000
const cors = require('cors');
const errorHandler = require("./middleware/errorHandler")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(routes)
app.use(errorHandler)
if(process.env.NODE_ENV !== 'test'){
    app.listen(port,() => {console.log(`listening on port 3000`);})
}

module.exports = app