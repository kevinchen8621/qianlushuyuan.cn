'use strict';

mo.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
	$urlRouterProvider.otherwise("/");
	$stateProvider
		.state("f", {abstract: true, templateUrl: 'tpl/f/layout', controller:"FCtl"})
		.state("f.home", {url:'/',  templateUrl: 'tpl/f/home', controller:"FHomeCtl"})
		.state("f.cat", {url:'/cat/:id', templateUrl: 'tpl/f/cat',controller:'FCatCtl'})
		.state("f.video", {url:'/video/:id', templateUrl: 'tpl/f/video',controller:'FVideoCtl'})
		.state("s", {abstract:true, url:'/s',  templateUrl: 'tpl/s/layout', controller:"SignCtl"})
		.state("s.signin", {url:'/signin',  templateUrl: 'tpl/s/signin', controller:"SignCtl"})
		.state("s.signup", {url:'/signup',  templateUrl: 'tpl/s/signup', controller:"SignCtl"})
		.state("s.forgot", {url:'/forgot',  templateUrl: 'tpl/s/forgot', controller:"SignCtl"})
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
		.state("b.data.promotion", {url:'/promotion',  templateUrl: 'tpl/b/data.promotion', controller:"BDataCtl"})
		.state("b.site", {abstract:true, url:'/site',  templateUrl: 'tpl/b/site', controller:"BSiteCtl"})
		.state("b.site.home", {url:'/home',  templateUrl: 'tpl/b/site.home', controller:"BSiteCtl"})
		.state("b.site.cat", {url:'/cat',  templateUrl: 'tpl/b/site.cat', controller:"BSiteCtl"})
		.state("b.site.video", {url:'/video',  templateUrl: 'tpl/b/site.video', controller:"BSiteCtl"})
		.state("b.site.d3", {url:'/d3',  templateUrl: 'tpl/b/site.d3', controller:"BSiteCtl"})
	$httpProvider.interceptors.push('authInterceptor');
}])
.controller("AppCtl",["$scope", "$state", function($scope, $state){
	$state.transitionTo('f.home');	
}])
.controller("FCtl",["$scope","$rootScope","$http","$window", function($scope,$rootScope,$http,$window){
}])
.controller("FHomeCtl",["$scope","$rootScope","$http","$window","$timeout", function($scope,$rootScope,$http,$window,$timeout){
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
						console.log("here");
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
.controller("FCatCtl",["$scope","$rootScope","$stateParams","$window",function($scope,$rootScope,$stateParams,$window){
	$scope.curCat =  $window._.find($rootScope.cats, function(cat){return cat.key == $stateParams.id;});
	console.log($scope.curCat);
}])
.controller("FVideoCtl",["$scope","$rootScope","$stateParams","$window","servVideo", function($scope,$rootScope,$stateParams,$window,servVideo){
	var regex = new RegExp("^\\d{2,12}$");
	if(regex.test($stateParams.id)){
		servVideo.getListByCatKey($stateParams.id, function(data){
			$scope.curVideoList = data;
			$scope.curVideo = $scope.curVideoList[0];
			servVideo.visit($scope.curVideo._id);
		});
	}else{
		servVideo.getById($stateParams.id, function(data){
			$scope.curVideo =  data;	
			$scope.curVideoList = [$scope.curVideo];
			servVideo.visit($stateParams.id);
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
.controller("BHomeCtl",["$scope","$rootScope","$state","servVideo", function($scope,$rootScope,$state,servVideo){
	$scope.myVideos = [];
	servVideo.getMyVisitList(function(err, lst){
		$scope.myVideos = lst;
	});
}])
.controller("BFaqCtl",["$scope","$rootScope","$state", function($scope,$rootScope,$state){
}])
.controller("BAccountCtl",["$scope","$rootScope","$state", function($scope,$rootScope,$state){
}])
.controller("BProfileCtl",["$scope","$rootScope","servUser", function($scope,$rootScope,servUser){
	$scope.doSubmit = function(){
		servUser.saveProfile(function(err, msg){
			$scope.msg = msg;
		});
	}
}])
.controller("BUppwdCtl",["$scope", "$rootScope","servUser", function($scope,$rootScope,servUser){
	$scope.doSubmit = function(){
		if(!$scope.oldpassword || !$scope.password){
			$scope.msg = "密码不能为空，请正确输入！";
		}else if($scope.password !== $scope.password2){
			$scope.msg = "新密码两次输入不一致，请正确输入！";
		}else{
			servUser.changePass($scope.oldpassword, $scope.password, function(err, msg){
				$scope.msg = msg;
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
.controller("BDataCtl",["$scope","$rootScope","$state", function($scope,$rootScope,$state){
}])
.controller("BSiteCtl",["$scope","$rootScope","$http","$window","servCat","servVideo", function($scope,$rootScope,$http,$window,servCat,servVideo){
	$scope.selCatType = function(t){
		$scope.curCatType = t;
		if(t == "video"){$scope.curCatTypeCaption = "视频"}
		else if(t == "article"){$scope.curCatTypeCaption = "文章"}	
	}
	$scope.selCatType('video');
	$scope.addSubCat = function(cat){
		cat = cat || {key: "", type: $scope.curCatType};
		servCat.newOne(cat, function(data){
			$scope.editCat(data);
		});
		$scope.curCatTip = cat.key ? "作为 [" + cat.title + "] 的子类" : "作为顶级分类";
	}
	$scope.editCat = function(cat){
		if(cat){
			$scope.curCat = cat;
			servVideo.getListByCatKey(cat.key, function(data){
				$scope.curVideoList = data;
			});
		}else{
			servVideo.getListByCatKey("", function(data){
				console.log(data);
				$scope.curVideoList = data;
			});			
		}
		$scope.newVideo();
	}
	$scope.saveCat = function(){
		servCat.save($scope.curCat, function(err, msg){
			$scope.msg = msg;
		});
	}
	$scope.delCat = function(){
		servCat.del($scope.curCat, function(err, msg){
			$scope.msg = msg;
		});
		$scope.addSubCat();
	}
	$scope.newVideo = function(){
		servVideo.newOne(function(data){
			$scope.editVideo(data);
		});
	}
	$scope.editVideo = function(video){
		$scope.curVideo = video;
	}
	$scope.saveVideo = function(){
		servVideo.save($scope.curVideo, function(err, msg){
			$scope.msg = msg;
		});
	}
	$scope.delVideo = function(){
		servVideo.del($scope.curVideo, function(err, msg){
			$scope.msg = msg;
		});
	}
	$scope.addVideoCat = function(key){
		$scope.curVideo.cats.splice(0,0,key);
		$scope.saveVideo();
	}
	$scope.delVideoCat = function(key){
		var idx = $window._.findIndex($scope.curVideo.cats, key);
		if(idx > -1){
			$scope.curVideo.cats.splice(idx,1);	
		}
		$scope.saveVideo();
	}

	$scope.addSubCat();
	$scope.editCat();
}])
.controller("SignCtl", function($scope,$rootScope,$modalInstance,$state,servUser,servSms){
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
		servSms.verify($scope.mdData, function(left){$scope.smsCaption = left <= 0 ? "发送验证码" : left + " 秒后再次发送";});
	};
	$scope.signin = function(){
		servUser.signin($scope.mdData, function(msg){$modalInstance.close();});
	};
	$scope.signup_simple = function(){
		servUser.signup_simple($scope.mdData, function(user){$modalInstance.close();});
	};
	$scope.signup_by_mobile = function(){
		servUser.signup_by_mobile($scope.mdData, function(user){$modalInstance.close();});
	};
	$scope.signup_by_email = function(){
		servUser.signup_by_email($scope.mdData, function(user){$modalInstance.close();});
	};
})
.run(['$rootScope', '$location', '$modal', 'servUser', 'servSite', 'constants', function ($rootScope, $location, $modal, servUser,servSite,constants) {
	console.log("here");
	servUser.init();
	servSite.init();
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		$rootScope.toState = toState;
		$rootScope.toParams = toParams;
		$rootScope.fromState = fromState;
		$rootScope.fromParams = fromParams;
		$rootScope.bodycss = $rootScope.toState.name.substr(0,2) == 's.' ? "login-layout" : "";
	});

	$rootScope.sign = function(type){
		var modalInstance = $modal.open({
			templateUrl: "modal/"+type+".html",
			controller: "SignCtl",
			size: null,
		});
		modalInstance.result.then(function(){

		})
	};

	$rootScope.toggleModal = function(key){
		$rootScope.mdData.msg = "";
		$rootScope.mdData.show = key;
		console.log($rootScope.mdData);
	}

	$rootScope.sendSignSms = function(){
		servUser.sendSignSms($rootScope.mdData, function(err, left){
			$rootScope.mdData.smsCaption = left <= 0 ? "发送验证码" : left + " 秒后再次发送";
		});
	};
	$rootScope.doSignup = function(){
		servUser.signUp($rootScope.mdData, function(err, msg){
			$scope.msg = msg;
			if(!msg){
				$rootScope.mdData.show = "";
				$state.go("b.home");
				$rootScope.toggleModal("");
			}
		});
	};
	$rootScope.doSignin = function(){
		servUser.signIn($rootScope.mdData, function(err, msg){
			$scope.msg = msg;
			if(!msg){
				$rootScope.mdData.show = "";
				$state.go("b.home");
				$rootScope.toggleModal("");
			}
		});
	}
	$rootScope.doForgotByEmail = function(){
		servUser.forgot($rootScope.mdData, function(err, msg){
			$scope.msg = msg;
			if(!msg){
				$rootScope.mdData.show = "";
				$state.go("b.home");
				$rootScope.toggleModal("");
			}
		});
	}

}]);