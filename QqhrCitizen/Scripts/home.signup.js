
$proto['pageLoad']=function (){

	//定义表单验证参数及提交表单的方法
	if($proto.userinfo!=null){location.replace($proto.basepath.home);return;}
	km_valid.initForm('fields_signup','','int_submit','',function (){
		sub_signup();
	});
	/*
	$("input[name='username']").focus(function (){
		$('#noexist').remove();
		$('#isexist').remove();
		$('#errorexist').remove();
	});
	*/
	$proto.pageloaded=true;

};

//配置表单验证方法
km_valid.alert=false;
$proto.config['fields_signup']={
	'username':{m:1,t:'用户名',cls:'int-hs',type:'',hs:'',chk:function (co,vo){
		var _return=km_form.valid_ename(this,co,'int-hs_s','用户名不符合要求');
		if(!_return){return false;}
		if(!$$('noexist')){
			sub_checkusername();return false;
		}
		$('#noexist').remove();
		return true;
	}}
	,'nickname':{m:0,t:'昵称',cls:'int-hs',type:'',hs:'',chk:function (co,vo){
		var _return=km_form.valid_ename_cn(this,co,'int-hs_s','昵称只能输入下划线、字母、数字和汉字');
		if(!_return){return false;}

		var s=co.value;
		var re=/[^\x00-\xff]/;
		var n=0;
		for(ik=0;ik<s.length;ik++){
			n=(s.charAt(ik).replace(re,"%")=="%")?n+2:n+1;
		}
		if(n>20){
			km_valid.formcheck_h(this,"中文昵称最多10个汉字，英文符号的昵称最多20字符。",co,"");
			return false;
		}

		/*
		if(!$$('noexist1')){
			sub_checknickname();return false;
		}
		$('#noexist1').remove();
		*/
		return true;
	}}
	,'password':{m:1,t:'密码',cls:'int-hs',type:'',hs:'',chk:function (co,vo){
		var _return=km_form.valid_pwd(this,co,'int-hs_s','密码不符合要求');
		if(!_return){return false;}
		return true;
	}}
	,'confirmpwd':{m:1,t:'确认密码',cls:'int-hs',type:'',hs:'',chk:function (co,vo){
		if(co.value!=domGN('password')[0].value){
			km_valid.formcheck_h(this,"密码两次输入不一致!",co,"");
			return false;
		}
		return true;
	}}
	,'email':{m:1,t:'电子邮箱',cls:'int-hs',type:'',hs:'',chk:function (co,vo){
		var _return=km_form.valid_email(this,co,'int-hs_s','您填写的电子邮箱可能不正确');
		if(!_return){return false;}
		if(!$$('noexist2')){
			sub_checkemail('email');return false;
		}
		$('#noexist2').remove();
		return true;
	}}
	,'question':{m:0,t:'密码问题',cls:'int-hs',type:'',hs:'',chk:function (co,vo){
		return km_form.valid_ename_cn(this,co,'int-hs_s','密码问题只能输入下划线、字母、数字和汉字');
	}}
	,'answer':{m:0,t:'密码答案',cls:'int-hs',type:'',hs:'',chk:function (co,vo){
		return km_form.valid_ename_cn(this,co,'int-hs_s','密码答案只能输入下划线、字母、数字和汉字');
	}}
	,'regionId':{m:0,t:'所属区县',cls:'select-hs',type:'select',hs:'',chk:function (co,vo){
		return true;
	}}
	,'streetId':{m:0,t:'所属街道',cls:'select-hs',type:'select',hs:'',chk:function (co,vo){
		return true;
	}}
	,'residentsCommittee':{m:0,t:'所属居委',cls:'select-hs',type:'select',hs:'',chk:function (co,vo){
		return true;
	}}
	,'vcode':{m:1,t:'验证码',cls:'int-hs',type:'',hs:'',extra:1,chk:function (co,vo){
		return true;
	}}
	,'terms':{ref:1,m:1,t:'使用协议',cls:'',type:'checkbox',hs:'',chk:function (co,vo){
		if(!co.checked){alert('请确认您已经看过并同意《上海学习网网站使用协议》。');return false;}
		return true;
	}}
};

function sub_checkusername(){
	$('#noexist').remove();
	$('#isexist').remove();
	$('#errorexist').remove();
	$.ajaxSetup({cache:false});
	var v=$.trim($("input[name='username']").val());
	if(v==''){return false;}
	var $url="/home/action/checkusername";
	var $param={username:v};
	$.getJSON($url,$param,function(data){
		if(data.rtvalue==0){//用户名不存在
			$("input[name='username']").after("<span id='noexist' style='color:green'>用户名可以使用。</span>");
			km_valid.dosubmit(true);
		}else if(data.rtvalue==1){//用户名存在
			$("input[name='username']").after("<span id='isexist' style='color:red'>用户名已存在。</span>");
			$("input[name='username']").focus();
		}else{
			$("input[name='username']").after("<span id='errorexist'  style='color:orange'>服务器繁忙，请稍后再试。</span>");
			$("input[name='username']").focus();
		}
	});
}
function sub_checknickname(){
	$('#noexist1').remove();
	$('#isexist').remove();
	$('#errorexist').remove();
	$.ajaxSetup({cache:false});
	var v=$.trim($("input[name='nickname']").val());
	if(v==''){return false;}
	var $url="/home/action/checkNickName";
	var $param={nickname:v};
	$.getJSON($url,$param,function(data){
		if(data.rtvalue==0){//不存在
			$("input[name='nickname']").after("<span id='noexist1' style='color:green'>昵称可以使用。</span>");
			km_valid.dosubmit(true);
		}else if(data.rtvalue==1){//存在
			$("input[name='nickname']").after("<span id='isexist' style='color:red'>昵称已存在。</span>");
			$("input[name='nickname']").focus();
		}else{
			$("input[name='nickname']").after("<span id='errorexist'  style='color:orange'>服务器繁忙，请稍后再试。</span>");
			$("input[name='nickname']").focus();
		}
	});
}

// 用户注册
function sub_signup(){

	var data={
		username:domGN('username')[0].value
		,vcode:domGN('vcode')[0].value
		,passwordfake:domGN('password')[0].value
		,email:domGN('email')[0].value

		,nickname:''
		,question:''
		,answer:''
		,regionId:''
		,streetId:''
		,residentsCommittee:''

	};

	var posting=$.ajax({
		type: "POST"
		,url: $('#d_signup').data('kmUrl')
		,cache: false
		,data: data
	});
	posting.done(function(msg){
		msg=JSON.parse(msg);
		if(msg.rturl=='stop'){
			Alert(msg.rtmsg);
			km_valid.initForm('fields_signup','','int_submit','',function (){
				sub_signup();
			});
			return;
		}
		km_valid.initForm('fields_signup','','int_submit','',function (){
			sub_signup();
		});
		// 从当前页面的 url 获取 `redirect` 参数的值，当用户登录成功后跳转到 `redirect` 中所指定的页面
		var dir=sub_getPa('redirect');
		if(dir==''){dir=$proto.basepath.home;}
		(function (){
			var _dir=dir;
			var _msg=msg.rtmsg;
			if(_msg==''){_msg='注册成功。';}
			Alert(_msg,function (){
				window.location=decodeURIComponent(_dir);
			});
		})();
	});
	posting.fail(function(msg) {
		Alert(JSON.stringify(msg),"location='"+$proto.basepath.home+"';");
	});
}
