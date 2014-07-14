(function($) {    
    /**
     * Build the user interface of this component
     * @param [object] jquery object instance
     */
    var _buildContainer=function($this){
        var fn = "javascript:$.fn.routecosts('onButtonEvaluate',this);";
        var html=
        '<div class="ml-button ml-button-toggle">\
            <div class="ml-icon ml-icon-logo" title="Clique para calcular custo de um percurso"></div>\
        </div>\
        <div class="ml-button ml-button-route-type" onclick="'+fn+'"><div class="ui-icon ui-icon-shuffle" title="Clique para recalcular" style="display:inline-block;vertical-align:middle;margin-right:2px;"></div><span></span></div>\
        <form action="javascript:void(0);"><div class="ml-form">\
            <div class="ml-route-header">\
                <div class="ml-route-info"><div class="ml-icon ui-icon-spinner" title="Aguarde" style="display:inline-block"></div></div>\
                <div class="ml-route-result">\
                    <div class="ml-route-summary-field"><div class="ml-route-summary-label">Distância:</div><div class="ml-route-summary-value"></div></div>\
                    <div class="ml-route-summary-field"><div class="ml-route-summary-label">Tempo:</div><div class="ml-route-summary-value"></div></div>\
                    <div class="ml-route-summary-field"><div class="ml-route-summary-label">Combustivel:</div><div class="ml-route-summary-value"></div></div>\
                    <div class="ml-route-summary-field"><div class="ml-route-summary-label">Pedágios:</div><div class="ml-route-summary-value"></div></div>\
                    <div class="ml-route-summary-field"><div class="ml-route-summary-label">Total:</div><div class="ml-route-summary-value"></div></div>\
                </div>\
            </div>\
        </div></form>';
        $this.append(html);
        $this.find('.ml-button-route-type').hide();
    };
    
    /**
     * Add a new address line into the form
     * @param [object] data 
     *  a json like:
     *          var data={
     *              state: "SP",
     *              city:"Campinas",
     *              street:"R. Prof Ferreira Lima",
     *              number:352
     *          }
     */
    var _addNewLine=function($this, data){
        var _data=$.extend( true, {}, {state:'',city:'',street:'',number:''}, data);
        var fn = "javascript:$.fn.routecosts('onButtonAddress',this);";
        var html=
        '<div class="ml-address-row">\
    		<div class="ml-address-field" style="width:10%;">\
				<label for="state">Estado</label>\
				<input type="text" name="state" value="'+_data.state+'" class="ml-address-input ml-address-input-state"/>\
			</div>\
			<div class="ml-address-field" style="width:35%;">\
				<label for="city">Cidade</label>\
				<input type="text" name="city" value="'+_data.city+'" class="ml-address-input ml-address-input-city"/>\
			</div>\
			<div class="ml-address-field" style="width:35%;">\
				<label for="street">Rua/Avenida</label>\
				<input type="text" name="street" value="'+_data.street+'" class="ml-address-input ml-address-input-street"/>\
			</div>\
			<div class="ml-address-field" style="width:10%;">\
				<label for="number">Número</label>\
				<input type="text" name="number" value="'+_data.number+'" class="ml-address-input ml-address-input-number"/>\
			</div>\
			<div class="ml-address-field">\
				<div class="ml-button" onclick="'+fn+'">\
					<div class="ui-icon ui-icon-plus" title="Adicione este endereço">\
					</div>\
				</div>\
			</div>\
		</div>';
        $this.find('.ml-form').append(html);
        _setFocus($this);
    };
    
    /**
     * Set focus on the first text box
     */
    var _setFocus=function($this){
        $this.find('.ml-form>.ml-address-row').last().find('.ml-address-field>input[name=state]').focus();    
    };
    
    /**
     * Display the MapLink evaluated costs for the route
     * @param: [object] result (MapLink routeTotals object
     */
    var _displayResults=function($this,result){
        var settings=$this[0].settings;
        var $fields=$this.find('.ml-form > .ml-route-header > .ml-route-result > .ml-route-summary-field > .ml-route-summary-value');
        var fmtTime = result.totalTime.replace(/PT/ig,'').replace(/H/ig,':').replace(/M/ig,'');
        var fmtDistance = result.totalDistance+"Km";
        var fmtFuelCost = "R$"+result.totalfuelCost;
        var fmtTollFeeCost = "R$"+result.totaltollFeeCost;
        var fmtTotalCost = "R$"+result.totalCost;
        $($fields[0]).text(fmtDistance);//Distância
        $($fields[1]).text(fmtTime);//Tempo
        $($fields[2]).text(fmtFuelCost);//Combustivel
        $($fields[3]).text(fmtTollFeeCost);//Pedágios
        $($fields[4]).text(fmtTotalCost);//Total
        if (settings.ui){
            $this.find('.ml-route-info').hide();
            $this.find('.ml-route-result').show();
            $this.find('.ml-button-route-type')
                .find('.ui-icon').removeClass('ui-icon-seek-next').removeClass('ui-icon-shuttle')
                .addClass((settings.routeType===0)?'ui-icon-shuttle':'ui-icon-seek-next')
                .parent().find('span').text((settings.routeType===0)?"Sem Transito":"Rápida")
                .parent().show();
        }
    };
    
    /**
     * Display or hide the user interface
     * @param: [object] result (MapLink routeTotals object
     */
    var _toggle=function($this){
        $this.find('form').fadeToggle(                
            function(){          
                var settings=$this[0].settings;
                if (settings.ui){
                    var maplink_data=$this.data("maplink_data");
                    if (maplink_data && maplink_data.addresses && maplink_data.addresses.length>1){
                        if ($(this).is(":visible")){
                            $this.find('.ml-button-route-type').show();                            
                        }
                        else{
                            $this.find('.ml-button-route-type').hide();
                        }
                    }
                    else{
                        $this.find('.ml-button-route-type').hide();
                    }
                    _setFocus($this);
                }
            }
        );
    };
    
    // jquery plugin methods
    var methods = {	
        //begin method.init
		init : function(options){
			return this.each(function(){
                /**
                 * Defines the default options
                 */
                var settings = {
                    addresses: [],  // initial addresses for searching
                    routeType: 0,   // default route type //http://dev.maplink.com.br/javascript-api/guia-referencia
                    showButton: true,       // display user interface
                    showForm:true,
                    ui:true,
                    onReady:function($this){
                        console.log("onReady");
                    },
                    onAddressAdded:function($this){
                        console.log("onAddressAdded");
                    },
                    onAddressRemoved:function($this){
                        console.log("onAddressRemoved");
                    }
                };
                this.settings=$.extend(true,{},settings,options);
                var $this = $(this);
                
                $this.data("maplink_data",{
                    addresses:[],
                    routeType:0
                });
                    
                $this.addClass('ml-container');
                
                _buildContainer($this);
                
                $this.find('.ml-button-toggle').hide();                
                $this.find('form').hide();
                this.settings.ui=false;
                
                if (this.settings.showButton){
                    $this.find('.ml-button-toggle').show();
                    this.settings.ui=true;
                }
                
                if (this.settings.showForm){
                    $this.find('form').show();
                    this.settings.ui=true;
                }
                
                
                $this.find('.ml-button > .ml-icon-logo').parent().bind('click', 
                    function(e){
                        e.preventDefault();e.stopPropagation();
                        $this.routecosts('toggle');
                    }
                );
                $this.find('form').submit(function(e){
                    e.stopPropagation();e.preventDefault();
                    var maplink_data=$this.data("maplink_data");
                    if ((!maplink_data.addresses) || (maplink_data.addresses.length<2)){
                        return false;
                    }
                    $this.routecosts('evaluate',function(result){
                        _displayResults($this,result);
                    });
                    return false;
                });                    
            
                if (this.settings.addresses && this.settings.addresses.length>0){
                    for(var i in this.settings.addresses){
                        _addNewLine($this,this.settings.addresses[i]);
                        var el=$this.find('.ml-form>.ml-address-row').last().find('.ml-address-field').last().find('.ml-button')[0];
                        $this.routecosts('onButtonAddress',el);
                    }
                }
                else{
                    _addNewLine($this);
                    $this.settings.onReady($this);
                }
            });
		},
        
        /**
         * Evaluate the route costs among addresses
         * @param {onsuccess} callback function to be called finding the costs
         * @return {jquery object} keep chainable
         */
        evaluate : function(onsuccess){
            // //http://dev.maplink.com.br/javascript-api/guia-referencia/#StructureMRouteType
            //  desafio: Rota padrão mais rápida:0   e Rota evitando o trânsito:23
            var $this=$(this);
            var _routeType = $this[0].settings.routeType||0;
            var $this=$(this);            
            var maplink_data=$this.data("maplink_data");
            
            if ((!maplink_data.addresses) || (maplink_data.addresses.length<2)){
                console.log("Invalid number of addresses");
                return $this;
            }
            
            var routes = [];
            var city_old=maplink_data.addresses[0].address.city.name;
            var descriptionType=0;
            /*
            // evaluation: 
            // http://maps.google.es/maps/api/directions/json?origin=-22.8041235,-47.06565759999999&destination=-23.5649909,-46.6520745&sensor=false
            maplink_data.addresses[0].point.x=-47.0656576; // Campinas, SP - R. Prof Ferreira Lima, 352
            maplink_data.addresses[0].point.y=-22.8041235;
            maplink_data.addresses[1].point.x=-46.6520745; // São Paulo, SP - Av. Paulista, 1000
            maplink_data.addresses[1].point.y=-23.5649909;
            */
            for (var i = 0; i < maplink_data.addresses.length; i++) { 
                var entry=maplink_data.addresses[i];
                var routestop = new MRouteStop();
                routestop.description = entry.address.city.name+", "+entry.address.city.state+" - "+entry.address.street+" - "+entry.address.houseNumber;
                routestop.point = new MPoint(entry.point.x,entry.point.y);
                //console.log(JSON.stringify(routestop));
                routes.push(routestop);                
                if ((descriptionType===0) && (entry.address.city.name!=city_old)){
                    descriptionType=1;// muda pra rota rodoviária (cidades diferentes)
                }
                city_old=entry.address.city.name;
            }
            
            var routeOptions = new MRouteOptions();            
            var routeDetails = new MRouteDetails();
            
            routeDetails.optimizeRoute = true;
            routeDetails.descriptionType = descriptionType; // 0 Urbana / 1 Rodoviaria (api não é clara: verificar se são cidades diferentes???)
            routeDetails.routeType = _routeType; //Rota padrão mais rápida:0   e Rota evitando o trânsito:23
            
            var vehicle = new MVehicle();
            //
            // TODO: Does not seems to make any difference on the final time and consumption
            //
            //vehicle.tankCapacity = 20;
            //vehicle.averageConsumption = 9;
            //vehicle.fuelPrice = 2.699;
            //vehicle.averageSpeed = 20;
            //vehicle.tollFeeCat = 2; // Automóvel, caminhoneta e furgão (dois eixos simples)
            //
            vehicle.tankCapacity = 20; // TODO: Make it configurable
            vehicle.averageConsumption = 9; // TODO: Make it configurable
            vehicle.fuelPrice = 3; // TODO: Make it configurable
            vehicle.averageSpeed = 60; //TODO: Check against Google Maps api - it seems that does not matter if you change - route time is always the same
            vehicle.tollFeeCat = 2;// Automóvel, caminhoneta e furgão (dois eixos simples)
            
            routeOptions.language = "portugues";
            routeOptions.routeDetails = routeDetails;
            routeOptions.vehicle = vehicle;
            
            var serviceRoute = new MWsRoute();
            serviceRoute.getRoute(routes, routeOptions, function (getRouteResponse) {
                var costs = getRouteResponse.routeTotals;                
                if (onsuccess && typeof(onsuccess)=='function'){
                    onsuccess(costs);
                }
                //$("#result").val(JSON.stringify(costs));
            });
            
            return $this;
        },
        
        /**
         * Search and add an MapLink address into the collection
         * @param {state} state of the address
         * @param {city} city of the address
         * @param {street} street of the address
         * @param {number} home number of the address
         * @param {onsuccess} callback function to be called after finding the coordinates
         * @return {jquery object} keep chainable
         */
        addAddress : function(state,city,street,number,onsuccess,onerror){
            var $this=$(this);
            if (!(($.trim(state)!=='')&&($.trim(city)!==''))){                
                if (onerror && typeof(onerror=='function')){
                    onerror($this);
                }
                return $this;
            }
            var maplink_data=$this.data("maplink_data");
            // ref http://dev.maplink.com.br/javascript-api/funcionalidades/#CodeSamplesConsumeData
            var serviceAddressFinder = new MWsAddressFinder(); 
            var address = new MAddress();            
            address.city = new MCity();            
            address.city.name = city;
            address.city.state = state;
            address.street = street;
            address.houseNumber = number;             
            var addressOptions = new MAddressOptions();
            addressOptions.matchType = 1;
            addressOptions.searchType = 2;
            addressOptions.usePhonetic = true;             
            var resultRange = new MResultRange();
            resultRange.pageIndex = 1;
            resultRange.recordsPerPage = 10;             
            addressOptions.resultRange = resultRange;
            serviceAddressFinder.findAddress(address, addressOptions, function (findAddressResponse) {
                var addressLocation = findAddressResponse.addressLocation;
                var maplink_data=$this.data("maplink_data");
                if (maplink_data){
                    if (addressLocation.length>0){                    
                        maplink_data.addresses.push(addressLocation[0]);
                        if (onsuccess && typeof(onsuccess)=='function'){
                            onsuccess($this);
                        }                    
                        $this[0].settings.onAddressAdded($this);                    
                    }
                    else{
                        if (onerror && typeof(onerror)=='function'){
                            onerror($this);
                        }
                    }
                }
                if ($this[0].settings.addresses.length==maplink_data.addresses.length){
                    $this[0].settings.onReady($this);
                }
            });            
            return $this;
        },
        
        /**
         * Remove an address from collection
         * @param {Number} index address position
         * @param {onsucess} callback function to be called
         * @return {jquery object} keep chainable
         */
        removeAddress : function(index,onsucess){
            var $this=$(this);
            var maplink_data=$this.data("maplink_data");
            if (maplink_data && maplink_data.addresses && (index>=0) && (index<maplink_data.addresses.length)){
                maplink_data.addresses.splice(index,1);
                $this.find('.ml-form>.ml-address-row').eq(index).remove();
                if (onsucess && typeof(onsucess)=='function'){
                    onsucess($this);
                }
            }
            return $this; 
        },
        
        /**
         * Returns an MapLink address or Null object based on a given index position
         * @param {Number} index address position
         * @return Returns an MapLink address based on its index
         */
        getAddress: function(index){
            var $this=$(this);
            var maplink_data=$this.data("maplink_data");
            if (maplink_data && maplink_data.addresses && (index>=0) && (index<maplink_data.addresses.length)){
                return maplink_data.addresses[index];          
            }
            return null;
        },
        
        toggle:function(){
            var $this=$(this);
            _toggle($this);
            return $this;
        },
        
        /**
         * onButtonEvaluate callback function (ui mode)
         * @return Returns an jquery chanable object
         */    
        onButtonEvaluate:function(el)
        {
            var $target=$(el);
            var $this=$target.parent();
            // //http://dev.maplink.com.br/javascript-api/guia-referencia/#StructureMRouteType
            //  desafio: Rota padrão mais rápida:0   e Rota evitando o trânsito:23
            $this.find('.ml-route-result').hide();
            $this.find('.ml-route-info').show();
            $this[0].settings.routeType=($this[0].settings.routeType===0)?23:0;                
            $this.routecosts('evaluate',
                function(result){
                    _displayResults($this,result);
                }
            );
            return $this;            
        },
        
        /**
         * set or get routeType
         * @return Returns an jquery chanable object
         */    
        routeType:function(routeType)
        {
            var $this=$(this);
            if (typeof(routeType)=='nothing'){
                return $this[0].settings.routeType;
            }
            else{
                $this[0].settings.routeType=((routeType===0)||(routeType===23))?routeType:0;                
                return $this;
            }
        },
        
        /**
         * onButtonAddress callback function (ui mode)
         * @return Returns an jquery chanable object
         */
        onButtonAddress:function(el){
            var $target=$(el);
            var $elrow=$target.parent().parent();
            var $this=$elrow.parent().parent().parent();            
            var $elicon=$target.find('.ui-icon'); // row entry            
            if ($elicon.hasClass('ui-icon-trash')||$elicon.hasClass('ui-icon-check')){ 
                if ($elrow){
                    var index=$elrow.index()-1;// remove the header
                    $this.routecosts('removeAddress',index,function($this){
                        var maplink_data=$this.data("maplink_data");
                        if (maplink_data && maplink_data.addresses && maplink_data.addresses.length>1){
                            $this.find('.ml-route-result').hide();
                            $this.find('.ml-route-info').show();
                            $this.routecosts('evaluate',function(result){
                               //console.log(result);
                               _displayResults($this,result);
                            });
                        }
                        else{
                            $this.find('.ml-route-result').hide();
                            $this.find('.ml-route-info').hide();
                            $this.find('.ml-button-route-type').hide();
                        }
                    });
                }
                _setFocus($this);    
                return $this;
            }
            else if ($elicon.hasClass('ui-icon-plus')){ 
                $elicon.removeClass('ui-icon-plus').addClass('ui-icon-spinner');
                $this.find('.ml-route-result').hide();
                $this.find('.ml-route-info').show();
                $this.find('.ml-button-route-type').hide();
                $this.routecosts('addAddress',
                    $elrow.find('.ml-address-field > input[name=state]').val(),
                    $elrow.find('.ml-address-field > input[name=city]').val(),
                    $elrow.find('.ml-address-field > input[name=street]').val(),
                    $elrow.find('.ml-address-field > input[name=number]').val(),
                    function($this){
                        var $elrow=$this.find('.ml-form>.ml-address-row>.ml-address-field').last(); // row entry
                        var $elicon=$elrow.find('.ml-button>.ui-icon'); // row entry
                        $elicon.removeClass('ui-icon-spinner').addClass('ui-icon-check').attr('title','Remova este endereço');
                        $this.find('.ml-form>.ml-address-row').last().find('input').prop('disabled', true);
                        var maplink_data=$this.data("maplink_data");
                        if (maplink_data && maplink_data.addresses && maplink_data.addresses.length>1){                        
                            $this.routecosts('evaluate',function(result){
                               //console.log(result);
                               _displayResults($this,result);
                            });
                        }
                        else{
                            $this.find('.ml-route-info').hide();
                        }
                        _addNewLine($this);                    
                    },
                    function($this){
                        console.log('Invalid address');
                        $this.find('.ml-route-info').hide();
                        $elicon.removeClass('ui-icon-spinner').addClass('ui-icon-plus');
                        _setFocus($this);
                    }
                );
            }
            return $this;
        }
    };
    
    /**
    * The MapLink routecosts jquery plugin 
    * @return Returns an jquery chanable object
    */    
    $.fn.routecosts= function(method) {
        if (methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} 
		else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} 
		else {
			$.error( 'Method ' +  method + ' does not exist on usertext' );
		}		
	};	
	//------------Map Link find route costs ------------------//
})(jQuery);
