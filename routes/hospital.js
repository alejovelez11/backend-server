// Rutas
var express = require("express")
var mdAuth = require("../middlewares/auth")
// var SEED = require('../config/config').SEED
var app = express()
var Hospital = require("../models/hospital")

// ============================
// Obtener todos los hospitales
// ============================

app.get('/',(req, res, next) => {
    var desde = req.query.desde || 0
    desde = Number(desde)
    Hospital.find({})
    .skip(desde) 
    .limit(5)
    .populate("usuario", "nombre correo")
    .exec(
     (err, hospitales) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al cargar hospital',
                errors:err
            })
        }
        Hospital.count({},(err, conteo)=>{
            res.status(200).json({
                ok:true,
                hospitales: hospitales,
                total: conteo
            })
        })
    })
})


// ============================
// Actualizar usuarios
// ============================

app.put("/:id", mdAuth.verifyToken,(req, res)=>{
    var id = req.params.id
    var body = req.body;
    Hospital.findById(id, (err, hospital)=>{
        
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar el hospital',
                errors:err
            })
        }
        if (!hospital) {
            return res.status(400).json({
                ok:false,
                mensaje:`El hospital con el id ${id} no existe`,
                errors: {message: 'No existe un usuario con ese ID'}
            })
        }
        hospital.nombre = body.nombre
        hospital.usuario = req.usuario._id

        hospital.save((err, hospitalSave)=>{
            if (err) {
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al actualizar el hospital',
                    errors:err
                })
            }
            res.status(200).json({
                ok:true,
                hospital: hospitalSave
            })
        })
    })
})


// ============================
// Insertar hospital
// ============================

app.post('/', mdAuth.verifyToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
        
    })
    hospital.save((err, hospitalSave)=>{
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear el hospital',
                errors:err
            })
        }
        res.status(201).json({
            ok:true,
            hospital: hospitalSave,
        })
    })
})



// ============================
// Borrar usuario por ID
// ============================

app.delete('/:id', mdAuth.verifyToken, (req, res)=>{
    var id = req.params.id
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar hospital',
                errors:err
            })
        }
        if (!hospitalBorrado) {
            return res.status(500).json({
                ok:false,
                mensaje:'No existe el hospital con ese ID',
                errors: {message: 'No existe el hospital con ese ID'}
            })
        }
        res.status(200).json({
            ok:true,
            hospital: hospitalBorrado
        })
    })
})
module.exports = app