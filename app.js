// Requieres
var express = require("express")
var mongoose = require("mongoose")
var bodyParser = require("body-parser")

// Inicializar variables
var app = express()

// bodyParser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// importar rutas
var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var usuarioLogin = require('./routes/login')

// Conexion
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err
    console.log("Base de datos:\x1b[32m%s\x1b[0m","online");

})

// Rutas
app.use("/usuario", usuarioRoutes)
app.use("/login", usuarioLogin)
app.use("/",appRoutes)


// Escuchar peticiones
app.listen(3000, ()=>{
    console.log("express server port 3000:\x1b[32m%s\x1b[0m","online");
    
})