var $proto={

	//当多个引入了 proto.js 的页面进行嵌套的时候，每个页面上的 `$proto.top` 都是最外层页面的 window 对象
	top:null

	//页面打开以后所有操作都结束后 `pageloaded` 设为 true
	,pageloaded:false

	//当 FLProto 与 Bootstrap 整合的时候，将 `ftype` 设为 'bootstrap'
	,ftype:''

	//表单验证定义在 $proto.config 对象中
	,config:{}

	//定义日历控件获取的日期的格式，可以是 'yyyymmdd' 或 'yyyy-mm-dd'
	,dateshowtype:'yyyy-mm-dd'

	//调试开关
	,debug:true

	//页面引入的 `css`、`js`、`html pagelet` 等静态文件的版本
	,public_ver:''

	//存放服务器端返回的当前系统时间，每个页面在加载时都会调用 `/common/ss` 来获取用户信息和系统时间
	,systemTime:''

	//当前页面所属的 `appid`
	,appid:''

	//当前页面的 `pageid`
	,pageid:''

	//当前页面的 `subpageid`
	,subpageid:''

	//定义需要在页面加载后再进行加载的外部 js 文件
	,scriptLoad:{}

	//存放已经获取的 `html pagelet`
	,cApp:[]

	,userinfo:null

	// 每个页面最后，在</body>前插入 `init.js` ，`init.js` 执行到最后调用 `$proto.load()`
	,load:function (){

		// 让导航菜单中与当前页面对应的 app 和 page 高亮显示
		if($$('topmenu_'+$proto.appid)){
			var c=$$('topmenu_'+$proto.appid).className;
			c=c.replace('item_selected','item');
			c=c.replace('item','item_selected');
			$$('topmenu_'+$proto.appid).className=c;
		}
		if($$('headmenu_'+$proto.pageid)){
			var c=$$('headmenu_'+$proto.pageid).className;
			c=c.replace('item_selected','item');
			c=c.replace('item','item_selected');
			c=c.replace('tab_select','tab');
			c=c.replace('tab','tab_select');
			$$('headmenu_'+$proto.pageid).className=c;
			//alert($$('headmenu_'+$proto.pageid).className);
		}else{
			//alert('');
		}
		if($$('submenu_'+$proto.subpageid)){
			var c=$$('submenu_'+$proto.subpageid).className;
			c=c.replace('ac_select','ac');
			c=c.replace('ac','ac_select');
			$$('submenu_'+$proto.subpageid).className=c;
		}

		// 根据获取的用户信息显示右上角的导航内容
		// 用户信息通过 `/common/ss` 获取，存储在 `$proto.userinfo` 中
		// ```
		// {
        //		uid:'user0'			[用户ID]
        //		,email:''			[邮箱]
        //		,username:'zhangy'	[用户名]
        //		,nickname:'zhangy'	[昵称]
        //		,r:'r1'				[角色ID]
        //		,ut:''				[身份 (groupadmin,eventadmin,courseadmin)]
        //		,verify:'0'			[是否通过了实名验证 0 未通过 1 完善]
        //		,userprofile:'1'	[是否完善了个人信息 0 未完善 1 完善]
        //		,ip:''				[ip地址]
        //		,location:'上海'		[城市]
        //		,token:''
        // }
		// ```

		if($proto.userinfo!=null){
			if($proto.appid=='group' && String(','+$proto.userinfo['ut']+',').indexOf(',groupadmin,')!=-1){
				$('#headmenu_admin').css('display','block');
			}
			if($proto.appid=='course' && String(','+$proto.userinfo['ut']+',').indexOf(',courseadmin,')!=-1){
				$('#headmenu_admin').css('display','block');
			}
		}

		var s='';
		if($proto.userinfo===null){
			s+='<div class="body">';
				//s+='<a href="javascript:;" onclick="toggleToolBar()" class="item last" title="无障碍辅助工具条" style="color:orange;">无障碍辅助工具</a>';
				if($('.d-top-nav').text().indexOf('返回')==-1){
					s+='<span class="txt">欢迎来到上海学习网</span>';
				}
				s+='<a class="item" href="'+$proto.basepath.login+'" target="'+$proto.basetarget+'">登录</a>';
				//if(location.href.indexOf('read.shlll.net')!=-1||location.href.indexOf('act.shlll.net')!=-1){
					//s+='<a class="item last" href="http://www.shlll.net/home/login/register.jsp" target="'+$proto.basetarget+'">注册</a>';
				//}else{
					s+='<a class="item last" href="'+$proto.basepath.signup+'" target="'+$proto.basetarget+'">注册</a>';
				//}
			s+='</div>';
		}else{
			s+='<div class="body">';
				//s+='<a href="javascript:;" onclick="toggleToolBar()" class="item last" title="无障碍辅助工具条" style="color:orange;">无障碍辅助工具</a>';
				if(top.location.href.indexOf('shlll.net')==-1 || top.location.href.indexOf('beta.shlll.net')!=-1){
					s+='<span class="item icon-drop-white" onclick="sub_domenu(\'d_hmenu4\')" style="cursor:pointer;">';
					s+='消息(3)';
					s+='<div id="d_hmenu4" class="d-hpanel" style="display:none;">';
						s+='<div class="hitem txt-justify">您加入学圈 <a href="/group/groupdetail" target="_blank">科学松鼠会读者花园</a> 的申请已经通过审核，您可以在学圈中发布信息了<span class="close">&#215;</span></div>';
						s+='<div class="hitem txt-justify"><a href="/share/public" target="_blank">张飞</a> 已经确认了您的好友申请，<a href="/share/myfriend" target="_blank">查看我的好友</a><span class="close">&#215;</span></div>';
						//s+='<div class="hitem txt-justify"><a href="/share/public" target="_blank">李明</a> 申请成为您的好友，您可以进入<a href="/share/myfriend" target="_blank">我的好友</a>处理所有申请<span class="close">&#215;</span></div>';
						//s+='<div class="hitem txt-justify">您的实名认证信息已经通过审核<span class="close">&#215;</span></div>';
					s+='</div>';
					s+='</span>';
				}

				var m=0;
				//if($proto.userinfo.verify!=1){m++;}
				if($proto.userinfo.userprofile!=1){m++;}
				var cls=(m>0)?'icon-drop-dot':'icon-drop-white';

				s+='<span class="item last '+cls+'" onclick="sub_domenu(\'d_hmenu3\')" style="cursor:pointer;">';
                    var name=($proto.userinfo.nickname=='')?$proto.userinfo.username:$proto.userinfo.nickname;
                   	s+=''+name+'';
                    if(m>0){
                    	s+='<span class="bi1"><span>&nbsp;</span></span>';
                    	s+='<span class="bi2"><span>'+(m)+'</span></span>';
                    }
                    s+='<div id="d_hmenu3" class="d-hmenu" style="display:none;">';
                        s+='<a class="item" href="'+$proto.basepath.verify+'" target="'+$proto.basetarget+'">实名认证';
                        //if($proto.userinfo.verify!=1){
                        //	s+='<div class="i"></div>';
                        //}
                        s+='</a>';
                        s+='<a class="item" href="'+$proto.basepath.useraccount+'" target="'+$proto.basetarget+'">个人信息';
                        if($proto.userinfo.userprofile!=1){
                        	s+='<div class="i"></div>';
                        }
                        s+='</a>';
	                    s+='<a class="item" href="'+$proto.basepath.personalhome+'" target="'+$proto.basetarget+'">学习档案</a>';
						s+='<a class="item" href="'+$proto.basepath.cj+'" target="'+$proto.basetarget+'">抽奖记录</a>';
						s+='<a class="item" href="'+$proto.basepath.logoutaction+'" target="'+$proto.basetarget+'">退出</a>';
                    s+='</div>';
                s+='</span>';
				//s+='<a class="item last" href="'+$proto.basepath.personalhome+'">学习档案</a>';
			s+='</div>';
		}
		$("#d_top_sign").html(s);

		setTimeout(function (){
			return;
			$("#line").show();
			$("#spell").show();
			//$("#txt").show();
		},4000);

		if(top.location.href.indexOf('read.shlll.net')==-1&&top.location.href.indexOf('member.shlll.net')==-1&&top.location.href.indexOf('act.shlll.net')==-1){
			$('.d-footer-c .l').css('display','block');
		}

		$('#d_bottom').remove();
		if(!PF_ie6 && km_st.show && top==window){

			var s1='';
			var n=km_st.list.length;
			for(var k=0;k<n;k++){
				s1+='<span>'+km_st.list[k].text+'</span>';
			}
			if(s1!=''){
				s1='<span class="exp" onclick="km_st.expend()">&nbsp;</span>'+s1;
			}
			var s='';
	        s+='<div id="d_bottom" class="d-bottom">';
	            s+='<div class="d-bottom-c">';
	                s+='<div id="d_scrolltop" class="d-scrolltop">';
	                	s+=s1;
						s+='<span class="t" onclick="$(document.body).ScrollTo();">顶部</span>';
	                s+='</div>';
	            s+='</div>';
	        s+='</div>';
	        if($$('d_menusub')){
				$('#d_menusub').after(s);
	        }else if($$('d_menu')){
				$('#d_menu').after(s);
	        }else if($$('d_banner')){
				$('#d_banner').after(s);
	        }else if($$('d_header')){
				$('#d_header').after(s);
	        }else{
				//$('.d-main > .container').prepend(s);
				$('.d-row').eq(0).before(s);
	        }

			for(var k=1;k<=n;k++){
				(function (){
					var _id=km_st.list[k-1].id;
					$('.d-scrolltop span').eq(k).on('click',function (){
						if(PF_ie7){
							$('#'+_id)[0].scrollIntoView();
						}else{
							$('#'+_id).ScrollTo();
						}
					});
				})();
			}
			if(km_st.autohide){
				$('#d_bottom').css({visibility:'hidden'});
			}else{
				$('#d_bottom').css({visibility:'visible'});
			}
		}
		if(typeof window['ifvisible']!='undefined'){
			ifvisible.setIdleDuration(5);
			ifvisible.on("idle", function(){
				$proto.ifvisible('idle');
			});
			ifvisible.on("wakeup", function(){
				$proto.ifvisible('wakeup');
			});
		}

		// 如果在页面所引入的 js 文件中定义了 `$proto['pageLoad']` 方法则执行 `$proto['pageLoad']`
		// 开发人员需要在 `$proto['pageLoad']` 方法中判断所有操作执行完成后将 `$proto.pageloaded` 设置为 'true'
		if(typeof $proto['pageLoad']=='function'){
			$proto['pageLoad']();
		}else{
			$proto.pageloaded=true;
		}
	}

	// 登录
	//km_valid.initForm('fields_login','','int_submit','',function (){
	//	$proto.login('login');
	//});
	// form - 'top' 是从页面顶部导航条上点击登录，'home' 是从首页登录，'login' 是从登录页面登录

	,login:function (from){
		var vcode=$$('vcode')?$$('vcode').value:'sample vcode';
		if(!from){from='top';}
		var _olduser=0;
		if($$('olduser')){_olduser=($$('olduser').checked)?'1':'0';}
		var data={
			username:$$('username').value
			,passwordfake:$$('password').value
			,from:from
			,olduser:_olduser
			,vcode:vcode
		};
		var posting=$.ajax({
			type: "POST"
			,url: $proto.basepath.loginaction
			,cache: false
			,data: data
		});
		posting.done(function(msg) {
			msg=JSON.parse(msg);
			if(msg.rturl=='stop'){
				Alert(msg.rtmsg);
				if(from=='login'){
					km_valid.initForm('fields_login','','int_submit','',function (){
						$proto.login('login');
					});
				}else if(from=='home'){
					km_valid.initForm('fields_login','','int_submit','',function (){
						$proto.login('home');
					});
				}
				return;
			}

			if(__isLocalStorageNameSupported){
				if($$('check_knowme').checked){
					var username=$$('username').value;
					var password=$$('password').value;
					var s=username+','+password;
					s=sjcl.encrypt("shlll", s);
					store.set('knowme',s);
				}else{
					store.set('knowme','');
				}
			}

			if(from=='login'){
				km_valid.initForm('fields_login','','int_submit','',function (){
					$proto.login('login');
				});
				// 从当前页面的 url 获取 `redirect` 参数的值，当用户登录成功后跳转到 `redirect` 中所指定的页面
				var dir=sub_getPa('redirect');

				if(dir!=''){
					location=decodeURIComponent(dir);
				}else{
					location=$proto.basepath.home;
				}
			}else if(from=='home'){
				km_valid.initForm('fields_login','','int_submit','',function (){
					$proto.login('home');
				});
				location.reload();
			}else{
				location.reload();
			}
		});
		posting.fail(function(msg) {
			Alert(JSON.stringify(msg),"location='"+$proto.basepath.home+"';");
		});
	}

	,profileshow:function (func){
		profile_valid=new km_validm();
		profile_valid.alert=false;
		$proto.config['fields_profile']={
			'profile_email':{m:1,t:'电子邮箱',cls:'int-hs',type:'',hs:'',chk:function (co,vo){
				var _return=km_form.valid_email(this,co,'int-hs_s','您填写的电子邮箱可能不正确');
				if(!_return){return false;}
				/*
				if(!$$('noexist2')){
					sub_checkemail('profile_email',profile_valid);return false;
				}
				*/
				return true;
			}}
			,'profile_provinceId':{ref:1,m:1,t:'所在地区',cls:'select-hs',type:'select',hs:'',chk:function (co,vo){
				if(co.value==-1){
					km_valid.formcheck_h(this,"请选择所在省市",co,"select-hs_s");
					return false;
				}
				return true;
			}}
			,'profile_regionId':{ref:1,m:1,t:'所属区县',cls:'select-hs',type:'select',hs:'',chk:function (co,vo){
				if($('#profile_provinceId').find('option:selected').text().indexOf('上海')!=-1 && co.value==-1){
					km_valid.formcheck_h(this,"请选择所属区县",co,"select-hs_s");
					return false;
				}
				return true;
			}}
			,'profile_streetId':{ref:1,m:1,t:'所属街道',cls:'select-hs',type:'select',hs:'',chk:function (co,vo){
				if($('#profile_provinceId').find('option:selected').text().indexOf('上海')!=-1 && co.value==-1){
					km_valid.formcheck_h(this,"请选择所属街道",co,"select-hs_s");
					return false;
				}
				return true;
			}}
		};
		if(typeof $proto['pagelets']=='undefined'){
		    $proto['pagelets']={};
		}
		$proto.pagelets['userprofile']={
		    p:'userprofile',
		    mid:'floatbox_i1',
		    w:600,
		    h:'auto',
		    temp:1,
		    before:function (){},
		    onload:function (){
		    	$('#profile_provinceId').bind('change',function (){
		    		if($(this).find('option:selected').text().indexOf('上海')!=-1){
		    			$('#d_userprofile_ext').css({display:'block'});
		    		}else{
		    			$('#d_userprofile_ext').css({display:'none'});
		    		}

					$('#profile_regionId option').remove();
					$('#profile_regionId').append('<option value="-1">请选择</option>');
					$('#profile_streetId option').remove();
					$('#profile_streetId').append('<option value="-1">请选择</option>');

		    		var v=$(this).val();
		    		if(v==-1){return;}

		    		/*
					$proto.scriptLoad["km_fb"]={load:false,path:"/vendor/flproto0_1_0/plugin/km_fb.js"};
		    		ij2('',function (){
						km_cmdlist['init'].doCmdA();
					});
					*/

					$.ajaxSetup({cache:false});
					var $param={pid:$('#profile_provinceId').val()};
					$.getJSON(profile_dataaction+'/action/region',$param,function(data){
						try{
							for(var i=0;i<data.length;i++){
								if(data[i].RegionID==-1){continue;}
								$('#profile_regionId').append('<option value="'+data[i].RegionID+'">'+data[i].RegionTitle+'</option>');
							}
						}catch(e){
							console.log('get region error: '+e.message);
						}
					});
		    	});
		    	$('#profile_regionId').bind('change',function (){
					$('#profile_streetId option').remove();
					$('#profile_streetId').append('<option value="-1">请选择</option>');

		    		var v=$(this).val();
		    		if(v==-1){return;}
					$.ajaxSetup({cache:false});
					var $param={pid:$('#profile_provinceId').val(),rid:$('#profile_regionId').val()};
					$.getJSON(profile_dataaction+'/action/street',$param,function(data){
						try{
							for(var i=0;i<data.length;i++){
								if(data[i].StreetID==-1){continue;}
								$('#profile_streetId').append('<option value="'+data[i].StreetID+'">'+data[i].StreetTitle+'</option>');
							}
						}catch(e){
							console.log('get street error: '+e.message);
						}
					});
		    	});
		    	if(typeof $proto.userinfo['email']!='undefined'){
		    		if($proto.userinfo['email']=='null'){$proto.userinfo['email']='';}
		    		$('#profile_email').val($proto.userinfo['email']);
		    	}
				profile_valid.initForm('fields_profile','','profile_int_submit','',function (){
					$proto.profilesubmit();
				});
		    }
		}

		var s="";
		s+="<div class='p-win'>";
		    s+="<div style='height:40px;overflow:hidden;z-index:33;'>";
		        s+="<div class='headicon'>完善个人信息</div>";
		        s+="<div class='clear'></div><div class='headline'></div>";
		        s+="<div style='position:absolute;top:10px;right:10px;width:20px;height:20px;cursor:pointer;font-size:18px;' onclick=\"$proto.profilesubmit(true);km_scr.close()\">&#215;</div>";
		    s+="</div>";
		    s+="<div style='padding:20px;margin:0 0 10px 0;background-color:white;'>";
		    	s+='<div style="color:#999;font-size:13px;height:30px;line-height:30px;">请完善您的以下个人信息。</div>';
		        s+='<table class="tbl" width="100%">';
		            s+='<tr>';
		                s+='<th width="100">电子邮箱</th>';
		                s+='<td><input type="text" class="int-hs" id="profile_email" name="profile_email" style="width:240px;" maxlength="100"></td>';
		            s+='</tr>';
		            s+='<tr>';
		                s+='<th width="100">所在省市</th>';
		                s+='<td><select class="select-hs" id="profile_provinceId" name="profile_provinceId" style="width:180px;"><option value="">请选择</option><option value="1">北京市</option><option value="2">上海市</option></select></td>';
		            s+='</tr>';
		        s+='</table>';
		        s+='<div id="d_userprofile_ext" style="display:none;">';
			    	s+='<div style="color:#999;font-size:13px;height:30px;line-height:30px;">请选择所在区县和街道。</div>';
			        s+='<table class="tbl" width="100%">';
			            s+='<tr>';
			                s+='<th width="100">区县</th>';
			                s+='<td><select class="select-hs" id="profile_regionId" name="profile_regionId" style="width:180px;"><option value="">请选择</option><option value="a">aaa</option></select></td>';
			            s+='</tr>';
			            s+='<tr>';
			                s+='<th width="100">街道</th>';
			                s+='<td><select class="select-hs" id="profile_streetId" name="profile_streetId" style="width:180px;"><option value="">请选择</option><option value="b">bbb</option></select></td>';
			            s+='</tr>';
			        s+='</table>';
		        s+='</div>';

		        s+='<div class="center" style="padding:20px 0 20px 0;">';
		            s+='<input id="profile_int_submit" type="button" class="btn btn-green" value="提交" style="width:60px;">';
		            s+='&nbsp;<input type="button" class="btn btn-grey" value="取消" style="width:60px;" onclick="$proto.profilesubmit(true);km_scr.close();">';
		        s+='</div>';
		    s+="</div>";
		s+="</div>";

		$proto.cApp['userprofile']=s;
		km_scr.modal('userprofile');
		(function (){
			var _func=func;
			$.ajaxSetup({cache:false});
			var $param={};
			$.getJSON(profile_dataaction+'/action/province',$param,function(data){
				try{
					$('#profile_provinceId option').remove();
					$('#profile_provinceId').append('<option value="-1">请选择</option>');
					for(var i=0;i<data.length;i++){
						if(data[i].ProvinceID==-1){continue;}
						$('#profile_provinceId').append('<option value="'+data[i].ProvinceID+'">'+data[i].ProvinceTitle+'</option>');
					}
				}catch(e){
					console.log('get province error: '+e.message);
				}
				if(typeof _func=='function'){_func();}
			});
		})();
	}
	,profilesubmit:function (isquit){
		if(!isquit){
			var data={
				email:$('#profile_email').val()
				,provinceId:$('#profile_provinceId').val()
				,regionId:$('#profile_regionId').val()
				,streetId:$('#profile_streetId').val()
				,quit:0
			};
		}else{
			var data={
				email:''
				,provinceId:''
				,regionId:''
				,streetId:''
				,quit:1
			};
		}
		if($proto.basepath.profileaction==''){
			//alert(JSON.stringify(data));
			profile_valid.initForm('fields_profile','','profile_int_submit','',function (){
				$proto.profilesubmit();
			});
			return;
		}
		var posting=$.ajax({
			type: "POST"
			,url: $proto.basepath.profileaction
			,cache: false
			,data: data
		});
		if(!isquit){
			posting.done(function(msg){
				msg=JSON.parse(msg);
				if(msg.rturl=='stop'){
					Alert(msg.rtmsg);
					profile_valid.initForm('fields_profile','','profile_int_submit','',function (){
						$proto.profilesubmit();
					});
					return;
				}
				profile_valid.initForm('fields_profile','','profile_int_submit','',function (){
					$proto.profilesubmit();
				});
				(function (){
					var _msg=msg.rtmsg;
					if(_msg==''){_msg='修改成功。';}
					Alert(_msg,function (){
						km_scr.close();Alert();
					});
				})();
			});
			posting.fail(function(msg) {
				km_scr.close();
				Alert(msg);
			});
		}else{
			posting.done(function(msg){
				//km_scr.close();
			});
		}
	}

	// 在页面上调用 `$ptoto.logout()` 退出系统
	,logout:function (){
		//如果页面上存在一个 id 为 'checkquit' 的html元素，则在用户点击“退出”按钮或者关闭浏览器窗口是弹出浏览器确认框，询问用户是否退出。
		if($$("checkquit")!=null){
			var s=$$("checkquit").value;
			if(s==''){s='您填写的数据还没有保存，您确定要退出系统吗？';}
			if(!window.confirm(s)){return;}
			$$("checkquit").parentNode.removeChild($$("checkquit"));
			location=$proto.basepath.logoutaction;
			return;
		}
		if(!window.confirm('您确定要退出系统吗？')){return;}
		location=$proto.basepath.logoutaction;
	}

	//页面上调用 `$proto.go()` 方法模拟用户点击一个超链接跳转页面，确保新页面可以获得 document.referrer 的值
	,go:function (url){
		if(PF_ie){
			var referLink=document.createElement('a');
            referLink.href=url;
            document.body.appendChild(referLink);
            referLink.click();
		}else{
			location=url;
		}
	}

	//当浏览器窗口大小有变化时，`$proto.resize()` 方法被调用
	,resize:function (){
		var w=$(window).width();
		try{
			if($('.d-top-c').css('width')=='1200px'){
				$('.d-main').css({'min-width':'1200px'});
			}else{
				$('.d-main').css({'min-width':'1000px'});
			}
		}catch(e){}

		if(w>1000 && w<1140){
			var r=50-(w-1000)/2-50;
			$('#d_scrolltop').css('right',(r)+'px');
		}else if(w>1140){
			$('#d_scrolltop').css('right','-70px');
		}else if(w<1000){
			var r=(1000-w);
			$('#d_scrolltop').css('right',(r)+'px');
		}
	}

	//当页面滚动时，`$proto.mainscroll()` 方法被调用
	,mainscroll:function (){
		var h=km_scr.wh()[3];
		if($(window).scrollTop()>170){
			$('#d_bottom').css({position:'fixed'});
		}else{
			$('#d_bottom').css({position:'relative'});
		}
		if($(window).scrollTop()>(h-300)){
			$('#d_bottom').css({visibility:'visible'});
		}else{
			if(km_st.autohide){
				$('#d_bottom').css({visibility:'hidden'});
			}else{
				$('#d_bottom').css({visibility:'visible'});
			}
		}
	}

	//
	,ifvisible:function (status){
		if(status=='idle'){
			$('#d_bottom').css({visibility:'hidden'});
		}else if(status=='wakeup'){

		}
	}

	// rtUrl
	,rtUrl:function (e1,e2){
		CookieUtil.set('formstatus','');
		if($$("frm_history")){
			$d.getWin($$('frm_history')).location=$proto.basepath['html']+'blank.html';
		}
		if(typeof km_valid!='undefined' && typeof km_valid['currField']!='undefined' && km_valid['currField']!=''){
			if(typeof $proto.config[km_valid.currField.replace('fields','fieldset')]!='undefined'){
				var fieldset=$proto.config[km_valid.currField.replace('fields','fieldset')];
				if(typeof fieldset.onback=='function'){
					var _return=fieldset.onback(e1,e2);
					if(_return){return;}
				}
			}
		}
		var cmdstr='';
		if(e2.indexOf("top.location.reload()")!=-1){
			cmdstr="search()";
			$proto.top.Alert(e1,cmdstr);
			return;
		}
		if(e2=='stop'){
			cmdstr+='$proto.top.Alert();';
			$proto.top.Alert(e1,cmdstr);
		}else{
			cmdstr+="$proto.top.km_float.close();";
			$proto.top.Alert(e1,cmdstr);
		}
	}
};

