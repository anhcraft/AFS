function updateNotification(){
	if(internet){
		$(function(){
			$.ajax({url: afsCustom.update, success: function(data){
				data = JSON.parse(data);
				var v1 = afsVersion.replace(/\./,"");
				var v2 = data.version.replace(/\./,"");
				v1 *= 1;
				v2 *= 1;
				if(v1 < v2){
					afs.dom.popup("Application For Student hiện có phiên bản mới !");
					$('#afs-body-board-footer').html('<div id="afs-body-board-footer-updateNotification"><a href="#" target="_blank">Phiên bản mới '+data.version+' !</a></div>');
				}
				if(v2 < v1){
					afs.dom.popup("Phiên bản hiện tại của bạn không được xác định.");
				}
			}}); 
		});
	}
}