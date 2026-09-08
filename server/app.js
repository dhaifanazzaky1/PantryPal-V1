if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
    
}

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const router = require('./routers');

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) 
app.set('query parser', 'extended') 

app.use(router)



module.exports = app