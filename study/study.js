//测试js

	
//测试对象
(function(){
	
	
	
	
	var myModule1 = {
			yes: true
			, no: false
			, age: 30
			, name: '孙小云'
	};
	new Vue({
		el:'#app1',
		data:myModule1
	});
	
	/*form表单提交*/
	function testSubmit(){
		console.log(myModule1);
	}
	
	/*定义初始化事件*/
	function init(){
		$(function(){
			
			$('#sub-btn').on('click',testSubmit);
			
		});
	}
	
	/*执行初始化事件*/
	init();
	
	
	
}());































