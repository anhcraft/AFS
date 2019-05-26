/*! (c) Copyright by Applications for student */
"use strict";
var user = '';
var noteLangCode = [];
var noteLang = [];
var noteCustom = '';
var id = '';
var title_ = '';
var description_ = '';
var content_ = '';
var note = {
    dom: {
        setData: function(n, v) {
            afs.dom.setData('note-' + user + '-' + n, v);
        },
        getData: function(n) {
            return afs.dom.getData('note-' + user + '-' + n);
        },
        setLang: function(langs, o) {
            o = JSON.stringify(o);
            noteLangCode.push(langs);
            noteLang.push(o);
        },
        setCustom: function(o) {
            o = JSON.stringify(o);
            noteCustom = JSON.parse(o);
        },
        getLang: function(u) {
            var a = '';
            for (var i = 0; i < noteLang.length; i++) {
                var lang = noteLangCode[i];
                var obj = JSON.parse(noteLang[i]);
                if (lang == noteCustom.lang) {
                    if (typeof obj[u] !== undefined) {
                        return obj[u];
                    }
                }
            }
        },
        getItem: function() {
            var a = note.dom.getData('item');
            var b = JSON.parse(a);
            var c = '';
            for (var i = 0; i < b.length; i++) {
                c = c + '<div class="afs-note-item" id="' + i + '"><div class="afs-note-item-title">' + b[i].title + '</div><div class="afs-note-item-description">' + b[i].description + '</div><div style="display:none" class="afs-note-item-content">' + b[i].content + '</div></div>';
            }
            return c;
        },
        newModeItem: function(t, d, c) {
            var a = JSON.stringify({
                title: t,
                description: d,
                content: c
            });
            var dx = '[' + a + ']';
            note.dom.setData('item', dx);
        }
    },
    run: function() {
        var u = $_GET['user'];
        u = afs.dom.atob(u);
        user = u;
		
		var checkItem = note.dom.getData('item');
		if(typeof checkItem === undefined || checkItem == null) {
			note.dom.newModeItem(noteCustom.defaultTitle, noteCustom.defaultDescription, noteCustom.defaultContent);
		}
        $(function() {
            $('#afs-note > div').hide();
            $('#afs-note #afs-note-loading').show();
            $('#note-loading').css('margin-top', (($('#afs-note').height() / 2) - ($('#windows8').outerHeight() / 2)) + 'px');
            setTimeout(function() {
                $('#afs-note-board-open, #afs-note-board-edit, #afs-note-board-delete').hide();
                $('#afs-note > div').hide();
                $('#afs-note #afs-note-board').show();
                $('#afs-note-board-item').html(note.dom.getItem());
                $('#afs-note-board-delete').click(function() {
                    var a = note.dom.getData('item');
                    var b = JSON.parse(a);
                    var c = '';
                    for (var i = 0; i < b.length; i++) {
                        if (i !== id) {
                            c = c + JSON.stringify(b[i]) + ',';
                        }
                    }
                    if (c.length !== 0) {
                        c = c.slice(0, c.length - 1);
                    }
                    var d = '[' + c + ']';
                    note.dom.setData('item', d);
                    afs.dom.popup(note.dom.getLang('deleteItem'));
                     location.reload();
                });
                $('#afs-note-board-new').click(function() {
                    var title = $('#afs-note-editor-itemTitle');
                    var description = $('#afs-note-editor-itemDescription');
                    var content = $('#cke_afs-note-editor-itemEditor iframe').contents().find('body');
                    $('#afs-note > div').hide();
                    $('#afs-note #afs-note-editor').show();
                    title.val('').attr('placeholder', note.dom.getLang('itemTitleEditor'));
                    description.val('').attr('placeholder', note.dom.getLang('itemDescriptionEditor'));
                    content.html('');
                    $('#afs-note-editor-complete').html(note.dom.getLang('completeEditor'));
                    $('#afs-note-editor-exit').click(function() {
                        $('#afs-note > div').hide();
                        $('#afs-note #afs-note-board').show();
                    });
                    $('#afs-note-editor-complete').click(function() {
                        var t = title.val();
                        var d = description.val();
                        var c = content.html();
                        var a = note.dom.getData('item');
                        var b = JSON.stringify({
                            title: t,
                            description: d,
                            content: c
                        }) + ',';
                        if (a.length == 2) {
                            b = b.slice(0, b.length - 1);
                        }
                        var cx = a.slice(1, a.length - 1);
                        var dx = '[' + b + cx + ']';
                        note.dom.setData('item', dx);
                        afs.dom.popup(note.dom.getLang('newItem'));
                       location.reload();
                    });
                });
                $('#afs-note-board-open').click(function() {
                    $('#afs-note > div').hide();
                    $('#afs-note #afs-note-open').show();
                    $('#afs-note-open-itemTitle').html(title_);
                    $('#afs-note-open-itemDescription').html(description_);
                    $('#afs-note-open-itemContent').html(content_);
                    $('#afs-note-open-exit').click(function() {
                        $('#afs-note > div').hide();
                        $('#afs-note #afs-note-board').show();
                    });
                });
                $('#afs-note-board-edit').click(function() {
                    var title = $('#afs-note-editor-itemTitle');
                    var description = $('#afs-note-editor-itemDescription');
                    var content = $('#cke_afs-note-editor-itemEditor iframe').contents().find('body');

                    $('#afs-note > div').hide();
                    $('#afs-note #afs-note-editor').show();
                    title.val(title_);
                    description.val(description_);
                    $('#afs-note-editor-complete').html(note.dom.getLang('completeEditor'));
                    $('#cke_afs-note-editor-itemEditor iframe').contents().find('body').html(content_);
                    $('#afs-note-editor-exit').click(function() {
                        $('#afs-note > div').hide();
                        $('#afs-note #afs-note-board').show();
                    });

                    $('#afs-note-editor-complete').click(function() {
                       var t = title.val();
                        var d = description.val();
                        var c = content.html();
                        var a = note.dom.getData('item');
                        var b = JSON.parse(a);
                        var cx = '';
                        for (var i = 0; i < b.length; i++) {
                            if (i !== id) {
                                cx = cx + JSON.stringify(b[i]) + ',';
                            }
                            if (i == id) {
                                cx = cx + JSON.stringify({
                                    title: t,
                                    description: d,
                                    content: c
                                }) + ',';
                            }
                        }
                        cx = cx.slice(0, cx.length - 1);
                        var d = '[' + cx + ']';
                        note.dom.setData('item', d);
                        afs.dom.popup(note.dom.getLang('editItem'));
                       location.reload();
                    });
                });
                $('.afs-note-item').click(function() {
                    id = $(this).attr('id') * 1;
                    title_ = $(this).find('.afs-note-item-title').html();
                    description_ = $(this).find('.afs-note-item-description').html();
                    content_ = $(this).find('.afs-note-item-content').html();

                    $('#afs-note-board-open').toggle();
                    $('#afs-note-board-edit').toggle();
                    $('#afs-note-board-delete').toggle();
                    $(this).toggleClass('afs-note-item-active');
                });
            }, noteCustom.timeLoading);
        });

    }
};