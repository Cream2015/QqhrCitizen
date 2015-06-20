
$proto['pageLoad']=function (){

	var bgcolor=adtranObj.himgs[0].bgcolor;
	//var bgcolor='#ffffff';
	$('#d_banner').css({
		'background-color':bgcolor
	});

    //http://fgnass.github.io/spin.js/
    var opts = {
      lines: 13, // The number of lines to draw
      length: 8, // The length of each line
      width: 3, // The line thickness
      radius: 10, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#fff', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 78, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('div_spin');
    var spinner = new Spinner(opts).spin(target);

	km_cmdlist['home']=new km_cl('home');
	km_cmdlist['home'].cmdA.push({func:function (){
		//km_guide.show('guide1','showguide',$proto.basepath['html']);
		km_cmdlist['home'].doCmdA();
	}});
	km_cmdlist['home'].cmdA.push({func:function (){

		//特别策划每个条目的内容最多显示60个字
		/*
		$('#d_homespecial .content').succinct({
            size:60
        });
        */
		km_cmdlist['home'].doCmdA();
        
	}});
	km_cmdlist['home'].cmdA.push({func:function (){
		adtranObj.init();
	}});

	km_cmdlist['home'].cmdI=0;
	km_cmdlist['home'].doCmdA();
};

//定义页面上的广告
var public_ad={
    'frm_ad_home_default_1':{
        did:'d_ad_home_default_1'
    }
    ,'frm_ad_home_default_2':{
        did:'d_ad_home_default_2'
    }
};

/*
var adtranObj=new km_adtran();
adtranObj.afterinit=function (){
	$('#div_spin').remove();
	$('.d-banner .loading').remove();
	$('#d_banner_c').css({
		visibility:'visible'
	});
	$('#'+adtranObj.thumb).children().each(function (i){
		var _i=i;
		$(this).on('mouseover',function (){
			adtranObj.dotran(i);
		});
	});
	$('#d_homebanner').children().eq(0).css('z-index','11');
	$('#d_homebanner').css('display','block');
	adtranObj.start();

	$proto.pageloaded=true;
};
adtranObj.beforetran=function (oidx,nidx){
	if(oidx==-1){return;}
	$('#'+adtranObj.thumb).children().eq(oidx).stop();
	$('#'+adtranObj.thumb).children().eq(nidx).stop();
	$('#'+adtranObj.thumb).children().eq(oidx).find('span').stop();
	$('#'+adtranObj.thumb).children().eq(nidx).find('span').stop();
	$('#'+adtranObj.thumb).children().eq(oidx).find('span').css({'width':'0'});
	$('#'+adtranObj.thumb).children().eq(nidx).find('span').css({'width':'0'});
	$('#'+adtranObj.thumb).children().eq(oidx).animate({'margin-top':'7px'},100);
	$('#'+adtranObj.thumb).children().eq(nidx).animate({'margin-top':'0'},100);
}
adtranObj.aftertran=function (nidx){
	return;
	var it=adtranObj.list[nidx].interval;
	$('#'+adtranObj.thumb).children().eq(nidx).find('span').animate({'width':'100%'},it,function (){
		$(this).css({'width':'0'});
	});
}
adtranObj.container='d_homebanner';
adtranObj.thumb='d_banner_thumb';
adtranObj.himgs=[
	{id:'bb1',bg:'/resource/homebanner/6_1000x400.jpg',thumb:'/resource/homebanner/6_46x46.jpg',bgcolor:'#1c4ea3',fgcolor:'#fff'}
	,{id:'bb2',bg:'/resource/homebanner/2_1000x400.jpg',thumb:'/resource/homebanner/2_46x46.jpg',bgcolor:'#000000',fgcolor:'#fff'}
	,{id:'bb3',bg:'/resource/homebanner/3_1000x400.jpg',thumb:'/resource/homebanner/3_46x46.jpg',bgcolor:'#4c2514',fgcolor:'#fff'}
	,{id:'bb4',bg:'/resource/homebanner/4_1000x400.jpg',thumb:'/resource/homebanner/4_46x46.jpg',bgcolor:'#5fa5e2',fgcolor:'#fff'}
	,{id:'bb5',bg:'/resource/homebanner/5_1000x400.jpg',thumb:'/resource/homebanner/5_46x46.jpg',bgcolor:'#250e3d',fgcolor:'#fff'}
];
adtranObj.list=[
	{d:"bb1",interval:5000
		,beforetran:function (){

		}
		,aftertran:function (){

		}
	}
	,{d:"bb2",interval:5000}
	,{d:"bb3",interval:5000}
	,{d:"bb4",interval:5000}
	,{d:"bb5",interval:5000}
];
*/

function sub_t(n){
	$('#d_board .bar').animate({'left':n+'px'},100);
}

km_st.autohide=false;
