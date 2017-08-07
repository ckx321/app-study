/**
 * 项目公共引用文件,非plugins
 * @author ckx
 * @date 2017/08/04
 * 
 * @description 包含如下：
 * 1：appConfig  项目前端全局配置
 * 2：appUtil 项目公共util工具类
 * 3：appInit 项目公共加载完成后事件
 */


/**
 ************************************************************************************************************
 * 项目前端全局配置
 ************************************************************************************************************
 **/
var appConfig = {
	/*项目根目录*/
	ROOT : ''
	
};

/**
 ************************************************************************************************************
 * 项目js工具类
 ************************************************************************************************************
 **/
var appUtil = (function(){
	
	/**
	 *****************************
	 * 定义js工具类各种方法
	 *****************************
	 **/
	
	/*
	 * 显示用户信息HTML
	 */
	function displayLoginHtml(account, imagePath) {
		// 用户信息
		$('#loginUserInfo').empty();
		var itemHtml = new Array();
		itemHtml.push('<div id="userAccount">');
		itemHtml.push('<span id="accountImg">');
		if (imagePath != '') {
			itemHtml.push('	 <img class="headPortrait" src="' + imagePath + '">');
		}
		else {
			itemHtml.push('<svg id="svg_headimg" class="icon iconPortrait" aria-hidden="true"><use xlink:href="#icon-img_default_avatar"/></svg>');
		}
		itemHtml.push('</span>');
		itemHtml.push('<span id="accountSp">' + account + '</span>');
		if ($('#ucpage').val()) {
			itemHtml.push('<span id="UClogout">退出</span>');
		}
		else {
			itemHtml.push('<span id="logout">退出</span>');
		}
		itemHtml.push('</div>');
		$('#loginUserInfo').html(itemHtml.join(''));

		// 购物车
		$('#shopping-cart').empty();
		var cartHtml = new Array();
		cartHtml.push('<a href="/userCenter/shoppingCart" class="user_info_a">');
		cartHtml.push('  <svg class="icon iconPortrait" aria-hidden="true"><use xlink:href="#icon-ic_cart"/></svg> 购物车');
        cartHtml.push('	')
		cartHtml.push('</a>');
		$('#shopping-cart').html(cartHtml.join(''));
	}
	
	/*
	 * 显示用户登录HTML
	 */
	function displayLogoutHtml() {
		$('#shopping-cart').empty();
		$('#loginUserInfo').empty();
		var itemHtml = new Array();
		itemHtml.push('<div id="userLogin"><span id="userLoginBtn">登录</span> <span id="userRegisterBtn">注册</span></div>');
		$('#loginUserInfo').html(itemHtml.join(''));
	}
	
	/*
	 * 请求数据
	 */
	function transfer(url, type, data, successFunc, errorFunc, upload) {
		// 检查URL是否为空
		if (isEmpty(url)) {
			// 窗口对象
			var win = window.parent != window ? window.parent : window;
			// 系统错误页面
			win.location.href = APP_ROOT + '/common/error';
			return;
		}

		// 请求成功时
		var success = function(result) {
			
			// 上传文件时
			if (upload) {
				result = JSON.parse(result);
			}
			
			// 系统错误时
			if (result.state == 999) {
				// 窗口对象
				var win = window.parent != window ? window.parent : window;
				// 系统错误页面
				win.location.href = APP_ROOT + '/common/error';
				return;
			}
			
			// 正常返回时
			if (result.state == 100) {
				
				// 画面显示登录状态
				var screenIsLogin = isExist($('#userAccount')[0]);
				// 后台登录状态
				if (result.isLogin == 'true') {
					// 登录信息
					var loginInfo = result.loginInfo;
					// 账号
					var account = isEmpty(loginInfo.nickname) ? loginInfo.account : loginInfo.nickname;
					// 头像路径
					var imgPath = isEmpty(loginInfo.imagePath) ? '' : loginInfo.imagePath;
					// 显示用户信息
                    displayLoginHtml(account, imgPath);
				}
				// 后台退出状态
				else if (screenIsLogin) {
					displayLogoutHtml();
				}

				if ($.isFunction(successFunc)) {
					successFunc(result.data, result.isLogin == 'true');
				}
			}
			// 错误发生时
			else {
				if ($.isFunction(errorFunc)) {
					errorFunc(result.state, result.message);
				}
				else {
					alert(result.message);
				}
			}
		}

		// 请求失败时
		var error = function(result) {
			// 处理结束
			console.log(result);
			// 窗口对象
			var win = window.parent != window ? window.parent : window;
			// 系统错误页面
			win.location.href = APP_ROOT + '/common/error';
		}

		/*
		 * 执行处理
		 */
		if (upload) {
			$.ajax({
				url : APP_ROOT + url,
				type : type,
				cache : false,
				data : data,
				processData : false,
				contentType : false,
				success : success,
				error : error
			});
		}
		else {
			$.ajax({
				url : APP_ROOT + url,
				type : type,
				cache : false,
				data : data,
				dataType : 'json',
				contentType : "application/json;charset=utf-8",
				success : success,
				error : error
			});
		}
	}
	
	/*
	 * 判断对象是否存在
	 */
	function isExist(obj) {
		return obj != undefined;
	}
	
	/*
	 * 判断对象是否为空对象
	 */
	function isEmpty(obj) {
		return (obj == undefined || obj == null || obj == '');
	}
	
	/*
	 * 判断对象是否为数值类型
	 */
	function isNumber(obj) {
		return $.isNumeric(obj);
	}
	
	/*
	 * 判断对象是否为布尔类型
	 */
	function isBoolean(obj) {
		return Object.prototype.toString.call(obj) == '[object Boolean]';
	}
	
	/*
	 * 判断对象是否为字符串类型
	 */
	function isString(obj) {
		return Object.prototype.toString.call(obj) === "[object String]";
	}
	
	/*
	 * 判断对象是否为数组
	 */
	function isArray(obj) {
		return $.isArray(obj);
	}
	
	/*
	 * 判断对象是否存在指定属性
	 */
	function hasAttr(obj, arrtName) {
		return !(typeof ($(obj).attr(arrtName)) == 'undefined')
	}
	
	/*
	 * 全部替换
	 */
	function replaceAll(str, oStr, nStr) {
		return str.replace(new RegExp(oStr,"gm"), nStr);
	}

	/*
	 * HTML特殊符号转义
	 */
	function encodeHtml(html) {
		if (!isString(html)) {
			return '';
		}
		var result = html.toString();
		if (result.length == 0) {
			return '';
		}
		result = replaceAll(result, '&', '&gt;');
		result = replaceAll(result, '<', '&lt;');
		result = replaceAll(result, '>', '&gt;');
		result = replaceAll(result, ' ', '&nbsp;');
		result = replaceAll(result, '\'', '&#39;');
		result = replaceAll(result, '"', '&quot;');
		result = replaceAll(result, '\r\n', '<br>');
		return result;
	}
	
	/*
	 * HTML特殊符号反转
	 */
	function decodeHtml(html) {
		if (!isString(html)) {
			return '';
		}
		var result = html.toString();
		if (result.length == 0) {
			return '';
		}
		result = replaceAll(result, '&gt;', '&');
		result = replaceAll(result, '&lt;', '<');
		result = replaceAll(result, '&gt;', '>');
		result = replaceAll(result, '&nbsp;', ' ');
		result = replaceAll(result, '&#39;', '\'');
		result = replaceAll(result, '&quot;', '"');
		result = replaceAll(result, '<br>', '\r\n');
		return result;
	}

	/*
	 * Long类型日期格式化
	 */
	function dateFormat(value, format) {
		var dateStr = value.toString();
		if (dateStr.length == 12) {
			dateStr += '00';
		}
		var year = dateStr.substring(0, 4);
		var month = parseInt(dateStr.substring(4, 6), 10) - 1;
		var day = dateStr.substring(6, 8);
		var hour = dateStr.substring(8, 10);
		var min = dateStr.substring(10, 12);
		var sec = dateStr.substring(12, 14);
		var date = new Date(year, month, day, hour, min, sec);
		return date.format(format);
	}

	/*
	 * JSON转URL参数
	 */
	function json2Url(data, key) {
		var urlParam = "";
		if (isString(data) || isNumber(data) || isBoolean(data)) {
			urlParam += "&" + key + "=" + encodeURIComponent(data);
		}
		else {
			var k;
			$.each(data, function(i) {
				k = key == null ? i : key + (isArray(data) ? "[" + i + "]" : "." + i);
				urlParam += '&' + json2Url(this, k);
			});
		}
		return urlParam.substr(1);
	}

	/*
	 * URL参数转JSON
	 */
	function url2Json(url) {
		var json = {};
		var index = url.indexOf('?');
		if (index != -1) {
			var paramStr = url.substring(index + 1);
			var params = paramStr.split('&');
			var param;
			for (var i = 0; i < params.length; i++) {
				param = params[i].split('=');
				json[param[0]] = param[1];
			}
		}
		else {
			json = {};
		}
		return json;
	}

	/*
	 * 替换文本内所有指定内容
	 */
	function textReplaceAll(text, oldChar, newChar) {
	    return text.replace(new RegExp(oldChar, "g"), newChar);
	}
	
	/*
	 * 根据指定长度进行文本缩略显示
	 */
	function textEllipsis(text, length) {
		var result = '';
		if (!isEmpty(text)) {
			if (!isExist(length)) {
				length = 150;
			}
			result = text.length > length ? text.substring(0, length) + '...' : text;
		}
	    return result;
	}
	
	/*
	 * 显示关键词高亮
	 */
	function displayHighlight(keyword) {
		var keywords = keyword.trim().split(' ');
		for (var i = 0; i < keywords.length; i++) {
			if (keywords[i].length > 0) {
				$("#content_main").highlight(keywords[i]);
			}
		}
		$("#content_main").find('.highlight').addClass('on');
	}
	
	/*
	 * 隐藏关键词高亮
	 */
	function removeHighlight() {
		$("#content_main").find('.highlight').removeClass('on');
	}

	/*
	 * 显示等待画面
	 */
	function displayWaitScreen() {
		$('#animate').show();
		$('#masking').show();
    }
	
    /*
	 * 隐藏等待画面
	 */
    function hideWaitScreen() {
    	$('#animate').hide();
    	$('#masking').hide();
    }

	/*
	 * 设定链接HREF
	 */
	 function setLinkHref(selector, baseUrl, dataAttrs, param) {
		var href;
		if (isString(selector)) {
			$(selector).each(function() {
				href = APP_ROOT + baseUrl;
				if (isArray(dataAttrs)) {
					for (var i = 0; i < dataAttrs.length; i++) {
						href += '/' + $(this).data(dataAttrs[i]);
					}
				}
				if (!isEmpty(param)) {
					href += '?' + param;
				}
				$(this).attr('href', href);
			});
		}
		else {
			href = APP_ROOT + baseUrl;
			if (isArray(dataAttrs)) {
				for (var i = 0; i < dataAttrs.length; i++) {
					href += '/' + $(this).data(dataAttrs[i]);
				}
			}
			if (!isEmpty(param)) {
				href += '?' + param;
			}
			$(selector).attr('href', href);
		}
	}
	 
	/*
	 * 发送验证码
	 */
	function sendCaptcha(btnId, url, data) {
		
		// 获取验证码失败回调
		var errorFunc = function(state, message) {
			// 显示错误提示信息
			alert(message);
			// 取消发送按钮只读
			$('#' + btnId).attr('disabled', false);
		}
		
		// 发送验证码按钮对象
		var $obj = $('#' + btnId);
		// 发送按钮只读
		$obj.attr('disabled', true);
		// 显示重新发送计时
		$obj.text(SEND_CAPTCHA_INTERVAL + 's');
		// 发送验证码间隔
		var sendCaptchaInterval = SEND_CAPTCHA_INTERVAL;
		// 重新发送倒计时
		var interval = window.setInterval(function() {
			if (sendCaptchaInterval == 0) {
				// 清除计时器
				window.clearInterval(interval);
				// 取消发送按钮只读
				$obj.attr('disabled', false);
				// 显示重新获取
				$obj.text('重新获取');
			}
			else {
				// 间隔递减
				sendCaptchaInterval--;
				// 显示剩余时间
				$obj.text(sendCaptchaInterval + 's');
			}
		}, 1000);
		// 发送验证码
		transfer(url, 'post', JSON.stringify(data), null, errorFunc, false);
	}

    /**
     * 获取一个字符串值在指定字符串第n次出现的位置
     * @param str 字符串
     * @param cha 要查找的字符串值
     * @param num 要查找第几个该字符串值
     * @returns {*|Number|number}
     */
    function findIndex(str,cha,num){
        var x=str.indexOf(cha);
        for(var i=0;i<num;i++){
            x=str.indexOf(cha,x+1);
        }
        return x;
    }

  	/*
	 * 格式化金额 优化负数格式化问题 @param s 数字 @param n 保留位数
	 */
	function fmoney(s, n) {
		n = n > 0 && n <= 20 ? n : 2;
		f = s < 0 ? "-" : ""; // 判断是否为负数
		s = parseFloat((Math.abs(s) + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";// 取绝对值处理, 更改这里n数也可确定要保留的小数位
		var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
		t = "";
		for (i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		}
		return f + t.split("").reverse().join("") + "." + r.substring(0, 2);// 保留2位小数 如果要改动 把substring 最后一位数改动就可
	}
	
	/*
	 * iframe 高度自适应
	 * 参数：iframe：iframe对象。如：setIframeHeight(window.parent.document.getElementById("iframeMain"));。在子页面设置iframe高度
	 */
	function setIframeHeight(iframe) {
		if (iframe) {
			$(iframe).attr('height', 0);
			var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
			if (iframeWin.document.body) {
				// 底部也可增加空间,消除可能有的padding和margin
				iframe.height = (iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight);
				$(iframe).parents('.frame-con').css('height', iframe.height);
			}
		}
	}
	
	/*
	 * 1:法规 2:案例 3:专栏 4:资讯 7:图书 8:文章 9:范本 10:刊物
	 */
	function getModuleType() {
		var type;
		// 法规
		if (module.indexOf('law') == 0) {
			type = 1;
		}
		// 案例
		else if (module.indexOf('cases') == 0) {
			type = 2;
		}
		// 专栏
		else if (module.indexOf('columns') == 0) {
			type = 3;
		}
		// 资讯
		else if (module.indexOf('material') == 0) {
			type = 4;
		}
		// 集刊
		else if (module.indexOf('collected') == 0) {
			type = 5;
		}
		// 系列
		else if (module.indexOf('series') == 0) {
			type = 6;
		}
		// 图书
		else if (module.indexOf('book') == 0) {
			type = 7;
		}
		// 文章
		else if (module.indexOf('article') == 0) {
			type = 8;
		}
		// 范本
		else if (module.indexOf('fanben') == 0) {
			type = 9;
		}
		// 刊物
		else if (module.indexOf('journal') == 0) {
			type = 10;
		}
		return type;
	}
	/**
	 * 全选事件
	 * 
	 * @param e 被选中的name
	 * @param f 全选的 id
	 */
	function checkAllBox(e, f) {
		var d = document.getElementById(f);
		var a = document.getElementsByName("" + e);

		if (d.checked) {
			for (var b = 0; b < a.length; b++) {
				a[b].checked = true;
			}
		}else {
			for (var b = 0; b < a.length; b++) {
				a[b].checked = false;
			}
		}
	}
	/*
	 * 判断对象是否为json对象
	 */
	function isJson(obj) {
		var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]"
				&& !obj.length;
		return isjson;
	}
	/*
	 * 详情页标签点击链接HREF dataAttrs
	 */
	function setLinkHrefDetail(selector, baseUrl, dataAttrs, param) {
		var href;
		$(selector).each(function() {
			href = APP_ROOT + baseUrl;
			if (isArray(dataAttrs)) {
				for (var i = 0; i < dataAttrs.length; i++) {
					href += '/' + $(this).data(dataAttrs[i]);
				}
			}
			if (!isEmpty(param)) {
				var params = param;
				if (isJson(param) && !isEmpty(dataAttrs)) {
					param.k = $(this).data(dataAttrs);
					param.co = 'k'
					params = json2Url(param);
				}
				href += '?' + params;
			}
			$(this).attr('href', href);
		});
	}

	/**
	 * 检查是否全选
	 * 
	 * @param a 的name
	 * @param b 被检查的class
	 * @param c 容器id
	 */
	function checkThisBox(a, b, c) {
		// checkThisCol
		var total = $(c + ' input[name="' + a + '"]').length;
		var check = $(c + ' input[name="' + a + '"]:checked').length;
		if (total == check) {
			$(b).prop('checked', true);
		}
		else {
			$(b).prop('checked', false);
		}
	}
	
	/******图片懒加载******
	 * 
	 * */
	function imgLazyLoad(){
		//懒加载图片集
		var _imgs = $(document).find('img[data-src]');
		$.each(_imgs,function(index,item){
			var $this = $(this);
			//获取图片链接
			var imgSrc = $this.attr('data-src');
			//设置图片链接,显示图片。class类vib_hide：visibility: hidden;
			$(this).attr('src',imgSrc).removeClass('vib_hide');
		});
	};
	
	/******表单数据提交取值******
	 * @param form 表单dom
 	 * 提交表单时，循环取表单输入框值
 	 * 取出form表单各项值,组成一个对象
 	 * 缺点:不能取出file文件或图片
 	 */
	function getFormData(form) {
		var paramsStr = form.serialize(), data = {};
		var _ary = paramsStr.split("&");
		for ( var i in _ary) {
			var _item = _ary[i];
			if (_item) {
				var __ary = _item.split("=");
				if (__ary.length > 1 && __ary[1] != '') {
					data[__ary[0]] = decodeURIComponent(__ary[1],true);
				}
			}
		}
		return data;
	};

	/******获取指定前几天的日期******
	 * 
	 */
	 function getBeforeDate(n){
	     var n = n;
	     var d = new Date();
	     var year = d.getFullYear();
	     var mon=d.getMonth()+1;
	     var day=d.getDate();
	     if(day <= n){
	             if(mon>1) {
	                mon=mon-1;
	             }
	            else {
	              year = year-1;
	              mon = 12;
	              }
	            }
	           d.setDate(d.getDate()-n);
	           year = d.getFullYear();
	           mon=d.getMonth()+1;
	           day=d.getDate();
	      s = year+"/"+(mon<10?('0'+mon):mon)+"/"+(day<10?('0'+day):day);
	      return s;
	 };
	
	/******图片上传预览功能****** 
	 * 参数：fileid:图片选择按钮id，如：fileBtn。imgid：显示图片img的id,如：imgShow
	 * */
	function setImagePreview(fileid,imgid) {
		var docObj=document.getElementById(fileid);
		var imgObjPreview=document.getElementById(imgid);
		if(docObj.files &&docObj.files[0])
		{
			//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式 
			imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
		}
		else
		{
			/* //IE下，使用滤镜 */
			fileid.select();
			var imgSrc = document.selection.createRange().text;
			var localImagId = document.getElementById(imgid);
			//图片异常的捕捉，防止用户修改后缀来伪造图片 
			try{
				localImagId.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
				localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
			}
			catch(e)
			{
				alert("您上传的图片格式不正确，请重新选择!");
				return false;
			}
			//imgObjPreview.style.display = 'none';
			document.selection.empty();
		}
		return true;
	};
	
	/******获取图片名后缀******
	 * 参数：inputFile：文件按钮对象
	 * */
	function getImgAttr(inputFile){
		var reg = /[^\\\/]*[\\\/]+/g; 
		var name = $(inputFile).val().replace(reg, '');
		var postfix = /\.[^\.]+/.exec(name);
		var imgAttr =  postfix[0]; 
		return imgAttr;
	};
	
	/**
	 * 图片转base64格式
	 * 
	 * @param inputFile 文件按钮对象
	 * @param callBack 回调函数
	 * @param imgSize {json object}设置图片大小
	 * @return 回掉函数  。回掉函数参数：图片base64数据
	 * */
	  function imgToBase64(input_file,callBack,imgSize) {  
		/*默认图片大小*/
	 	var defaultImgSize = {
	 		width:840,
	 		height:600
	 	};
	 	
	 	var ImgSizeOpts = defaultImgSize;
	 	if(imgSize){
	 		ImgSizeOpts = $.extend({},defaultImgSize,imgSize);
	 	}
 		
	 	if(input_file.files &&input_file.files[0]){
	 		if (typeof (FileReader) === 'undefined') {  
		        alert("抱歉，你的浏览器不支持 FileReader，不能将图片转换为Base64，请使用现代浏览器操作！");  
		    } else {  
		        try {  
		            /*图片转Base64 核心代码*/  
		            var file = input_file.files[0];  
		            //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件  
		            if (!/image\/\w+/.test(file.type)) {  
		                alert("请确保文件为图像类型");  
		                return false;  
		            } 
		            var fileSize = file.size;
		            if(fileSize>(1000*5300)){
		            	layer.msg('图片不能大于5M');
		            	return false;
		            }
		            //压缩图片并执行回掉函数
		            compressImg(input_file,ImgSizeOpts,function(base64){
		            	callBack(base64);
		            });
	
		            return true;
		        } catch (e) {  
		            alert('图片转Base64出错啦！' + e.toString())  
		        }  
		    } 
	 	}else{
	 		return false; 
	 	}
	     
	};

	/******图片压缩******
	 * @param input_file:文件
	 * @param imgSize : 设置的图片大小
	 * @param callBack : 回掉函数
	 * 
	 * */
	function compressImg(input_file,imgSize, callBack) {
				
	            var file = input_file.files[0];  
	            var reader = new FileReader(); 
	
	            reader.readAsDataURL(file); 
	            var width1 = imgSize.width;
	            var height1 = imgSize.height;
	            
	            reader.onload = function (e) {  
	            var image = $('<img/>'); 
	            image.attr('src', e.target.result); 
	            image.load(function () {  
	            var canvas = document.createElement('canvas');  
	            canvas.width = width1;  
	            canvas.height = height1;  
	            var context = canvas.getContext('2d');  
	            var img = new Image;
	            img.src = e.target.result;
	
	            var imgwidth = image.width;
	            var imgheight = image.height;
	            context.fillStyle = "rgba(255, 255, 255, 0)"; 
	            context.fillRect(0, 0, canvas.width, canvas.height); 
	            context.drawImage(img, 0, 0, width1, height1);
	            var data = canvas.toDataURL('image/png');  
	                //压缩完成执行回调  
	               callBack(data);  
	            });  
	             
	            };  
	
	            return true;
	 
	};
	
	/**
	 * 字符串截取指定字符之前的数据
	 * 
	 * @param str:字符串，
	 * @param code:指定字符 如： '/.'
	 * @return 截取后的字符串
	 * */
	function subBeforeStr(str,code){
		var tstr = str,
			tcode = code;
		if(tstr&&tstr.length>0&&tcode){
			var tindex = tstr.indexOf(tcode);
			if(tindex!=-1){
				tstr = tstr.substring(0,tindex);
			}
		}
		return tstr;
	};
	
	/******判断是不是pc端******
	 * @return boolean
	 * */
	function isPC() {
	    var userAgentInfo = navigator.userAgent;
	    var Agents = ["Android", "iPhone",
	                "SymbianOS", "Windows Phone",
	                "iPad", "iPod"];
	    var flag = true;
	    for (var v = 0; v < Agents.length; v++) {
	        if (userAgentInfo.indexOf(Agents[v]) > 0) {
	            flag = false;
	            break;
	        }
	    }
	    return flag;
	};
	
	/******a锚点跳转******
	 * @description 跳转时增加动画效果
	 * 
	 * */
	 function animateGoLink() {
		var href = $(this).attr("href");
		var pos = $(href).offset().top;
		$("html,body").animate({
					scrollTop : pos - 50
				}, 100);
		return false;
	};
	

	/******屏蔽元素，行内元素******
	 * @param dom dom元素,如：$('#abc');
	 * @description 适用于单个元素，属性为inline-block
	 * 
	 * */
	function maskAddInlineBlock(dom){
		var $dom = $(dom);
		var hasMask = $dom.parent().find('.js_maskoff_bg');
		if(!hasMask[0]){
			var divHtml = '<div class="js_maskoff_bg" style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px; background: #fff; opacity: 0.5; filter: alpha(opacity=50);"> </div>'; 
			$dom.wrap('<div style="display:inline-block;position: relative;"></div>'); 
			$dom.parent().append(divHtml); 
		}
	};
	
	/******屏蔽元素，块级元素******
	 * @param dom:jquery dom,如：$('#abc');
	 * @description 适用于单个元素，属性为block
	 * 
	 * */
	function maskAddBlock(dom){
		var $dom = $(dom);
		var hasMask = $dom.parent().find('.js_maskoff_bg');
		if(!hasMask[0]){
			var divHtml = '<div class="js_maskoff_bg" style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px; background: #fff; opacity: 0; filter: alpha(opacity=0);"> </div>'; 
			$dom.wrap('<span style="display:block;position: relative;"></span>'); 
			$dom.parent().append(divHtml); 
		}
	};
	
	/******解除屏蔽元素******
	 * @param dom:jquery dom,如：$('#abc');
	 * 
	 * */
	function maskRemove(dom){
		var $dom = $(dom);
		var hasMask = $dom.parent().find('.js_maskoff_bg');
		if(hasMask.length>0){
			hasMask.remove();
			$dom.unwrap();
		}
	};
	
	/******图片加载完成后执行事件******
	 * @param imgSrcList 图片src 数组
	 * @param callBack 所有图片加载完成后的回掉函数
	 * 
	 * */
	function imgsLoadComplate(imgSrcList,callBack){
		var _imgSrcList = imgSrcList;
		if(_imgSrcList.length>0){
			$.each(_imgSrcList,function(index,item){
				var _img = new Image();
				_img.src = item;
				_img.onload = function() { // 判断是否加载到最后一个图片
					if (index >= _imgSrcList.length - 1) {
						callBack();
						return false;
					} 
				}
				_img.onerror = function() { // 判断是否加载到最后一个图片
					if (index >= _imgSrcList.length - 1) {
						callBack();
						return false;
					}
				}
			});
		}else{
			callBack();
		}
	};
	
	/******获取窗口滚动高度******
	 * 
	 * @param {object} document 对象
	 * @return {number} 页面滚动高度
	 * */
	function getScrollTop(doc)
	{
	    var scrollTop=0;
	    if(doc.documentElement&&doc.documentElement.scrollTop)
	    {
	        scrollTop=doc.documentElement.scrollTop;
	    }
	    else if(doc.body)
	    {
	        scrollTop=doc.body.scrollTop;
	    }
	    return scrollTop;
	};
	
	/**
	 *****************************
	 * 暴露js工具类各种方法
	 *****************************
	 **/
	return {
		/**
		 * 通过GET方式请求数据
		 * 
		 * @param url URL
		 * @param successFunc 请求成功的回调函数
		 * @param errorFunc 请求失败的回调函数
		 */
		get : function(url, data, successFunc, errorFunc) {
			transfer(url, 'get', data, successFunc, errorFunc, false);
		},
		/**
		 * 通过POST方式请求数据
		 * 
		 * @param url URL
		 * @param data 数据
		 * @param successFunc 请求成功的回调函数
		 * @param errorFunc 请求失败的回调函数
		 */
		post : function(url, data, successFunc, errorFunc) {
			transfer(url, 'post', JSON.stringify(data), successFunc, errorFunc, false);
		},
		/**
		 * 通过POST方式上传文件
		 * 
		 * @param url URL
		 * @param fileObj File标签对象
		 * @param successFunc 请求成功的回调函数
		 * @param errorFunc 请求失败的回调函数
		 */
		upload : function(url, fileObj, successFunc, errorFunc) {
			var data = new FormData();
			data.append('file', fileObj.files[0]);
			transfer(url, 'post', data, successFunc, errorFunc, true);
		},
		/**
		 * 判断对象是否为存在
		 * 
		 * @param obj 对象
		 * @return true/false 对象存在/对象不存在
		 */
		isExist : isExist,
		/**
		 * 判断对象是否为空对象
		 * 
		 * @param obj 对象
		 * @return true/false 空对象/非空对象
		 */
		isEmpty : isEmpty,
		/**
		 * 判断对象是否为数值类型
		 * 
		 * @param obj 对象
		 * @return true/false 数值类型/非数值类型
		 */
		isNumber : isNumber,
		/**
		 * 判断对象是否为布尔类型
		 * 
		 * @param obj 对象
		 * @return true/false 布尔类型/非布尔类型
		 */
		isBoolean : isBoolean,
		/**
		 * 判断对象是否为字符串类型
		 * 
		 * @param obj 对象
		 * @return true/false 字符串类型/非字符串类型
		 */
		isString : isString,
		/**
		 * 判断对象是否为字数组类型
		 * 
		 * @param obj 对象
		 * @return true/false 数组类型/非数组类型
		 */
		isArray : isArray,
		/**
		 * 判断对象是否为手机号
		 * 
		 * @param value 值
		 * @return true/false 是手机号/不是手机号
		 */
		isPhone : function(value) {
			var regex = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
			return regex.test(value);
		},
		/**
		 * 判断对象是否为邮箱
		 * 
		 * @param value 值
		 * @return true/false 是邮箱/不是邮箱
		 */
		isMail : function(value) {
			var regex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			return regex.test(value);
		},
		/**
		 * 判断标签是否存在指定属性
		 * 
		 * @param obj 对象
		 * @param arrtName 属性名称
		 * @return true/false 存在/不存在
		 */
		hasAttr : hasAttr,
		/**
		 * 字符串全部替换
		 * 
		 * @param str 文字
		 * @param oStr 旧字符
		 * @param nStr 新字符
		 * @return 替换后文字
		 */
		replaceAll : replaceAll,
		/**
		 * HTML特殊符号转义
		 * 
		 * @param html HTML字符串
		 * @return 转义后HTML字符串
		 */
		encodeHtml : encodeHtml,
		/**
		 * HTML特殊符号反转
		 * 
		 * @param html HTML字符串
		 * @return 反转后HTML字符串
		 */
		decodeHtml : decodeHtml,
		/**
		 * Long类型日期格式化
		 * 
		 * @param value 值(Long)
		 * @param format 日期格式
		 * @return 格式化日期
		 */
		dateFormat : dateFormat,
		/**
		 * JSON转URL参数
		 * 
		 * @param data 数据
		 * @param key KEY
		 * @return URL参数
		 */
		json2Url : json2Url,
		/**
		 * URL参数转JSON
		 * 
		 * @param url URL
		 * @return JSON
		 */
		url2Json : url2Json,
		/**
		 * 替换文本内所有指定内容
		 * 
		 * @param text 文本
		 * @param oldChar 被替换内容
		 * @param newChar 替换内容
		 * @return 替换后的文本
		 */
		textReplaceAll : textReplaceAll,
		/**
		 * 根据指定长度进行文本缩略显示
		 * 
		 * @param text 文本
		 * @param length 显示长度
		 * @return 缩略后的文本
		 */
		textEllipsis : textEllipsis,
		/**
		 * 显示关键词高亮
		 * 
		 * @param keyword 关键词
		 */
		displayHighlight : displayHighlight,
		/**
		 * 隐藏关键词高亮
		 */
		removeHighlight : removeHighlight,
		/**
		 * 显示等待画面
		 */
		displayWaitScreen : displayWaitScreen,
		/**
		 * 隐藏等待画面
		 */
		hideWaitScreen : hideWaitScreen,
		/**
		 * 设定链接HREF
		 * 
		 * @param selector 选择器
		 * @param baseUrl 基础URL
		 * @param dataAttrs 自定义属性名称
		 * @param param URL参数
		 */
		setLinkHref : setLinkHref,
		/**
		 * 发送验证码
		 * 
		 * @param btnId 发送验证码按钮ID
		 * @param url URL
		 * @param data 验证码请求数据
		 */
		sendCaptcha : sendCaptcha,
		/**
		 * 关闭弹出窗口
		 */
		closePopUp : function() {
			$('#mask').hide();
			$('#mask').empty();
		},
        /**
         * 获取一个字符串值在指定字符串第n次出现的位置
         * @param str 字符串
         * @param cha 要查找的字符串值
         * @param num 要查找第几个该字符串值
         * @returns {*|Number|number}
         */
        findIndex : findIndex,
		/**
		 * 格式化金额 优化负数格式化问题
		 * 
		 * @param s 数字
		 * @param n 保留位数
		 */
        fmoney : fmoney,
		/**
		 * 用户模板高度自适应
		 */
		setIframeHeight: setIframeHeight,
		/**
		 * 详情页标签 设定链接HREF
		 * 
		 * @param 对应列表页参数
		 */
		setLinkHrefDetail: setLinkHrefDetail,
        /**
		 * 取得模块类型
		 */
		getModuleType: getModuleType,
		/**
		 * 全选事件
		 * 
		 * @param e 被选中的name
		 * @param f 全选的 id
		 */
		checkAllBox : checkAllBox,
		/**
		 * 检查是否全选
		 * 
		 * @param a 的name
		 * @param b 被检查的class
		 */
		checkThisBox : checkThisBox,
		/**
		 * 图片懒加载
		 * 
		 * @description 懒加载图片初始具有data-src属性，具有class类：vib_hide：visibility: hidden
		 */
		imgLazyLoad : imgLazyLoad,
		/**
		 * 表单数据提交取值
		 * 
		 * @param form 表单dom
		 * @return{json object} 表单内容对象
	 	 * @description 提交表单时，循环取表单输入框值,缺点:不能取出file文件或图片
	 	 */
		getFormData : getFormData,
		/**
		 * 获取几天前的日期
		 * 
		 * @param n 几天前，天数
		 * @return 日期
	 	 */
		getBeforeDate : getBeforeDate,
		/**
		 * 图片上传预览功能
		 * 
		 * @param fileid 图片选择按钮id，如：fileBtn。
		 * @param imgid 显示图片img的id,如：imgShow
		 * */
		setImagePreview : setImagePreview,
		/**
		 * 获取图片名后缀
		 * 
		 * @param inputFile 文件按钮对象
		 * @return 图片名后缀类型
		 * */
		getImgAttr : getImgAttr,
		/**
		 * 图片压缩并转base64格式
		 * 
		 * @param inputFile 文件按钮对象
		 * @param callBack 回调函数
		 * @param imgSize {json object}设置图片大小
		 * @return 回掉函数  。回掉函数参数：图片base64数据
		 * */
		 imgToBase64 : imgToBase64,
		/**
		 * 字符串截取指定字符之前的数据
		 * 
		 * @param str:字符串，
		 * @param code:指定字符 如： '/.'
		 * @return 截取后的字符串
		 * */
		subBeforeStr : subBeforeStr,
		/**
		 * 判断是不是pc端
		 * 
		 * @return boolean
		 * */
		isPC : isPC,
		/**
		 * a锚点跳转
		 * 
		 * @description 跳转时增加动画效果
		 * */
		 animateGoLink : animateGoLink,
		/**
		 * 屏蔽元素，行内元素
		 * 
		 * @param dom dom元素,如：$('#abc');
		 * @description 适用于单个元素，属性为inline-block
		 * */
		maskAddInlineBlock : maskAddInlineBlock,
		/**
		 * 屏蔽元素，块级元素
		 * 
		 * @param dom dom元素,如：$('#abc');
		 * @description 适用于单个元素，属性为block
		 * */
		maskAddBlock : maskAddBlock,
		/**
		 * 解除屏蔽元素
		 * 
		 * @param dom dom元素,如：$('#abc');
		 * */
		maskRemove : maskRemove,
		/**
		 * 图片加载完成后执行事件
		 * 
		 * @param imgSrcList 图片src 数组
		 * @param callBack 所有图片加载完成后的回掉函数
		 * @description 适用于判断元素的高度，如：要判断某div的高度，需要等其内图片加载完成后再判断，才不会出错
		 * */
		imgsLoadComplate : imgsLoadComplate,
		/**
		 * 获取页面滚动高度
		 * 
		 * @param {object} document 对象
		 * @return {number} 页面滚动高度
		 * */
		getScrollTop : getScrollTop,
	
	};
}());

/**
 ************************************************************************************************************
 * 项目页面加载后公共事件
 ************************************************************************************************************
 **/
var appInit = (function(){
	
	/**
	 *****************************
	 * 定义页面初始化所用到的各种方法
	 *****************************
	 **/
	/*打招呼*/
	function greeting(){
		//打招呼对象测试
		var greeter = $('#test1').text().trim();
		//控制台打招呼
		console.log('Hello '+greeter);
	}
	
	
	/**
	 *****************************
	 * 定义页面初始化事件
	 * @description 页面加载完成后执行
	 *****************************
	 **/
	function init(){
		/*页面加载完成后执行*/
		$(function(){
			/*打招呼测试*/
			//greeting();
			
		});
	}
	
	/**
	 *****************************
	 * 执行页面初始化事件
	 * @description 页面加载完成后执行
	 *****************************
	 **/
	init();
	
}());

