/*! (c) Copyright by Applications for student */
"use strict";
var user = '';
var calculatorLangCode = [];
var calculatorLang = [];
var calculatorCustom = '';
var id = '';
var title_ = '';
var description_ = '';
var content_ = '';
var calculator = {
    dom: {
        setData: function(n, v) {
            afs.dom.setData('calculator-' + user + '-' + n, v);
        },
        getData: function(n) {
            return afs.dom.getData('calculator-' + user + '-' + n);
        },
        setLang: function(langs, o) {
            o = JSON.stringify(o);
            calculatorLangCode.push(langs);
            calculatorLang.push(o);
        },
        setCustom: function(o) {
            o = JSON.stringify(o);
            calculatorCustom = JSON.parse(o);
        },
        getLang: function(u) {
            var a = '';
            for (var i = 0; i < calculatorLang.length; i++) {
                var lang = calculatorLangCode[i];
                var obj = JSON.parse(calculatorLang[i]);
                if (lang == calculatorCustom.lang) {
                    if (typeof obj[u] !== undefined) {
                        return obj[u];
                    }
                }
            }
        }
    },
    run: function() {
        var u = $_GET['user'];
        u = afs.dom.atob(u);
        user = u;
		
		if(calculator.dom.getData('M') == null || typeof calculator.dom.getData('M') == undefined) {
			calculator.dom.setData('M','');
		}
				
        $(function() {
           var txt = $('#afs-calculator-text');
		   $('#afs-calculator-ac').click(function(){
			   txt.val('');
		   });
		   $('#afs-calculator-del').click(function(){
			   txt.val(txt.val().slice(0,-1));
		   });
		   $('#afs-calculator-setData').click(function(){
				txt.val(txt.val()+calculator.dom.getData('M'));
		   });
		   $('#afs-calculator-reData').click(function(){
				calculator.dom.setData('M',txt.val());
		   });
		   $('#afs-calculator-plus').click(function(){
			   txt.val(txt.val()+'+');
		   });
		   $('#afs-calculator-opts').click(function(){
			   txt.val(txt.val()+'(');
		   });
		   $('#afs-calculator-seven').click(function(){
			   txt.val(txt.val()+'7');
		   });
		   $('#afs-calculator-eight').click(function(){
			   txt.val(txt.val()+'8');
		   });
		   $('#afs-calculator-nine').click(function(){
			   txt.val(txt.val()+'9');
		   });
		   $('#afs-calculator-mns').click(function(){
			   txt.val(txt.val()+'-');
		   });
		   $('#afs-calculator-cpts').click(function(){
			   txt.val(txt.val()+')');
		   });
		   $('#afs-calculator-four').click(function(){
			   txt.val(txt.val()+'4');
		   });
		   $('#afs-calculator-five').click(function(){
			   txt.val(txt.val()+'5');
		   });
		   $('#afs-calculator-six').click(function(){
			   txt.val(txt.val()+'6');
		   });
		   $('#afs-calculator-mty').click(function(){
			   txt.val(txt.val()+'x');
		   });
		   $('#afs-calculator-pi').click(function(){
			   txt.val(txt.val()+'pi');
		   });
		   $('#afs-calculator-one').click(function(){
			   txt.val(txt.val()+'1');
		   });
		   $('#afs-calculator-two').click(function(){
			   txt.val(txt.val()+'2');
		   });
		   $('#afs-calculator-three').click(function(){
			   txt.val(txt.val()+'3');
		   });
		   $('#afs-calculator-bks').click(function(){
			   txt.val(txt.val()+':');
		   });
		   $('#afs-calculator-pct').click(function(){
			   txt.val(txt.val()+'%');
		   });
		   $('#afs-calculator-zero').click(function(){
			   txt.val(txt.val()+'0');
		   });
		   $('#afs-calculator-dot').click(function(){
			   txt.val(txt.val()+'.');
		   });
		   $('#afs-calculator-e').click(function(){
			   txt.val(txt.val()+'e');
		   });
		   $('#afs-calculator-submit').click(function(){
			   var a = txt.val();
			   a = a.replace(/\e/g,'2.17');
			   a = a.replace(/\pi/g,'3.14');
			   a = a.replace(/\--/g,'+');
			   a = a.replace(/\++/g,'+');
			   a = a.replace(/\+-/g,'-');
			   a = a.replace(/\-+/g,'-');
			   a = a.replace(/\*+/g,'*');
			   a = a.replace(/\/+/g,'/');
			   a = a.replace(/x/g,'*');
			   a = a.replace(/\:/g,'/');
			   a = a.replace(/\%/g,'/100');
			   txt.val(eval(a));
		   });
        });
    }
};