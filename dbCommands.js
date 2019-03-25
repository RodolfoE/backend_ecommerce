db.produto.insert({
    nomeProduto: 'Camisa La Coste',
    marca: 'La coste',
    genero: 'm',
    categoria: ['camisa', 'camiseta'],
    preco: 50,
    qtdEmTamanhos:{
        tamanhos: ['p', 'm', 'g'],
        p: 35,
        m: 30,
        g: 40
    },
    descricao: 'lsad sdlkjflksd asldkjfasd çlaksdjlksadjf',
    caminhoFoto:
    ['assets/produtos/camisas/000001_lacoste_1.jpg', 'assets/produtos/camisas/000001_lacoste_2.jpg'],
    comentarios: [{
        cliente: '5b1d7c9d8b150e6e6c2feea6',
        txt: 'produto é bao msm',
        data: '00:00:00 12/07/2013'
    }]
})

db.compra.aggregate([{
             $lookup:
             {
                 from: "statusRecebimento",
                 localField: "IdStatusRecebimento",
                 foreignField: "_id",
                 as: "statusRecebimento"
             }
            },
            {
             $lookup:
             {
                 from: "origemCompra",
                 localField: "IdOrigemCompra",
                 foreignField: "_id",
                 as: "origemCompra"
             }
            }
    ]).pretty()

    
db.compra.insert({    
        _id : obterProximaSequenciaTabela('compra'),
        cliente : 1,
        carrinho : {
                produtos : [
                        {_id: 1, qtd: 5},
                        {_id: 2, qtd: 2}
                ]
        },
        dataCompra : "27-02-1993",
        IdOrigemCompra : ObjectId("5b87ec568ab6af7c3f9517e9"),
        IdStatusRecebimento : ObjectId("5b87ec5b8ab6af7c3f9517ea"),
        valorCompra : 157.75,
        observacao: "O cliente reclamou que a compra demorou muito tempo para ser efetuada. Consultado o responsável pelo envio a justificativa foi pelo fato de que os correios estavão de greve na semana do envio."
})

db.statusRecebimento.insert({
    status: ['Vendas À Postar', 'Postado', 'Postado e recebido'],
    funcResponsavel: 'Curinga',
    origemIndex: 0
})

db.origemCompra.insert({
    origens: ['site', 'Loja Física'],
    funcResponsavel: 'Curinga',
    origemIndex: 0
})

db.cliente.insert({
    _id : obterProximaSequenciaTabela('cliente'),
        mEndereco : {
                postalCode : "45545-450",
                street : "Rua Moacir De Andrade",
                number : "141",
                district : "Durval de Bairros",
                city : "Contagem",
                state : "Mg",
                pontoRef : "Igreja Da Cidade"
        },
        mNome : "Rodolfo Eliezer Soares Rezende",
        mUsuario : "RodolfoE",
        mSenha : "56556",
        mEmail : "Rodolfo_eliezer@hotmail.com",
        mGenero : "m",
        mIdade : "15"
})


db.envio.insert({
    data: '00:00:00 12/07/2013',
    postagem: {
        entregueAosCorreios: {
            confirmado: false,
            funcResponsavel: '5af9ce208f9a9e87935d44a4'
        },
        entregueAoDestinatario: {
            confirmado: false,
            funcResponsavel: '5af9ce208f9a9e87935d44a4'
        },
        trocaOuDevolucao: {
            trocaEntregueALoja: true,
            funcRecebimento: '5af9ce208f9a9e87935d44a4',

        }
    },
    compra: '5af9cdfa8f9a9e87935d44a3'
})

//functions
db.cliente.update(
    {_id: ObjectId(cli._id?)},
    cli
)


{
	"nome": "teste14",
    "usuario": "teste1",
    "senha": "psw",
    "email": "teste1",
    "genero": "m",
    "idade": 13,
    "caminhoFoto": "assets/produtos/camisas/000001_lacoste_2.jpg", 
    "endereco": {
        "cep": "33343-999",
        "rua": "teste1",
        "bairro": "teste1",
        "cidade": "teste1",
        "estado": "teste1",
        "numero": "teste1",
        "complemento": "teste1",
        "pontoRefef": "teste1"
    }
}

