function change_audio(_target,_src,_loop,_autoplay){
	_target.src = _src;
	if(_loop)
		_target.loop = _loop;
	else
		_target.loop = "loop";
	if(_autoplay)
		_target.autoplay = _autoplay;
	else
		_target.autoplay = "autoplay";
}
function winWH(){
	var wHeight = 0;
	var wWidth = 0;
	if(window.innerHeight){
		wWidth = window.innerWidth;
		wHeight = window.innerHeight;
	}else if ((document.body) && (document.body.clientHeight)){
		wWidth = document.body.clientWidth;
		wHeight = document.body.clientHeight;
	}
	if(document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
		wWidth = document.documentElement.clientWidth;
		wHeight = document.	documentElement.clientHeight;
	}
	if(wWidth>wHeight){
		return true;
	}else{
		return false;
	}
}
function WinWidth(){
	var wWidth = 0;
	if(window.innerWidth) wWidth = window.innerWidth;
	else if ((document.body) && (document.body.clientWidth)) wWidth = document.body.clientWidth;
	if(document.documentElement && document.documentElement.clientWidth && document.documentElement.clientWidth) wWidth = document.documentElement.clientWidth;
	return wWidth;
}
function WinHeight(){
	var wHeight = 0;
	if(window.innerHeight) wHeight = window.innerHeight;
	else if ((document.body) && (document.body.clientHeight)) wHeight = document.body.clientHeight;
	if(document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) wHeight = document.documentElement.clientHeight;
	return wHeight;
}
function scaleTarget(_tobj,_defaultW,_defaultH,_winW,_winH,_type){
	var defaultW = _defaultW;
	var defaultH = _defaultH;
	var showW;
	var showH;
	var percent;
	if(_type=="in"){
		if(_winW/_winH>defaultW/defaultH){
			showH = _winH;
			showW = showH/defaultH*defaultW;
		}else{
			showW = _winW;
			showH = showW/defaultW*defaultH;
		}
	}else{
		if(_winW/_winH>defaultW/defaultH){
			showW = _winW;
			showH = showW/defaultW*defaultH;
		}else{
			showH = _winH;
			showW = showH/defaultH*defaultW;
		}
	} 
	percent = showW/defaultW;
	_tobj.target.style.top = _tobj.top*percent - (showH-_winH)/2 + "px";
	_tobj.target.style.left = _tobj.left*percent - (showW-_winW)/2 + "px";
	_tobj.target.style.width = _tobj.width*percent/_winW*100 + "%";
	_tobj.target.style.height = _tobj.height*percent/_winH*100 + "%";
}
/**
 * [isMobile 判断平台]
 * @param test: 0:iPhone    1:Android
 */
function ismobile(test){
    var u = navigator.userAgent, app = navigator.appVersion;
    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
     if(window.location.href.indexOf("?mobile")<0){
      try{
       if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
        return '0';
       }else{
        return '1';
       }
      }catch(e){}
     }
    }else if( u.indexOf('iPad') > -1){
        return '0';
    }else{
        return '1';
    }
};
/**
 * 判断是否微信平台
 */
function is_weixn(){  
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
        return true;  
    } else {  
        return false;  
    }  
}
 