/*! (c) Copyright by Applications for student */
"use strict";
var user = '';
var doyouknowLangCode = [];
var doyouknowLang = [];
var doyouknowCustom = '';
var id = '';
var title_ = '';
var description_ = '';
var content_ = '';
var doyouknow = {
    dom: {
        setData: function(n, v) {
            afs.dom.setData('doyouknow-' + user + '-' + n, v);
        },
        getData: function(n) {
            return afs.dom.getData('doyouknow-' + user + '-' + n);
        },
        setLang: function(langs, o) {
            o = JSON.stringify(o);
            doyouknowLangCode.push(langs);
            doyouknowLang.push(o);
        },
        setCustom: function(o) {
            o = JSON.stringify(o);
            doyouknowCustom = JSON.parse(o);
        },
        getLang: function(u) {
            var a = '';
            for (var i = 0; i < doyouknowLang.length; i++) {
                var lang = doyouknowLangCode[i];
                var obj = JSON.parse(doyouknowLang[i]);
                if (lang == doyouknowCustom.lang) {
                    if (typeof obj[u] !== undefined) {
                        return obj[u];
                    }
                }
            }
        },
		setItem: function(id, list){
			$(function(){
				for(var i = 0; i < list.length; i++) {
					$('#afs-doyouknow-list-'+id).append('<div id="afs-doyouknow-list-'+id+'-item"><div id="afs-doyouknow-list-'+id+'-item-title">'+list[i].title+'</div><div id="afs-doyouknow-list-'+id+'-item-body"><img id="afs-doyouknow-list-'+id+'-item-image" src="'+list[i].img+'" /><div id="afs-doyouknow-list-'+id+'-item-short">'+(list[i].content.slice(0,300))+' [...]</div></div><div id="afs-doyouknow-list-'+id+'-item-data" style="display:none">'+list[i].content+'</div></div>');
				}
			});
		},
    },
    run: function() {
        var u = $_GET['user'];
        u = afs.dom.atob(u);
        user = u;
		
        $(function() {
           $('#afs-doyouknow-title').html(doyouknow.dom.getLang('title'));
		   $('#afs-doyouknow-category-universe').html(doyouknow.dom.getLang('universeTitle'));
		   $('#afs-doyouknow-category-animal').html(doyouknow.dom.getLang('animalTitle'));
		   $('#afs-doyouknow-category-plant').html(doyouknow.dom.getLang('plantTitle'));
		   $('#afs-doyouknow-category-earth').html(doyouknow.dom.getLang('earthTitle'));
		   $('#afs-doyouknow-category-technology').html(doyouknow.dom.getLang('technologyTitle'));
		   $('#afs-doyouknow-list > div').hide();
		   $('#afs-doyouknow-list-backToHome').html(doyouknow.dom.getLang('backHome'));
		   $('#afs-doyouknow-list-backToItem').html(doyouknow.dom.getLang('backItem'));
		   $('#afs-doyouknow-list-backToHome').click(function(){
				$('#afs-doyouknow-list > div').hide();
				$('#afs-doyouknow-category').show();
				$(this).parent().children('div').find('img').next().show();
			    $(this).parent().children('div').last().hide();
		   });
		   $('#afs-doyouknow-list-backToItem').click(function(){
			    $('#afs-doyouknow-list-backToItem').hide();
			    $('#afs-doyouknow-list-backToHome').show();
				$('#afs-doyouknow-list > div > div').show();
				$('#afs-doyouknow-list > div > div > div').find('img').next().show();
			    $('#afs-doyouknow-list > div > div > div:nth-of-type(3)').hide();
		   });
		   $('#afs-doyouknow-category > div').click(function(){
			   var id = $(this).attr('id');
			   id = id.replace('afs-doyouknow-category-','');
			   $('#afs-doyouknow-list > div').hide();
			   $('#afs-doyouknow-list-'+id).show();
			   $('#afs-doyouknow-category').hide();
			   $('#afs-doyouknow-list-backToItem').hide();
			   $('#afs-doyouknow-list-backToHome').show();
		   });
		   $('#afs-doyouknow-list > div > div > div:first-child').click(function(){
			   $('#afs-doyouknow-list-backToItem').show();
			   $('#afs-doyouknow-list-backToHome').hide();
			   $(this).parent().parent().children('div').hide();
			   $(this).parent().show();
			   $(this).parent().children('div').find('img').next().hide();
			   $(this).parent().children('div').last().show();
		   });
		});
    }
};