db.produto.update( 
    {_id: ObjectId('5b1efa8506d822a60f27546f')},   
    {
    nomeProduto: 'Camisa La Coste',
    marca: 'La coste',
    genero: 'm',
    categoria: ['camisa', 'camiseta'],
    preco: 50,
    qtdEmTamanhos:{
        tamanhos: ['p', 'm', 'g'],
        p: 35,
        m: 30,
        g: 40
    },
    descricao: 'lsad sdlkjflksd asldkjfasd çlaksdjlksadjf',
    caminhoFoto:
    ['assets/produtos/camisas/000001_lacoste_1.jpg', 'assets/produtos/camisas/000001_lacoste_2.jpg'],
    comentarios: [
        {
        cliente: '5b1d7cfdad20223b3ca6e863',
        txt: 'produto é bao msm',
        data: '00:00:00 12/07/2013'
        },
        {
            cliente: '5b1d7cfdad20223b3ca6e863',
            txt: 'Testando adicionamento de comentário',
            data: '00:00:00 12/07/2013'
        }
    ]
})

db.produto.find({_id: {$in: [ObjectId('5b27ec5baf290838b479bb07', '5b2d6cc2de315208e4d02398')]}})

db.produto.insert(
    {
        "_id": obterProximaSequenciaTabela("produto"),
        "qtdFoto" : [
                0,
                1
        ],
        "qtdEmTamanhos" : {
                "tamanhos" : [
                        "p",
                        "m",
                        "g"
                ],
                "p" : "3",
                "m" : "3",
                "g" : 2
        },
        "categoria" : [
                "Camisa"
        ],
        "caminhoFoto" : [
                "assets/produtos/camisas/000001_lacoste_2.jpg",
                "assets/produtos/camisas/000001_lacoste_1.jpg"
        ],
        "nomeProduto" : "Nike Especial Copa",
        "marca" : "Nike",
        "descricao" : "Modelo destinado a copa do mundo",
        "preco" : 150,
        "genero" : "m",
        "comentarios" : [ ],
        "qtdInChart" : {
                "p" : 0,
                "m" : 0,
                "g" : 0
        },
        "tamanhoEscolhido" : "g"
    });
    ,
    {
        "_id": incrementoTabela('produto');
        "qtdFoto" : [
                0,
                1
        ],
        "qtdEmTamanhos" : {
                "tamanhos" : [
                        "p",
                        "m",
                        "g"
                ],
                "p" : "3",
                "m" : "3",
                "g" : "3"
        },
        "categoria" : [
                "Calças"
        ],
        "caminhoFoto" : [
                "assets/produtos/camisas/000001_lacoste_2.jpg",
                "assets/produtos/camisas/000001_lacoste_1.jpg"
        ],
        "marca" : "Zara",
        "nomeProduto" : "Calça Zara",
        "descricao" : "Calça super confortável e ajustável a sua sintura.",
        "preco" : 200,
        "genero" : "m",
        "comentarios" : [ ]
    },
    {
        "_id": incrementoTabela('produto');
        "qtdFoto" : [
                0,
                1
        ],
        "qtdEmTamanhos" : {
                "tamanhos" : [
                        "p",
                        "m",
                        "g"
                ],
                "p" : "10",
                "m" : "10",
                "g" : "10"
        },
        "categoria" : [
                "Acessórios"
        ],
        "caminhoFoto" : [
                "assets/produtos/camisas/000001_lacoste_2.jpg",
                "assets/produtos/camisas/000001_lacoste_1.jpg"
        ],
        "nomeProduto" : "Relógio Adidas",
        "marca" : "Adidas",
        "descricao" : "Relógio Esportivo ",
        "preco" : 500,
        "genero" : "m",
        "comentarios" : [ ]
    },
    {
        "_id": obterProximaSequenciaTabela('produto');
        "qtdFoto" : [
                0
        ],
        "qtdEmTamanhos" : {
                "tamanhos" : [
                        "p",
                        "m",
                        "g"
                ],
                "p" : "3",
                "m" : "3",
                "g" : "3"
        },
        "categoria" : [
                "Meias e Cuecas"
        ],
        "caminhoFoto" : [
                "assets/produtos/camisas/000001_lacoste_2.jpg"
        ],
        "nomeProduto" : "Gucci Meia",
        "marca" : "Gucci",
        "descricao" : "Meias da Gucci maleáveis",
        "preco" : 20,
        "genero" : "f",
        "comentarios" : [ ]
    },
    {
        "_id": obterProximaSequenciaTabela('produto');
        "qtdFoto" : [
                0
        ],
        "qtdEmTamanhos" : {
                "tamanhos" : [
                        "p",
                        "m",
                        "g"
                ],
                "p" : "3",
                "m" : "3",
                "g" : "3"
        },
        "categoria" : [
                "Bermudas"
        ],
        "caminhoFoto" : [
                "assets/produtos/camisas/000001_lacoste_2.jpg"
        ],
        "nomeProduto" : "Hermès Berma",
        "marca" : "Hermès",
        "descricao" : "Berma da Hermès, para surfar a vontade",
        "preco" : 300,
        "genero" : "m",
        "comentarios" : [ ]
    }
)

