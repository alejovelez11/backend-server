// Rutas
var express = require("express")
var mdAuth = require("../middlewares/auth")
// var SEED = require('../config/config').SEED
var app = express()
var Medico = require("../models/medico")

// ============================
// Obtener todos los medicos
// ============================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                })

            });
});



// ============================
// Obtener medico
// ============================
app.get("/:id", (req, res)=>{
    var id  = req.params.id
    Medico.findById(id)
    .populate("usuario", "nombre email img")
    .populate("hospital")
    .exec((err, medico)=>{
             
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar el medico',
                errors:err
            })
        }
        if (!medico) {
            return res.status(400).json({
                ok:false,
                mensaje:`El medico con el id ${id} no existe`,
                errors: {message: 'No existe un usuario con ese ID'}
            })
        }
        res.status(200).json({
            ok:true,
            medico:medico
        })
    })
})
// ============================
// Actualizar medicos
// ============================

app.put("/:id", mdAuth.verifyToken,(req, res)=>{
    var id = req.params.id
    var body = req.body;
    Medico.findById(id, (err, medico)=>{
        
        if (err) {
            return res.status(500).json({
                ok:false,
                mensaje:'Error al buscar el medico',
                errors:err
            })
        }
        if (!medico) {
            return res.status(400).json({
                ok:false,
                mensaje:`El medico con el id ${id} no existe`,
                errors: {message: 'No existe un usuario con ese ID'}
            })
        }
        medico.nombre = body.nombre
        medico.usuario = req.usuario._id
        medico.hospital = body.hospital

        medico.save((err, medicoSave)=>{
            if (err) {
                return res.status(400).json({
                    ok:false,
                    mensaje:'Error al actualizar el medico',
                    errors:err
                })
            }
            res.status(200).json({
                ok:true,
                medico: medicoSave
            })
        })
    })
})


// ============================
// Insertar medico
// ============================

app.post('/', mdAuth.verifyToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
        
    })
    medico.save((err, medicoSave)=>{
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje:'Error al crear el medico',
                errors:err
            })
        }
        res.status(201).json({
            ok:true,
            medico: medicoSave,
        })
    })
})



// ============================
// Borrar usuario por ID
// ============================

app.delete('/:id', mdAuth.verifyToken, (req, res)=>{
    var id = req.params.id
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar medico',
                errors:err
            })
        }
        if (!medicoBorrado) {
            return res.status(500).json({
                ok:false,
                mensaje:'No existe el medico con ese ID',
                errors: {message: 'No existe el medico con ese ID'}
            })
        }
        res.status(200).json({
            ok:true,
            medico: medicoBorrado
        })
    })
})
module.exports = app




// let objeto = {
//     nombre: "alejo",
//     apellido: "velez"
// }

// let titulo = `
//     <h1>${objeto.nombre}</h1>
//     <h1>${objeto.apellido}</h1>
// `

