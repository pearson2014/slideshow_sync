var zoom='';
var audio='';
var loop=0;
var loopsound="";
var endSound= '';
var endReplay= true;
var thumbnail = '';
var thumbnailCollapse = true;

var dataTime='';

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});

var pause_audio=""; // variabile per clearTimeout 


$(document).ready(function(){
	var json=$.getUrlVar('json');
	var impostazioniData, slideData;
	$.when(
		
	    $.getJSON('script/'+json+'_param.json', function(data) {
	        impostazioniData = data.parametri;
			slideData = data.elementi;
	    })
	).then(function() {
		if (slideData) {
	        var i=0;
		    $.each( slideData, function(i, element) {
		      if (i+1 < slideData.length) {
		        var nextElement = slideData[i+1];
		        var time = ((parseFloat(nextElement.sound) - parseFloat(element.sound)) * 1000);
		      }else {
		        var time = 67000;
		      }
		      
		      /*FIX TIME, COUNTING TRANSITION TIME*/
		      if (i!=0) {
		        time = time - 3000;
		      }
		      
		      var description = '';
			  if (element.title == null) {
					element.title="";
			  }
			   if (element.description == null) {
					element.description=""
			  }
		      if ((element.title != '') || (element.description != '')) {
		        var description = '<div class="camera_caption fadeFromBottom"><strong>'+element.title+'</strong><br>'+element.description+'<br><br></div>';
		      }
		      $('.camera_wrap').append('<div data-thumb="'+element.thumb+'" data-src="'+element.image+'"  data-sound="'+element.sound+'" data-time="'+time+'">'+ description + '</div>');
		      i++;
		    });
	    }
	    else {
	        alert('no slide');
	    }
	    
	    if (impostazioniData) {
	       $.each(impostazioniData, function(index, impostazioniData) {
	       		var autoplay= impostazioniData.autoplay;
		        var codProgetto= impostazioniData.codice_progetto;
		        var coloreSfondo= impostazioniData.colore_sfondo;
		        var dida= impostazioniData.dida;
		        var tag= impostazioniData.tag;
		        thumbnail= impostazioniData.thumbnail;
			    if (thumbnail == "Hide") {
					thumbnail=false;
				} else {
					thumbnail=true;
				}
				//var thumbnail=true;
				var tipoProgetto = impostazioniData.tipo_progetto;
		        var titoloProgetto= impostazioniData.titolo_progetto;
		        var tracciaAudio= impostazioniData.traccia_audio;
		        var windowTitle= impostazioniData.window_title;
		        var transition= impostazioniData.transition;
		        zoom= impostazioniData.zoom;
		        var dida= impostazioniData.visible_dida;
		        audio=tracciaAudio;
		        var endSound= true;
				
				if (autoplay == "No") {
					autoplay=false;
				} else {
					autoplay=true;
				}
				
		        if(dida != 'No'){
			        dida= true;
		        }else{
			        dida= false;
		        }
		        
		         var fx = transition;
				  if (fx == "flowChart") {
				    fx = "simpleFade";
				  }
				if (tipoProgetto == "No-Sync-Slide-Show") {
					loopsound=true;
				  }
		        window.changeSound = false;
				
				jQuery('#camera_wrap_4').camera({
					height: 'auto',
					loader: 'bar',
					pagination: false,
					thumbnails: thumbnail,
					navigationHover: false,
					mobileNavHover: false,
					opacityOnGrid: false,
					fx: transition,
					imagePath: '../images/',
					info: dida,
					autoAdvance: autoplay,
					onStartTransition: function() { 
							if (tipoProgetto != "No-Sync-Slide-Show") {
						
								clearTimeout(pause_audio);
								currentSecond = parseFloat($('li.cameracurrent').attr('data-sound')); 
								if (isNaN(currentSecond)) {currentSecond = 0;}
								if ($('.camera_play').css('display') == 'none' || ($('#jquery_jplayer_1').data().jPlayer.status.paused == false)){
									var gap= (parseFloat($('li.cameracurrent').next().attr('data-sound')) - parseFloat($('li.cameracurrent').attr('data-sound'))) * 1000;
									gap=parseInt(gap);
									if (!isNaN(gap)) {
										
										pause_audio=setTimeout(function(){pausesound(currentSecond);}, gap);
										
									}else{
										//pause_audio=setTimeout(function(){pausesound(currentSecond);}, dataTime);
										//alert(dataTime)
									}
									
									playsound(currentSecond);
								}else {
									console.log('pause sound')
									pausesound(currentSecond);
								}
						 
					
					  } 
					}, onEndTransition: function () {
						if (tipoProgetto == "No-Sync-Slide-Show") {
								console.log(loop)
								if (loop == 0) {
								
								currentSecond = parseFloat($('li.cameracurrent').attr('data-sound')); 
								if (isNaN(currentSecond)) {currentSecond = 0;}
								console.log(currentSecond)
								if ($('.camera_play').css('display') == 'none' || ($('#jquery_jplayer_1').data().jPlayer.status.paused == false)){
									
									
									setTimeout(function(){playsound(currentSecond);},500)
									
								}else {
									
									pausesound(currentSecond);
								}
								loop=1;
							}
						}
					}
				});
				
				$("#jquery_jplayer_1").jPlayer({
			      ready: function () {
						if (tracciaAudio) {
			          $(this).jPlayer("setMedia", {
			              mp3: tracciaAudio + ".mp3",
			              oga: tracciaAudio + ".ogg"
			          });
					  }
			      },
			      swfPath: "/scripts",
			      supplied: "mp3,oga",
			      solution:"html,flash",
			      wmode:"window",
			      volumeBar: ".jp-volume-bar",

			      ended : function(){
		            console.log("ended");
					if (loopsound == true) {console.log('loopsound'); playsound();$("#jquery_jplayer_1").jPlayer('play')}
		           // $(this).jPlayer("playHead",100);
		           // $('.camera_wrap .camera_src').addClass('paused');
		            }

			  });
			  
			  if(endSound == true){
				  if (loopsound == true) {
					playsound();
				  }
				  else {
				  $("#jquery_jplayer_1").on($.jPlayer.event.ended, function() {
				    $('.camera_wrap .camera_src').addClass('paused');
				    if(endReplay == true) {
					  var wrapImg= '<div class="wrap-img"><div class="wrap-play"><img src="images/event-play.png" /></div></div>';
					  $('body').append(wrapImg);
					  var $img = $('body .wrap-img .wrap-play img');
					  var h = $img.height();
					  $img.css('margin-top', + h / -2 + "px");
					  
					  $('body').on('click', '.wrap-img .wrap-play img', function(event){
						  $('.camera_thumbs_cont ul li:first img').trigger('click');
						  $('.wrap-img').remove();
					  });
					}	
				  });
				  
				  $("#jquery_jplayer_1").on($.jPlayer.event.playing, function() {
				  	$('.camera_wrap .camera_src').removeClass('paused');
				  });
				  
				  
				  }
			  }
			  
			  $('.camera_thumbs_cont').css("background", coloreSfondo);
			  $('body').css("background", coloreSfondo);
			  document.title = titoloProgetto;
			  
			  if (thumbnail == false) {
			    $('#camera_wrap_4').css('marginBottom', '0px');
			  }
				
	       });
	       
	       var currentSecond = 0;
		  
		    window.playsound = playsound;
		    window.pausesound = pausesound;
		    window.volumecontrol = volumecontrol;		
		    //var second = $('li.cameracurrent').attr('data-sound');
			if (!audio) {
				$('.main_bar').hide();
			}	
	    }
	    else {
	        alert('no impo');
	    }
	});
      
    $('.main_bar').on('click', '.camera_play', function(){		
		
       var gap= (parseFloat($('li.cameracurrent').next().attr('data-sound')) - parseFloat($('#jquery_jplayer_1').data().jPlayer.status.currentTime)) * 1000;	
        playsound($('#jquery_jplayer_1').data().jPlayer.status.currentTime);	
        $("#jquery_jplayer_1").jPlayer("play");
		if (loopsound == false) {
		pause_audio=setTimeout(function(){ console.log('pause sound 7');pausesound();}, gap);
		}
    });

   $('.main_bar').on('click', '.camera_stop', function(){			
		clearTimeout(pause_audio)
	    pausesound();			
    });
	
});

$( window ).resize(function() {
	if($('body .wrap-img').length > 0) {
		var wH= $(window).height()-20;
		$('.wrap-img .cont-img').height(wH);
		$(".panzoom").panzoom("resetDimensions");
		$(".panzoom").panzoom("resetPan");
	}
});

function playsound (t){
  currentSecond = parseFloat(t);
 
  $("#jquery_jplayer_1").jPlayer("stop");

  if (t==0) {
   console.log(currentSecond + " t = 0")
    $("#jquery_jplayer_1").jPlayer("play");
	
	}
  else { 
    $("#jquery_jplayer_1").jPlayer("play", currentSecond);
    }
    //console.log(currentSecond);
	
}
    
function pausesound (t){
  if (t != undefined) {
    currentSecond = t;
  }else {
    currentSecond = $("#jquery_jplayer_1").data("jPlayer").status.currentTime;
  }
  
  $("#jquery_jplayer_1").jPlayer("pause");			
}
    
function volumecontrol(v){
  $("#jquery_jplayer_1").jPlayer("volume",v);	
}