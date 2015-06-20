/**
@example 
var adtranObj=new km_adtran();
adtranObj.afterinit=function (){
	$('#'+adtranObj.thumb).children().each(function (i){
		var _i=i;
		$(this).on('mouseover',function (){
			adtranObj.dotran(i);
		});
	});
	$proto.pageloaded=true;
};
adtranObj.beforetran=function (oidx,nidx){
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
	var it=adtranObj.list[nidx].interval;
	$('#'+adtranObj.thumb).children().eq(nidx).find('span').animate({'width':'100%'},it,function (){
		$(this).css({'width':'0'});
	});
}
adtranObj.container='d_homebanner';
adtranObj.thumb='d_banner_thumb';
adtranObj.himgs=[
	{id:'bb1',bg:'/resource/homebanner/1_1000x400.jpg',thumb:'/resource/homebanner/1_46x46.jpg',bgcolor:'#000000'}
	,{id:'bb2',bg:'/resource/homebanner/2_1000x400.jpg',thumb:'/resource/homebanner/2_46x46.jpg',bgcolor:'#5b4116'}
	,{id:'bb3',bg:'/resource/homebanner/3_1000x400.jpg',thumb:'/resource/homebanner/3_46x46.jpg',bgcolor:'#212b50'}
	,{id:'bb4',bg:'/resource/homebanner/4_1000x400.jpg',thumb:'/resource/homebanner/4_46x46.jpg',bgcolor:'#60b131'}
	,{id:'bb5',bg:'/resource/homebanner/5_1000x400.jpg',thumb:'/resource/homebanner/5_46x46.jpg',bgcolor:'#735b1c'}
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
adtranObj.init();
*/
function km_adtran(){
	var self=this;
	this.adTran=-1;
	this.iv_adtran=null;
	this.container='';
	this.thumb='';
	this.fadespeed=400;
	this.himgs=[];
	this.beforetran=function (){};
	this.aftertran=function (){};
	this.afterinit=function (){};
	this.init=function (){

		var imgO=new km_image();
		imgO.himgs=[];
		imgO.func=function (){}
		imgO.after=function (){

			console.log('images loaded.');
			setTimeout(function (){

				for(var i=0;i<self.himgs.length;i++){
					$('#'+self.himgs[i].id).css({
						'background-color':self.himgs[i].bgcolor
					});
					$('#'+self.himgs[i].id+' p.h').css({
						'color':self.himgs[i].fgcolor
					});
					$('#'+self.himgs[i].id+' p.p').css({
						'color':self.himgs[i].fgcolor
					});
					$('#'+self.himgs[i].id+' a').css({
						'background-image':'url('+self.himgs[i].bg+')'
					});
					$('#'+self.thumb).children().eq(i).css({
						'background-image':'url('+self.himgs[i].thumb+')'
					});
				}
				self.afterinit();

			},100);
			
		}
		var s=',';
		for(var i=0;i<self.himgs.length;i++){
			if(s.indexOf(','+self.himgs[i].bg+',')==-1){
				imgO.himgs.push(self.himgs[i].bg);
			}
			s+=self.himgs[i].bg+',';
			if(s.indexOf(','+self.himgs[i].thumb+',')==-1){
				imgO.himgs.push(self.himgs[i].thumb);
			}
			s+=self.himgs[i].thumb+',';
		}
		imgO.init();

	};
	this.start=function (){
		$('#'+self.container).children().eq(0).css('z-index','11');
		setTimeout(function (){
			self.dotran(0,true);
		},100);
	};
	this.dotran=function (n,auto){
		if(auto){
			self.fadespeed=400;
		}else{
			self.fadespeed=100;
		}

		if(n==self.adTran){return;}

		var oidx=self.adTran;
		self.adTran=n;

		$('#'+self.container).children().each(function (){
			$(this).css('z-index','9');
		});
		if(oidx>-1){
			$('#'+self.container).children().eq(oidx).css('z-index','11');	
		}
		$('#'+self.container).children().eq(n).css('z-index','10');

		self.beforetran(oidx,n);
		if(typeof self.list[self.adTran].beforetran=="function"){
			self.list[self.adTran].beforetran();
		}

		if(self.lock){
			return;
		}
		self.lock=true;
		$('#'+self.container).children().eq(oidx).fadeOut(self.fadespeed,function (){
			self.lock=false;
			$(this).css('z-index','9');
			$(this).show();
			clearInterval(self.iv_adtran);
			if(typeof self.list[self.adTran].aftertran=="function"){
				self.list[self.adTran].aftertran();
			}
			self.aftertran(self.adTran);
			self.iv_adtran=setInterval(function (){
				var next_tran=(self.adTran+1==self.list.length)?0:self.adTran+1;
				self.dotran(next_tran,true);
			},self.list[self.adTran].interval);
		});

	};
};
