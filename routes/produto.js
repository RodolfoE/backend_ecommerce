var express = require('express');
const router = require('express-promise-router')();
const mongojs = require('mongojs');
const db = mongojs('lojaBenfica', ['produto', 'compra','envio', 'funcionario', 'produto']);
//var pag = require('../config/pagseguroConfig');


router.get('/produtos', (req, res, next) => {
    db.produto.find((err, produtos) => {
        if (err) return next(err);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(produtos);
    });
});

/*
router.post('/produtos', (req, res, next) => {
    var prod = req.body;
    db.produtos.find(prod, (err, produto) => {
        if (err) return next(err);
        res.setHeader('Content-Type', 'Application/json');
        res.json(produto);
    })
});*/

/*
router.post('/buscarLista', (req, res, next) => {
    var prod = req.body;
    var retorno = [];
    db.produto.find({_id: {$in: prod}}, (err, produto) => {
        if (err) { return next(err); console.log(err); }
        retorno = produto;
        res.setHeader('Content-Type', 'Application/json');
        res.json(retorno);
    });  
});
*/

router.get('/buscarLista/:id', (req, res, next) => {
    db.compra.aggregate(
        [
            {
                $match:
                {
                    _id: parseInt(req.params.id)
                }
            },
            { $lookup:
                {
                    from: "produto",
                    localField: "carrinho.produtos._id",
                    foreignField: "_id",
                    as: "ObjetoDoProduto"
                }
            },
            { $lookup:
                {
                    from: "cliente",
                    localField: "cliente",
                    foreignField: "_id",
                    as: "ObjetoDoCliente"
                }
            },
            {
                $lookup:
                {
                    from: "statusRecebimento",
                    localField: "IdStatusRecebimento",
                    foreignField: "_id",
                    as: "ObjetoStatusRecebimento"
                }
            },
            {
                $lookup:
                {
                    from: "origemCompra",
                    localField: "IdOrigemCompra",
                    foreignField: "_id",
                    as: "ObjetoOrigemCompra"
                }
            }
        ], (err, compra) => {
            res.json(compra);
        }
    )  
});



router.get('/produto/:id', (req, res, next) => {
    console.log(req.params.id);
    db.produtos.findOne({ _id: mongojs.ObjectId(req.params.id) }, (err, produto) => {
        console.log('bla');
        if (err) { return next(err); console.log(err); }
        res.json(produto);
    });
});

router.get('/feedback', (result) => {
    console.log('asdf');
})

router.get('/notification-feedback', (result) => {
    console.log(result);
})

router.post('/insert-cliente', (req, res, next) => {
    const cliente = req.body;
    db.cliente.save(cliente, (err, cliente) => {
        if (err)
         return next(err); 
        res.json(cliente);
    }); 
})

router.put('/comentar-prod/:id', (req, res, next) => {
    const prod = req.body;
    delete prod._id;
    db.produto.update({_id: mongojs.ObjectId(req.params.id)}, prod, (err, bdResult) => {
        if (err) return next(err); 
        res.json(bdResult);
    });      
})


router.post('/checkOut', function (req, res) {
    
    //Configurando as informações do comprador
    pag.pagCart.buyer({
        name: 'Emerson jose',
        email: 'comprador@uol.com.br',
        phoneAreaCode: '51',
        phoneNumber: '12345678'
    });

    //Configurando a entrega do pedido
    pag.pagCart.shipping({
        type: 1,
        street: 'Rua Alameda dos Anjos',
        number: '367',
        complement: 'Apto 307',
        district: 'Parque da Lagoa',
        postalCode: '01452002',
        city: 'São Paulo',
        state: 'RS',
        country: 'BRA'
    });

    //Adicionar os produtos no carrinho do pagseguro
    req.body.mChart.forEach(function (item, i) {
        pag.pagCart.addItem({
            id: item.id,
            description: item.nomeProduto,
            amount: item.preco,
            quantity: item.qtdInChart,
            weight: 10.1
        });
    });

    //Enviando o xml ao pagseguro
    pag.pagCart.send(function (err, res) {
        if (err) {
            console.log('Error: ' + err);
        }
        console.log(res);
    });

    res.send({ sucesso: true });

});






/*
router.post('/tasks', (req, res, next) => {
    const task = req.body;
    if (!task.title || !(task.isDone + '')){
        res.status(400).json({
            'error':'bad data'
        })
    } else {
        db.task.save(task, (err, task) => {
            if (err) return next(err); 
            res.json(task);
        });
    }
})

router.delete('/tasks/:id', (req, res, next) => {
    db.task.remove({_id: mongojs.ObjectId(req.params.id)}, (err, result) => {
        if (err) return next(err); 
        res.json(result);
    });
})

router.put('/tasks/:id', (req, res, next) => {
    const task = req.body;
    const updateTask = {};

    if (!task.isDone){
        updateTask.isDone = task.isDone;
    }

    if (task.title){
        updateTask.title = task.title;
    }

    if (!updateTask){
        res.status(400).json({
            'error':'bad request'
        })
    } else {
        db.task.update({_id: mongojs.ObjectId(req.params.id)}, (err, task) => {
            if (err) return next(err); 
            res.json(task);
        });
    }

})
*/


module.exports = router;
