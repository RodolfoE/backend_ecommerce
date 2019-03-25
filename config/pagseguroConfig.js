var pagseguro = require('pagseguro');

var pag = new pagseguro({
    email: 'rodolfo_eliezer@hotmail.com',
    token: 'DX98D6DE3D724489883F3D1F24ED8EDA',
    mode: 'sandbox'
});

//Configurando a moeda e a referência do pedido
pag.currency('BRL');
pag.reference('12345');


//Configuranto URLs de retorno e de notificação (Opcional)
//ver https://pagseguro.uol.com.br/v2/guia-de-integracao/finalizacao-do-pagamento.html#v2-item-redirecionando-o-comprador-para-uma-url-dinamica
pag.setRedirectURL("http://localhost:3000/api/feedback");
pag.setNotificationURL("http://localhost:3000/api/notification-feedback");


//exportar a configuração do pagseguro
module.exports.pagCart = pag;