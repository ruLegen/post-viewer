var err;
function onOkInit(){
	
 	VK.api('wall.get',{owner_id:178345712,count:20},function(data){		
				alert(data.response);

	}); 

}

function onFaildInit(){
	alert("faild");
}

window.onload = function(){
	

	VK.init(function(){ 
     onOkInit();
    }, 
	function() { 
     onFaildInit();
	 },'5.52'); 

		VK.api('video.get',{videos: '-4363_136089719,13245770_137352259'},function(data) { 
  
  alert(data.response);
 
});
}
