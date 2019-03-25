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
module.exports = router;