var profile_dataaction='';
if(location.href.indexOf(':5788')!=-1){
	profile_dataaction='/home';
}else if(location.href.indexOf('.shlll.net')!=-1){
	profile_dataaction='http://member.shlll.net/common';
}else if(location.href.indexOf('202.120.199.153')!=-1){
	profile_dataaction='http://202.120.199.153:81/common';
}

var profile_valid=null;

// 定义 `FLProto` UI 组件中使用的全局设置
$proto.uiconfig={

};

// 初始化 $proto.top 对象
/*
try{
	$proto.top=parent.$proto.top;
}catch(e){
	$proto.top=window;
}
*/
try{
	if(top!=window&&typeof(parent.$proto)!='undefined'){
		$proto.top=parent.$proto.top;
	}else{
		$proto.top=window;
	}
}catch(e){
	$proto.top=window;
}

function sub_domenu(d){
    km_kb._set($$(d),null,function (){

    });
}

function sub_checkemail(name,valid){
	if(!valid){valid=km_valid;}
	if(!name){name='email';}
	$('#noexist2').remove();
	$('#isexist').remove();
	$('#errorexist').remove();
	$.ajaxSetup({cache:false});
	var v=$.trim($("input[name='"+name+"']").val());
	if(v==''){return false;}
	var $url="/home/action/CheckEmail";
	var $param={email:v};
	(function (){
		var _valid=valid;
		var _name=name;
		$.getJSON($url,$param,function(data){
			if(data.rtvalue==0){//不存在
				$("input[name='"+_name+"']").after("<span id='noexist2' style='color:green'>&nbsp;邮箱可以使用。</span>");
				_valid.dosubmit(true);
			}else if(data.rtvalue==1){//存在
				$("input[name='"+_name+"']").after("<span id='isexist' style='color:red'>&nbsp;邮箱已存在。</span>");
				$("input[name='"+_name+"']").focus();
			}else{
				$("input[name='"+_name+"']").after("<span id='errorexist'  style='color:orange'>&nbsp;服务器繁忙，请稍后再试。</span>");
				$("input[name='"+_name+"']").focus();
			}
		});
	})();
}


