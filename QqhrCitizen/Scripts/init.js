﻿km_cmdlist.init=new km_cl("init"),km_cmdlist.init.cmdA.push({func:function(){""==$proto.systemTime&&($proto.systemTime=(new Date).getTime());var a=new Date($proto.systemTime);$proto.systemTime=[a.getFullYear(),nTos(a.getMonth()+1),nTos(a.getDate())],km_cmdlist.init.doCmdA()}}),km_cmdlist.init.cmdA.push({func:function(){ij2("",function(){km_cmdlist.init.doCmdA()})}}),km_cmdlist.init.cmdA.push({func:function(){$km.init(),km_lout.lout_keydown();try{$("input, textarea").placeholder()}catch(a){console.log("placeholder error: "+a.message)}$d.removeTextN(document.body),km_cmdlist.init.doCmdA()}}),km_cmdlist.init.cmdA.push({func:function(){if("undefined"!=typeof window.$autocom){var a=new $autocom({idx:"entry",fieldname:"entry_selitem_pg",count:10,val1:{field:["title"],str:"[title]"},val2:{field:["uid"],str:"[uid]"},style:"left:'0px'",afterclick:function(){}});a.init(),km_cmdlist.init.doCmdA()}else km_cmdlist.init.doCmdA()}}),km_cmdlist.init.cmdA.push({func:function(){Echo&&(Echo.init({offset:100,throttle:250}),Echo.render()),km_cmdlist.init.doCmdA()}}),km_cmdlist.init.cmdA.push({func:function(){if(!__isLocalStorageNameSupported)return $(".d-top-weather").css("width","0px"),void km_cmdlist.init.doCmdA();if("undefined"==typeof window.weatherAPI)return void km_cmdlist.init.doCmdA();if(!$$("span_weather")&&!$$("d_weather"))return void km_cmdlist.init.doCmdA();var a="";if($$("span_weather")&&(a=$("#span_weather").data("kmUrl")),$$("d_weather")&&(a=$("#d_weather").data("kmUrl")),a="http://api.shlll.net/weather?location=%E4%B8%8A%E6%B5%B7&output=json&ak=1b8027242390d93b9b2111278acd9fe0",!a)return void km_cmdlist.init.doCmdA();weatherAPI.url=a;var b="上海";null!==$proto.userinfo&&"undefined"!=typeof $proto.userinfo.location&&(b=$proto.userinfo.location),weatherAPI.get(b,function(){km_cmdlist.init.doCmdA()})}}),km_cmdlist.init.cmdA.push({func:function(){var a=$(document.body).attr("class");return a||(a=""),""==$proto.appid&&($proto.appid=a.substring(0,a.indexOf("__"))),""==$proto.pageid&&($proto.pageid=a.substring(a.indexOf("__")+2,a.length)),top!=window||null==$proto.userinfo||"undefined"==typeof $proto.userinfo.userprofile||"1"==$proto.userinfo.userprofile?void km_cmdlist.init.doCmdA():"modifypass"==$proto.pageid||"useraccount"==$proto.pageid||"verify"==$proto.pageid?void km_cmdlist.init.doCmdA():void km_cmdlist.init.doCmdA()}}),km_cmdlist.init.cmdA.push({func:function(){"undefined"!=typeof window.km_ad&&km_ad.load(function(){}),$proto.resize(),$proto.load()}}),$(document).ready(function(){km_cmdlist.init.cmdI=0,km_cmdlist.init.doCmdA()});