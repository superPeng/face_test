;(function() {
  var boc_id="H5标识";
  var hrefUrl = window.location.href;
  $.ajax({
    url: "http://wx.bocweb.cn/boc_data/index.php/getwxsdk",
    type: "post",
    data: { pageUrl: hrefUrl,boc_id:boc_id },
    dataType: 'json',
    success: function success(data) {
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'chooseImage','uploadImage','startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice']
        // 所有要调用的 API 都要加到这个列表中
      });
    }
  });

  function wxShare(dataForWeixin){
    wx.ready(function() {
      // 2. 分享接口
      // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
      wx.onMenuShareAppMessage({
        title: dataForWeixin.title,
        desc: dataForWeixin.desc,
        link: dataForWeixin.linkurl,
        imgUrl: dataForWeixin.img,
        trigger: function trigger(res) {},
        success: function success(res) {
          //alert('已分享');
           $.post('http://wx.bocweb.cn/boc_data/index.php/getwxsdk/share/',{boc_id:boc_id},function(){},'json');
          dataForWeixin.success && dataForWeixin.success();
        },
        cancel: function cancel(res) {
          //alert('已取消');
          dataForWeixin.cancel &&   dataForWeixin.cancel();
        },
        fail: function fail(res) {
          //alert(JSON.stringify(res));
          dataForWeixin.fail && dataForWeixin.fail();
        }
      });

      // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
      wx.onMenuShareTimeline({
        title: dataForWeixin.title,
        link: dataForWeixin.linkurl,
        imgUrl: dataForWeixin.img,
        trigger: function trigger(res) {
          // alert('用户点击分享到朋友圈');
        },
        success: function success(res) {
          //alert('已分享');
           $.post('http://wx.bocweb.cn/boc_data/index.php/getwxsdk/share/',{boc_id:boc_id},function(){},'json');
          dataForWeixin.success && dataForWeixin.success();
          
        },
        cancel: function cancel(res) {
          //alert('已取消');
          dataForWeixin.cancel &&   dataForWeixin.cancel();
        },
        fail: function fail(res) {
          //alert(JSON.stringify(res));
          dataForWeixin.fail && dataForWeixin.fail();
        }
      });

      wx.onMenuShareQQ({
        title: dataForWeixin.title,
        desc: dataForWeixin.desc,
        link: dataForWeixin.linkurl,
        imgUrl: dataForWeixin.img,
        trigger: function trigger(res) {
          //alert('用户点击分享到QQ');
        },
        complete: function complete(res) {
          //alert(JSON.stringify(res));
        },
        success: function success(res) {
          //alert('已分享');
          dataForWeixin.success && dataForWeixin.success();
        },
        cancel: function cancel(res) {
          //alert('已取消');
          dataForWeixin.cancel &&   dataForWeixin.cancel();
        },
        fail: function fail(res) {
          //alert(JSON.stringify(res));
          dataForWeixin.fail && dataForWeixin.fail();
        }
      });

      // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
      wx.onMenuShareWeibo({
        title: dataForWeixin.title,
        desc: dataForWeixin.desc,
        link: dataForWeixin.linkurl,
        imgUrl: dataForWeixin.img,
        trigger: function trigger(res) {
          //alert('用户点击分享到微博');
        },
        complete: function complete(res) {
          // alert(JSON.stringify(res));
        },
        success: function success(res) {
          //alert('已分享');
          dataForWeixin.success && dataForWeixin.success();
        },
        cancel: function cancel(res) {
          // alert('已取消');
          dataForWeixin.cancel &&   dataForWeixin.cancel();
        },
        fail: function fail(res) {
          // alert(JSON.stringify(res));
          dataForWeixin.fail && dataForWeixin.fail();
        }
      });
    });
  }
  (window.wxShare) || (window.wxShare = wxShare);
})();