// 定义页面中使用的关键 url 路径
// * common 目录中存放所有 js、css、images 文件
// * vendor 目录中存放所有第三方 js 库
// * HTML 目录中存放页面中需要使用的一些不可见页面


var thisLocation = window.location.href;
var memberSiteURL = 'http://member.shlll.net/';

$proto.baseurl=location.href.substring(0,location.href.replace('http://','').indexOf('/')+7);
$proto.basetarget='_self';
$proto.basepath={
	common:$proto.baseurl+'/common/v1/'
	,vendor:$proto.baseurl+'/vendor/'
	,html:(location.href.indexOf(':5788')!=-1)?$proto.baseurl+'/html/':'/File/html/'
	,profileaction:'' /*完善个人信息*/
	,login:$proto.baseurl+'/home/login' /*登录页面*/
	,signup:$proto.baseurl+'/home/signup' /*注册页面*/
	,loginaction:$proto.baseurl+'/login' /*登录请求*/
	,logoutaction:$proto.baseurl+'/home/action/logout' /*登出*/
	,personalhome:$proto.baseurl+'/usercenter/homepage' /*个人首页*/
	,home:$proto.baseurl+'/home/default' /*总首页*/
	,verify:$proto.baseurl+'/usercenter/verify' /*实名认证*/
	,useraccount:$proto.baseurl+'/usercenter/useraccount' /*个人信息*/
	,cj:''
};

