function(a,b){
	function c(){var b=a("p","#j-mainslide-data");b.each(function(b,c){var d=a(c).find("span");z.push({link:d.eq(0).text(),bigpic:d.eq(1).text(),smallpic:d.eq(2).text(),txtpic:d.eq(3).text(),bgcolor:d.eq(4).text()})}),A=z.length}
	function d(){if(a.each(z,function(b,c){var d=""!=a.trim(c.txtpic)?'<img src="'+c.txtpic+'">':"",e=a('<div class="imgItem f-pa j-slideImg">						 		<div class="imgbox g-container f-pr">						 			<a href="'+c.link+'" target="_blank">									<div class="pic"></div>									<div class="txt f-pa">'+d+"</div>									</a>								</div>							   </div>");e.css("background",c.bgcolor).find(".pic").css("background-image","url("+c.bigpic+")"),t.append(e);var f=a('<div class="j-slideitem item f-pa">									<div class="posborder f-pa"></div>									<div class="slt"></div>							   </div>');f.css({left:84*b+"px",top:"0px"}).find(".slt").css("background-image","url("+c.smallpic+")"),f.attr("index",b),u.append(f)}),p=t.find(".j-slideImg"),q=u.find(".j-slideitem"),!y){var b=q.eq(A-1);u.css({left:"50%","margin-left":-(parseInt(b.css("left"))+b.width())/2+"px"})}}
	function e(){a.each(q,function(b,c){a(c).on("mouseenter",function(){j.call(this)}).on("mouseleave",l)})}
	function f(){a.each(z,function(b,c){""!=a.trim(c.txtpic)&&v.push(c.txtpic),""!=a.trim(c.bigpic)&&v.push(c.bigpic),""!=a.trim(c.smallpic)&&v.push(c.smallpic)});for(var b=0;b<v.length;b++)h(v[b])}
	function g(){d(),e(),i(0),k(),s.fadeOut()}
	function h(b){a("<img />").bind("load",function(){w++,w==v.length&&g()}).attr("src",b)}
	function i(a){if(C!=a){var b=C;b>=0&&(p.eq(b).stop().css({"z-index":"3",opacity:"1"}),q.eq(b).removeClass("itempos").stop().animate({top:"0px"},200)),C=a,q.eq(C).addClass("itempos").stop().animate({top:"-6px"},200),p.eq(C).stop().css({"z-index":"2",opacity:"1",display:"block"}),b>=0&&p.eq(b).stop().fadeTo(400,0,function(){p.eq(b).hide().css("z-index","1")})}}
	function j(){var b=a(this).attr("index");r&&clearInterval(r),i(Number(b))}
	function k(){r&&clearInterval(r),r=setInterval(function(){var a=C+1;a=a>A-1?0:a,i(Number(a))},B)}
	function l(){k()}
	function m(a){a.html('<p class="f-c9 empty">暂无排行</p>')}
	function n(a){return 10>a?"0"+a:a}
	function o(a){for(var b="",c=0;c<a.length&&!(c>9)&&a[c]&&a[c].movie;c++){var d=a[c].movie,e=2>=c?"icon icon2":"icon";b+='<li>								<a href="http://v.163.com'+d.pageurl+'" target="_blank" class="item">									<span class="num">'+a[c].hits+'</span>									<i class="'+e+'">'+n(c+1)+'</i>									<span class="txt f-ib f-thide">'+d.title+"</span>								</a>							</li>"}return b}var p,q,r,s=a("#j-mainslide-loading"),t=a("#j-mainslide-imgs"),u=a("#j-mainslide-items"),v=[],w=0,x=b.SLIDEDATA,y=!!x,z=[],A=0,B=5e3,C=-1;return function(){c(),f()}(),y?(function(){function b(a,b){var c=d.eq(a),f=Number(c.data("left"));e.stop().animate({left:f+"px"},180,"swing"),b>=0&&d.eq(b).removeClass("tabpos"),d.eq(a).addClass("tabpos")}var c=a("#j-mainslide-tabs"),d=c.find(".j-tab"),e=c.find(".j-tabline"),f=c.find(".j-mainslide-tabcon");a.each(d,function(b,c){x[b]?a(c).data("left",x[b].left).css("margin-left",x[b].marginleft+"px"):a(c).hide()}),a.tab({mode:"move",tabs:d,tabcons:f,onTabSelect:b})}(),function(){function b(a,b){b>=0&&c.eq(b).removeClass("subtabpos"),c.eq(a).addClass("subtabpos")}var c=a(".j-subtab"),d=a(".j-mainslide-subtabcon");a.tab({tabs:c,tabcons:d,onTabSelect:b})}(),b.returnRank||(b.returnRank=function(b){var c=a(".j-mainslide-subtabcon"),d=c.eq(0).find(".j-mainslide-weekrank").eq(0),e=c.eq(1).find(".j-mainslide-monthrank").eq(0);b[0].topWeekList?b[0].topWeekList.length>0?d.html(o(b[0].topWeekList)):m(c.eq(0)):m(c.eq(0)),b[0].topMonthList?b[0].topWeekList.length>0?e.html(o(b[0].topMonthList)):m(c.eq(1)):m(c.eq(1))}),void 0):(a("#j-mainslide-tabs").remove(),void 0)}(window.jQuery,window);