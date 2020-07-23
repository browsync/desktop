const express = require('express')
const app = 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use("/", require("./routes"))
app.listen(PORT,function(){
    console.log(`running at port ${PORT}`)
})