if(thisLocation.indexOf('202.120.199.154')==-1&&thisLocation.indexOf('127.0.0.1')==-1){
	$proto.basepath.home = memberSiteURL + 'usercenter/useraccount';
	$proto.basepath.personalhome = memberSiteURL + 'usercenter/historycourse';
	$proto.basepath.useraccount = memberSiteURL + 'usercenter/useraccount';
	$proto.basepath.verify = memberSiteURL + 'usercenter/verify';
	$proto.basepath.cj = memberSiteURL + 'usercenter/lottery';
	$proto.basepath.login = memberSiteURL + 'home/login?redirect=' + thisLocation;//登录页面
	$proto.basepath.signup = memberSiteURL + 'home/signup?redirect=' + thisLocation;//注册页面
	//$proto.basepath.signup = 'http://www.shlll.net/home/login/register.jsp';//注册页面
	//$proto.basepath.loginaction='...';//登录ajax的请求地址
	$proto.basepath.logoutaction = memberSiteURL + 'home/action/logout?redirect=' + thisLocation;//退出系统的请求地址
}

var km_form={
	valid_ename_cn:function (ho,co,cls,str){
		//用户名
		if(!str){str="用户名不符合要求";}
		if(co.value.charAt(0)=='_'){km_valid.formcheck_h(ho,str,co,cls);return false;}
		if(co.value.length>30){km_valid.formcheck_h(ho,str,co,cls);return false;}
		var regu="^[_0-9a-zA-Z\u4e00-\u9fa5]+$";
		var re=new RegExp(regu);
		var _return=re.test(co.value);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_ename:function (ho,co,cls,str){
		//用户名
		if(!str){str="用户名不符合要求";}
		if(co.value.charAt(0)=='_'){km_valid.formcheck_h(ho,str,co,cls);return false;}
		if(co.value.length>30){km_valid.formcheck_h(ho,str,co,cls);return false;}
		var regu="^[_0-9a-zA-Z]+$";
		var re=new RegExp(regu);
		var _return=re.test(co.value);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_xm:function (ho,co,cls,str){
		/*名称：只能输入中文字符，英文字母和空格，不能包含数字和其他字符*/
		co.value=str_trim(co.value);
		var s=co.value;
		s=s.replace(/\s/g,'');
		var regu="^[a-zA-Z\u4e00-\u9fa5]+$";
		var re=new RegExp(regu);
		var _return=re.test(s);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_dz:function (ho,co,cls,str){
		/*地址：只能输入中文字符，英文字母，数字，“( )”括号，中划线和空格，不能包含其他字符。长度限制为50个汉字（或100个英文字母）*/
		co.value=str_trim(co.value);
		var v=rC(co.value,'——','');
		v=rC(v,'—','');
		v=rC(v,'（','');
		v=rC(v,'）','');
		var re=/^[\s\(\)-\.0-9a-zA-Z\u4e00-\u9fa5]+$/;
		var _return=re.test(v);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_yzbm:function (ho,co,cls,str){
		/*邮政编码*/
		var _re=/^[0-9]{6}$/;
		var _return=_re.test(co.value);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_mobile:function (ho,co,cls,str){
		/*手机：只能输入11位数字*/
		var _re=/^[0-9]{11}$/;
		var _return=_re.test(co.value);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_tel:function (ho,co,cls,str){
		/*电话：只能输入数字，英文字母和中英文的中划线。长度限制为20位*/
		var v=rC(co.value,'——','');
		v=rC(v,'—','');
		var _re=/^[-0-9a-zA-Z]+$/;
		var _return=_re.test(v);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_email:function (ho,co,cls,str){
		var re1=/^[A-Za-z0-9-_\.]+@\w+\.\w{2,3}$/;
		var re2=/^[A-Za-z0-9-_\.]+@\w+\.\w+\.\w{2,3}$/;
		var re3=/^[A-Za-z0-9-_\.]+@\w+\.\w+\.\w+\.\w{2,3}$/;
		var _return=re1.test(co.value)||re2.test(co.value)||re3.test(co.value);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_url:function (ho,co,cls,str){
		var s=co.value;
		var strRegex = "^((https|http|ftp|rtsp|mms)?://)" 
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
        + "|" // 允许IP和DOMAIN（域名） 
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
        + "[a-z]{2,6})" // first level domain- .com or .museum  
        + "(:[0-9]{1,5})?" // 端口- :80  
        + "((/?)|" // a slash isn't required if there is no file name  
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";  
        var re=new RegExp(strRegex);  
		var _return=re.test(co.value); 
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_isIdCardNo:function (ho,co,cls,str){
		var num=co.value;
		num=num.toUpperCase();  
		//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
		if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
			km_valid.formcheck_h(ho,"输入的身份证件号长度不对,或者号码不符合规定!",co,cls);
			return false;
		} 
		//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
		//下面分别分析出生日期和校验位 
		var len,re;
		len=num.length;
		if (len==15) {
			re=new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
			var arrSplit=num.match(re); 

			//检查生日日期是否正确 
			var dtmBirth=new Date("19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
			var bGoodDay;
			bGoodDay=(dtmBirth.getYear()==Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1)==Number(arrSplit[3])) && (dtmBirth.getDate()==Number(arrSplit[4]));
			if (!bGoodDay) {
				km_valid.formcheck_h(ho,"输入的身份证号里出生日期不对!",co,cls);
				return false;
			}else{ 
				//将15位身份证转成18位
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
				var arrInt=new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh=new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
				var nTemp=0, i;
				num=num.substr(0, 6) + "19" + num.substr(6, num.length - 6);
				for (i=0; i < 17; i++) {
					nTemp += num.substr(i, 1) * arrInt[i];
				}
				num += arrCh[nTemp % 11];
				return true;
			}
		}
		if (len==18) {
			re=new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
			var arrSplit=num.match(re); 

			//检查生日日期是否正确 
			var dtmBirth=new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
			var bGoodDay;
			bGoodDay=(dtmBirth.getFullYear()==Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1)==Number(arrSplit[3])) && (dtmBirth.getDate()==Number(arrSplit[4]));
			if (!bGoodDay) {
				km_valid.formcheck_h(ho,"输入的身份证号里出生日期不对!",co,cls);
				return false;
			}else{ 
				//检验18位身份证的校验码是否正确。
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
				var valnum;
				var arrInt=new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh=new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
				var nTemp=0, i;
				for (i=0; i < 17; i++) {
					nTemp += num.substr(i, 1) * arrInt[i];
				}
				valnum=arrCh[nTemp % 11];
				if (valnum != num.substr(17, 1)) {
					km_valid.formcheck_h(ho,"18位身份证的校验码不正确!",co,cls);
					//alert('最后一位应该为' + valnum);
					return false;
				}
				return true;
			}
		}
		return false;
	},
	valid_pwd:function (ho,co,cls,str){
		if(!str){str="密码只能输入字母数字和下划线，长度为1到20位，并且区分大小写!";}
		var re=/^[_A-Za-z0-9]{1,20}$/;
		var _return=re.test(co.value);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_char:function (ho,co,cls,str){
		if(!str){str="输入的内容不能包含以下字符：<br/># $ % & * ` + \\ \/ \' \"";}
		//var _re=/([~!@#$%&*()`=+,.;?<>-]|\\|\/|\'|\")/;
		var _re=/([#$%&*`+]|\\|\/|\'|\")/;
		var _return=!_re.test(co.value);
		if(!_return){km_valid.formcheck_h(ho,str,co,cls);}
		return _return;
	},
	valid_radio:function (ho,co,cls,str,name){
		var _nl=domGN(name);
		var _return=false;
		if(_nl.length!=0){
			for(var ri=0;ri<_nl.length;ri++){
				if(_nl[ri].checked){return true;}
			}
		}
		if(!_return){km_valid.formcheck_h(ho,str,co);}
		return _return;
	},
	valid_datetime:function (ho,co,cls,str,name){
		var _nl=domGN(name);
		if(_nl[0].checked){
			if(co.value==""){
				km_valid.formcheck_h(ho,str,co);
				return false;
			}
		}
		return true;
	},
	valid_isempty:function (ho,co,cls,str,name){
		var _nl=domGN(name);
		if(_nl[0].checked){
			if(co.value==""){
				km_valid.formcheck_h(ho,str,co,cls);
				return false;
			}
		}
		return true;
	},
	valid_max:function (ho,co,cls,m){
		var nls=(m=="max")?"填写的[内容]长度不能超过[max]个字符，一个汉字为2个字符!":"填写的[内容]长度不能少于[min]!";
		if(typeof ho[m]!="undefined"){
			/*中文一个字2个字符长度*/
			var cArr=co.value.match(/[^\x00-\xff]/ig);
    		var len=co.value.length+(cArr==null?0:cArr.length);
    		//alert(co.value.length+'\n'+(cArr==null?0:cArr.length));
			if(len>ho[m]){
				var _nls=nls;
				_nls=_nls.replace("["+m+"]",ho[m]);
				_nls=_nls.replace("[内容]",ho.t);
				km_valid.formcheck_h(ho,_nls,co,cls);
				return false;
			}
		}
		return true;
	},
	isDecimal:function (str){//检查输入字符串是否是带小数的数字格式,可以是负数
		if(this.isInteger(str)) return true; 
		var re=/^[-]{0,1}(\d+)[\.]+(\d+)$/; 
		if (re.test(str)) { 
			if(RegExp.$1==0&&RegExp.$2==0) return false; 
			return true; 
		} else { 
			return false; 
		}
	},
	isInteger:function (str){//检查输入对象的值是否符合整数格式
		var regu=/^[-]{0,1}[0-9]{1,}$/; 
		return regu.test(str); 
	}
};
