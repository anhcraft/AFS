/*! (c) Copyright by Applications for student */
afs.dom.setApp({
		appId: 'school-timetable',
		appBanner: './data/img/app_school-timetable.png',
		appSize: 'small'
	}, [
	{
		appLang: 'vi',
		appName: 'Thời khóa biểu'
	},
	{
		appLang: 'en',
		appName: 'School Timetable'
	}
	], function(){
		var a = $('#afs-body-app-iframe');
		var u = afs.dom.btoa(afsUser);
		var request = 'user='+u+'&lang='+afsCustom.lang;
		var url = 'index.html?'+request;
		a.html('<iframe src="./app/school-timetable/'+url+'"></iframe>');
	}
);