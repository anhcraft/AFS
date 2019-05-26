/*! (c) Copyright by Applications for student */
afs.dom.setCustom({
	update: "http://localhost/?v="+afsVersion,
	lang: afs.dom.getLangCode(),
	background: afs.dom.getBgUrl(),
	timeLoading: Math.floor((Math.random() * 3000) + 1000),
	timeShowBoard: Math.floor((Math.random() * 1000) + 1000)
});