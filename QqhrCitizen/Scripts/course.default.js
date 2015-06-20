
$proto['pageLoad']=function (){

	$d.frm({id:'frm_coursebanner'},'d_coursebanner');

	km_cmdlist['course']=new km_cl('course');
	km_cmdlist['course'].cmdA.push({func:function (){
		//加载 banner
		var url=$('#d_coursebanner').data('kmUrl');
		if(url!=''){
			$$("frm_coursebanner").src=url;
			km_scr.frmloading("frm_coursebanner",function (){

			});
		}
		km_cmdlist['course'].doCmdA();
	}});
	km_cmdlist['course'].cmdA.push({func:function (){
		//初始化学习动态
		learningfeed.start();
		$proto.pageloaded=true;
	}});

	km_cmdlist['course'].cmdI=0;
	km_cmdlist['course'].doCmdA();

};

//定义学习动态参数
//详见 [/opendesign/boilerplate-feed](/opendesign/boilerplate-feed)
var learningfeed=new km_feed({max:10,container:'feed_learningactivity'});

//定义页面上的广告
var public_ad={
    'frm_ad_course_default_1':{
        did:'d_ad_course_default_1'
    }
};