db.statusRecebimento.insert({
    _id : obterProximaSequenciaTabela('statusRecebimento'),
    status : [
            "Vendas À Postar",
            "Postado",
            "Postado e recebido"
    ],
    funcResponsavel : "Curinga",
    origemIndex : 0
})

db.origemCompra.insert({
    "_id" : obterProximaSequenciaTabela('origemCompra'),
    "origens" : [
            "site",
            "Loja Física"
    ],
    "funcResponsavel" : "Curinga",
    "origemIndex" : 0
})



db.compra.aggregate(
    [
        { $lookup:
            {
                from: "produto",
                localField: "carrinho.produtos",
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
        }
    ]
)

db.produto.insert(
{
    _id: obterProximaSequenciaTabela('produto'),
    categoriasIndex:[0, 1, 2],
    tags: [0,1],
    fotos: {
        azul: ['caminho'],
        preto: ['caminho']
    },
    dados:{
        nomeProduto: '',
        fornecedorIndex: 0,
        codigoFornecedor: '',
        precoDeCusto: 123,
        precoDeVenda: 140,
        marca: '',
        lucro: 90,
        lucroEmPorcentagem: 0.1,
        generoIndex: 0
    },
    estoque:{
        qtds:{
            P: {
                unid: 15,
                cor: 'azul'
                },
            P2:{
                unid: 3,
                cor: 'lilaz'
                }
        },
        localDeArmazenamento: [''],
        estoqueMinimo: 40
    },
    precificacao: {
        fretePagoNaCompra: 10,
        comissaoVendedor: 0.1,
        precoMinimoParaVenda: 90,
        ipi: 0.01,
        icms: 0.02
    },
    fiscal: {
        grupoTributario:'',
        cFOPPadrão: '',
        codigoNCM: '',
        codigoCEST: '',
        eANCcdigoBarras: '',
        unidadeComercial: '',
        origemMercadoria: '',
        situacaoTributariaIPI: '',
        eXTIPI: '',
        EANUnidadeTributavel:'',
        UnidadeTributavel: ''
    },
    comentario: ''
})

db.incrementoTabela.insert({_id:"info_categorias",sequence_value:0})
db.info_categorias.insert({
    "_id" : obterProximaSequenciaTabela('info_categorias'),
	categorias: ['jeans', 'bermuda', 'slin']
})

db.incrementoTabela.insert({_id:"info_tags",sequence_value:0})
db.info_tags.insert({
    "_id" : obterProximaSequenciaTabela('info_tags'),
	tags: ['rock', 'skatista']
})

db.incrementoTabela.insert({_id:"info_genero",sequence_value:0})
db.info_genero.insert({
    "_id" : obterProximaSequenciaTabela('info_genero'),
	genero: ['Masculino', 'Feminino', 'Unisex']
})
