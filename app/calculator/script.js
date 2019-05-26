/*! (c) Copyright by Applications for student */
afs.dom.setApp({
		appId: 'calculator',
		appBanner: './data/img/app_calculator.png',
		appSize: 'small'
	}, [
	{
		appLang: 'vi',
		appName: 'Máy tính'
	},
	{
		appLang: 'en',
		appName: 'Calculator'
	}
	], function(){
		var a = $('#afs-body-app-iframe');
		var u = afs.dom.btoa(afsUser);
		var request = 'user='+u+'&lang='+afsCustom.lang;
		var url = 'index.html?'+request;
		a.html('<iframe src="./app/calculator/'+url+'"></iframe>');
	}
);