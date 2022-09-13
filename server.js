const express = require('express')
const sysinfo = require('./sysinfo.js')

const PORT = parseInt(process.env.PORT) || 28282

// Start the API
const app = express()

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.get('/metrics', async (req, res)=>{
    try{
        const metrics = await sysinfo.getSystemMetrics()
        return res.status(200).send(metrics)
    }
    catch( err ){
        return res.status(500).send({error:err})
    }
})

app.listen(PORT, () => {
    console.log("System metrics running on port: "+PORT )
})
