;(function($) {

    "use strict";    

	
   $.UIjson  = {

                         version           : "v1.0.0.0",
                         bootstrap_version : "3",
                         jquery_version    : "2.2",
                         jquery_ui_version : "v1.11.4"
   };

   $.UIjson.defaults = {

						 binders     : {
   
							             tabs       : ".UIjson.nav-tabs" ,
								     sections   : ".UIjson.sections" ,
								     obj        : ".UIjson.obj_UI" 
						 },
						 dataHolder : {
						                     tabName    : "General" ,
						                     path       : false     ,
							             label      : "&nbsp"   ,
							             arrEach    : false     ,
								     options    : false     ,
								     array_Api  : {
										     sortable : true ,
										     add      : true ,
										     remove   : true
								     }



						 }
   }; 
   
   /**
   *   The main constructor of UIjson
   *   Dataholders are the defined dataholders from config or defineProp method.
   *   dataholders in _Objects are a reference of Dataholders in constructor.
   **/
   $.UIjson.Instance = function(){
	          
		this.Settings     = "",
	        this.Element      = null,
	        this._Objects     = [],
                this.ActiveTab    = "General",			  
	        this.Tabs         = {},
	        this.Sections     = {},
	        this.Dataholders  = []
   };
   
   $.UIjson.create   = function( el , params ){
	   
	          var inst = new $.UIjson.Instance();
			  
		          inst.Element  = el;
				  inst.Settings = $.extend(true, {}, $.UIjson.defaults , params.config );  
				  
	              $(el).data( 'UIjson', inst );
		          inst.init( el, params );
			      
		      return inst;
   };
   
   
   /**
   *    Creates an object to push to _Objects array of UIjson instance.
   *    JsTree is the object feeder in our case, but using a feeder we can get objects from everywhere we want.
   **/
   
   $.UIjson.Obj = function( Ob , path ){
	   
	          this.obj         = Ob;
			  this.ui_wrapper  = null;
			  this.dataholders = [];
			  
	          if( $.type( path )!=="undefined" ){
					 
				this.path = path;	 
		      }
   };
   

   /** Here are the main methods of UIjson **/
   
   $.UIjson.Instance.prototype = {
	   
	             init    : function( el , opts ){
					                  
					        var len,u = 0,THAT = this;
								
								if( opts.hasOwnProperty("properties") && opts.properties ){
									
									 len = opts.properties.length;
									 
       							     for( u = 0; u < len; u++ ){

       								    this.defineProp( opts.properties[u] );
										
       						         }
		                        }
								if( opts.hasOwnProperty("_Objects") && opts._Objects ){
									
									len = opts._Objects.length;
									
       							    for( u = 0; u < len; u++ ){
										
								        this.ImportObject( opts._Objects[ u ].obj , opts._Objects[ u ].path );
										
									}
		                        }
								this.Element.find(".nav-tabs").eq(0).children().eq(0).find("a").trigger("click");

				 },                   				                      
				 destroy  : function(){ 
					               
								/* Detach events from tabs */
                                for( var b in this.Tabs ){

									 $.UIjson.Tabs.detachEv( this.Tabs[ b ] , this );   
								}
								
								/* Detach events from UI_elements if they exist */								
								this.ObjAll_Clear();
								
								/* Clear contents of tab parent  and section parent */
                                this.Element.find( this.Settings.binders.tabs ).empty(); 
								this.Element.find( this.Settings.binders.sections ).empty();
								
								/* No need to wait for garbage collector to do his work*/
			                    this.Settings     = "";
	                            this._Objects     = [];								
                    		    this.Tabs         = {};
                    	        this.Sections     = {};
                    			this.Dataholders  = [];
					
			                    this.Element.removeData('UIjson');								
					            this.Element = null;	  
				 }, 
				 				 
                 /** Tabs Api Includes defineTab, tabOrder , removeTab methods and some other other functions inside $.UIjson.Tabs block **/
				 
				 defineTab : function( tabName ){
							
							    this.Tabs[ tabName ]     = $.UIjson.Tabs.createTab( tabName );
							    this.Sections[ tabName ] = $.UIjson.Sections.createSection( tabName );
								
								this.Tabs[ tabName ].element.appendTo( this.Element.find( this.Settings.binders.tabs ) ); 
								this.Sections[ tabName ].element.appendTo( this.Element.find( this.Settings.binders.sections) ); 

								$.UIjson.Tabs.attachEv( this.Tabs[ tabName ] ,this );	

								return this.Tabs[ tabName ];
				 },                   
				                      
				 tabOrder  : function( arr ){ 
					 
			                    var t,arrObjects = [],THAT = this;
								$(arr).each(function(i,str){
			                        for ( t in THAT.Tabs ){ 
			                           if(THAT.Tabs[t].name === str){
										  arrObjects.push(THAT.Tabs[t]);  
									   }
								    }
								});

								$.UIjson.Tabs.tabOrder( arrObjects );					                  
					                  
				 },                   
				                      
				 removeTab  : function( tabName ){ 
					                  			
			                      var k,m,TabObj,SectionObj,Objs = this._Objects , ObjsLen = Objs.length;
			                        if( this.Tabs.hasOwnProperty(tabName) ){
								     	
						                TabObj     = this.Tabs[ tabName ];
							            SectionObj = this.Sections[ tabName ];
                                            for( k = 0 ; k < this.Dataholders.length; k++ ){
        										
        										   if( this.Dataholders[ k ].tabName === tabName ){
        											  
													   this.propTab( this.Dataholders[ k ] , this.Settings.dataHolder.tabName );
													   
													   for( m = 0 ; m < ObjsLen; m++ ){
													       this.Obj_PropClear( Objs[m] , this.Dataholders[ k ].prop_name ); 
													   }
        										   }
												   
        									}																	     
			                            $.UIjson.Tabs.deleteTab( TabObj );
										delete this.Tabs[ tabName ] ;
							            $.UIjson.Sections.deleteSection( SectionObj );
										delete this.Sections [ tabName ];

								     }					                  
				 }, 
			     propTab   : function( dtObj , tabName ){
					 
					                var	TAB_OBJ; 
									if( $.type(tabName)!=="undefined" ){
              							    if( this.Tabs.hasOwnProperty( tabName ) === false ){
               											
               									    TAB_OBJ       = this.defineTab( tabName ); 
											}else{
												    TAB_OBJ       = this.Tabs[ tabName ]; 
											}		
        										    dtObj.tabName = tabName;
        											dtObj.tab     = TAB_OBJ.element;
        											dtObj.section = this.Sections[ tabName ];
               							    
									}else{
										       return dtObj.tabName;
									}		
				
					 
				 },
				 
                 /** Dataholders Api **/ 
				 
				 defineProp : function( propObj ){
					                  
			
			                      var TAB_OBJ,SECTION_OBJ,NewProp,TabName,THAT = this,
       								propObj = $.extend(true, {} , THAT.Settings.dataHolder , propObj ); 
									
        	                        if( !$.UIjson.UI_Elements.hasOwnProperty( propObj.assignTo ) ){ alert( propObj.assignTo+ " does not exist in UIjson "); return false; }
									
       								TabName = propObj.tabName;
       								
       							    if( this.Tabs.hasOwnProperty(TabName)===false ){
       											
       										TAB_OBJ = this.defineTab.apply( THAT, [ TabName ] ); 				  
       							    }		
       							    TAB_OBJ     = this.Tabs[ TabName ];
       							    SECTION_OBJ = this.Sections[ TabName ];
       				
       								propObj.tabName  = TAB_OBJ.name;
       								propObj.tab      = TAB_OBJ.element;
       								propObj.section  = SECTION_OBJ.element;
                                    propObj.assignTo = $.UIjson.UI_Elements[ propObj.assignTo ];
       								
       							    $(this.Dataholders).each(function( i , dthdObj ){
       								
       								     if( dthdObj.prop_name === propObj.property && dthdObj.path === propObj.path ){

											  $.extend(true, dthdObj , propObj ); 
											  return dthdObj;  
       									 }
       							    });
                                    propObj["prop_name"] = propObj["property"];

									NewProp = $.extend(true, {}, this.Settings.dataHolder , propObj ); 
       							    this.Dataholders.push( NewProp );        
       					            return NewProp;					                  
				 },                   
				 unsetProp : function( propObject ){
                                    
									var k,u,_obj;
				 
                                    for( k = 0 ; k < this._Objects.length; k++ ){
										
									        _obj = this._Objects[ k ];
											
											for( u = 0 ; u < _obj.dataholders.length; u++ ){
												
									             if( _obj.dataholders[ u ].config === propObject ){
													 
													    _obj.dataholders.splice( u , 1);
														break;
												 }
											   
											}
									}		
                                    for( k = 0 ; k < this.Dataholders.length; k++ ){
										
										   if( this.Dataholders[ k ] === propObject ){
											   this.Dataholders.splice(k, 1);
										   }
									}									
																       
							   
				 },				      
                 getProp         : function( str , path ){ 
         
            			                var THAT = this,propObj = false;
            							    if( $.type(str) === "string" ){ 
            							        $(this.Dataholders).each(function(i,obj){
            								      if( obj.prop_name === str ){
            										  if( $.type(path) !== "undefined" ){
            											  if( obj.path === path ){ 
            											       propObj = obj; 
            											  }
            										  }
            									      else{   
            											  propObj = obj;     
            										  }
            								      }
            							       });
            							    }else{
            								       propObj = str;
            							    }
            
            							 return propObj;
         							 
         		 },		 
				 ImportObject  : function( obj , path ){ 
					 
					                    var newObject = new $.UIjson.Obj( obj , path );
					                    this._Objects.push( newObject );
					                    this.Obj_initDataholders( newObject );
										
										this.Element.trigger("ImportObject.UIjson", [ newObject ]);
				 },
                 getUIjsonObj : function( ob ){
					                    var UIob = false;
					                    $( this._Objects ).each(function( i , UIjsonObj ){
											
											if( UIjsonObj.obj === ob ){ 
												UIob = UIjsonObj;
											}
										});
										return UIob;
					 
				 },				 
                 Obj_Delete	 : function( UIjsonObj ){
					 
					                    var THAT = this;
	                                    $(this._Objects).each(function( i , obj ){
											
											   if( obj === UIjsonObj ){
												    THAT.Obj_ClearRender( UIjsonObj );
												    THAT._Objects.splice( i , 1 );
													return false;
											   }
										});				 
					 
				 },
                 Obj_DeleteAll : function(){
					 
					                    var THAT = this;
	                                    $(this._Objects).each(function( i , obj ){
											

												    THAT.Obj_ClearRender( obj );
												    THAT._Objects.splice( i , 1 );
													return false;
											   
										});				 
					 
				 },				 
                 Obj_Elements : function( UIjsonObj , propName ){
					 
					                    var u , k , ObjDataholders = UIjsonObj.dataholders , all_Elements = [];

					                    for ( u = 0; u < ObjDataholders.length; u++ )
									    {   
									      if( propName )
										  { 
                                            if( ObjDataholders[ u ].propertyName ===  propName ){	
											
											    for ( k = 0; k < ObjDataholders[ u ].elements.length; k++ )
											    {
											    		all_Elements.push( ObjDataholders[ u ].elements[ k ] );
											    }
											}
										  }else{
											    for ( k = 0; k < ObjDataholders[ u ].elements.length; k++ )
											    {
											    		all_Elements.push( ObjDataholders[ u ].elements[ k ] );
											    }											  
											  
										  }
										}
										return all_Elements; 
				 },			 
				 Obj_Update  : function( UIjsonObj ){  
				 
				                        /** 
										    Parsing all elements of all dataholder objects of a UIjson object and using Val_Method of each assigned UI_element 
											updates all values of imported Object reference.										
										**/
										this.Obj_PropUpdate( UIjsonObj );

									    this.Element.trigger("Obj_Update.UIjson", [ UIjsonObj ] ); 
										 														                  
				 },
				 ObjAll_Render    : function(){ 
				 
					                    var t , _Objs = this._Objects , len = _Objs.length , tab = this.ActiveTab;
										
					                    for( t = 0; t < len; t++ ) 
									    {    
												this.Obj_ClearRender(  _Objs[ t ] );  
												this.Obj_Render(  _Objs[ t ] , tab );
											  
									    }
										
					                    this.Element.trigger("ObjAll_Render.UIjson", [ this ]);
				 },
				 ObjAll_Clear : function(){ 
				 
					                    var t , _Objs = this._Objects , len = _Objs.length;
										
					                    for( t = 0; t < len; t++ ) 
									    {    
												this.Obj_ClearRender( _Objs[ t ] );  											  
									    }
										
					                    this.Element.trigger("ObjAll_Clear.UIjson", [ this ]);
				 },	
				 ObjAll_Redraw : function(){ 
				 
					                    var t , _Objs = this._Objects , len = _Objs.length;
										
					                    for( t = 0; t < len; t++ ) 
									    {    
												this.Obj_Redraw( _Objs[ t ] );  											  
									    }
										
					                    this.Element.trigger("ObjAll_Redraw.UIjson", [ this ]);
				 },				 
				 Obj_initDataholders  : function(  UIjsonObj  ){ 
					                     
										 var THAT = this , dtHd , dataProperties = [];
										 
										 this.Obj_ClearRender( UIjsonObj );
										 
										 UIjsonObj.dataholders = []; 
										 
                                         $.each( this.Dataholders , function( Ki, propObj ){
													   
											if(  UIjsonObj.obj.hasOwnProperty( propObj.prop_name )   ){ 
												
										         if(  (!propObj.path || !UIjsonObj.path) || (propObj.path && UIjsonObj.path && $.UIjson.helpers.checkPath( UIjsonObj.path , propObj.path ))  ){
													 
														
													    dataProperties.push( propObj.prop_name );
																											 
														 dtHd =  {
											                         propertyName : propObj.prop_name,
											                         elements     : [],
															         config       : propObj
											                }; 
															
												        UIjsonObj.dataholders.push( dtHd );
														
														
												 } 												
	
											}
	
										});
										return  dataProperties;
										
				 },
				 Obj_Redraw     : function( UIjsonObj ){
					 
					                       this.Obj_ClearRender( UIjsonObj );
					                       this.Obj_Render( UIjsonObj );
					 
				 },
                 Obj_Render     : function( UIjsonObj ){
					 
                                           var path = UIjsonObj.path || "";		
										   
    								           UIjsonObj.ui_wrapper = $(  '<div class="col-md-12 col-lg-12 col-sm-12">'
																		 +   '<label class="path-label control-label">'+path+'</label>'
																		 +   '<div class="UIjson_ObjWrapper row"></div>'
																		 + '</div>'
																	   ).appendTo( this.Sections[ this.ActiveTab ].element );
											
											/** Calling Obj_PropRender without propName argument will render all properties of UIjsonObj object. **/
											this.Obj_PropRender( UIjsonObj );						   
					 
				 },				 
				 Obj_PropRender : function( UIjsonObj , propName ){
					 
					                   var ka , p , dtHd , UIelement , value , path = UIjsonObj.path || "" , dtObjs = UIjsonObj.dataholders , dtObjLen = dtObjs.length;
									   
									   /** Scan dataholder-Objects of UIjsonObj and filter them by 'propName'. **/
									   
					                   for( ka = 0; ka < dtObjLen; ka++ ){ 
									   
									        dtHd = dtObjs[ ka ];
											
									        if( $.type(propName)==="undefined" || dtHd.propertyName === propName ){
												 
												/**  Check if the matched property is assigned to the activeTab **/
												 
												 if( dtHd.config.tabName === this.ActiveTab  ){
													 
													 value = UIjsonObj.obj[ dtHd.propertyName ];
													 
													 /**  Check if there is not a wrapper of UIjsonObj in HTML.If not , create one. **/
													  
													  if( !UIjsonObj.ui_wrapper ){
    			                                           UIjsonObj.ui_wrapper = $(  '<div class="col-md-12 col-lg-12 col-sm-12">'
																			        +   '<label class="path-label control-label">'+path+'</label>'
																			        +   '<div class="UIjson_ObjWrapper row"></div>'
																			        + '</div>'
																			      ).appendTo( this.Sections[ this.ActiveTab ].element );													 
													  }
													 
													  /** Check if arrEach is true so we are going to render multiple elements and not a single. **/
													 
													  if( dtHd.config.arrEach && $.UIjson.helpers.IsArrayOfStrings( value ) ){
														    
															  /** Create the wrapper element for array elements with glyphicon-plus("+") symbol **/
														      dtHd.array_wrapper = this.initArrayTemplate( UIjsonObj , dtHd  , UIjsonObj.ui_wrapper.find(".UIjson_ObjWrapper") );
															 
                                                              for(  p = 0; p < value.length; p++ ){
                                                                  /** Create each element for the array with glyphicon-remove("x") symbol **/
                                                                   UIelement = $.UIjson.Actions.ArrCreateUI_Elem({ 
																	                                    data:{
																	                                    	UIjsonInstance : this,
																	                                    	UIjsonObj      : UIjsonObj,																											
																	                                    	dtHd           : dtHd,
																	                                    	parent         : dtHd.array_wrapper
																	                                    } 
																									   });
																	
																  dtHd.config.assignTo.Val_Method( UIelement , value[p] );
															   }															 
														  
													  }else{
												              UIelement = this.createUiElement( UIjsonObj , dtHd , UIjsonObj.ui_wrapper.find(".UIjson_ObjWrapper") );
												              dtHd.config.assignTo.Val_Method( UIelement , UIjsonObj.obj[dtHd.propertyName] );
													 
													  }
													  
													
												 }
												 
											}
												
									   }    
					 
					 
				 },
				 Obj_ClearRender  : function( UIjsonObj ){
					 
					                    if( !UIjsonObj.ui_wrapper ){ return false; }  
					                    /** Calling Obj_PropClear without 'propName' argument will clear UI of all the properties of UIjsonObj object. **/
										
					                    this.Obj_PropClear( UIjsonObj );
										
									    UIjsonObj.ui_wrapper.remove(); 
										UIjsonObj.ui_wrapper = null;
										
										this.Element.trigger("Obj_ClearRender.UIjson", [ UIjsonObj ]); 				 
					 
				 },				 
				 Obj_PropClear : function( UIjsonObj , propName ){ 
					 
					                     var el , ka , dtHd , y  , dtObjs = UIjsonObj.dataholders , dtObjLen = dtObjs.length;					 
									    /**
										   Scan dataholder-Objects of UIjsonObj and filter them by propName.
										   Then remove events calling detach method from assigned UI_element.
										   Also remove every event and element associative to array API like "x" symbol for delete, "+" for insert and array wrapper.
										   Finally empty "elements" array of dataholder.
									    **/
					                       for( ka = 0; ka < dtObjLen; ka++ ){ 
									   
									             dtHd = dtObjs[ ka ];
											
									             if(  $.type(propName)==="undefined" || dtHd.propertyName === propName ){
													 
   					                                  for( y = 0; y < dtHd.elements.length; y++ )											   
   										              {  
										                  el = dtHd.elements[ y ];	
														  
 										                  if( dtHd.config.assignTo.hasOwnProperty("detachEv") ){
												  	   
   									                          dtHd.config.assignTo.detachEv( this , el );
												          }
														  
												          el.find( ".glyphicon-remove" ).off( "click" , $.UIjson.Actions.RemoveUI_Elem );
												          
												          this.Element.trigger("Obj_PropClear.UIjson", [ UIjsonObj , dtHd.config , el ]);
												         
   											              el.remove();
											  
													  }
													  
											          if( dtHd.array_wrapper ){
											          	
											              dtHd.array_wrapper.parent().find(".glyphicon-plus").off( "click" , $.UIjson.Actions.ArrCreateUI_Elem );
                                                          if ( typeof jQuery.ui !== 'undefined' ) { 
									  
									                            if( dtHd.array_wrapper.hasClass( "ui-sortable" ) ){ 
									     
									                                         dtHd.array_wrapper.sortable( "destroy" );
                                                                }
														  }	
														  
                                                          dtHd.array_wrapper = null;
											          } 
											          
   								                      dtHd.elements = [];													  
													  
												 }
												 
										   }												 
				 },
				 Obj_PropRedraw    : function( UIjsonObj , propName ){
					 
					                      var el , ka , dtHd , y  , dtObjs = UIjsonObj.dataholders , dtObjLen = dtObjs.length;
										 
					                       for( ka = 0; ka < dtObjLen; ka++ ){ 
									   
									             dtHd = dtObjs[ ka ];
											
									             if(  $.type(propName)==="undefined" || dtHd.propertyName === propName ){
													 
													   this.Obj_PropClear(  UIjsonObj , propName );
													   this.Obj_PropRender( UIjsonObj , propName );
												 }
										   }												 
					 
				 },
				 Obj_PropUpdate    : function( UIjsonObj , propName ){ 
				 
					                   var k , ka  , arr = [] , dtHd  , dtObjs = UIjsonObj.dataholders , dtObjLen = dtObjs.length;
									   
									   /** Scan dataholder-Objects of UIjsonObj and filter them by 'propName'. **/
									   
					                   for( ka = 0; ka < dtObjLen; ka++ ){ 
									   
									        dtHd = dtObjs[ ka ];
											
									       if( $.type(propName)==="undefined" || dtHd.propertyName === propName ){	
 
										          	if( dtHd.array_wrapper && dtHd.config.arrEach ){	
													
										          		for ( k = 0; k < dtHd.elements.length; k++ )
										          		{
										          			arr.push( dtHd.config.assignTo.Val_Method( dtHd.elements[k] )  );
										          		}
										          		
										          		UIjsonObj.obj[ dtHd.propertyName ] =  arr;
										          		
										          	}else if( dtHd.elements.length === 1 && !dtHd.config.arrEach ){  
										          		
										                UIjsonObj.obj[ dtHd.propertyName ] =  dtHd.config.assignTo.Val_Method( dtHd.elements[0] );
										          	   
										          	}	 
									              
                                                    this.Element.trigger("Obj_PropUpdate.UIjson", [ UIjsonObj , dtHd.propertyName ] ); 
										   }
										   
										 
									   }			 
				 
				 
				 
				 }, 
				 createUiElement   : function( UIjsonObj , dtHd , parent ){
					 
									   var UiEl, dthdCONFIG = dtHd.config , THAT = this;	
									       
										   /**If no element is assigned return**/
			                               if( !dthdCONFIG.assignTo ){ return false; }	

										   UiEl = $( dthdCONFIG.assignTo._HTML );
										   
										   if( dthdCONFIG.hasOwnProperty("label") ){
											   
										          UiEl.find("label").html( dthdCONFIG.label );
										   }
										   
					                       /** Adding Options in case of select,radio and checkbox elements **/
						                   if( dthdCONFIG.options && dthdCONFIG.assignTo.hasOwnProperty("_Options") ){
											   
						                          dthdCONFIG.assignTo._Options( UiEl , dthdCONFIG.options );
						                   }
										   
										   if( dthdCONFIG.assignTo.hasOwnProperty("attachEv") ){
											   
	                                              dthdCONFIG.assignTo.attachEv( THAT  , UIjsonObj , dtHd , UiEl );
				                           }
										   
										   if( parent ){ parent.append( UiEl ); }
										   
										   dtHd.elements.push( UiEl );

                                           this.Element.trigger( "createUiElement.UIjson", [ UIjsonObj , dtHd , UiEl ]);	
										   
									    return UiEl;										   
					 					 					 
				 },
				 initArrayTemplate : function( UIjsonObj, dtHd , par ){ 
			
                              var THAT = this,lab = dtHd.config.label,arrTemplate,Wrapper,glyf,Class = "UIjsonArraySortable"; 
			              
								  
							    arrTemplate = $('<div class="col-md-12 col-lg-12 col-sm-12"><label class="control-label">'+lab+'</label><div class="UIjsonArraySortable row"></div></div>').appendTo(par);
                                 glyf   = $('<div class="glyphicon glyphicon-plus pull-right" aria-hidden="true" style="color:green;padding-left:10px;"></div>').appendTo(arrTemplate.find("label"));

                                 glyf.on( "click", { UIjsonInstance:this, UIjsonObj:UIjsonObj , dtHd:dtHd , parent:par.find("."+Class) }, $.UIjson.Actions.ArrCreateUI_Elem );

							   Wrapper = arrTemplate.find("."+Class);
				
							   
							   if (typeof jQuery.ui !== 'undefined') { 
									  
									   if( Wrapper.hasClass( "ui-sortable" ) ){ 
									     
									          Wrapper.sortable( "destroy" );
									   }
									   Wrapper.sortable( { cursor: "move" , revert: true , helper: "clone" } );
									   
									   Wrapper.on( "sortstart", function( event, ui ) {
									      ui.placeholder.height(ui.item.height());
									      Wrapper.height(ui.item.parent().height());
									   });
									   
									   Wrapper.on( "sortstop", function( event, ui ) {
										   var r,items,ReOrder = [];
									       ui.placeholder.height("");
									       Wrapper.height("");
										   items = ui.item.parent().children();
										       for( r = 0; r < items.length; r++ ){  
										       
												   ReOrder.push(  $(items[ r ]) );
										        }
											   
										   dtHd.elements = ReOrder;
										   
										   THAT.Obj_PropUpdate( UIjsonObj , dtHd.propertyName );

									   });
									 
							  } 
                              
                              return Wrapper;	 						  					 
					 
				 }
	        
	   
   };
   

    /**
	
   $.UIjson.Actions includes handler functions for user actions.

   **/
   
   $.UIjson.Actions      = { 
   
                         /** 
						     clickTab is attached to all "<a>" elements inside tabs and runs on click event. 
						     It makes clicked tab active using "active" class
							 Matched section of active tab becomes visible while the rest of sections become invisible
						 **/
						 clickTab  : function( event ){ 
							 
							                 var args       =  event.data;							 
							                 var Instance   =  args.UIjsonInstance,
											     TAB_obj    =  args.TAB_obj,
											     SECTION_obj;
												 
											 	TAB_obj.element.parent().children().removeClass("active");
		                                        TAB_obj.element.addClass( "active" );
												
											    SECTION_obj = Instance.Sections[ TAB_obj.name ];
												
												/** Hide all sections and show only the targeted based on tab name**/
						                        SECTION_obj.element.parent().children().hide();						
                                                SECTION_obj.element.show();	
												
									            Instance.ActiveTab = TAB_obj.name;
									            Instance.ObjAll_Render();												
											 
						 },
						 /** 
						    ArrCreateUI_Elem is used only if arrEach is set to true and Fires when user clicks glyphicon-plus("+") symbol to add an new UI element in the array. 						
						 **/							 
						 ArrCreateUI_Elem   : function( event ){ 
						 
						                     var args       = event.data;
						                     var Instance   = args.UIjsonInstance,
						                         UIjsonObj  = args.UIjsonObj , 
												 dtHd       = args.dtHd , 
												 parent     = args.parent , 
												 el;

                                                 el = Instance.createUiElement( UIjsonObj , dtHd , parent );												 
                                                 el.find(".control-label").hide();
												 
                                                 /** Add glyphicon-remove("X") symbol so element can be removed **/
												 
                                                 $('<div class="UIjsonRemove glyphicon glyphicon-remove pull-right" style="color:red;padding: 5px;" aria-hidden="true"></div>')
											      .prependTo( el.find("div").eq(0) )
											      .on( "click",{ elem : el , UIjsonObj : UIjsonObj , dtHd:dtHd , UIjsonInstance : Instance },$.UIjson.Actions.ArrRemoveUI_Elem );

												 if( event.target ){ 
												     Instance.Obj_PropUpdate( UIjsonObj , dtHd.propertyName );
												 }
                                                 return el;																				 
						 },
						 /** 
						    ArrRemoveUI_Elem is used only if arrEach is set to true and Fires when user clicks glyphicon-remove("X") symbol to remove an element from the array. 						
						 **/						 
						 ArrRemoveUI_Elem   : function( event ){ 
						 
							                 var args       = event.data;
						                     var Instance   = args.UIjsonInstance,
						                         UIjsonObj  = args.UIjsonObj ,
												 dtHd       = args.dtHd  ,
 												 el         = args.elem;

												 el.find( ".glyphicon-remove" ).off( "click" , $.UIjson.Actions.RemoveUI_Elem );
												 
												 for( var q = 0; q < dtHd.elements.length; q++ )
												 {  
													   if( dtHd.elements[ q ].get(0) === el.get(0) ){       
														 
														   dtHd.elements.splice( q , 1 ); 
														   el.remove();
														   break;
													   } 
													   
												 }
												 if( event.target ){ 
												     Instance.Obj_PropUpdate( UIjsonObj , dtHd.propertyName );
												 }
												 
						 }						 
						 
   
   };   
   
   $.UIjson.UI_Elements  = {
	   
	       input_field   : { 
						 _HTML     :   '<div class="col-md-6 col-lg-6 col-sm-6 UIjson_el">'
						             +    '<div class="form-group">'
									 +      '<label class="control-label"></label>'
									 +      '<input class="form-control" type="text">' 
									 +    '</div>'
									 + '</div>',
						Val_Method : function( _HTML , value ){ 
						                              var target = _HTML.find("input");
												      if( $.type( value )!=="undefined" ){   target.val( value );
													  }else{                                 return target.val();  
													  }
						},
						attachEv   : function( UIjsonInstance , UIjsonObj , dtHd , el ){ 
																			
								                        el.find("input").eq(0).on(    "change", $.proxy( UIjsonInstance, "Obj_PropUpdate" , UIjsonObj , dtHd.propertyName )    );					
						                                return el; 
						},
                        detachEv  : function( UIjsonInstance , el ){ 
						
						                                el.find("input").eq(0).off( "change", UIjsonInstance.Obj_PropUpdate    );							
						                           
						}												
		 },		 
    	 textarea_field : { 
    		              _HTML    :   '<div class="col-md-6 col-lg-6 col-sm-6 UIjson_el">'
						             +   '<div class="form-group">' 
						             +     '<label    class="control-label"></label>'
									 +     '<textarea class="form-control" type="text" ></textarea>'               
									 +    '</div>'
									 + '</div>',									 
						Val_Method : function( _HTML , value ){ 
						                              var target = _HTML.find("textarea");
												      if( $.type( value )!=="undefined" ){   target.val( value );
													  }else{                                 return target.val();  
													  }
						},
						attachEv    : function( UIjsonInstance , UIjsonObj , dtHd , el ){ 
						
													  el.find("textarea").eq(0).on("change" , $.proxy( UIjsonInstance, "Obj_PropUpdate" , UIjsonObj , dtHd.propertyName ) );
						                              return el; 
						},
                        detachEv    : function( UIjsonInstance , el ){ 
						
													  el.find("textarea").eq(0).off( "change", UIjsonInstance.Obj_PropUpdate    );	
						                           
						}													  
    	 },
    	 select_list   : { 
    		              _HTML    :   '<div class="col-md-6 col-lg-6 col-sm-6 UIjson_el">'
						             +   '<div class="form-group">' 
						             +     '<label  class="control-label"></label>'
									 +     '<select class="form-control" type="text" ></select>'               
									 +    '</div>'
									 + '</div>',									 				  
						  _Options : function( _HTML , options  ){
							           var OptParent = _HTML.find("select");
									   $(options).each(function(k,v){
										   OptParent.append('<option value="'+v+'">'+v+'</option>');
									   });
						  },						  
						Val_Method : function( _HTML , value ){ 
						                              var target = _HTML.find("select");
												      if( $.type( value )!=="undefined" ){   target.val( value );
													  }else{                                 return target.val();  
													  }
						},
						attachEv    : function( UIjsonInstance , UIjsonObj , dtHd , el ){ 
						
													  el.find("select").eq(0).on( "change" , $.proxy( UIjsonInstance, "Obj_PropUpdate" , UIjsonObj , dtHd.propertyName ) );
						                              return el; 
						},
                        detachEv    : function( UIjsonInstance , el ){ 
						
													  el.find("select").eq(0).off( "change", UIjsonInstance.Obj_PropUpdate    );
						                           
						}																		
    	 },
    	 checkbox : {  
    		              _HTML    :   '<div class="col-md-6 col-lg-6 col-sm-6 UIjson_el">'
						             +   '<div class="form-group">' 
						             +     '<label  class="control-label main_label"></label>'             
									 +    '</div>'
									 + '</div>',									 	
						  _Options : function( _HTML , options  ){
							             var OptParent = _HTML.find(".form-group");
										 $(options).each(function(k,v){
								OptParent.append('<div   class="checkbox"><label class="control-label"><input type="checkbox" name="k" value="'+v+'"></label>'+v+'</div>');								
										 });
						  },    	                			  
						Val_Method : function( el , value ){ 
										                  var arr = [];
										            
												          if( $.type( value )!=="undefined" ){
															   el.find('input').prop("checked", false); 
															   if( $.type( value )==="array" ){
																     $(value).each(function(index){
												                     el.find('input[value="'+value[index]+'"]').prop("checked", true);
																     });
															   }else{
																     el.find('input[value="'+value+'"]').prop("checked", true);
															   }
														  }else{     
														              el.find( "input:checked" ).each( function(key,elem){
															               arr.push($(elem).attr("value"));
														              });
																	  
														             return arr;
 
														  }						  
					    },
						attachEv   : function( UIjsonInstance , UIjsonObj , dtHd , el ){ 
						
													     el.find("input").on( "change" , $.proxy( UIjsonInstance, "Obj_PropUpdate" , UIjsonObj , dtHd.propertyName ) );
						                                 return el; 
						},
                        detachEv   : function( UIjsonInstance , el ){ 
						
													     el.find("input").off( "change", UIjsonInstance.Obj_PropUpdate    );
						                           
						}														  
    	 },
    	 radio    : {
    		              _HTML    :   '<div class="col-md-6 col-lg-6 col-sm-6 UIjson_el">'
						             +   '<div class="form-group">' 
						             +     '<label  class="control-label main_label"></label>'             
									 +    '</div>'
									 + '</div>',									 	
						  _Options : function( _HTML , options  ){
							             var OptParent = _HTML.find(".form-group");
										 $( options ).each(function(k,v){
											 OptParent.append('<div class="radio"><label class="control-label"><input type="radio" name="k" value="'+v+'"></label>'+v+'</div>');
										 });
						  },    	                				  
						Val_Method : function( el , value ){
							                            var va,found;
												        if( $.type( value )!=="undefined" ){ 
														      found = el.find("input[value='"+value+"']");
														   if(found.length>0){
												             found.prop( "checked", true );
														   }else{
															 el.find("input:checked").prop( "checked", false );  
														   }
														}else{
															  va  = el.find("input:checked").val();
															  if( $.type( va )==="undefined" ){ va = "";}
															  return va;
														}   
						},
						attachEv   : function( UIjsonInstance , UIjsonObj , dtHd , el ){ 
						
													    el.find("input").on( "change" , $.proxy( UIjsonInstance, "Obj_PropUpdate" , UIjsonObj , dtHd.propertyName ) );
						                                return el; 
						},
                        detachEv   : function( UIjsonInstance , el ){ 
						
													    el.find("input").off( "change", UIjsonInstance.Obj_PropUpdate    );
						                           
						}														
    	 },
	      thumbnail      : {
			   
			             _HTML     :  '<div class="col-md-2 col-lg-2 col-sm-2  UIjson_el">' 
                                     +   '<div class = "thumbnail">'
                                     +     '<img src = "" alt = "Image not found">'
                                     +   '</div>'
									 +   '<div class = "caption">'
									 +	    '<div class="form-group"><input class="form-control" type="text"></div>'
									 +   '</div>'		
                                     + '</div>',		 	 
						Val_Method : function( _HTML , value ){  
						                              var target = _HTML.find("input"); 
												      if( $.type( value )!=="undefined" ){ 
													  
													              _HTML.find("img").attr("src",value );  
													              target.val(value);  
													  }else{      
													              return target.val();  
													  }
						             },
						attachEv       : function( UIjsonInstance , UIjsonObj , dtHd , el ){ 
						
													  el.find("input").eq(0).on( "change" , $.proxy( UIjsonInstance, "Obj_PropUpdate" , UIjsonObj , dtHd.propertyName ) );
						                              return el; 
						},
                        detachEv     : function( UIjsonInstance , el ){ 
						
													  el.find("input").off( "change", UIjsonInstance.Obj_PropUpdate    );
						                           
						}														 
		   },
	       blockquote     : {
			              _HTML    : '<blockquote class="col-md-6 col-lg-6 col-sm-6 UIjson_el"><label  class="control-label main_label"></label><p></p></blockquote>',
						 _target   : function( _HTML ){ return _HTML.find("p").eq(0);   },							 
						Val_Method : function( _HTML , value ){  
						                              var target = this._target(_HTML ); 
												      if( $.type( value )!=="undefined" ){ 
													              target.html(value);  
													  }else{      
													              return target.html();  
													  }
					   }

		   }		   
	   
   };
	


  
   $.UIjson.Tabs        = {       
	  
	   tab_HTML         : '<li role="presentation"><a data-toggle="tab" href=""></a></li>' ,
	   createTab        : function( TabName ){
		   
		                 var TAB_obj = {};
							 TAB_obj.name    = TabName; 
							 TAB_obj.element = $(this.tab_HTML);                            
							 TAB_obj.element.find("a").attr("href","#"+TabName).html( TabName );
							 return TAB_obj;
	   },
	   deleteTab        : function( TAB_obj ){

							 TAB_obj.element.find('*').off();
							 TAB_obj.element.remove();
							
	   },
	   tabOrder         : function( ArrayOfTabObjects ){ 
		   
		                     var i = 0 , len = ArrayOfTabObjects.length,elem;
						   
		                     for( i = 0; i < len; i++ ){ 
							     elem = ArrayOfTabObjects[i].element;
							     elem.appendTo(elem.parent()); 
						     }
	   },
	   attachEv         : function( TAB_obj , UIjsonInstance ){

							 
							 TAB_obj.element.find("a").on( "click" , { UIjsonInstance:UIjsonInstance , TAB_obj:TAB_obj } , $.UIjson.Actions.clickTab );
		   
	   },
	   detachEv         : function( TAB_obj , UIjsonInstance ){

							 
							 TAB_obj.element.find("a").off( "click" , $.UIjson.Actions.clickTab );
		   
	   } 	    	   
   },
   $.UIjson.Sections    = {     
	   
	   section_HTML     : '<div role="tabpanel"   class="tab-pane tabSection fade in row" style="min-height:300px;"></div>',
	   createSection    : function( SectionName ){
		   
		                 var SECTION_obj = {};
					  	     SECTION_obj.name    =  SectionName;
						     SECTION_obj.element =  $(this.section_HTML);
						     SECTION_obj.element.addClass( SectionName );
						  
		                     return SECTION_obj;
	   },
	   deleteSection    : function( SECTION_obj ){

						     SECTION_obj.element.find('*').off();
						     SECTION_obj.element.remove();
							 
	   }
	   
   };
     

   $.UIjson.helpers = { 
	   
        checkPath      : function ( selectedPath , definedStr ){ 
        
        					   if( definedStr.toString() === selectedPath.toString() ){ return true; }
        					   definedStr  = definedStr.split("/"); 
        					   for(var t = definedStr.length-1; t >= 0; t-- ){    
        					        if( /\d/.test(definedStr[t])   || definedStr[t]===""  ){
        								    definedStr.splice(t, 1);
        							}
        					   }
        					   selectedPath  = selectedPath.split("/");
        					   for(var k = selectedPath.length-1; k >= 0; k-- ){                          
        						    if( /\d/.test(selectedPath[k]) || selectedPath[k]===""){
        									selectedPath.splice(k, 1);
        						    } 
        					   }
        					   
        					   if( definedStr.toString() === selectedPath.toString() ){
        						 return true;  
        					   }
        					   return false;
        
        },
        IsArrayOfStrings	: function ( obj ){
          
        				       if( $.type(obj) !== "array" ) { return false; }
        				       var onlyStrings = true;
        					   $(obj).each(function(m,va){
        						   if( $.type(va)!=="string" ){ onlyStrings = false;}
        					   });
        					   return onlyStrings;
        }				   
	   
	   
   };



   
$.fn.UIjson = function( arg ){
 

	    var is_method	= (typeof arg === 'string'),
			args		= Array.prototype.slice.call(arguments, 1),
			result		= null,
			method      = null;

			
		    this.each(function (){ 
				
				var instance    = $(this).data( "UIjson" ) || false;  
				
		   	        if( is_method && instance  ){  method = instance[arg];  }else {  method = null;}
				
					if( is_method && method   ){ result = method.apply(instance, args);  }else {   result = null;}
					
					if( !instance && !is_method && typeof arg === "object"   ){

								instance  = $.UIjson.create($(this), arg );								
                   	}
					if( (instance && !is_method) || arg === true ) { 

                   				result = instance || false;
                    }
					if(result !== null && result !== undefined) {
                   				return false;
                   	}
				
				
			});
		    return result !== null && result !== undefined ? result : this;
		
		
}				   
                   
				 
   
   
   
   
   
   

   
  
   
   
   
}(jQuery)); 
   

   
	
