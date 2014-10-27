'use strict';

mo.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
	$urlRouterProvider.otherwise("/");
	$stateProvider
		.state("f", {abstract: true, templateUrl: 'tpl/f/layout', controller:"FCtl"})
		.state("f.home", {url:'/',  templateUrl: 'tpl/f/home', controller:"FHomeCtl"})
		.state("f.sign", {url:'/sign', templateUrl: 'tpl/f/sign',controller:'FSignCtl'})
		.state("f.cat", {url:'/cat/:id', templateUrl: 'tpl/f/cat',controller:'FCatCtl'})
		.state("f.video", {url:'/video/:id', templateUrl: 'tpl/f/video',controller:'FVideoCtl'})
		.state("f.vip", {url:'/vip', templateUrl: 'tpl/f/vip',controller:'FCtl'})
		.state("b", {abstract:true, url:'/b',  templateUrl: 'tpl/b/layout', controller:"BCtl"})
		.state("b.home", {url:'/home',  templateUrl: 'tpl/b/home', controller:"BHomeCtl"})
		.state("b.faq", {abstract:true, url:'/faq',  templateUrl: 'tpl/b/faq', controller:"BFaqCtl"})
		.state("b.faq.home", {url:'/home',  templateUrl: 'tpl/b/faq.home', controller:"BFaqCtl"})
		.state("b.faq.ask", {url:'/ask',  templateUrl: 'tpl/b/faq.ask', controller:"BFaqCtl"})
		.state("b.faq.answer", {url:'/answer',  templateUrl: 'tpl/b/faq.answer', controller:"BFaqCtl"})
		.state("b.account", {url:'/account',  templateUrl: 'tpl/b/account', controller:"BAccountCtl"})
		.state("b.profile", {url:'/profile',  templateUrl: 'tpl/b/profile', controller:"BProfileCtl"})
		.state("b.uppwd", {url:'/uppwd',  templateUrl: 'tpl/b/uppwd', controller:"BUppwdCtl"})
		.state("b.getvip", {url:'/getvip',  templateUrl: 'tpl/b/getvip', controller:"BGetvipCtl"})
		.state("b.buyvip", {url:'/buyvip',  templateUrl: 'tpl/b/buyvip', controller:"BBuyvipCtl"})
		.state("b.gcode", {url:'/gcode',  templateUrl: 'tpl/b/gcode', controller:"BGcodeCtl"})
		.state("b.data", {abstract:true, url:'/data',  templateUrl: 'tpl/b/data', controller:"BDataCtl"})
		.state("b.data.finance", {url:'/finance',  templateUrl: 'tpl/b/data.finance', controller:"BDataCtl"})
		.state("b.data.member", {url:'/member',  templateUrl: 'tpl/b/data.member', controller:"BDataCtl"})
		.state("b.data.vip", {url:'/vip',  templateUrl: 'tpl/b/data.vip', controller:"BDataCtl"})
		.state("b.data.promotion", {url:'/promotion',  templateUrl: 'tpl/b/data.promotion', controller:"BDataCtl"})
		.state("b.site", {abstract:true, url:'/site',  templateUrl: 'tpl/b/site', controller:"BSiteCtl"})
		.state("b.site.home", {url:'/home',  templateUrl: 'tpl/b/site.home', controller:"BSiteCtl"})
		.state("b.site.cat", {url:'/cat',  templateUrl: 'tpl/b/site.cat', controller:"BSiteCatCtl"})
		.state("b.site.video", {url:'/video',  templateUrl: 'tpl/b/site.video', controller:"BSiteVideoCtl"})
		.state("b.site.d3", {url:'/d3',  templateUrl: 'tpl/b/site.d3', controller:"BSiteCtl"})
	$httpProvider.interceptors.push('authInterceptor');
}])
.controller("AppCtl",["$scope", "$state", function($scope, $state){
	$state.transitionTo('f.home');	
}])
.controller("FCtl",["$scope","$rootScope","$window", function($scope,$rootScope,$window){
}])
.controller("FSignCtl",["$scope","$rootScope","$rest","$window","$state", function($scope,$rootScope,$rest,$window,$state){
	$scope.mdData = {
		org: "钱路书院",
		email:"",
		username:"",
		password:"",
		promcode: "",
		msg: "",
	};
	$scope.signup_by_email_and_promcode = function(){
		console.log("signup");
		$rest.signup_by_email_and_promcode($scope.mdData, function(data){
			console.log(data);
			$rootScope.user = data;
			$window.localStorage.token = data.token;
			$window.localStorage.user = JSON.stringify(data);
			$state.go("f.home");
		});
	};
}])
.controller("FHomeCtl",["$scope","$rootScope","$window","$timeout", function($scope,$rootScope,$window,$timeout){
	var slides = $rootScope.slides, currentTimeout, isPlaying=true, destroyed = false;
	var currentIndex = $scope.currentIndex = -1;

	$scope.select = function(idx) {
		if (currentIndex !== idx && !destroyed) {
			currentIndex = idx;
			resetTimer();
			var interval = +3000;
			if (!isNaN(interval) && interval>=0) { 
				currentTimeout = $timeout(function(){
					if (isPlaying) { 
						var newIndex = $rootScope.slides ?  (currentIndex + 1) % $rootScope.slides.length : 1;
						$scope.select(newIndex);
					} else if (!$scope.noPause) { 
						console.log("here2");
						isPlaying = false; 
						resetTimer(); 
					} 
				}, 1000);  
			}
		}
	};
	$scope.$on('$destroy', function () {
		destroyed = true;
		resetTimer();
	});
	function resetTimer() {
		if (currentTimeout) { 
			$timeout.cancel(currentTimeout); 
			currentTimeout = null; 
		}
	}
	$scope.select(0);
}])
.controller("FCatCtl",["$scope","$rootScope","$stateParams","$rest",function($scope,$rootScope,$stateParams,$rest){
	$scope.cat = _.find($rootScope.cats, function(item){return item._id == $stateParams.id;});
	$rest.get_videos_by_catid($stateParams.id, function(videos){ $scope.videos = videos;});
	$rest.get_member_by_id($scope.cat.teacher_id, function(teacher){$scope.teacher = teacher;});
}])
.controller("FVideoCtl",["$scope","$rootScope","$stateParams","$window","$rest", function($scope,$rootScope,$stateParams,$window,$rest){
	var regex = new RegExp("^\\d{2,12}$");
	if(regex.test($stateParams.id)){
		$rest.get_videos_by_catid($stateParams.id, function(data){
			$scope.curVideoList = data;
			$scope.curVideo = $scope.curVideoList[0];
			$rest.set_visit({type:"video", _id: $scope.curVideo._id});
		});
	}else{
		$rest.get_video_by_id($stateParams.id, function(data){
			$scope.curVideo =  data;	
			$scope.curVideoList = [$scope.curVideo];
			$rest.set_visit({_id: $stateParams.id});
			$rest.set_visit({_id: $stateParams.id});
			$rest.set_visit({type:"video", _id: $stateParams.id});
		}); 
	}
}])
.controller("BCtl",["$scope", "$rootScope","$state", function($scope,$rootScope,$state){
	if(!$rootScope.user){$state.go("f.home");}
	$scope.tasks = [
		{title:"你还有30个问题没有关闭！", progress: 30, },
		{title:"你还有30个问题没有关闭！", progress: 30, },
		{title:"你还有30个问题没有关闭！", progress: 30, },
		{title:"你还有30个问题没有关闭！", progress: 30, },
	];
	$scope.alerts = [
		{color:"pink", icon:"comment", title:"您的VIP权限已超时！", num:"3"},
		{color:"pink", icon:"comment", title:"您的VIP权限已超时！", num:"3"},
		{color:"pink", icon:"comment", title:"您的VIP权限已超时！", num:"3"},
		{color:"pink", icon:"comment", title:"您的VIP权限已超时！", num:"3"},
	];
	$scope.msgs = [
		{from:{username:"叶辛", avatar:"assets/avatars/avatar.png"}, title:"您的VIP权限已超时！", create_at: Date.now()},
		{from:{username:"叶辛", avatar:"assets/avatars/avatar.png"}, title:"您的VIP权限已超时！", create_at: Date.now()},
		{from:{username:"叶辛", avatar:"assets/avatars/avatar.png"}, title:"您的VIP权限已超时！", create_at: Date.now()},
	];
	//Socket.connect(host,port,data._id,$rootScope.token);
}])
.controller("BHomeCtl",["$scope","$rootScope","$state","$rest", function($scope,$rootScope,$state,$rest){
	$scope.myVideos = [];
	$rest.get_visit_videos(function(data){
		$scope.myVideos = data;
	});
}])
.controller("BFaqCtl",["$scope","$rootScope","$state", function($scope,$rootScope,$state){
}])
.controller("BAccountCtl",["$scope","$rootScope","$state", function($scope,$rootScope,$state){
}])
.controller("BProfileCtl",["$scope","$rootScope","$rest", function($scope,$rootScope,$rest){
	$scope.profile = {};
	$scope.doSubmit = function(){
		$rest.set_user_profile($scope.profile, function(){

		});
	}
}])
.controller("BUppwdCtl",["$scope", "$rootScope","$rest", function($scope,$rootScope,$rest){
	$scope.doSubmit = function(){
		if(!$scope.oldpassword || !$scope.password){
			$scope.msg = "密码不能为空，请正确输入！";
		}else if($scope.password !== $scope.password2){
			$scope.msg = "新密码两次输入不一致，请正确输入！";
		}else{
			$rest.user_set_password({password: $scope.password}, function(){
			});
		}
	};
	$scope.doReset = function(){
		$scope.msg = "";
		$scope.oldpassword = "";
		$scope.password = "";
		$scope.password2 = "";
	};
	$scope.doReset();
}])
.controller("BGetvipCtl",["$scope","$rootScope","$state", function($scope,$rootScope,$state){

}])
.controller("BBuyvipCtl",["$scope","$rootScope","$state", function($scope,$rootScope,$state){
	$scope.buy = function(level){
		var parameter = {
			total_fee : 2380,
			subject : "VIP会员",
			body : "钱路书院VIP会员年费"
		};
  			$http.post('/api/alipay/create_direct_pay_by_user_location/qianlushuyuan', parameter).success(function(data){
  				$window.location.href = data.location;
  			});
	};	
}])
.controller("BGcodeCtl",["$scope","$rootScope","$state", function($scope,$rootScope,$state){
}])
.controller("BDataCtl",["$scope","$rootScope","$state", "$rest", function($scope,$rootScope,$state,$rest){
	$scope.pmt_types = ["vip"]; //promotion
	$scope.pmt_type = "";
	$scope.pmt_fors = []; 
	$scope.pmt_for_idx = -1;


	servPay.get_gcodes(function(data){
		$scope.pmt_gcodes = data;
	});
	servVip.get_vips(function(data){
		$scope.vips = data;
	})
	servUser.get_users(function(data){
		$scope.mems = data;
	})
	servPay.get_pays(function(data){
		$scope.pays = data;
	})
	
	$scope.$watch("pmt_type", function(newVal){
		if(newVal == "vip"){
			servVip.get_vips(function(data){$scope.pmt_fors = data;});
		}
	});

	$scope.pmt_new = function(){
		$scope.pmt_gcode = {gcode : "",fee_back: 0,username:"",deadline:Date.now()};
		$scope.pmt_type = "";
		$scope.pmt_for_idx = -1;
	}
	$scope.pmt_edit = function(item){
		$scope.pmt_gcode = item;
		$scope.pmt_type = item.type;
		$scope.pmt_for_idx = -1;
	}
	$scope.pmt_del = function(item){
		servPay.del_gcode(item, function(result){
			var idx = _.findIndex($scope.pmt_gcodes, function(it){return it._id == item._id}); 
			$scope.pmt_gcodes.splice(idx,1);
		});
	}
	$scope.pmt_save = function(){
		$scope.pmt_gcode.type = $scope.pmt_type;
		$scope.pmt_gcode.ref_id = $scope.pmt_fors[$scope.pmt_for_idx]._id;
		$scope.pmt_gcode.title = $scope.pmt_fors[$scope.pmt_for_idx].title + " 折扣码";
		servPay.set_gcode($scope.pmt_gcode, function(result){
			console.log(result);
			var idx = _.findIndex($scope.pmt_gcodes, function(it){return it._id == result._id}); 
			if(idx > -1){
				$scope.pmt_gcodes.splice(idx,1,result);
			}else{
				$scope.pmt_gcodes.unshift(result);
			}
			$scope.pmt_new();
		});
	}
	$scope.vip_new = function(){
		$scope.vip = {title:"", subtitle:"", description:"", span:0, fee_now: 0, fee_origin:0,priority:50};
	}
	$scope.vip_edit = function(item){
		$scope.vip = item;
	}
	$scope.vip_del = function(item){
		servVip.del_vip(item, function(result){
			var idx = _.findIndex($scope.vips, function(it){return it._id == item._id}); 
			$scope.vips.splice(idx,1);
		});
	}
	$scope.vip_save = function(){
		console.log($scope.vip);
		servVip.set_vip($scope.vip, function(result){
			console.log(result);
			var idx = _.findIndex($scope.vips, function(it){return it._id == result._id}); 
			console.log(idx);
			console.log($scope.vips);
			if(idx > -1){
				$scope.vips.splice(idx,1,result);
			}else{
				$scope.vips.unshift(result);
			}
			console.log($scope.vips);
			$scope.vip_new();
			console.log($scope.vips);
		});
	}
	$scope.mem_edit = function(item){
		$scope.mem = item;
	}
	$scope.mem_setrole = function(){
		var idx = _.indexOf($scope.mem.roles, $scope.mem_role);
		if(idx == -1){
			$scope.mem.roles.push($scope.mem_role);
		}else{
			$scope.mem.roles.splice(idx,1);
		}
		servUser.set_roles($scope.mem);
	}
	$scope.pay_edit = function(item){
		$scope.pay = item;
	}
	$scope.pay_setfee = function(){
		$scope.pay.fee_origin = +$scope.pay.fee_origin || 0;
		$scope.pay.fee_back = +$scope.pay.fee_back || 0;
		$scope.pay.fee_actual = $scope.pay.fee_origin - $scope.pay.fee_back;
		if($scope.pay.fee_actual == 0){$scope.pay.status = "finished";}
		servPay.set_fee($scope.pay);
	}
}])
.controller("BSiteCtl",["$scope","$rootScope","$window", function($scope,$rootScope,$window){
}])
.controller("BSiteCatCtl",["$scope","$rootScope","$window","$rest", function($scope,$rootScope,$window,$rest){
	$scope.ctypes = ["video","article"];
	$scope.sel_ctype = function(t){
		$scope.ctype = t;
		$scope.data = _.filter($rootScope.cats, function(item){return item.type == $scope.ctype;});
		$scope.add_top();
	}
	$scope.add_top = function(){
		$scope.cat = {hostname: $rootScope.site._id,type: $scope.ctype, key:"", pkey:"", title: "",face: "/img/0101.jpg",priority: 50,description:""};
		$scope.cat_tip = "作为顶级分类";
	}
	$scope.sel_ctype('video');
	$scope.add_sub = function(cat){
		$scope.cat = {hostname: $rootScope.site._id,type: $scope.ctype, pkey: cat.key, title: "",face: "/img/0101.jpg",priority: 50,description:""};
		$scope.cat_tip = "作为 [" + cat.title + "] 的子类";
	}
	$scope.edit = function(item){ $scope.cat = item; }
	$scope.set = function(){
		servCat.save($scope.cat, function(){$scope.add_top();});

	}
	$scope.del = function(item){
		servCat.del(item, function(){$scope.add_top();}); 
	}
}])
.controller("BSiteVideoCtl",["$scope","$rootScope","$window","$rest", function($scope,$rootScope,$window,$rest){
	$scope.cat = null;
	$scope.sel_cat = function(ckey){
		if(ckey){
			$scope.cat_videos = _.filter($rootScope.videos, function(item){ return _.indexOf(item.cats, key) > -1; });
		}else{
			$scope.cat_videos = _.filter($rootScope.videos, function(item){ return item.cats.length == 0; });
		}
	}
	$scope.new = function(){
		$scope.video = {hostname:$rootScope.site._id,title:"", url:"",cats:[],face: "/img/0202.jpg",visits: 50,create_at: Date.now(),description:""}; 
		if($scope.cat){ $scope.video.cats.push(cat); }
	}
	$scope.edit = function(item){$scope.video = item;}
	$scope.save = function(){ $rest.set_video($scope.video, function(){toastr.info("视频信息已保存！");});}
	$scope.del = function(){$rest.del_video_by_id($scope.video._id, function(){toastr.info("视频信息已删除！");}); $scope.new();}
	$scope.set_cat = function(ckey){
		var idx = _.indexOf($scope.video.cats, ckey);
		if(idx == -1){
			$scope.video.cats.push(key);
		}else{
			$scope.curVideo.cats.splice(idx,1);	
		}
		$scope.save();
	}
}])
.controller("SignCtl", function($scope,$rootScope,$window,$modalInstance,$state,$rest){
	$scope.mdData = {
		org: "钱路书院",
		show: "", //显示哪个Modal
		mobile:"",
		email:"",
		sms:"",
		username:"",
		password:"",
		smsCaption: "发送验证码",
		smsDisable: false,
		smsInterval: 60,
		rememberme: true,
		agree: true,
		msg: "",
	};
	$scope.sendSms = function(){
		$rest.sms_verify($scope.mdData, function(left){$scope.smsCaption = left <= 0 ? "发送验证码" : left + " 秒后再次发送";});
	};
	$scope.signin = function(){
		$rest.user_signin($scope.mdData, function(msg){$modalInstance.close();});
	};
	$scope.signup_simple = function(){
		$rest.user_signup_simple($scope.mdData, function(user){$modalInstance.close();});
	};
	$scope.signup_by_mobile = function(){
		$rest.user_signup_by_mobile($scope.mdData, function(user){$modalInstance.close();});
	};
	$scope.signup_by_email = function(){
		$rest.user_signup_by_email($scope.mdData, function(user){$modalInstance.close();});
	};
	$scope.pay_vip = function(vip){
		$rest.pay_vip(vip, function(data){
			if(data.status == "finished"){
				$state.go("b.pays");	
			}else{
				$window.location.href = data.location;
			}
		});
	};
	$scope.update_ecoupon_code = function(vip){
		$rest.get_ecoupon_by_code(vip.ecoupon_code, function(data){
			if(!data || data.type !== "vip"){
				vip.subtitle = "折扣码错误！";
			}else{
				vip.subtitle = "享受折扣" + data.fee_back + "元";
			}
		});
	}
})
.run(['$rootScope', '$location', '$modal', '$window', '$rest', function ($rootScope, $location, $modal, $window, $rest) {
	var site =  JSON.parse($window.localStorage.site || "{}");
	angular.forEach(site, function(value, key){ $rootScope[key] = value;});
	$rootScope.signOut = function(){
		delete $rootScope.user;
		delete $window.sessionStorage.token;
		delete $window.sessionStorage.user;
		delete $window.localStorage.token;
		delete $window.localStorage.user;
		$state.go('f.home');
	};
	$rest.get_site("slides,cats,video_new10,video_hot10,vips", function(data){
		angular.forEach(data, function(value, key){
			$rootScope[key] = value;
		});
		$window.localStorage.site = JSON.stringify(data);
	});
	$rootScope.user =  JSON.parse($window.localStorage.user || "{}");

	$rootScope.sign = function(type){
		var modalInstance = $modal.open({
			templateUrl: "modal/"+type+".html",
			controller: "SignCtl",
			size: null,
		});
		modalInstance.result.then(function(){

		})
	};
}]);