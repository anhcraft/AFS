/*! (c) Copyright by Applications for student */
afs.dom.setApp({
		appId: 'doyouknow',
		appBanner: './data/img/app_doyouknow.png',
		appSize: 'small'
	}, [
	{
		appLang: 'vi',
		appName: 'Bạn có biết ?'
	},
	{
		appLang: 'en',
		appName: 'Do you know ?'
	}
	], function(){
		var a = $('#afs-body-app-iframe');
		var u = afs.dom.btoa(afsUser);
		var request = 'user='+u+'&lang='+afsCustom.lang;
		var url = 'index.html?'+request;
		a.html('<iframe src="./app/doyouknow/'+url+'"></iframe>');
	}
);