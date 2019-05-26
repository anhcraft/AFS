/*! (c) Copyright by Applications for student */
"use strict";

var school_timetableLang = [];
var school_timetableLangCode = [];
var school_timetableCustom = '';
var user = '';

var school_timetable = {
    dom: {
        setData: function(n, v) {
            afs.dom.setData('school-timetable-' + user + '-' + n, v);
        },
        getData: function(n) {
            return afs.dom.getData('school-timetable-' + user + '-' + n);
        },
        setLang: function(langs, o) {
            o = JSON.stringify(o);
            school_timetableLangCode.push(langs);
            school_timetableLang.push(o);
        },
        setCustom: function(o) {
            o = JSON.stringify(o);
            school_timetableCustom = JSON.parse(o);
        }, 
		getLang: function(u) {
            var a = '';
            for (var i = 0; i < school_timetableLang.length; i++) {
                var lang = school_timetableLangCode[i];
                var obj = JSON.parse(school_timetableLang[i]);
                if (lang == school_timetableCustom.lang) {
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

		$(function() {
			var tableDate = new Date();
			var tableData = school_timetable.dom.getData('table');
			if(tableData == null){
				$('#afs-school-timetable-table').html(' <tr> <th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr> <tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
			}
			
			var arr_day = school_timetable.dom.getLang('day');
			for(var day = 0; day < arr_day.length; day++){
				$('#afs-school-timetable-table tr:first-child th').eq(day).html(arr_day[day]);
			}
			
			if(tableData !== null){
				$('#afs-school-timetable-table').html(tableData);
				$('.school-timetable-tomorrow').removeClass('school-timetable-tomorrow');
				$('.school-timetable-today').removeClass('school-timetable-today');
			}
			
			$('#afs-school-timetable-table tr td:nth-child('+(tableDate.getDay())+')').addClass('school-timetable-today');
			
			if(tableDate.getDay() == school_timetableCustom.col) {
				$('#afs-school-timetable-table tr td:nth-child(1)').addClass('school-timetable-tomorrow');
			}
			
			if(tableDate.getDay() !== school_timetableCustom.col) {
				$('#afs-school-timetable-table tr td:nth-child('+(tableDate.getDay()*1+1)+')').addClass('school-timetable-tomorrow');
			}

			$('#afs-school-timetable-edit').click(function(){
				$('#afs-school-timetable-table').addClass('edit-table');
				$('#afs-school-timetable-table tr td').attr('contenteditable','true');
				$('#afs-school-timetable-ok').show();
				$(this).hide();
			});
			$('#afs-school-timetable-ok').click(function(){
				$('#afs-school-timetable-table').removeClass('edit-table');
				$('#afs-school-timetable-table td').removeAttr('contenteditable');
				school_timetable.dom.setData('table',$('#afs-school-timetable-table').html());
				location.reload();
			});
        });
    }
};