/*! (c) Copyright by Applications for student */
afs.dom.setApp({
		appId: 'note',
		appBanner: './data/img/app_note.png',
		appSize: 'small'
	}, [
	{
		appLang: 'vi',
		appName: 'Ghi chú'
	},
	{
		appLang: 'en',
		appName: 'Note'
	}
	], function(){
		var a = $('#afs-body-app-iframe');
		var u = afs.dom.btoa(afsUser);
		var request = 'user='+u+'&lang='+afsCustom.lang;
		var url = 'index.html?'+request;
		a.html('<iframe src="./app/note/'+url+'"></iframe>');
	}
);