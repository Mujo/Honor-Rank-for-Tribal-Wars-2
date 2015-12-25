var honorDB = {};
var user = localStorage.key(0).split("_");
var dbid = "_" + user[1] + user[2];

function honorRank() {
	$(".screen-tribe-memberlist .name").parent().parent().parent().forEach(function (tr) {
		loadDB();
		var f = ($(tr).children().length == 8) ? 1 : 0;
		var p = parseInt($(tr).children()[3 + f].innerHTML.replace(".", "").replace(",", ""));
		var v = parseInt($(tr).children()[4 + f].innerHTML);
		var h = parseInt($(tr).children()[6 + f].innerHTML);
		var n = $(tr).find(".name").html();
		var r = (p < 1500) ?
							1 :
							(h > 1) ?
								parseFloat(((h + 1 / v) * 3000 / p).toFixed(2)) :
								parseFloat(((h + 1) * 1500 / p).toFixed(2));


		var cr = (r < 1) ? "ff" : (r > 2) ? "00" : ("0" + parseInt(255 * (2 - r)).toString(16)).slice(-2);
		var cg = (r > 1) ? "ff" : ("0" + parseInt(255 * r).toString(16)).slice(-2);

		var now = Date.now();
		var newRank = { d: now, r: r, p: p, v: v, h: h };
		if (!honorDB[n]) {
			honorDB[n] = [newRank];
		} else {
			var rankHist = honorDB[n];
			var lastSaved = rankHist[rankHist.length - 1];
			if (lastSaved.r != r)
				honorDB[n].push(newRank);
		}
		var title = "", hl = honorDB[n].length, hs = 0, ds = null, he = honorDB[n][hl - 1].h;
		for (var i = 0; i < hl - 1; i++) {
			var ph = honorDB[n][i];
			if (!ds && ph.d > now - 20 * 24 * 60 * 60 * 1000)
				ds = ph.d;
			if (ph.h != undefined) {
				hs = ph.h;
				break;
			}
		}
		title += "Media doa&ccedil;&atilde;o di&aacute;ria(20 dias): ";
		if (hs && he > 1) {
			var avg = (he - hs) * 100000 / ((now - ds) / 1000 / 60 / 60 / 24);
			title += avg.toFixed(2);
		} else {
			title += "0.00";
		}
		title += "\n";

		var im = Math.max(0, hl - 10);
		for (var i = hl - 1; i >= im; i--) {
			var ph = honorDB[n][i];
			var dt = new Date(ph.d);
			title += dt.toLocaleDateString() + " " + dt.toLocaleTimeString({}, { hour12: false }) + " > " + ph.r.toFixed(2);
			if (ph.p != undefined)
				title += " (" + ph.p + "," + ph.v + "," + ph.h + ")";
			if (i > im)
				title += "\n";
		}
		saveDB();
		$($(tr).children()[6]).html(h + " <span title='" + title + "' style='color:#" + cr + cg + "22;background-color:rgba(50,50,50,.5);'>&nbsp;" + r.toFixed(2) + "&nbsp;</span>");
	});
}

function loadDB() {
	user = localStorage.key(0).split("_");
	dbid = "_" + user[1] + user[2];
	if (localStorage["honorDB" + dbid]) {
		honorDB = JSON.parse(localStorage["honorDB" + dbid]);
	}
}
function saveDB() {
	localStorage["honorDB" + dbid] = JSON.stringify(honorDB);
}

function initHonorRank() {
	if (localStorage.honorDB) {
		localStorage["honorDB" + dbid] = localStorage.honorDB;
		localStorage.removeItem("honorDB");
	}
	//loadDB();
	$("[ng-controller=TribeController] .tab:eq(1)").off("click").on("click", function () {
		setTimeout(honorRank, 1000);
	});
	//$(window).on("beforeunload", function () {
	//	saveDB();
	//});
}

var intervalId = setInterval(function () {
	if ($(".tribe-tag").length) {
		$("[ng-click*='openTribe('],[ng-click*='open(\'tribe']").click(function () { setTimeout(initHonorRank, 1000); });
		clearInterval(intervalId);
	}
}, 1000);
