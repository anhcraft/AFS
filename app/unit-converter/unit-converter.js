/*! (c) Copyright by Applications for student */
"use strict";

var unit_converterLang = [];
var unit_converterLangCode = [];
var unit_converterCustom = '';
var user = '';

var unit_converter = {
    dom: {
        setData: function(n, v) {
            afs.dom.setData('unit-converter-' + user + '-' + n, v);
        },
        getData: function(n) {
            return afs.dom.getData('unit-converter-' + user + '-' + n);
        },
        setLang: function(langs, o) {
            o = JSON.stringify(o);
            unit_converterLangCode.push(langs);
            unit_converterLang.push(o);
        },
        setCustom: function(o) {
            o = JSON.stringify(o);
            unit_converterCustom = JSON.parse(o);
        }, 
		getLang: function(u) {
            var a = '';
            for (var i = 0; i < unit_converterLang.length; i++) {
                var lang = unit_converterLangCode[i];
                var obj = JSON.parse(unit_converterLang[i]);
                if (lang == unit_converterCustom.lang) {
                    if (typeof obj[u] !== undefined) {
                        return obj[u];
                    }
                }
            }
        },
		setUnit: function(o){
			$(function() {
				var id = o.id;
				var list = o.list;
				var size = o.size;
				var a = list.split(' ');
				var b = '';
				for(var i = 0; i < a.length; i++) {
					b = b + '<option data-size="'+size+'" value="'+a[i]+'">'+a[i]+'</option>';
				}
				
				$('#afs-unit-converter-selectTypeConvert').append('<option value="'+id+'">'+unit_converter.dom.getLang('unit_'+id+'_title')+'</option>');
				$('#afs-unit-converter-dataConvert').append('<div id="afs-unit-converter-'+id+'" data-id="'+id+'"><div id="afs-unit-converter-'+id+'-a"><input id="afs-unit-converter-'+id+'-a-num" type="number"/><select id="afs-unit-converter-'+id+'-a-unit">'+b+'</select></div><div id="afs-unit-converter-'+id+'-b"><select id="afs-unit-converter-'+id+'-b-unit">'+b+'</select></div><div id="afs-unit-converter-'+id+'-result"></div></div>');
				$('#afs-unit-converter-'+id).on('keydown keyup mouseup mousedown',function(){
					var nt = $('#afs-unit-converter-'+id+'-a-num').val();
					var na = $('#afs-unit-converter-'+id+'-a-unit').val();
					var nb = $('#afs-unit-converter-'+id+'-b-unit').val();
					var na_ = $('#afs-unit-converter-'+id+'-a-unit option[value="'+na+'"]').index()*1+1;
					var nb_ = $('#afs-unit-converter-'+id+'-b-unit option[value="'+nb+'"]').index()*1+1;
					var sz = $('#afs-unit-converter-'+id+'-a-unit option[value="'+na+'"]').attr('data-size')*1;
					var r = Math.pow(sz, na_) * nt / Math.pow(sz, nb_);
					$('#afs-unit-converter-'+id+'-result').html(nt + na + ' = ' + r + nb);
				});
			});
		}
    },
    run: function() {
        var u = $_GET['user'];
        u = afs.dom.atob(u);
        user = u;

        $(function() {
            $('#afs-unit-converter-dataConvert > div').hide();
			$('#afs-unit-converter-selectTypeConvert').on('change focus hover mouseup',function(){
				 $('#afs-unit-converter-dataConvert > div').hide();
				$('#afs-unit-converter-'+$(this).val()).show();
			});
        });
    }
};