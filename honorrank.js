function honorRank() {
	$(".screen-tribe-memberlist .name").parent().parent().parent().forEach(function (tr) {
		var p = parseInt($(tr).children()[3].innerHTML.replace(".", ""));
		var v = parseInt($(tr).children()[4].innerHTML);
		var h = parseInt($(tr).children()[6].innerHTML);
		//var n = $($(tr).children()[1]).children().children().html();
		var r = ((h + v) * 1000 / p).toFixed(2);
		var cr = (r < 1) ? "ff" : (r >= 2) ? "00" : ("0" + parseInt(255 * (2 - r)).toString("16")).slice(-2);
		var cg = (r > 1) ? "ff" : ("0" + parseInt(255.0 * r).toString("16")).slice(-2);

		$($(tr).children()[6]).html(h + " <span style='color: #" + cr + cg + "22;background-color:rgba(50,50,50,.5);'>&nbsp;" + r + "&nbsp;</span>");
	});
}
function initHonorRank() {
	$("[ng-controller=TribeController] .tab:eq(1)").off("click").on("click", function () {
		setTimeout(honorRank, 1000);
	});
}
var intervalId = setInterval(function () {
	if ($(".tribe-tag").length) {
		$("[ng-click*='openTribe('],[ng-click*='open(\'tribe']").click(function () { setTimeout(initHonorRank, 1000); });
		clearInterval(intervalId);
	}
}, 1000);
