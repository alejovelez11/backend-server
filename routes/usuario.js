// Rutas
var express = require("express")
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var mdAuth = require("../middlewares/auth")
// var SEED = require('../config/config').SEED
var app = express()
var Usuario = require("../models/usuario")

// ============================
// Obtener todos los usuarios
// ============================

app.get('/',(req, res, next) => {
    Usuario.find({}, 'nombre email img role').exec(
     (err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al cargar usuarios',
                errors:err
            })
        }
        res.status(200).json({
            ok:true,
            usuarios: usuarios
        })

    })
})





// ============================
// Insertar usuarios
// ============================

app.post('/', mdAuth.verifyToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })
    usuario.save((err, usuarioSave)=>{
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear el usuario',
                errors:err
            })
        }
        res.status(201).json({
            ok:true,
            usuario: usuarioSave,
            usuarioToken: req.usuario
        })
    })
})

// ============================
// Actualizar usuarios
// ============================

app.put("/:id", mdAuth.verifyToken,(req, res)=>{
    var id = req.params.id
    var body = req.body;
    Usuario.findById(id, (err, usuario)=>{
        
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar el usuario',
                errors:err
            })
        }
        if (!usuario) {
            return res.status(400).json({
                ok:false,
                mensaje:`El usuario con el id ${id} no existe`,
                errors: {message: 'No existe un usuario con ese ID'}
            })
        }
        usuario.nombre = body.nombre
        usuario.email = body.email
        usuario.role = body.role

        usuario.save((err, usuarioSave)=>{
            if (err) {
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al actualizar el usuario',
                    errors:err
                })
            }
            res.status(200).json({
                ok:true,
                usuario: usuarioSave
            })
        })
    })
})


// ============================
// Borrar usuario por ID
// ============================

app.delete('/:id', mdAuth.verifyToken, (req, res)=>{
    var id = req.params.id
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar usuario',
                errors:err
            })
        }
        if (!usuarioBorrado) {
            return res.status(500).json({
                ok:false,
                mensaje:'No existe el usuario con ese ID',
                errors: {message: 'No existe el usuario con ese ID'}
            })
        }
        res.status(200).json({
            ok:true,
            usuario: usuarioBorrado
        })
    })
})
module.exports = app