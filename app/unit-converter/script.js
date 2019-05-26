/*! (c) Copyright by Applications for student */
afs.dom.setApp({
		appId: 'unit-converter',
		appBanner: './data/img/app_unit-converter.png',
		appSize: 'small'
	}, [
	{
		appLang: 'vi',
		appName: 'Chuyển đổi đơn vị'
	},
	{
		appLang: 'en',
		appName: 'Unit converter'
	}
	], function(){
		var a = $('#afs-body-app-iframe');
		var u = afs.dom.btoa(afsUser);
		var request = 'user='+u+'&lang='+afsCustom.lang;
		var url = 'index.html?'+request;
		a.html('<iframe src="./app/unit-converter/'+url+'"></iframe>');
	}
);