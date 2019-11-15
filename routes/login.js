var express = require("express")
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var SEED = require('../config/config').SEED
var app = express() 
var Usuario = require("../models/usuario")
// google
// var CLIENT_ID = require('../config/config').CLIENT_ID
// const {OAuth2Client} = require('google-auth-library');
// const client = new OAuth2Client(CLIENT_ID);
// ===========================
// Autenticacion con google
// ===========================
// async function verify(token) {
//     const ticket = await client.verifyIdToken({
//         idToken: token,
//         audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
//         // Or, if multiple clients access the backend:
//         //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//     });
//     const payload = ticket.getPayload();
//     // const userid = payload['sub'];
//     // If request specified a G Suite domain:
//     //const domain = payload['hd'];
//     return {
//         nombre: payload.name,
//         email: payload.email,
//         img: payload.picture,
//         google: true
//     }
// }
// app.post('/google', async(req, res)=>{
 
//     var token = req.body.token
//     var googleUser = await verify( token )
//         .catch(e =>{
//             res.status(403).json({
//                 ok: false,
//                 mensaje: 'Token no válido'
//             });
//         })
 
//     res.status(200).json({
//         ok: true,
//         mensaje: 'OK',
//         googleUser: googleUser
//     });
// });
var mdAutenticacion = require("../middlewares/auth");
app.get("/renuevatoken", mdAutenticacion.verifyToken, (req, res)=>{
  var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn:14400})
  res.status(200).json({
    ok:true,
    usuario: req.usuario,
    token:token
  })
})



app.post('/', (req, res)=>{
    var body = req.body;
    Usuario.findOne({correo: body.correo},(err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar el usuario',
                errors:err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok:false,
                mensaje:'Credenciales incorrectas - email',
                errors:err
            })
        }
        if (body.password !== usuarioDB.password) {
            return res.status(400).json({
                ok:false,
                mensaje:'Credenciales incorrectas - password',
                errors:err
            })
        }
        // crear un token
        usuarioDB.password = ":)"
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn:14400})


        res.status(200).json({
            ok:true,
            usuario: usuarioDB,
            token:token,
            id: usuarioDB.id,
            menu: obtenerMenu(usuarioDB.role)
        })
    })
})
function obtenerMenu(role){
    var menu = [
        {
          titulo:"principal",
          icono:'mdi mdi-gauge',
          submenu:[
            {titulo:"Dashboard", url:"/dashboard"},
            {titulo:"ProgressBar", url:"/progress"},
            {titulo:"Graficas", url:"/graficas1"},
            {titulo:"Promesas", url:"/promesas"},
            {titulo:"RxJs", url:"/rxjs"}
          ]
        },
        {
          titulo: "Mantenimientos",
          icono: "mdi mdi-folder-lock-open",
          submenu:[
            {titulo: "Hospitales", url:"/hospitales"},
            {titulo: "Medicos", url:"/medicos"}
          ]
        }
    ]
      if (role == "ADMIN_ROLE") {
        menu[1].submenu.unshift({titulo: "Usuarios", url:"/usuarios"})
      }
    return menu
}

module.exports = app

