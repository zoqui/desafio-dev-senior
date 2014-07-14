Desafio Desenvolvedor Sênior

Rules:

https://github.com/maplinkapi/desafio-dev-senior

====================================================================
Reusable component proposal: A JQuery plugin routecosts
====================================================================

Live demo: http://goo.gl/0GmeDd

Using builtin address input form

   $('#mlroutecost1').routecosts({
      addresses: [{state:'SP',city:'São Paulo',street:'Av. Paulista',number:'1000'}],
      routeType: 0,// default route type //http://dev.maplink.com.br/javascript-api/guia-referencia
      showButton: true, // display the button to toggle it
      showForm: true// // display the input form
   });


Usage without any user interface:

   $('#mlroutecost2').routecosts({
      addresses: [
         {state:'SP',city:'São Paulo',street:'Av. Paulista',number:'1000'},
         {state:'SP',city:'Campinas',street:'Rua Prof Ferreira Lima',number:'352'}
      ],
      routeType: 0,// default route type //http://dev.maplink.com.br/javascript-api/guia-referencia
      showButton: false, // display the button to toggle it
      showForm: false, // display the input form
      onReady:function($this){			
         $this.routecosts('evaluate',function(response){console.log(response);});// evaluate with default routeType (0)
         $this.routecosts('routeType',23);// change route type to (23)
         $this.routecosts('evaluate',function(response){console.log(response);});// evaluate with new routeType (23)
      }
   });


