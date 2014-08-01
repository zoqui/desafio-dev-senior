Desafio Desenvolvedor Sênior

Rules: https://github.com/maplinkapi/desafio-dev-senior

**Reusable component**:

proposal: A JQuery plugin routecosts

Live demo: http://goo.gl/0GmeDd

![](https://690d12d2d43782056e2fc543f5edec31c17b4127.googledrive.com/host/0Bx8SjyJJ1zQ3djdDQVJYalU5NHM/examples.png)

**Using the builtin address input form**:
    
    $('#mlroutecost1').routecosts({
     addresses: [{state:'SP',city:'São Paulo',street:'Av. Paulista',number:'1000'}],
     routeType: 0,// default route type //http://dev.maplink.com.br/javascript-api/guia-referencia
     showButton: true, // display the button to toggle it
     showForm: true// // display the input form
    });

**Syntax: No user interface**:
   
    $('#mlroutecost1').routecosts({
     addresses: [
        {state:'SP',city:'São Paulo',street:'Av. Paulista',number:'1000'},
        {state:'SP',city:'Campinas',street:'Rua Prof Ferreira Lima',number:'352'}
     ],
     routeType: 0,// default route type //http://dev.maplink.com.br/javascript-api/guia-referencia
     showButton: false, // display the button to toggle it
     showForm: false, // display the input form
     onReady:function($this){
        $this.routecosts('evaluate',function(response){console.log(response);});// default type
        $this.routecosts('routeType',23);// change route type to (23)
        $this.routecosts('evaluate',function(response){console.log(response);});
       }
    }); 

