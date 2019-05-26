/*! (c) Copyright by Applications for student */
afs.dom.setApp({
		appId: 'robo_sweed',
		appBanner: './data/img/app_robo_sweed.png',
		appSize: 'small'
	}, [
	{
		appLang: 'vi',
		appName: 'RoboRun Sweed'
	},
	{
		appLang: 'en',
		appName: 'RoboRun Sweed'
	}
	], function(){
		var a = $('#afs-body-app-iframe');
		var u = afs.dom.btoa(afsUser);
		var request = 'user='+u+'&lang='+afsCustom.lang;
		var url = 'index.html?'+request;
		a.html('<iframe src="./app/roborun-sweed/'+url+'"></iframe>');
	}
);