mo.controller("AppCtl",["$scope", "$state", function($scope, $state){
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
						var newIndex = (currentIndex + 1) % $rootScope.slides.length;
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
.controller("SignCtl",["$scope","$rootScope","$window","$state","servUser", function($scope,$rootScope,$window,$state,servUser){
	if($rootScope.user){$state.go("b.home");}
	$scope._id="";
	$scope.username="";
	$scope.password="";
	$scope.sms="";
	$scope.smsCaption="发送验证码";
	$scope.smsDisable = false;
	$scope.interval = 60;
	$scope.rememberme = false;

	$scope.sendSms = function(){
		servUser.sendSignSms($scope._id, "钱路书院", 60, function(err, left){
			$scope.smsCaption = left <= 0 ? "发送验证码" : left + " 秒后再次发送";
		});
	};
	$scope.signup = function(){
		var data = {_id:$scope._id, username:$scope.username, sms:$scope.sms, password:$scope.password};
		servUser.signUp(data, function(err, msg){
			$scope.msg = msg;
			if(!msg){
				$state.go("b.home");
			}
		});
	};
	$scope.signin = function(){
		servUser.signIn($scope.username, $scope.password, $scope.rememberme, function(err, msg){
			$scope.msg = msg;
			if(!msg){
				$state.go("b.home");
			}
		});
	}
	$scope.forget = function(){
		servUser.forgot($scope.username, $scope.password, $scope.sms, function(err, msg){
			$scope.msg = msg;
			if(!msg){
				$state.go("b.home");
			}
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
;