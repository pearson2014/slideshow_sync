jQuery(function(){
  
  var fx = objectSettings.TRANSITION;
  if (fx == "flowChart") {
    fx = "simpleFade";
  }
  
  window.changeSound = false;
  jQuery('#camera_wrap_4').camera({
    height: 'auto',
    loader: 'bar',
    pagination: false,
    thumbnails: objectSettings.THUMBNAILS,
    navigationHover: false,
	mobileNavHover: false,
    opacityOnGrid: false,
    fx: fx,
    imagePath: '../images/',
    onEndTransition: function() { 
      if (changeSound == true) {
        window.changeSound = false;
        currentSecond = parseFloat($('li.cameracurrent').attr('data-sound')); 
        if (isNaN(currentSecond)) 
          currentSecond = 0;
        if ($('.camera_play').css('display') == 'none' || ($('#jquery_jplayer_1').data().jPlayer.status.paused == false)){
          if (currentSecond <=2) {
            setTimeout(function(){playsound(currentSecond);}, 250);
          }else {
            playsound(currentSecond);
          }
        }else {
            pausesound(currentSecond);
        }
      }
    }
  });

  $("#jquery_jplayer_1").jPlayer({
      ready: function () {
          $(this).jPlayer("setMedia", {
              mp3: objectSettings.GLOBAL_SOUND + ".mp3",
              oga: objectSettings.GLOBAL_SOUND + ".ogg"
          });
      },
      swfPath: "/scripts",
      supplied: "mp3,oga",
      solution:"html,flash",
      wmode:"window",
      volumeBar: ".jp-volume-bar",
	  preload: "auto"
  });
    
  $('.camera_thumbs_cont').css("background", objectSettings.BACKGROUND_COLOR);
  $('body').css("background", objectSettings.BACKGROUND_COLOR);
  document.title = objectSettings.TITOLO_SLIDESHOW;
  
  if (objectSettings.THUMBNAILS == false) {
    $('#camera_wrap_4').css('marginBottom', '0px');
  }
});

$(function(){
  $(document).ready(function() {
    function volumecontrol(v){
      $("#jquery_jplayer_1").jPlayer("volume",v);	
    }
    
    var currentSecond = 0;
    function playsound (t){
      
      currentSecond = parseFloat(t);
      $("#jquery_jplayer_1").jPlayer("stop");

      if (t==0)
        $("#jquery_jplayer_1").jPlayer("play");
      else 
        $("#jquery_jplayer_1").jPlayer("play", currentSecond);
    }
    
    function pausesound (t){
      if (t != undefined) {
        currentSecond = t;
      }else {
        currentSecond = $("#jquery_jplayer_1").data("jPlayer").status.currentTime;
      }
      
      $("#jquery_jplayer_1").jPlayer("pause");			
    }    
  
    window.playsound = playsound;
    window.pausesound = pausesound;
    window.volumecontrol = volumecontrol;		
    //var second = $('li.cameracurrent').attr('data-sound');
        
    $('.camera_commands').on('click', '.camera_play', function(){					
        playsound(currentSecond);	
        $("#jquery_jplayer_1").jPlayer("play");
    });

   $('.camera_commands').on('click', '.camera_stop', function(){			
        pausesound();			
    });
    
    var i=0;
    $.each( objectDataSource, function(i, element) {
      if (i+1 < objectDataSource.length) {
        var nextElement = objectDataSource[i+1];
        var time = ((parseFloat(nextElement.sound) - parseFloat(element.sound)) * 1000);
      }else {
        var time = 67000;
      }
      
      /*FIX TIME, COUNTING TRANSITION TIME*/
      if (i!=0) {
        time = time - 3000;
      }
      
      var description = '';
      if ((element.title != '') || (element.description != '')) {
        var description = '<div class="camera_caption fadeFromBottom"><strong>'+element.title+'</strong><br>'+element.description+'<br><br></div>';
      }
      $('.camera_wrap').append('<div data-thumb="'+element.thumb+'" data-src="'+element.image+'"  data-sound="'+element.sound+'" data-time="'+time+'">'+ description + '</div>');
      i++;
    });
  });
});