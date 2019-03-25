var jwt = require('jsonwebtoken');
const router = require('express-promise-router')();
const mongojs = require('mongojs');
const db = mongojs('lojaBenfica', ['produto', 'compra', 'envio', 'funcionario', 'produto']);
//var pag = require('../config/pagseguroConfig');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyD8DC8ZSYqa5HUggeDyTUqq6_TvBLmTjsU',
  formatter: null
};
var geocoder = NodeGeocoder(options);
const bcrypt = require('bcryptjs');
const saltRounds = 10;
var config = require('../config/config.json');


router.get('/obterEnderecoDoUsuario/:coordinate', (req, res, next) => {
  let cord = JSON.parse(req.params.coordinate);
  geocoder.reverse({ lat: cord.lat, lon: cord.log }, function (err, GeoRes) {
    res.json(GeoRes);
  });
})

var storage = multer.diskStorage({
  destination: 'bin/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpeg')
  }
})

var upload = multer({ storage: storage });

router.post('/addFotoPerfil', upload.array('FotoDePerfilDoUsuario', 12), (req, res, next) => {
  let db_data = {
    caminhoFotoPerfil: req.files[0].filename,
    _id: req.body.idUsuarioMongo != undefined && req.body.idUsuarioMongo != null ? req.body.idUsuarioMongo : ''
  };

  if (db_data._id != '') {
    SobrePonhaFotoPerfil(db_data._id, db_data.caminhoFotoPerfil, res);
  } else {
    db.cliente.save(db_data, function (err, data) {
      if (err) throw err
      res.json({ data: data, idNumero: mongojs.ObjectId(data._id) });
    });
  }
});

router.get('/verificarExistenciaDeEmail/:email', (req, resRouter, next) => {
  let email = req.params.email;
  db.cliente.findOne({ "mEmail": email }, (err, res) => {
    if (err) return next(err);
    if (res != null) {
      resRouter.json({ ok: 1, existeUsuario: true, mensagemErro: 'Email já cadastrado.' });
    } else {
      resRouter.json({ ok: 1, existeUsuario: false });
    }
  })
});


router.delete('/apagarRegistroDoPerfil/:id', (req, res, next) => {
  let idUsuario = req.params.id;
  db.cliente.find({ _id: mongojs.ObjectId(idUsuario) }, (err, res) => {
    var appDir = path.dirname(require.main.filename);
    var filePath = appDir + '/uploads/' + res[0].caminhoFotoPerfil;
    fs.unlinkSync(filePath);
    db.cliente.remove({ _id: mongojs.ObjectId(idUsuario) });
  });
});

function SobrePonhaFotoPerfil(idClienteNoMongo, novoCaminhoFoto, resposta) {
  db.cliente.find({ _id: mongojs.ObjectId(idClienteNoMongo) }, (err, res) => {
    var appDir = path.dirname(require.main.filename);
    var filePath = appDir + '/uploads/' + res[0].caminhoFotoPerfil;;
    db.cliente.update({ _id: mongojs.ObjectId(idClienteNoMongo) }, { $set: { caminhoFotoPerfil: novoCaminhoFoto } },
      (err, cliente) => {
        if (err) { return next(err); }
        fs.unlinkSync(filePath);
        resposta.json(cliente);
      });
  })
}

router.get('/nomeUsuarioEmUso/:nomeUsuario', (req, resRouter, next) => {
  let nomeUsuario = req.params.nomeUsuario;
  db.cliente.findOne({ "mNome": nomeUsuario }, (err, res) => {
    if (err) return next(err);
    if (res != null) {
      resRouter.json({ ok: 1, existeUsuario: true, mensagemErro: 'Nome de usuário já está em uso. Por favor, adicione outro nome.' });
    } else {
      resRouter.json({ ok: 1, existeUsuario: false });
    }
  })
})

function AddOrUpdateClient(idClienteNoMongo, cliente, resposta) {
  if (cliente.atualizar) {
    db.cliente.find({ _id: mongojs.ObjectId(idClienteNoMongo) }, (err, res) => {
      if (err) return next(err);
      cliente['caminhoFotoPerfil'] = res[0].caminhoFotoPerfil;
      db.cliente.update({ _id: mongojs.ObjectId(idClienteNoMongo) }, cliente, (err, cliente) => {
        if (err) { return next(err); }
        cliente['ok'] = 1;
        resposta.status(200).json(cliente);
      });
    });
  } else {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        resposta.status(400).json(err);
      } else {
        bcrypt.hash(cliente.mSenha, salt, (err, hash) => {
          if (err) {
            resposta.status(400).json(err);
          } else {
            cliente.mSenha = hash;
            db.cliente.save(cliente, (err, task) => {
              if (err) {
                resposta.status(400).json(err);
              } else {
                cliente['ok'] = 1;
                jwt.sign({ hash }, config.secret, { }, (err, token) => {
                  if (err) {
                    resposta.status(400).json(err)
                  } else {
                    resposta.status(200).json({
                      idToken: token,
                      cliente: cliente
                    });
                  }
                });
              }
            });
          }
        });
      }
    })
  }
}

router.put('/cadastro_cliente/:id', (req, resRouter, next) => {
  const cliente = req.body;
  const idClienteNoMongo = req.params.id;
  AddOrUpdateClient(idClienteNoMongo, cliente, resRouter);
});

router.post('/login', (req, resposta, next) => {
  const cliente = req.body;
  var obj = {$or: [{ "mUsuario": cliente.mUsuario }, { "mEmail": cliente.mUsuario }]};
  db.cliente.findOne(obj, (err, mUsuario) => {
    if (mUsuario) {
      bcrypt.compare(cliente.mSenha, mUsuario.mSenha, function(err, res) {
        if (res){
          jwt.sign({ 'payload': mUsuario.mSenha }, config.secret, { }, (err, token) => {
            if (err) {
              resposta.status(400).json(err)
            } else {
              resposta.status(200).json({
                idToken: token,
                cliente: mUsuario
              });
            }
          });
        } else {
          resposta.status(400).json({ 'err': 'senha inválida.' });
        }
      });
    }
    if (err) { res.status(400).json(err) }
  });
});

router.post('/update_cliente', (req, res, next) => {
  const cliente1 = req.body;
  db.cliente.update({ _id: mongojs.ObjectId(cliente1._id) }, cliente1, (err, cliente) => {
    res.json(cliente);
    if (err) { return next(err); console.log(err); }
  });
});

router.get('/clientes', (req, res, next) => {
  db.cliente.find((err, produtos) => {
    if (err) return next(err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(produtos);
  });
});

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}
module.exports = router;