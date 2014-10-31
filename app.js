'use strict';

mo.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
	$urlRouterProvider.otherwise("/");
	$stateProvider
		.state("f", {abstract: true, templateUrl: 'tpl/f/layout', controller:"FCtl"})
		.state("f.home", {url:'/',  templateUrl: 'tpl/f/home', controller:"FHomeCtl"})
		.state("f.search", {url:'/search/:keyword',  templateUrl: 'tpl/f/search', controller:"FSearchCtl"})
		.state("f.signin", {url:'/signin', templateUrl: 'tpl/f/signin',controller:'FSigninCtl'})
		.state("f.signup", {url:'/signup', templateUrl: 'tpl/f/signup',controller:'FSignupCtl'})
		.state("f.privacy", {url:'/privacy', templateUrl: 'tpl/f/privacy'})
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
		.state("b.verify", {url:'/verify',  templateUrl: 'tpl/b/verify', controller:"BVerifyCtl"})
		.state("b.uppwd", {url:'/uppwd',  templateUrl: 'tpl/b/uppwd', controller:"BUppwdCtl"})
		.state("b.getvip", {url:'/getvip',  templateUrl: 'tpl/b/getvip', controller:"BGetvipCtl"})
		.state("b.buyvip", {url:'/buyvip',  templateUrl: 'tpl/b/buyvip', controller:"BBuyvipCtl"})
		.state("b.gcode", {url:'/gcode',  templateUrl: 'tpl/b/gcode', controller:"BGcodeCtl"})
		.state("b.data", {abstract:true, url:'/data',  templateUrl: 'tpl/b/data', controller:"BDataCtl"})
		.state("b.data.finance", {url:'/finance',  templateUrl: 'tpl/b/data.finance', controller:"BDataFinanceCtl"})
		.state("b.data.user", {url:'/user',  templateUrl: 'tpl/b/data.user', controller:"BDataUserCtl"})
		.state("b.data.vip", {url:'/vip',  templateUrl: 'tpl/b/data.vip', controller:"BDataVipCtl"})
		.state("b.data.ecoupon", {url:'/ecoupon',  templateUrl: 'tpl/b/data.ecoupon', controller:"BDataEcouponCtl"})
		.state("b.site", {abstract:true, url:'/site',  templateUrl: 'tpl/b/site', controller:"BSiteCtl"})
		.state("b.site.home", {url:'/home',  templateUrl: 'tpl/b/site.home', controller:"BSiteCtl"})
		.state("b.site.cat", {url:'/cat',  templateUrl: 'tpl/b/site.cat', controller:"BSiteCatCtl"})
		.state("b.site.video", {url:'/video',  templateUrl: 'tpl/b/site.video', controller:"BSiteVideoCtl"})
		.state("b.site.article", {url:'/article',  templateUrl: 'tpl/b/site.article', controller:"BSiteArticleCtl"})
	$httpProvider.interceptors.push('authInterceptor');
}])
.controller("AppCtl",["$scope", "$state", function($scope, $state){
	$state.transitionTo('f.home');	
}])
.controller("FCtl",["$scope","$rootScope","$window" ,"$modal","$rest","$state", function($scope,$rootScope,$window,$modal,$rest,$state){
	$scope.mdData = {username: "",password: "",};
	var signinModal = $modal({scope: $scope, template: 'tpl/t/signin', show: false});
	$scope.modal_signin = function() {signinModal.$promise.then(signinModal.show);};
	$scope.signin = function(){
		$rest.user_signin($scope.mdData, function(user){
			$rootScope.user = user;
			$window.localStorage.user = JSON.stringify(user);
			$window.localStorage.token = user.token;
			signinModal.toggle();
		});
	};
	$scope.toSignup = function(){
		$state.go("f.signup");
		signinModal.toggle();
	}
	$scope.search = function() {
		$state.go("f.search",{keyword: $scope.keyword});
	}
}])
.controller("FSigninCtl",["$scope","$rootScope","$rest","$window","$state", function($scope,$rootScope,$rest,$window,$state){
	$scope.mdData = {
		username:"",
		password:"",
		msg: "",
	};
	$scope.signin = function(){
		$rest.user_signin($scope.mdData, function(data){
			$rootScope.user = data;
			$window.localStorage.token = data.token;
			$window.localStorage.user = JSON.stringify(data);
			$state.go("f.home");
		});
	};
}])
.controller("FSignupCtl",["$scope","$rootScope","$rest","$window","$state", function($scope,$rootScope,$rest,$window,$state){
	$scope.mdData = {
		org: "钱路书院",
		email:"",
		username:"",
		password:"",
		promcode: "",
		msg: "",
	};
	$scope.signup_by_email_and_promcode = function(){
		$rest.user_signup_by_email_and_promcode($scope.mdData, function(data){
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
.controller("FSearchCtl",["$scope","$rootScope","$stateParams","$rest",function($scope,$rootScope,$stateParams,$rest){
	$rest.get_videos_by_keyword($stateParams.keyword, function(videos){ $scope.videos = videos;});
}])
.controller("FVideoCtl",["$scope","$rootScope","$stateParams","$state","$window","$rest", function($scope,$rootScope,$stateParams,$state,$window,$rest){
	if(!$rootScope.user._id){ $state.go("f.signup"); }
	$rest.get_video_by_id($stateParams.id, function(data){
		$scope.curVideo =  data;	
		$scope.curVideoList = [$scope.curVideo];
		$rest.set_visit({type:"video", _id: $stateParams.id});
	}); 
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
.controller("BAccountCtl",["$scope","$rootScope","$state","$rest", "utils", function($scope,$rootScope,$state,$rest,utils){
	$rest.get_pays(function(pays){$scope.pays = pays});
	$scope.del_pay = function(pay){
		$rest.del_pay_by_id(pay._id, function(){
			utils.delFromSet($scope.pays, pay._id);
		});
	};
}])
.controller("BProfileCtl",["$scope","$rootScope","$rest", function($scope,$rootScope,$rest){
	$scope.doSubmit = function(){
		$rest.set_user_profile($rootScope.user.profile, function(data){
			console.log(data);
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
}])
.controller("BDataFinanceCtl",["$scope","$rootScope","$state", "$rest", function($scope,$rootScope,$state,$rest){
	$rest.get_pays(function(data){
		$scope.pays = data;
	})

	$scope.pay_edit = function(item){
		$scope.pay = item;
	}
	$scope.pay_setfee = function(){
		$scope.pay.fee_origin = +$scope.pay.fee_origin || 0;
		$scope.pay.fee_back = +$scope.pay.fee_back || 0;
		$scope.pay.fee_actual = $scope.pay.fee_origin - $scope.pay.fee_back;
		if($scope.pay.fee_actual == 0){$scope.pay.status = "finished";}
		$rest.set_fee($scope.pay);
	}
}])
.controller("BDataUserCtl",["$scope","$rootScope","$state", "$rest", function($scope,$rootScope,$state,$rest){
	$rest.get_users(function(data){
		$scope.users = data;
	});
	$scope.user_edit = function(item){
		$scope.cur = item;
	}
	$scope.user_setrole = function(){
		var idx = _.indexOf($scope.cur.roles, $scope.user_role);
		if(idx == -1){
			$scope.cur.roles.push($scope.user_role);
		}else{
			$scope.cur.roles.splice(idx,1);
		}
		$rest.set_user_roles($scope.cur);
	}
}])
.controller("BDataVipCtl",["$scope","$rootScope","$state", "$rest", function($scope,$rootScope,$state,$rest){
	$rest.get_vips(function(data){
		$scope.vips = data;
	});
	$scope.vip_new = function(){
		$scope.vip = {title:"", subtitle:"", description:"", span:0, fee_now: 0, fee_origin:0,priority:50};
	}
	$scope.vip_edit = function(item){
		$scope.vip = item;
	}
	$scope.vip_del = function(item){
		$rest.del_vip_by_id(item._id, function(result){
			var idx = _.findIndex($scope.vips, function(it){return it._id == item._id}); 
			$scope.vips.splice(idx,1);
		});
	}
	$scope.vip_save = function(){
		$rest.set_vip($scope.vip, function(result){
			var idx = _.findIndex($scope.vips, function(it){return it._id == result._id}); 
			if(idx > -1){
				$scope.vips.splice(idx,1,result);
			}else{
				$scope.vips.unshift(result);
			}
			$scope.vip_new();
		});
	}
}])
.controller("BDataEcouponCtl",["$scope","$rootScope","$state", "$rest", function($scope,$rootScope,$state,$rest){
	$scope.ecoupon_types = ["vip"]; //promotion
	$scope.ecoupon_type = "";
	$scope.ecoupon_fors = []; 
	$scope.ecoupon_for_idx = -1;
	
	$scope.$watch("ecoupon_type", function(newVal){
		if(newVal == "vip"){
			$rest.get_vips(function(data){$scope.ecoupon_fors = data;});
		}
	});

	$scope.ecoupon_new = function(){
		$scope.ecoupon = {gcode : "",fee_back: 0,username:"",deadline:Date.now()};
		$scope.ecoupon_type = "";
		$scope.ecoupon_for_idx = -1;
	}
	$scope.ecoupon_edit = function(item){
		$scope.ecoupon = item;
		$scope.ecoupon_type = item.type;
		$scope.ecoupon_for_idx = -1;
	}
	$scope.ecoupon_del = function(item){
		$rest.del_gcode(item, function(result){
			var idx = _.findIndex($scope.ecoupons, function(it){return it._id == item._id}); 
			$scope.ecoupon_gcodes.splice(idx,1);
		});
	}
	$scope.ecoupon_save = function(){
		$scope.ecoupon.type = $scope.ecoupon_type;
		$scope.ecoupon.node_id = $scope.ecoupon_fors[$scope.ecoupon_for_idx]._id;
		$scope.ecoupon.title = $scope.ecoupon_fors[$scope.ecoupon_for_idx].title + " 折扣码";
		$rest.set_ecoupon($scope.ecoupon, function(result){
			var idx = _.findIndex($scope.ecoupons, function(it){return it._id == result._id}); 
			if(idx > -1){
				$scope.ecoupons.splice(idx,1,result);
			}else{
				$scope.ecoupons.unshift(result);
			}
			$scope.ecoupon_new();
		});
	}
}])
.controller("BSiteCtl",["$scope","$rootScope","$window", function($scope,$rootScope,$window){
}])
.controller("BSiteCatCtl",["$scope","$rootScope","$window","$rest", "$aside", "utils", function($scope,$rootScope,$window,$rest, $aside, utils){
	$scope.activeTab = 0;


	var catAside = $aside({scope: $scope, template: 'tpl/a/cat', show: false});
	$rest.get_cats(function(data){
		$scope.cats = data;
	});
	$scope.edit_cat = function(item){
		$scope.cat = item || { type: "video", key: "", face: "", title: "", description: ""};
		catAside.$promise.then(function() {catAside.show();});
	}
	$scope.set_cat = function(){
		$rest.set_cat($scope.cat, function(obj){
			utils.applyToSet($scope.cats, obj);
			catAside.hide();
		});
	}
	$scope.del_cat = function(item){
		$rest.del_cat_by_id(item._id, function(){
			utils.delFromSet($scope.cats, item._id);
		}); 
	}
}])
.controller("BSiteVideoCtl",["$scope","$rootScope","$window","$rest", "$aside", "utils", function($scope,$rootScope,$window,$rest, $aside, utils){
	var videoAside = $aside({scope: $scope, template: 'tpl/a/video', show: false});
	$scope.cat = "";
	$rest.get_cats_by_type("video", function(data){
		$scope.videocats = data;
	});
	$scope.$watch("cat", function(newVal){
		if(newVal){
			$rest.get_videos_by_catid(newVal, function(data){ $scope.videos = data; });
		}else{
			$rest.get_videos(function(data){ $scope.videos = data; });
		}
	});

	$scope.edit_video = function(item){
		item = item || { cats: [$scope.cat], key: "", face: "", title: "", description: ""};
		if(item.cats.length == 0){return;}
		$scope.video = item;
		videoAside.$promise.then(function() {videoAside.show();});
	}
	$scope.set_video = function(){
		if(!_.contains($scope.video.cats, $scope.cat)){ $scope.video.cats.push($scope.cat); }
		console.log($scope.video);
		$rest.set_video($scope.video, function(obj){
			console.log(obj);
			utils.applyToSet($scope.videos, obj);
			videoAside.hide();
		});
	}
	$scope.del_video = function(item){
		$rest.del_video_by_id(item._id, function(){
			utils.delFromSet($scope.videos, item._id);
		}); 
	}
}])
.controller("BSiteArticleCtl",["$scope","$rootScope","$window","$rest", "$aside", "utils", function($scope,$rootScope,$window,$rest, $aside, utils){
	$scope.cat = "";
	$rest.get_cats_by_type("article", function(data){
		$scope.articlecats = data;
	});
	$scope.$watch("cat", function(newVal){
		if(newVal){
			$rest.get_articles_by_catid(newVal, function(data){ $scope.articles = data; });
		}else{
			$rest.get_articles(function(data){ $scope.articles = data; });
		}
		$scope.isEdit = false;
	});

	$scope.edit_article = function(item){
		item = item || { cats: [$scope.cat], key: "", face: "", title: "", content: ""};
		if(item.cats && item.cats.length == 0){return;}
		$scope.article = item;
		$scope.isEdit = true;
	}
	$scope.set_article = function(){
		if(!_.contains($scope.article.cats, $scope.cat)){ $scope.article.cats.push($scope.cat); }
		$rest.set_article($scope.article, function(obj){
			utils.applyToSet($scope.articles, obj);
			$scope.isEdit = false;
		});
	}
	$scope.del_article = function(item){
		$rest.del_article_by_id(item._id, function(){
			utils.delFromSet($scope.articles, item._id);
		}); 
	}
}])
.run(['$rootScope', '$location', '$modal', '$window','$state', '$rest', function ($rootScope, $location, $modal, $window, $state, $rest) {
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
	$rootScope.is_admin = function(user){
		return user && _.contains(user.roles, "管理员");
	}
	$rootScope.user.is_vip = $rootScope.user && _.contains($rootScope.user.roles, "VIP");

	$rest.get_vips(function(data){$rootScope.vips = data;});
	var vipModal = $modal({scope: $rootScope, template: 'tpl/t/vip', show: false});
	$rootScope.modal_vip = function() {vipModal.$promise.then(vipModal.show);};
	$rootScope.pay_vip = function(vip){
		$rest.pay_vip(vip, function(){
			vipModal.toggle();
			$state.go("b.account");
		});
	};
	$rootScope.keyword = "";
}]);