var honorDB = {};
var user = localStorage.key(0).split("_");
var dbid = "_" + user[1] + user[2];

function honorRank() {
	$(".screen-tribe-memberlist .name").parent().parent().parent().forEach(function (tr) {
		var f = ($(tr).children().length == 8) ? 1 : 0;
		var p = parseInt($(tr).children()[3 + f].innerHTML.replace(".", "").replace(",", ""));
		var v = parseInt($(tr).children()[4 + f].innerHTML);
		var h = parseInt($(tr).children()[6 + f].innerHTML);
		var n = $(tr).find(".name").html();
		var r =
			(v < 1) ?
			h :
				(h > 1) ?
					parseFloat(((h + v) * 1000 / p).toFixed(2)) :
					(h > 0) ?
						parseFloat((2000 / p).toFixed(2)) :
						(p < 1000) ?
							1 :
							parseFloat(Math.max(1 - ((p - 1000) / 4000), 0).toFixed(2));

		var cr = (r < 1) ? "ff" : (r > 2) ? "00" : ("0" + parseInt(255 * (2 - r)).toString("16")).slice(-2);
		var cg = (r > 1) ? "ff" : ("0" + parseInt(255 * r).toString("16")).slice(-2);
		var now = Date.now();
		var newRank = { d: now, r: r };
		if (!honorDB[n]) {
			honorDB[n] = [newRank];
		} else {
			var rankHist = honorDB[n];
			var lastSaved = rankHist[rankHist.length - 1];
			if (lastSaved.r != r)
				honorDB[n].push(newRank);
		}
		var title = "";
		for (var i = honorDB[n].length - 1; i >= Math.max(0, honorDB[n].length - 10) ; i--) {
			var dt = new Date(honorDB[n][i].d);
			title += dt.toLocaleDateString() + " " + dt.toLocaleTimeString({}, { hour12: false }) + " > " + honorDB[n][i].r.toFixed(2) + "\n";
		}
		$($(tr).children()[6]).html(h + " <span title='" + title + "' style='color:#" + cr + cg + "22;background-color:rgba(50,50,50,.5);'>&nbsp;" + r.toFixed(2) + "&nbsp;</span>");
	});
}
function initHonorRank() {
	if (localStorage.honorDB) {
		localStorage["honorDB" + dbid] = localStorage.honorDB;
		localStorage.removeItem("honorDB");
	}
	if (localStorage["honorDB" + dbid])
	{
		honorDB = JSON.parse(localStorage["honorDB" + dbid]);
	}
	$("[ng-controller=TribeController] .tab:eq(1)").off("click").on("click", function () {
		setTimeout(honorRank, 1000);
	});
	$(window).on("beforeunload", function () {
		localStorage["honorDB" + dbid] = JSON.stringify(honorDB);
	});
}
var intervalId = setInterval(function () {
	if ($(".tribe-tag").length) {
		$("[ng-click*='openTribe('],[ng-click*='open(\'tribe']").click(function () { setTimeout(initHonorRank, 1000); });
		clearInterval(intervalId);
	}
}, 1000);
