
$proto['pageLoad']=function (){

	//定义表单验证参数及提交表单的方法
	if($proto.userinfo!=null){location.replace($proto.basepath.home);return;}
	km_valid.initForm('fields_login','','int_submit','',function (){
		$proto.login('login');
	});

	$proto.pageloaded=true;
};

//配置表单验证方法
km_valid.alert=false;
$proto.config['fields_login']={
	'username':{m:1,t:'用户名',cls:'int-hs',type:'',hs:'',extra:1,chk:function (co,vo){
		$('.d-password .formcheck').remove();
		$('.d-vcode .formcheck').remove();
		return true;
	}}
	,'password':{m:1,t:'密码',cls:'int-hs',type:'',hs:'',extra:1,chk:function (co,vo){
		$('.d-username .formcheck').remove();
		$('.d-vcode .formcheck').remove();
		var _return=km_form.valid_pwd(this,co,'int-hs_s','密码只能输入1-20位的字母数字和下划线，并且区分大小写');
		if(!_return){return false;}
		return true;
	}}
	,'vcode':{ref:1,m:1,t:'验证码',cls:'int-hs',type:'',hs:'',extra:1,chk:function (co,vo){
		$('.d-username .formcheck').remove();
		$('.d-password .formcheck').remove();
		if($('#isf').val()==1){return true;}
		else{
			if(co.value==''||co.value=='验证码'){
				km_valid.formcheck_h(this,"请输入验证码!",co,'int-hs_s');
				return false;
			}
		}
		return true;
	}}
};

if(!__isLocalStorageNameSupported){
	$('.d-knowme').css({
		height:'1px'
		,overflow:'hidden'
	});
}
