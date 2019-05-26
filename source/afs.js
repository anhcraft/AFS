/*! (c) Copyright by Applications for student */
var $_GET = {};
 
(function (){
    var a = window.location.href; 
    var b = a.indexOf('?');
    var c = a.slice(b+1);
    var d = c.split('&'); 
 
    var obj = '';
    for(var i = 0; i < d.length; i++){
        var e = d[i];
        var f = e.split('='); 
        var g = f[0]; 
        var h = f[1]; 
        var ii = JSON.stringify($_GET);
        var j = ii.slice(1,ii.length-1); 
        if(i == 0) { 
            obj = '"' + g + '" : "' + h + '"';
        }
        if(i !== 0){ 
            obj += ', "' + g + '" : "' + h + '"';
        }
    }
 
    obj = '{' + obj + '}'; 
    $_GET = JSON.parse(obj);
})();

var internet = "";
var afsLang = [];
var afsLangCode = [];
var afsCustom = '';
var afsApp = [];
var afsUser = '';
var afsVersion = "1.0";

var afs = {
	dom: {
		btoa: function(str) {
			return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
		},
		atob: function(str) {
			return atob(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
		},
		setLang: function(langs,o) {
			o = JSON.stringify(o);
			afsLangCode.push(langs);
			afsLang.push(o);
		},
		setCustom: function(o) {
			o = JSON.stringify(o);
			afsCustom = JSON.parse(o);
		},
		getLang: function(u) {
			var a = '';
			for(var i = 0; i < afsLang.length; i++){
				var lang = afsLangCode[i];
				var obj = JSON.parse(afsLang[i]);
				if(lang == afsCustom.lang){
					if(typeof obj[u] !== undefined) {
						return obj[u];
					}
				}
			}
		},
		setData: function(n,v){
			if (typeof(Storage) !== "undefined") {
				localStorage.setItem(n, v);
			}
		},
		getData: function(n){
			if (typeof(Storage) !== "undefined") {
				return localStorage.getItem(n);
			}
		},
		popup: function(str){
			$(function(){
				$('#afs-modal-fix').fadeIn();
				$('#afs-modal').fadeIn();
				$('#afs-modal-title').html(afs.dom.getLang('modalTitle'));
				$('#afs-modal-content').html(str);
				$('#afs-modal-close, #afs-modal-fix').click(function(){
					afs.dom.closePopup();
				});
			});
		},
		closePopup: function(){
			$(function(){
				$('#afs-modal-fix').fadeOut();
				$('#afs-modal').fadeOut();
			});
		},
		setApp: function(info,lang,func){
			var i_id = info.appId;
			var i_banner = info.appBanner;
			var i_size = info.appSize;
			
			for(var i = 0; i < lang.length; i++){
				var l_appLang = lang[i].appLang;
				var l_appName = lang[i].appName;
				
				if(i_size == 'small'){
					i_size = 'width:128px;height:128px;';
				}
				if(i_size == 'medium'){
					i_size = 'width:256px;height:256px;';
				}
				if(i_size == 'large'){
					i_size = 'width:384px;height:384px;';
				}
				
				afsApp.push({
					appId: i_id,
					appLang: l_appLang,
					appName: l_appName
				});
			}
			
			afs.dom.getLangForApp(info,func,i_size);
		},
		getLangForApp: function(info,func,i_size){
			for(var i =  0; i < afsApp.length; i++) {
				var a = afsApp[i];
				if(a.appId == info.appId){
					if(a.appLang == afsCustom.lang){
						afs.dom.appendApp(info, {
							appLang: a.appLang,
							appName: a.appName
						}, func, i_size);
					}
				}
			}
		},
		appendApp: function(info,lang,func,i_size){
			$(function(){
				$('#afs-body-board-app').append('<div style="'+i_size+'" class="afs-board-subapp" id="'+info.appId+'"> <div class="afs-board-subapp-tab" style="background-image:url('+info.appBanner+');"> <div class="afs-board-subapp-name">'+lang.appName+'</div></div></div>');
				$('#'+info.appId).click(function(){
					$('#afs-body > div').hide();
					$('#afs-body-app').show();
					$('#afs-body-app-close').show();
					eval('$('+func+');');
				});
			});
		},
		getLangCode: function(){
			var a = afs.dom.getData('afs-langcode');
			if(a == null || a === undefined){
				return 'vi';
			}
			if(a !== null || a !== undefined){
				return a;
			}
		},
		getBgUrl: function(){
			var a = afs.dom.getData('afs-bgurl');
			if(a == null || a === undefined){
				return './data/img/bg.jpg';
			}
			if(a !== null || a !== undefined){
				return a;
			}
		},
		getUrlAvatar: function(){
			var data = afs.dom.getData('afs-'+afsUser+'-avatar');
			var url = '';
			if(data == null){
				url = "./data/img/user.png";
			}
			if(data !== null){
				url = data;
			}
			return 'url('+url+')';
		}
	},
	data: {
		beforeLoad: function() {
			$(function(){
				$('#afs-body').css('background-image','url(' + afsCustom.background + ')');
				$('#afs-loading').css('margin-top', (($('#afs-body').height() / 2) - ($('#floatingCirclesG').outerHeight() / 2)) + 'px');
				$('#afs-body > div').hide();
				$('#afs-body-loading').show();
				$('html').attr('lang',afsCustom.lang);
				document.title = afs.dom.getLang('title');
				$('meta[name="description"]').attr('content',afs.dom.getLang('description'));
				
				setTimeout(function(){
					afs.data.afterLoad();
				}, afsCustom.timeLoading);
			});
		},
		afterLoad: function(){
			$(function(){
				$('#afs-body-loading').slideUp(800);
				afs.data.loginForm();
			});
		},
		loginForm: function(){
			$(function(){
				$('#afs-body-register').slideUp(800);
				$('#afs-body-login').slideDown(1000);
				$('#afs-form-login-title').html(afs.dom.getLang('loginTitle'));
				$('#afs-form-login-inputUser').attr('placeholder', afs.dom.getLang('loginInputUser'));
				$('#afs-form-login-inputPass').attr('placeholder', afs.dom.getLang('loginInputPass'));
				$('#afs-form-login-toRegister').html(afs.dom.getLang('loginToRegister'));
				$('#afs-rememberAccount span').html(afs.dom.getLang('loginRemember'));
				$('#afs-form-login-submit').html(afs.dom.getLang('loginSubmit'));
				
				var accountRemember = afs.dom.getData('afs-accountRemember');
				if(accountRemember == "true"){
					$('#afs-rememberAccount input').prop("checked", true);
				}
				
				var userInLastLogin = afs.dom.getData('afs-userInLastLogin');
				if(userInLastLogin !== null){
					$('#afs-form-login-inputUser').val(userInLastLogin);
				}
				
				var passInLastLogin = afs.dom.getData('afs-passInLastLogin');
				if(passInLastLogin !== null){
					$('#afs-form-login-inputPass').val(passInLastLogin);
				}
				
				$('#afs-form-login-toRegister').click(function(){
					afs.data.registerForm();
				});
				$('#afs-form-login-submit').click(function(){
					afs.data.checkLoginForm();
				});
				$('#afs-form-login-inputUser, #afs-form-login-inputPass').keydown(function(e){
					if(e.keyCode == 13) {				
						afs.data.checkLoginForm();
					}
				});
			});
		},
		registerForm: function(){
			$(function(){
				$('#afs-body-login').slideUp(800);
				$('#afs-body-register').slideDown(1000);
				$('#afs-form-register-title').html(afs.dom.getLang('registerTitle'));
				$('#afs-form-register-inputUser').attr('placeholder', afs.dom.getLang('registerInputUser'));
				$('#afs-form-register-inputPass').attr('placeholder', afs.dom.getLang('registerInputPass'));
				$('#afs-form-register-inputRePass').attr('placeholder', afs.dom.getLang('registerInputRePass'));
				$('#afs-form-register-inputName').attr('placeholder', afs.dom.getLang('registerInputName'));
				$('#afs-form-register-btnCreatePassword').html(afs.dom.getLang('registerButtonCreatePassword'));
				$('#afs-form-register-btnTogglePassword').html(afs.dom.getLang('registerButtonTogglePassword'));
				$('#afs-form-register-toLogin').html(afs.dom.getLang('registerToLogin'));
				$('#afs-form-register-submit').html(afs.dom.getLang('registerSubmit'));
				$('#afs-form-register-toLogin').click(function(){
					afs.data.loginForm();
				});
				
				$('#afs-form-register-submit').click(function(){
					afs.data.checkRegisterForm();
				});
				
				$('#afs-form-register-btnTogglePassword').click(function(){
				    if ($('#afs-form-register-inputPass').attr('type')) {
						$('#afs-form-register-inputPass').removeAttr('type');
						$('#afs-form-register-inputRePass').removeAttr('type');
					} else {
						$('#afs-form-register-inputPass').attr('type', 'password');
						$('#afs-form-register-inputRePass').attr('type', 'password');
					}
				});
				
				$('#afs-form-register-btnCreatePassword').click(function(){
					afs.dom.popup('<iframe style="width:100%;height:500px" src="./plugin/password-generator/'+afsCustom.lang+'.html"></iframe>');
				});
				
				$('#afs-form-register-inputUser, #afs-form-register-inputPass, #afs-form-register-inputName').keydown(function(e){
					if(e.keyCode == 13) {				
						afs.data.checkRegisterForm();
					}
				});
			});
		},
		checkLoginForm: function(){
			$(function(){
				var user = $('#afs-form-login-inputUser').val();
				var pass = $('#afs-form-login-inputPass').val();
				afsUser = user;
				var passLocal = afs.dom.getData('afs-'+user+'-account');
				if(passLocal == null){
					afs.dom.popup(afs.dom.getLang('loginAccountNotExist'));
				}
				if(passLocal !== pass && passLocal !== null){
					afs.dom.popup(afs.dom.getLang('loginWrongPassword'));
				}
				if(passLocal == pass){
					if($('#afs-rememberAccount input').prop("checked") == true){
						afs.dom.setData('afs-accountRemember',"true")
						afs.dom.setData('afs-userInLastLogin',user);
						afs.dom.setData('afs-passInLastLogin',pass);
					}
					if($('#afs-rememberAccount input').prop("checked") == false){
						afs.dom.setData('afs-accountRemember',"false")
						afs.dom.setData('afs-userInLastLogin',"");
						afs.dom.setData('afs-passInLastLogin',"");
					}
					afs.data.loginSuccess();
				}
			});
		},
		checkRegisterForm: function(){
			$(function(){
				var user = $('#afs-form-register-inputUser').val();
				var pass = $('#afs-form-register-inputPass').val();
				var repass = $('#afs-form-register-inputRePass').val();
				var name = $('#afs-form-register-inputName').val();
				var passLocal = afs.dom.getData('afs-'+user+'-account');
				if(user.length < 4){
					afs.dom.popup(afs.dom.getLang('registerUserTooShort'));
				}
				if(pass.length < 8){
					afs.dom.popup(afs.dom.getLang('registerPassTooShort'));
				}
				if(16 < user.length) {
					afs.dom.popup(afs.dom.getLang('registerUserTooLong'));
				}
				if(32 < pass.length){
					afs.dom.popup(afs.dom.getLang('registerPassTooLong'));
				}
				if (4 <= user.length && user.length <= 16 && 8 <= pass.length && pass.length <= 32){
					if(repass !== pass){
						afs.dom.popup(afs.dom.getLang('registerRePassIncorrect'));
					}
					if(repass == pass){
						if(passLocal != null){
							afs.dom.popup(afs.dom.getLang('registerAccountAlreadyExists'));
						} else {
							afs.dom.setData('afs-'+user+'-account',pass);
							afs.dom.setData('afs-'+user+'-name',name);
							afs.dom.setData('afs-'+user+'-appSetting','');
							afs.dom.setData('afs-'+user+'-avatar','./data/img/user.png');
							afs.dom.popup(afs.dom.getLang('registerCreateSuccess'));
							afs.data.loginForm();
						}
					}
				}
			});
		},
		loginSuccess: function(){
			$(function(){
				$('#afs-body-login').slideUp(800);
				$('#afs-body-register').slideUp(800);
				afs.dom.popup(afs.dom.getLang('loginSuccess'));
				afs.data.checkInternet();
			});
		},
		checkInternet: function(){
			$(function(){
				if(navigator.onLine == true) {
					internet = true;
				}
				if(navigator.onLine == false) {
					internet = false;
				}
				
				$('#afs-body-loading').show(500);
				
				setTimeout(function(){
					afs.data.mainBoard();
				}, afsCustom.timeLoading);
			});
		},
		mainBoard: function(){
			$(function(){
				var checkUpdate = new updateNotification();
				
				$('#afs-body-loading').fadeOut(800);
				$('#afs-body-board').fadeIn(afsCustom.timeShowBoard);
				$('#afs-body-board-menu-profile-name').html(afs.dom.getData('afs-'+afsUser+'-name'));
				$('#afs-body-board-menu-profile-avatar').css('background-image',afs.dom.getUrlAvatar);
				
				$('#afs-body-board-menu-setting').click(function(){
					afs.data.setting();
				});
				$('#afs-body-board-menu-logout').click(function(){
					location.reload();
				});
				
				$('#afs-body-app-close span').click(function(){
					$('#afs-body > div').hide();
					$('#afs-body-board').fadeIn(afsCustom.timeShowBoard-2500);
					$('#afs-body-app-iframe').html('');
					$(this).parent().hide();
				});
			});
		},
		setting: function(){
			$(function(){
				$('#afs-body-board').fadeOut();
				$('#afs-body-setting').fadeIn(500);
		
				$('#afs-body-setting-menu-account').html(afs.dom.getLang('settingMenuAccount'));
				$('#afs-body-setting-menu-data').html(afs.dom.getLang('settingMenuData'));
				$('#afs-body-setting-menu-personalized').html(afs.dom.getLang('settingMenuPersonalized'));
				$('#afs-body-setting-menu-language').html(afs.dom.getLang('settingMenuLanguage'));
				$('#afs-body-setting-changeName .afs-body-setting-title').html(afs.dom.getLang('settingChangeName'));
				$('#afs-body-setting-changePass .afs-body-setting-title').html(afs.dom.getLang('settingChangePass'));
				$('#afs-body-setting-changeAvatar .afs-body-setting-title').html(afs.dom.getLang('settingChangeAvatar'));
				$('#afs-body-setting-removeAppData').html(afs.dom.getLang('settingRemoveAppData'));
				$('#afs-body-setting-removeMyData').html(afs.dom.getLang('settingRemoveMyData'));
				$('#afs-body-setting-removeAllData').html(afs.dom.getLang('settingRemoveAllData'));
				$('#afs-body-setting-removeAccount').html(afs.dom.getLang('settingRemoveAccount'));
				$('#afs-body-setting-changeBackground .afs-body-setting-title').html(afs.dom.getLang('settingChangeBackground'));
				$('#afs-body-setting-content-language .afs-body-setting-title').html(afs.dom.getLang('settingChangeLanguage'));
				$("#afs-body-setting-content-language-submit").html(afs.dom.getLang('settingLanguageSubmit'));
				$('#afs-body-setting-content input').val('');
				$('#afs-body-setting-content-language select').html("");
				for(var i = 0; i < afsLang.length; i++){
					$('#afs-body-setting-content-language select').append("<option value='"+afsLangCode[i]+"'>"+JSON.parse(afsLang[i]).langName+"</option>");
				}	
				
				$('#afs-body-setting-content > div').hide();
				$('#afs-body-setting-content > div').first().show();
				$('#afs-body-setting-menu-account').click(function(){
					$('#afs-body-setting-content > div').hide();
					$('#afs-body-setting-content-account').show();
					return false;
				});
				$('#afs-body-setting-menu-data').click(function(){
					$('#afs-body-setting-content > div').hide();
					$('#afs-body-setting-content-data').show();
					return false;
				});
				$('#afs-body-setting-menu-personalized').click(function(){
					$('#afs-body-setting-content > div').hide();
					$('#afs-body-setting-content-personalized').show();
					return false;
				});
				$('#afs-body-setting-menu-language').click(function(){
					$('#afs-body-setting-content > div').hide();
					$('#afs-body-setting-content-language').show();
					return false;
				});
				
				$('#afs-body-setting-changeName-input').on('keyup',function(e){
					if(e.keyCode == 13) {
						afs.dom.setData('afs-'+afsUser+'-name',$(this).val());
						afs.dom.popup(afs.dom.getLang('settingNotice'));
					}
				});
				$('#afs-body-setting-changePass-input').on('keyup',function(e){
					if(e.keyCode == 13) {
						afs.dom.setData('afs-'+afsUser+'-account',$(this).val());
						afs.dom.popup(afs.dom.getLang('settingNotice'));
					}
				});
				$("#afs-body-setting-changeAvatar-input").change(function(){
					var input = this;
					if (input.files && input.files[0]) {
						var reader = new FileReader();
						
						reader.onload = function (e) {
							afs.dom.setData('afs-'+afsUser+'-avatar',e.target.result);
							afs.dom.popup(afs.dom.getLang('settingNotice'));
						}
						
						reader.readAsDataURL(input.files[0]);
					}
				});
				$("#afs-body-setting-changeBackground-input").change(function(){
					var input = this;
					if (input.files && input.files[0]) {
						var reader = new FileReader();
						
						reader.onload = function (e) {
							afs.dom.setData('afs-bgurl',e.target.result);
							afs.dom.popup(afs.dom.getLang('settingNotice'));
						}
						
						reader.readAsDataURL(input.files[0]);
					}
				});
				$('#afs-body-setting-removeAccount').click(function(){
					for(var w = 0; w < afsApp.length; w++){
						var name = afsApp[w].appId;
						for(var i = 0; i < localStorage.length; i++) {
							var key = localStorage.key(i);
							if(-1 < key.indexOf(name) && -1 < key.indexOf(afsUser)){
								localStorage.removeItem(key);
							}
						}
					}	
					
					if(afs.dom.getData('afs-userInLastLogin') == afsUser){
						localStorage.removeItem('afs-userInLastLogin');
						localStorage.removeItem('afs-passInLastLogin');
					}
					localStorage.removeItem('afs-'+afsUser+'-account');
					localStorage.removeItem('afs-'+afsUser+'-avatar');
					location.reload();
				});
				$('#afs-body-setting-removeAppData').click(function(){
					for(var a = 0; a < afsApp.length; a++){
						var name = afsApp[a].appId;
						for(var i = 0; i < localStorage.length; i++) {
							var key = localStorage.key(i);
							if(-1 < key.indexOf(name) && -1 < key.indexOf(afsUser)){
								localStorage.removeItem(key);
							}
						}
					}
					afs.dom.popup(afs.dom.getLang('settingNotice'));
					location.reload();
				});
				$('#afs-body-setting-removeMyData').click(function(){
					for(var w = 0; w < afsApp.length; w++){
						var name = afsApp[w].appId;
						for(var i = 0; i < localStorage.length; i++) {
							var key = localStorage.key(i);
							if(-1 < key.indexOf(name) && -1 < key.indexOf(afsUser)){
								localStorage.removeItem(key);
							}
						}
					}
					
					localStorage.removeItem('afs-bgurl');
					localStorage.removeItem('afs-langcode');
					localStorage.removeItem('afs-accountRemember');
					localStorage.removeItem('afs-userInLastLogin');
					localStorage.removeItem('afs-passInLastLogin');					
					localStorage.removeItem('afs-'+afsUser+'-avatar');
					afs.dom.popup(afs.dom.getLang('settingNotice'));
					location.reload();
				});
				$('#afs-body-setting-removeAllData').click(function(){
					for(var w = 0; w < afsApp.length; w++){
						var name = afsApp[w].appId;
						for(var i = 0; i < localStorage.length; i++) {
							var key = localStorage.key(i);
							if(-1 < key.indexOf(name)){
								localStorage.removeItem(key);
							}
						}
					}
					
					var afsDataKeywords = ["account","avatar"];
					for(var w = 0; w < afsDataKeywords.length; w++){
						var name = afsDataKeywords[w];
						for(var i = 0; i < localStorage.length; i++) {
							var key = localStorage.key(i);
							if(-1 < key.indexOf(name) && -1 < key.indexOf("afs")){
								localStorage.removeItem(key);
							}
						}
					}
					
					localStorage.removeItem('afs-bgurl');
					localStorage.removeItem('afs-langcode');
					localStorage.removeItem('afs-accountRemember');
					localStorage.removeItem('afs-userInLastLogin');
					localStorage.removeItem('afs-passInLastLogin');
					afs.dom.popup(afs.dom.getLang('settingNotice'));
					location.reload();
				});
				$("#afs-body-setting-content-language-submit").click(function(){
					afs.dom.setData('afs-langcode',$('#afs-body-setting-content-language select').val());
					afs.dom.popup(afs.dom.getLang('settingNotice'));
					location.reload();
				});
				$('#afs-body-setting-exit').click(function(){
					$('#afs-body-setting').fadeOut(500);
					afs.data.mainBoard();
				});
			});
		}
	},
	run: function() {
		/** CODE TO REMOVE ALL CHANGES **/
		// localStorage.clear();
		/** PLEASE USE IF YOU WANT TO RETURN TO THE ORIGINAL SOFTWARE **/
		afs.data.beforeLoad();
	},
};