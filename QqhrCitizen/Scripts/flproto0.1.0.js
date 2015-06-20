
var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

var FileAPI_support = (function(undefined) {
    return $("<input type='file'>").get(0).files!==undefined;
})();
var PF_host=window.location.href.substring(7,window.location.href.indexOf("/",7));
var PF_ie=false,PF_ie6=false,PF_ie7=false,PF_Trident=false;
function ck(){
	PF_ie=isBrowserSupported();
	if(isBrowser().indexOf("IE 版本:6")!=-1){PF_ie6=true;}
	if(isBrowser().indexOf("IE 版本:7")!=-1){PF_ie7=true;}
	if(isBrowser().indexOf("IE(Trident) 版本:")!=-1){PF_Trident=true;}
	try{
		var c1=isBrowserSupported(),l=location.href;
		if((l.indexOf("browserchk")>-1)||(l.indexOf("browsersupported")>-1)){var cs="BROWSER:"+isBrowser();document.getElementById("divchk").innerHTML=cs;return;}
	}catch(eb1){}
}
function cc(f){return f?"支持":"不支持";}
function isBrowserSupported(){
	var agt=navigator.userAgent.toLowerCase();
	var is_op=(agt.indexOf("opera")>-1),
		is_ie=((agt.indexOf("msie")>-1)&&document.all&&!is_op),
		is_ie5=((agt.indexOf("msie 5")>-1)&&document.all&&!is_op),
		is_mac=(agt.indexOf("mac")>-1),
		is_gk=(agt.indexOf("gecko")>-1)&&(agt.indexOf("trident")==-1),
		is_trident=(agt.indexOf("trident")>-1)&&(agt.indexOf("msie")==-1),
		is_sf=(agt.indexOf("safari")>-1);
	
	if(is_ie&&!is_op&&!is_mac){
		if(agt.indexOf("palmsource")>-1||agt.indexOf("regking")>-1||agt.indexOf("windows ce")>-1||agt.indexOf("j2me")>-1||agt.indexOf("avantgo")>-1||agt.indexOf(" stb")>-1){
			return false;
		}
		var v=GetFollowingFloat(agt,"msie ");
		if(v!=null){return (v>=5.5);}
	}
	if(is_trident){
		var v=GetFollowingFloat(agt,"rv:");
		if(v!=null){
			return true;
		}
	}
	return false;
}
function isBrowser(){
	var s="";
	var agt=navigator.userAgent.toLowerCase();
	//alert(agt);
	var is_op=(agt.indexOf("opera")>-1),
		is_ie=((agt.indexOf("msie")>-1)&&document.all&&!is_op),
		is_ie5=((agt.indexOf("msie 5")>-1)&&document.all&&!is_op),
		is_mac=(agt.indexOf("mac")>-1),
		is_gk=(agt.indexOf("gecko")>-1)&&(agt.indexOf("trident")==-1),
		is_trident=(agt.indexOf("trident")>-1)&&(agt.indexOf("msie")==-1),
		is_sf=(agt.indexOf("safari")>-1);
	
	if(is_ie&&!is_op&&!is_mac){
		if(agt.indexOf("palmsource")>-1||agt.indexOf("regking")>-1||agt.indexOf("windows ce")>-1||agt.indexOf("j2me")>-1||agt.indexOf("avantgo")>-1||agt.indexOf(" stb")>-1){
			s="非windows操作系统";
		}
		var v=GetFollowingFloat(agt,"msie ");
		if(v!=null){s="IE 版本:"+v;}
	}
	if(is_trident){
		var v=GetFollowingFloat(agt,"rv:");
		if(v!=null){
			s="IE 版本:"+v;
		}
	}
	if(is_gk&&!is_sf){
		var v=GetFollowingFloat(agt,"rv:");
		if(v!=null){
			s="gecko 版本:"+v;
		}else{
			v=GetFollowingFloat(agt,"galeon/");
			if(v!=null){s="gecko 版本:"+v;}
		}
	}
	if(is_sf){
		var v=GetFollowingFloat(agt,"safari/");
		if(v!=null){s="safari 版本:"+v;}
	}
	if(is_op){
		var v=GetFollowingFloat(agt,"opera ");
		if(v==null){
			v=GetFollowingFloat(agt,"opera/");
		}
		if(v!=null){s="Opera 版本:"+v;}
	}
	return s;
}
function GetFollowingFloat(str,pfx){var i=str.indexOf(pfx);if(i>-1){var v=parseFloat(str.substring(i+pfx.length));if(!isNaN(v)){return v;}}return null;}
function isCookieEnabled(){
	var s=String(new Date().getTime());
	document.cookie="cookie"+s;
	var ws_c=(document.cookie.indexOf("cookie"+s)>-1)?true:false;
	document.cookie="";
	return ws_c;
}
ck();
var devDetect={
	isIPad:function(){return navigator.userAgent.match(/iPad/i)!==null;},
	isIPhone:function(){return navigator.userAgent.match(/iPhone/i)!==null;},
	isIOS:function(){return this.isIPhone()||this.isIPad();},
	iOSVersion:function(){
		var match=navigator.userAgent.match(/OS (\d+)_/i);
		if(match&&match[1]){return match[1];}
	},
	isIOS4:function (){
		if(!this.isIOS()){return false;}
		var iosv=this.iOSVersion();
		return ( iosv < 5 && iosv >= 4);
	}
};

var $d={
    func: null,
    checkLen:function (obj,maxlen,did) {
		if(obj.value.length>maxlen){obj.value=obj.value.substring(0,maxlen);}
		var curr=maxlen-obj.value.length;
		document.getElementById(did).innerHTML='剩余 '+curr.toString()+' 个字'; 
	},
	eval:function (data){
		eval(data);
	},
	cc:function (d,n,a){
		var x_i=document.createElement(n.toUpperCase());
		if(a!=null){
			for(var _i=0;_i<a.length;_i++){
				var x_t=document.createAttribute(a[_i][0]);
				x_t.value=a[_i][1];
				x_i.attributes.setNamedItem(x_t);
			}
		}
		if(typeof d=='string'){d=$$(d);}
		if(d){x_i=d.appendChild(x_i);}
		return x_i;
	},
	remove:function (ds){
		var _d=(ds.indexOf(",")==-1)?[ds]:ds.split(",");
		for(var _i=0;_i<_d.length;_i++){
			if($$(_d[_i])){
				$d.rn($$(_d[_i]));
				do {
					if($$(_d[_i])==null){return;}
					$d.remove(_d[_i]);
				}
				while ($$(_d[_i])!=null);
				return;
			}
			var _dn=document.getElementsByName(_d[_i]);
			if(_dn!=null){
				if(_dn.length>0){
					for(var _j=0;_j<_dn.length;_j++){
						$d.rn(_dn[_j]);
					}
				}
			}
		}
	},
	rn:function (n){
		var DOC = document;
		if(PF_ie){
			var d;
			if(n && n.tagName != 'BODY'){
				d = d || DOC.createElement('div');
				d.appendChild(n);
				d.innerHTML = '';
			}
		}else{
			if(n && n.parentNode && n.tagName != 'BODY'){
				n.parentNode.removeChild(n);
			}
		}
	},
	getChilds:function (d,tn,ni){
		if(d==null){return null;}
		if(!d.hasChildNodes()){
			if(ni!=null){return null;}
			return [];
		}
		var _list=[];
		var _li=d.childNodes;
		for(var _j=0;_j<_li.length;_j++){
			var d_i=_li[_j];
			if(tn){
				if(d_i.nodeName==tn.toUpperCase()){_list.push(d_i);}
			}else{
				if((d_i.nodeType==3)&&(d_i.nodeValue=="")){

				}else{
					_list.push(d_i);
				}
			}
		}
		if(ni!=null){
			var _lo=null;
			try{_lo=_list[ni];}catch(ne){}
			return _lo;
		}
		return _list;
	},
	removeTextN:function (d){
		try{
			if(!d){return;}
			if(!d.hasChildNodes()){return;}
			var _li=d.childNodes;
			for(var _j=_li.length-1;_j>=0;_j--){
				var d_i=_li[_j];
				if((d_i.nodeType==3)&&(d_i.nodeValue.replace(/[ \f\n\r\t\v]/g,"")=="")){
					d_i.parentNode.removeChild(d_i);
				}else{
					var _d=d_i;
					$d.removeTextN(_d);
				}
			}
		}catch(ex){}
	},
	setAttr:function (d_o,d_a,d_v){
		if(d_a.indexOf("|")==-1){d_o.setAttribute(d_a,d_v);return;}
		var d_xa=d_a.split("|");
		for(var di=0;di<d_xa.length;di++){
			if(d_xa[di].indexOf(":")!=-1){
				var d_ya=d_xa[di].split(":");
				d_o.setAttribute(d_ya[0],d_ya[1]);
			}
		}
	},
	gBT:function (d_o,d_r){
		if(typeof d_o!="object"){d_o=$$(d_o);}
		return d_o.getElementsByTagName(d_r);
	},
	getWin:function (frame,doc){
		if(PF_ie){return frame.contentWindow;}
		if(!doc){doc=$d.getDoc(frame);}
		if(doc.parentWindow){
			return doc.parentWindow;
		}
		if((isBrowser().indexOf("gecko")!=-1)||(isBrowser().indexOf("safari")!=-1)){
			var scriptElement=doc.createElement('script');
			scriptElement.innerHTML='document.parentWindow=window';
			var parentElement=doc.documentElement;
			parentElement.appendChild(scriptElement);
			parentElement.removeChild(scriptElement);
			return doc.parentWindow;
		}
		return doc.defaultView;
	},
	getDoc:function (frame){
		if(frame==null){return null;}
		if((isBrowser().indexOf("gecko")!=-1)||(isBrowser().indexOf("safari")!=-1)){
			doc=(frame.document || frame.contentWindow.document);
		}else{
			doc=(frame.contentDocument || frame.contentWindow.document);
		}
		return doc;
	},
	evt:function (){
		if(document.all)return window.event;
		try{
			func=$d.evt.caller;
			while(func!=null){
				var arg0=func.arguments[0];
				if(arg0){if((arg0.constructor==Event||arg0.constructor==MouseEvent)||(typeof(arg0)=="object"&&arg0.preventDefault&&arg0.stopPropagation)){return arg0;}}
				func=func.caller;
			}
		}catch(er2){return window.event;}
		return null;
	},
	elem:function (ent){
		try{return ent.srcElement||ent.target;}catch(_em){return null;}
	},
	dk:function (cmd){var ent=$d.evt();if(ent.keyCode==13){
		if(typeof cmd=="function"){cmd();}else{$d.eval(cmd);}
	}},
	ifrm:function (d,name,src,func){
		if($$(name)||document.getElementsByName(name)[0]){return;}
		var iframe=$d.cc('','iframe',[['id',name],['frameborder','0']]);
		//iframe.src = '';
		iframe.name=name;
		iframe.frameborder='0';
		iframe.scrolling='no';
		$d.setAttr(iframe,"width:1|height:1|scrolling:no");
		if(typeof func=='function'){
			(function (){
				var _func=func;
				if(iframe.attachEvent){
				    iframe.attachEvent("onload",function(){_func()});
				}else{
				    iframe.onload=function(){_func()};
				}
			})();
		}
		if(typeof d=='string'){d=$$(d);}
		d.appendChild(iframe);
		iframe.style.border='none';
	}
	,frm:function (option,did,keephtml){
		try{
			var iframe=document.createElement('<iframe id="'+option.id+'" name="'+option.id+'" />');
		}catch(e){
			var iframe=document.createElement("iframe");
			var x_t=document.createAttribute("id");
			x_t.value=option.id;
			iframe.attributes.setNamedItem(x_t);
		}

		if((/MSIE (6|7|8)/).test(navigator.userAgent)){
			var x_t=document.createAttribute("frameborder");
			x_t.value="0";
			iframe.attributes.setNamedItem(x_t);
		}

		iframe.name=option.id;
		iframe.frameborder='0';
		iframe.scrolling='no';
		$d.setAttr(iframe,"width:100%|height:1|scrolling:no");
		if(!keephtml){
			$$(did).innerHTML='';
		}
		$$(did).appendChild(iframe);
		iframe.style.border='none';
		iframe.style.visibility='hidden';
		iframe.allowTransparency='true';
	}
	,mb:function (d,j,cs,ch){
		if(typeof d!="object"){d=$$(d);}
		if((d=="")||(d==null)){return;}
		if(j==null){
			var s=(d.style.display=="none")?"block":"none";
		}else{
			var s=(j==1)?"block":"none";
		}
		if(cs!=null){d.className=cs;}
		if(ch!=null){d.innerHTML=ch;}
		if(s=="block"){$d.removeTextN(d);}
		d.style.display=s;
	}
	,mb2:function (d1,d2){
		var da1=(d1.indexOf(',')==-1)?[d1]:d1.split(',');
		for(var i=0;i<da1.length;i++){
			if($$(da1[i]).style.display=='none'){$$(da1[i]).style.display='block';}
			else if($$(da1[i]).style.display=='block'){$$(da1[i]).style.display='none';}
		}
		var da2=(d2.indexOf(',')==-1)?[d2]:d2.split(',');
		for(var i=0;i<da2.length;i++){
			$$(da2[i]).style.display='none';
		}
	}
	,debounce:function (func, wait, immediate) {
		// As taken from the UnderscoreJS utility framework
		// window.addEventListener('resize', debounce(function(event) {}, 300));
	    var timeout;
	    return function() {
	        var context = this, args = arguments;
	        var later = function() {
	            timeout = null;
	            if (!immediate) func.apply(context, args);
	        };
	        var callNow = immediate && !timeout;
	        clearTimeout(timeout);
	        timeout = setTimeout(later, wait);
	        if (callNow) func.apply(context, args);
	    }
	}
	,setInterval_i:function (){
        window.addEventListener('message', function(e) {
        	console.log(e.data);
        },false);
        var it=1000; //1s
        var iframe=document.createElement('iframe');
        iframe.style.display='none';
        iframe.id='timerios';
        //iframe.src='data:text/html,%3C%21DOCTYPE%20html%3E%0A%3Chtml%3E%0A%3Chead%3E%0A%09%3Cmeta%20charset%3D%22utf-8%22%20%2F%3E%0A%09%3Cmeta%20http-equiv%3D%22refresh%22%20content%3D%22'+it+'%22%20id%3D%22metarefresh%22%20%2F%3E%0A%09%3Ctitle%3Ex%3C%2Ftitle%3E%0A%3C%2Fhead%3E%0A%3Cbody%3E%0A%09%3Cscript%3Etop.postMessage%28%27refresh%27%2C%20%27%2A%27%29%3B%3C%2Fscript%3E%0A%3C%2Fbody%3E%0A%3C%2Fhtml%3E';
        var f='';
        iframe.src=f;

        document.body.insertBefore(iframe, document.body.childNodes[0]);

        /*
        var s='';
        s+='<!doctype html>';
        s+='<html><head>';
        s+='<meta charset="utf-8">';
        s+='<meta http-equiv="refresh" content="15" id="metarefresh">';
        s+='<title>reload</title>';
        s+='</head>';
        s+='<body>';
        s+='<script>top.postMessage(\'[data]\', \'*\');</script>';
        s+='</body>';
        s+='</html>';
        */

	}
	,clearInterval_i:function (){
		if($$('timerios')){$$('timerios').parentNode.removeChild($$('timerios'));}
		//window.removeEventListener();
	}
	,clone:function (src) {
		function mixin(dest, source, copyFunc) {
			var name, s, i, empty = {};
			for(name in source){
				// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
				// inherited from Object.prototype.	 For example, if dest has a custom toString() method,
				// don't overwrite it with the toString() method that source inherited from Object.prototype
				s = source[name];
				if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
					dest[name] = copyFunc ? copyFunc(s) : s;
				}
			}
			return dest;
		}

		if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
			// null, undefined, any non-object, or function
			return src;	// anything
		}
		if(src.nodeType && "cloneNode" in src){
			// DOM Node
			return src.cloneNode(true); // Node
		}
		if(src instanceof Date){
			// Date
			return new Date(src.getTime());	// Date
		}
		if(src instanceof RegExp){
			// RegExp
			return new RegExp(src);   // RegExp
		}
		var r, i, l;
		if(src instanceof Array){
			// array
			r = [];
			for(i = 0, l = src.length; i < l; ++i){
				if(i in src){
					r.push(clone(src[i]));
				}
			}
			// we don't clone functions for performance reasons
			//		}else if(d.isFunction(src)){
			//			// function
			//			r = function(){ return src.apply(this, arguments); };
		}else{
			// generic objects
			r = src.constructor ? new src.constructor() : {};
		}
		return mixin(r, src, clone);

	}
};





// http://www.andrewduthie.com/post/a-self-correcting-setinterval-alternative/
window.setCorrectingInterval = (function(func, delay) {
  var instance = { };

  function tick(func, delay) {
    if (!instance.started) {
      instance.func = func;
      instance.delay = delay;
      instance.startTime = new Date().valueOf();
      instance.target = delay;
      instance.started = true;

      setTimeout(tick, delay);
    } else {
      var elapsed = new Date().valueOf() - instance.startTime,
        adjust = instance.target - elapsed;

      instance.func();
      instance.target += instance.delay;

      setTimeout(tick, instance.delay + adjust);
    }
  };

  return tick(func, delay);
});

function mb(d,j,cs,ch){
	if(typeof d!="object"){d=$$(d);}
	if((d=="")||(d==null)){return;}
	if(j==null){
		var s=(d.style.display=="none")?"block":"none";
	}else{
		var s=(j==1)?"block":"none";
	}
	if(cs!=null){d.className=cs;}
	if(ch!=null){d.innerHTML=ch;}
	if(s=="block"){$d.removeTextN(d);}
	d.style.display=s;
}

function $$(d,p,v,w){
	if(!d){return;}
	if(!w){w=window;}
	var _d=d;
	var g=(typeof _d=="object")?_d:w.document.getElementById(_d);
	if(!g){
		var _g=w.document.getElementsByName(d);
		if(_g.length>0){g=_g[0];}
	}
	if(!g){return;}
	switch(p){
	case "c":g.className=v;break;
	case "h":
		try{g.innerHTML=v.replace(/[\f\n\r\t\v]/g,"");}catch(ex){
			var _d=(typeof d=="object")?d.id:d;
			alert(_d+'\n'+v);
		}
		break;
	case "visibility":g.style.visibility=v;break;
	case "b":g.style.visibility=v;break;
	case "src":g.src=v;break;
	case "value":g.value=v;break;
	case "v":g.value=v;break;
	case "disabled":g.disabled=(v=="true");break;
	case "style":
		try{
			var t=v.split(",");
			for(var o=0;o<t.length;o++){
				if(t[o]!=""){
					var a=t[o].split(":");
					if(PF_ie){
						w.g=g;
						w.g.style[a[0]]=a[1].replace(/\'/g,"");
						w.g=null;
					}else{
						w['_g_']=g;
						w['_g_'].style[a[0]]=a[1].replace(/\'/g,"");
						delete w['_g_'];
					}
				}
			}

		}catch(_eg){km_debug.a("",_eg.message+"\n"+d);}
		break;
	}
	return g;
}

$km={
	shouldscroll:[]
	,scrolling:false
	,init:function (g){
		window.onresize=function (){
			if(window['resize']==1){return;}
			window['resize']=1;
			$km.resize();
			setTimeout(function (){window['resize']=0;},50);
		}
		document.ondragstart=function (){return false;}
		document.onselectionchange=function (){return false;}
		document.body.onselectstart=function (){return true;}
		
		if(navigator.userAgent.match(/iPad/i)!==null){
			document.addEventListener('touchstart',__kb,false);
		}else{
			document.onmousedown=function (){
				km_kb._try();
				if(typeof $km['cd']!='undefined'){return;}
				try{
					if(parent!=window){
						parent.km_kb._try();
					}
				}catch(ea){}
			}
		}

		if(!PF_ie){
			document.addEventListener('scroll',function(){
				$km.mainscroll();
			},false);
		}else{
			window.onscroll=function (){
				$km.mainscroll();
			};
		}

		for(var i=0;i<this.shouldscroll.length;i++){
			$$(this.shouldscroll[i]).addEventListener('touchmove', function(e){
			    e.stopPropagation();
	        }, false);
		}
		km_kb.bindunbeforunload();
	}
	,resize:function (){
		try{CollectGarbage();setTimeout(function (){CollectGarbage();},1);}catch(_e709){}
		/*
		var wha=km_scr.wh();
		var maxw=wha[0],maxh=wha[1],minw=wha[2],minh=wha[3];
		var minw2=(minw<1001)?1001:minw;

		if($$("d_main")&&$$("div_m_floatbox_i1")&&($$("div_m_floatbox_i1").style.height!='')){
			if($$('div_m_floatbox_i1').style.height=='auto'){
				$$('div_m_floatbox_i1').style.height=$$('div_m_floatbox_i1').offsetHeight+'px';
			}
			$$("mPaper_i1","style","width:'"+minw2+"px',height:'"+(maxh)+"px'");
		}
		*/
		try{
			var h1=$('#p_win').height()+100;
			var h=Math.max($(window).height(),$(document.body).height(),h1);

		}catch(e){
			console.log('666:'+e.message);
		}

		// 用 $('.float_box_km') 会报错 没有权限
		$('#div_m_floatbox_i1').css({height:h+'px'});
		$('#div_m_floatbox_i2').css({height:h+'px'});
		$('#flalert').css({height:h+'px'});
		$('#flmpaper_grey').css({height:h+'px'});
		$('#flmpaper_white').css({height:h+'px'});
		$proto.resize();
	}
	,mainscroll:function (){
		if($km.scrolling){return;}
		if(typeof $proto['mainscroll']!='function'){return;}
		$km.scrolling=true;
		setTimeout(function(){
			$proto.mainscroll();
			$km.scrolling=false;
		},100);
	}
}

var CookieUtil={
	usestore:true,
	get:function (name){
		if(this.usestore){
			return store.get(name);
		}
		var cookieName=encodeURIComponent(name)+"=",
			cookieStart=document.cookie.indexOf(cookieName),
			cookieValue="";
		if(cookieStart>-1){
			var cookieEnd=document.cookie.indexOf(";",cookieStart);
			if(cookieEnd==-1){
				cookieEnd=document.cookie.length;
			}
			cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
		}
		return cookieValue;
	},
	set:function (name,value,expires,path,domain,secure){
		if(this.usestore){
			store.set(name,value);
			return;
		}
		var cookieText=encodeURIComponent(name)+"="+encodeURIComponent(value);
		if(expires instanceof Date){cookieText+="; expires="+expires.toGMTString();}
		if(path){
			cookieText+="; path="+path;
		}else{
			cookieText+="; path=/"+$proto.protoid;
		}
		if(domain){cookieText+="; domain="+domain;}
		if(secure){cookieText+="; secure";}
		document.cookie=cookieText;
	},
	unset: function (name,path,domain,secure){
		this.set(name,"",new Date(0),path,domain,secure);
	}
};

var Cookie={
	get:function (name){
		var cookieName=encodeURIComponent(name)+"=",
			cookieStart=document.cookie.indexOf(cookieName),
			cookieValue="";
		if(cookieStart>-1){
			var cookieEnd=document.cookie.indexOf(";",cookieStart);
			if(cookieEnd==-1){
				cookieEnd=document.cookie.length;
			}
			cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
		}
		return cookieValue;
	},
	set:function (name,value,expires,path,domain,secure){
		var cookieText=encodeURIComponent(name)+"="+encodeURIComponent(value);
		if(expires instanceof Date){cookieText+="; expires="+expires.toGMTString();}
		if(path){
			cookieText+="; path="+path;
		}else{
			cookieText+="; path=/";
		}
		if(domain){cookieText+="; domain="+domain;}
		if(secure){cookieText+="; secure";}
		document.cookie=cookieText;
	},
	unset: function (name,path,domain,secure){
		this.set(name,"",new Date(0),path,domain,secure);
	}
};

function $q(options){
    var self=this;

    this.mode='';// local or web
    this.type='';
    this.url='';
    this.cache='';
    this.data=null;
    this.done=null;
    this.fail=null;
    this.always=null;

    this.req={query:{},body:{}};
    this.res=null;

    this.init=function (options){

        self.mode='';// local or web
        self.type='';
        self.url='';
        self.cache='';
        self.data=null;
        self.done=null;
        self.fail=null;
        self.always=null;

        self.req={query:{},body:{}};
        self.res=null;

        if(options){
            for(var i in options){
                self[i]=options[i];
            }
        }

        self.mode=public_mode;
    }

    this.posting=function (){
        if(self.mode=='local'){
            if(self.type.toLowerCase()=='get'){

                self.req.query={};
                var a=self.url.split('?');
                var b=(a[1].indexOf('&')==-1)?[a[1]]:a[1].split('&');
                for(var i=0;i<b.length;i++){
                    var c=(b[i].indexOf('=')==-1)?[b[i],'']:b[i].split('=');
                    self.req.query[c[0]]=c[1];
                }
                console.log('self.req.query: '+JSON.stringify(self.req.query));

            }else if(self.type.toLowerCase()=='post'){

                self.req.query={};
                self.req.body=self.data;
                console.log('self.req.body: '+JSON.stringify(self.req.body));
            }
            self.res={
                send:function (data){
                    self.done(data);
                    self.always();
                }
            }
            $m.handler(self.req,self.res);

        }else if(self.mode=='web'){
            if(self.type.toLowerCase()=='get'){
                var posting=$.ajax({
                    type:self.type
                    ,url:self.url
                    ,cache:self.cache
                });
            }else if(self.type.toLowerCase()=='post'){
                var posting=$.ajax({
                    type:self.type
                    ,url:self.url
                    ,cache:self.cache
                    ,data:self.data
                });
            }
            posting.done(function(data){
                self.done(data);
            });
            posting.fail(function(data){
                self.fail(data);
            });
            posting.always(function(data){
                self.always(data);
            });
        }
    }

    self.init(options);
}

var km_kb={
	showing:[],
	_fw:function (o,para,func){
		if(o==null){return;}
		if(typeof func=="function"){func(o,para);}
		o.style.display='block';
	},
	_set:function (o,para,func,func2,para2){try{
		this._fw(o,para,func);
		this.showing.push({o:o,para:para2,func:func2});
	}catch(_de){
		alert('km_kb._set: '+_de.message);
	}},
	_hide:function (){
		for(_k=this.showing.length-1;_k>=0;_k--){
			try{this.showing[_k].o.style.display='none';}catch(_ex){}
		}
		this.showing=[];
	},
	_hideo:function (o){
		for(_k=this.showing.length-1;_k>=0;_k--){
			if(o==this.showing[_k].o){
				this.showing[_k].o.style.display='none';
				this.showing[_k]=null;
				delete this.showing[_k];
				break;
			}
		}
	},
	_try:function (o){
		if(typeof window.fo=='object'){
			if(km_btn.suspend){
				km_btn.fc(window.fo,'mouseout');
				km_btn.suspend=false;
				return;
			}
		}
		if(this.showing.length==0){return false;}
		try{
			var ent=$d.evt();
			if(!o){o=$d.elem(ent);}
		}catch(eg1){}
		for(_k=this.showing.length-1;_k>=0;_k--){
			this._tryo(o,_k,o);
		}
		for(_k=0;_k<this.showing.length;_k++){
			if(this.showing[_k]!=null){return false;}
		}
		this.showing=[];
	},
	_tryo:function (_o,_s,o){
		if(this.showing[_s]==null){return false;}
		if(_o==this.showing[_s].o){return false;}
		if((_o==null)||(_o.tagName=="BODY")){
			var __o=this.showing[_s].o;
			var __para=this.showing[_s].para;
			var __c=true;
			if((typeof this.showing[_s].func!="undefined")&&(this.showing[_s].func!=null)){
				__c=this.showing[_s].func(__o,o,__para,_s);
			}
			if(__c){
				this.showing[_s].o.style.display='none';
				this.showing[_s]=null;
			}
			return false;
		}
		this._tryo(_o.parentNode,_s,o);
	},
	bindunbeforunload:function (func_unload){
		window.onbeforeunload=function (){
			if($$("checkquit")){
				if(typeof func_unload=='function'){func_unload();}
				var rt=$$("checkquit").value;
				if(PF_ie){
					window.event.returnValue=rt;
				}else{
					return rt;
				}
			}
			/*
			//只有点右上角X的时候弹出提示,让用户确认(是否关闭)
			//解决了onbeforeunload()函数在刷新页面也弹出的问题)
			//而且无需再body中加载
			var evt=$d.evt();
			if(evt.clientX>360&&evt.clientY<0){
				window.event.returnValue="提示：您确定要离开当前页面吗？";
			} 
			*/
		}
	},
	unbindunbeforunload:function (){
		window.onbeforeunload=null;
	}
};
function __kb(){
	km_kb._try();
	if(typeof $km['cd']!='undefined'){return;}
	try{
		if(parent!=window){
			parent.km_kb._try();
		}
	}catch(ec){}
}


var km_scr={
	bid:''
	,mid1:''
	,mid2:''
	,ie6frame:""
	,ie6mpaper:""
	,wh:function (){
		var maxw=Math.max(Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),Math.max(document.body.clientWidth, document.documentElement.clientWidth));	
		var maxh=Math.max(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),Math.max(document.body.clientHeight, document.documentElement.clientHeight));	
		var minw=Math.min(Math.min(document.body.offsetWidth, document.documentElement.offsetWidth),Math.min(document.body.clientWidth, document.documentElement.clientWidth));	
		var minh=Math.min(Math.min(document.body.scrollHeight, document.documentElement.scrollHeight),Math.min(document.body.offsetHeight, document.documentElement.offsetHeight),Math.min(document.body.clientHeight, document.documentElement.clientHeight));	
		var ch=Math.max(document.body.clientHeight, document.documentElement.clientHeight);
		return [maxw,maxh,minw,minh,ch];
	}
	,modal:function (t,p,func1,func2){
		km_scr.init();
		if(p==null){p="";}
		var x_t=null;
		if(typeof $proto.pagelets[t]=='undefined'){return;}
		x_t=$proto.pagelets[t];

		if(typeof func1=='function'){x_t.before=func1;}
		if(typeof func2=='function'){x_t.onload=func2;}

		var mid=x_t.mid;
		if(mid.substring(mid.length-1,mid.length)=='2'){
			if(km_scr.mid2!=''){$proto.top.km_scr.close();}
			km_scr.mid2=mid;
		}
		if(mid.substring(mid.length-1,mid.length)=='1'){
			if(km_scr.mid2!=''){$proto.top.km_scr.close();}
			if(km_scr.mid1!=''){$proto.top.km_scr.close();}
			km_scr.mid2='';
			km_scr.mid1=mid;
		}

		var _w=x_t.w;
		var _h=x_t.h;

		if(typeof x_t.src=='undefined'){x_t.src='';}
		var _src=x_t.src;
		_src=(_src!=''&&p!='')?_src+''+p:_src;

		x_t.re=[
			{re:/\[src\]/g,val:_src},
			{re:/\[w\]/g,val:_w},
			{re:/\[t\]/g,val:t},
			{re:/\[h0\]/g,val:_h},
			{re:/\[h1\]/g,val:50},
			{re:/\[h2\]/g,val:_h-50-20}
		];
		$proto.top.km_scr.showview(x_t);
		return false;
	}
	,showview:function (x_t,n){
		var mid=x_t.mid;
		var x_sco=x_t.p;
		if(!n){
			if(typeof x_t.temp!='undefined'&&x_t.temp=='1'){
				if(typeof $proto.top.$proto.cApp[x_sco]=="undefined"){
					(function (){
						var _t=x_t;
						_ij(x_sco,function (){
							$proto.top.km_scr.showview(_t,true);
						});
					})();
					return;
				}
			}else{
				if(typeof x_t.title=="undefined"){x_t.title="";}
				$proto.top.$proto.cApp[x_sco]=$proto.top.$proto.floattemp;
				$proto.top.$proto.cApp[x_sco]=$proto.top.$proto.cApp[x_sco].replace(/\[title\]/g,x_t.title);
			}
		}
		var x_str=$proto.top.$proto.cApp[x_sco];
		if(typeof x_t.before=="function"){x_t.before();}
		$proto.top.km_scr.open(x_t,mid,x_str);
		if(typeof x_t['src']=='undefined'){x_t['src']='';}
		if(x_t.src==''){
			if(typeof x_t.onload=="function"){x_t.onload();}
			$km.resize();
		}else{
			$proto.top.km_scr.loading(x_t);
		}
	}
	,loading:function (x_t,n){
		var d=x_t.frm;
		var mid=x_t.mid;
		var d_load='d_loading_'+d;
		if(n===null||typeof n=='undefined'){n=0;}
		try{
			if($$(d_load)==null){
				var x_i=$d.cc($$(d).parentNode,"DIV",[["id",d_load],["class","clsloading"]]);
				x_i.appendChild(document.createTextNode("正在装载..."));
			}
			var _d=$proto.top.$d.getDoc($$(d));
			var c1=_d.body&&(str_trimSpace(_d.body.innerHTML)!=''&&_d.body.outerHTML.toLowerCase().indexOf('<\/body>')!=-1);
			c1=c1&&(_d.readyState=="complete"||_d.readyState=="loaded");
			if(c1){
				$d.removeTextN($$(d).parentNode);
				if($$(d_load)){$$(d_load).parentNode.removeChild($$(d_load));}
				if(mid.substring(mid.length-3,mid.length-1)=='_i'){
					$$(d).style.width="100%";
					$proto.top.km_scr.frm_control(d,null,'div_m_'+mid);
				}else{
					$$(d).style.width="100%";
					$$(d).style.height="100%";
				}
				if(typeof x_t.onload=="function"){x_t.onload();}
				return;
			}
		}catch(e1){console.log('222:'+e1.message);}

		var __n=n+1;
		var _x_t=x_t;
		if(__n>40){
			$proto.top.km_scr.close();
			//$proto.top.Alert('打开窗口超时，请重新进行操作');
			console.log('打开窗口超时，请重新进行操作');
			return;
		}
		setTimeout(function (){$proto.top.km_scr.loading(_x_t,__n)},500);
	}
	,frmloading:function (d,after,n){
		if(n===null||typeof n=='undefined'){n=0;}
		var d_load='d_loading_'+d;
		try{
			if($$(d_load)==null){
				var x_i=$d.cc($$(d).parentNode,"DIV",[["id",d_load],["class","clsloading"]]);
				x_i.appendChild(document.createTextNode("正在装载..."));
			}
		}catch(e1){console.log('frmloading e1:'+e1.message);}
		try{
			var _d=$d.getDoc($$(d));
			console.log(_d.readyState);
			var c1=_d.body&&(str_trimSpace(_d.body.innerHTML)!=''&&_d.body.outerHTML.toLowerCase().indexOf('<\/body>')!=-1);
			c1=c1&&(_d.readyState=="complete"||_d.readyState=="loaded");
			//_d.readyState=="interactive"||_d.readyState=="uninitialized"||_d.readyState=="loading"
			if(c1){
				$d.removeTextN($$(d).parentNode);
				if($$(d_load)){$$(d_load).parentNode.removeChild($$(d_load));}
				$$(d).style.width="100%";
				var afterback=false;
				if(typeof after=="function"){
					afterback=after(d,_d);
				}
				if(!afterback){
					km_scr.frm_control2(d);
				}
				return;
			}
		}catch(e3){console.log('frmloading e3:'+e3.message);}
		if((n+1)>30){
			//$proto.top.Alert('页面加载超时，请重新刷新页面。');
			console.log('页面加载超时，请重新刷新页面。');
			return;
		}
		var __n=n+1;
		var __d=d;
		var __after=after;
		setTimeout(function (){
			km_scr.frmloading(__d,__after,__n);
		},500);
	}
	,frm_control:function (n,h,did){
		var doc=$proto.top.$d.getDoc($proto.top.$$(n));
		if(h==null){
			h=Math.max(
	        	Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
	        	Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
	        	Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
	    	);
		}
		var eo=$proto.top.$$(n);
		eo.style.height=h+'px';
		eo.height=h+'px';
		do{
			eo=eo.parentNode;
			eo.style.height='auto';
		}while(eo.id!=did)
		$km.resize();
		return h;
	}
	,frm_control2:function (n,protowin){
		try{
			if(!protowin){protowin=$proto.top;}
			var doc=protowin.$d.getDoc(protowin.$$(n));
			var win=protowin.$d.getWin(protowin.$$(n));
			var h=null;
			if(typeof win['$$']!='undefined'){
				if(win.$$('div_container')){
					h=win.$$('div_container').offsetHeight;
					console.log('div_container:'+h);
				}
			}
			if(h==null){
				h=Math.max(
		        	Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
		        	Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
		        	Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
		    	);
			}
			var eo=protowin.$$(n);
			eo.style.visibility='visible';
			eo.style.height=h+'px';
			eo.style.minHeight=h+'px';
			eo.height=h;
			console.log(h);
			protowin.$km.resize();
			return h;

		}catch(e2){console.log('frm_control2:'+e2.message);}
	}
	,open:function (x_t,mid,str){
		var bid=x_t.p;
		var ww=x_t.w;
		var hh=x_t.h;
		var re=x_t.re;
		var tt=50;
		var _src='';
		window.scrollTo(0,0);

		$d.removeTextN($$("div_m_"+mid));
		var eo=$$("div_m_"+mid).lastChild;

		if(typeof x_t.theme=='undefined'){x_t.theme='default';}


		if(x_t.theme=='default'){
			eo.style.left="50%";
			eo.style.marginLeft=(0-ww/2)+"px";
			eo.style.top=tt+"px";
			eo.style.width=ww+"px";
			eo.style.height=(hh=="auto")?hh:hh+"px";
		}

		/*
		eo.style.top="-1500px";
		mb("div_m_"+mid,1);
		$(eo).animate({top:tt+'px'},800);
		*/
		eo.style.top=tt+"px";
		mb("div_m_"+mid,1);
		$('#div_m_'+mid).data('bid',x_t.p);

		if(bid){km_scr.bid=bid;}

		var r=(str)?str:$proto.cApp[bid];
		r=rC(r,"[mid]",mid);
		if(re!=null){
			for(var t=0;t<re.length;t++){
				r=r.replace(re[t].re,re[t].val);
				if(String(re[t].re).indexOf('[src')!=-1){_src=re[t].val;}
			}
		}

		try{$proto.floatopen=true;}catch(_ei_){}
		km_scr.sub_cifrm(eo,r,null,_src);
		try{km_kb._try();}catch(ey){}

		if(typeof window['km_dnd']!='undefined'){
			(function (){
				var _eo=eo;
				$('.p-win-head')[0].onmousedown=function (){
					km_dnd._dragstart(_eo);
				}
			})();
		}
	}
	,close:function (){
		km_scr.bid="";
		if(km_scr.mid1!=''){mid=km_scr.mid1;}
		if(km_scr.mid2!=''){mid=km_scr.mid2;}
		var eo=$$("div_m_"+mid).lastChild;
		var bid=$('#div_m_'+mid).data('bid');

		if(typeof $proto.pagelets[bid]['beforeclose']=='function'){
			$proto.pagelets[bid]['beforeclose']();
		}
		
		var ifrm=eo.getElementsByTagName('iframe');
		if(typeof ifrm[0]!='undefined'){
			for(var i=0;i<ifrm.length;i++){
				try{
					$(ifrm[i]).contents().find("div.btn-upload").empty();
					$(ifrm[i]).remove();
				}catch(e){}
			}
		}

		mb("div_m_"+mid,0);

		$$(eo,"h","");
		try{km_kb._try();}catch(ey){}
	}
	,sub_cifrm: function(c_obj,c_html,c_style,c_src){
		var x_o=document.createElement("DIV");
		$$(x_o,"style","position:'absolute',left:'0px',top:'0px',width:'100%',height:'100%',backgroundColor:'white'");
		var x_c=document.createElement("DIV");
		$$(x_c,"style","position:'relative',width:'100%',height:'100%',overflow:'visible'");

		var x_i=document.createElement("IFRAME");
		if((/MSIE (6|7|8)/).test(navigator.userAgent)){
			var x_t=document.createAttribute("frameborder");
			x_t.value="0";
			x_i.attributes.setNamedItem(x_t);
		}else{
			x_i.frameborder='0';
		}

		$d.setAttr(x_i,"width:100%|height:100%|scrolling:no");
		if(c_html.indexOf("http://")==0){
			x_i.src=c_html;
			c_obj.appendChild(x_o);
			x_o.appendChild(x_i);
			x_i.style.border='none';
			return;
		}
		x_i.src=$proto.basepath['html']+"blank.html";
		c_obj.appendChild(x_o);
		x_o.appendChild(x_i);
		x_i.style.border='none';
		if(!c_html){return;}
		if((c_html!=null)&&(c_html!="")){x_c.innerHTML=c_html;}
		c_obj.appendChild(x_c);
		if((c_style!=null)&&(c_style!="")){$$(x_c,"style",c_style);}

		if($$('div_iframe')&&str_trimSpace($$('div_iframe').innerHTML)==''){
			try{
				var iframe = document.createElement('<iframe id="d_frm" name="d_frm" />');
			}catch(_e9_){
				var iframe = document.createElement("iframe");
				var x_t=document.createAttribute("id");
				x_t.value="d_frm";
				iframe.attributes.setNamedItem(x_t);
			}
			if((/MSIE (6|7|8)/).test(navigator.userAgent)){
				var x_t=document.createAttribute("frameborder");
				x_t.value="0";
				iframe.attributes.setNamedItem(x_t);
			}
			iframe.src = c_src;
			iframe.name = 'd_frm';
			iframe.frameborder = '0';
			iframe.scrolling = 'no';
			$d.setAttr(iframe,"width:1|height:1|scrolling:no");
			/*
			(function (){
				var _eo=c_obj;
				if(iframe.attachEvent){
				    iframe.attachEvent("onload", function(){
				        $proto.top.km_scr.frm_control('d_frm',null,_eo);
				    });
				}else{
				    iframe.onload=function(){
				        $proto.top.km_scr.frm_control('d_frm',null,_eo);
				    };
				}
			})();
			*/
			$$('div_iframe').appendChild(iframe);
			iframe.style.border='none';
		}
	}
	,init:function (){
		km_scr.ie6frame=(PF_ie6)?"<iframe style='display:block;' frameborder='0' width='100%' height='100%' scrolling='no' src='"+$proto.basepath['html']+"mpaper.html' allowTransparency='true'></iframe>":"";
		km_scr.ie6mpaper=(PF_ie6)?"mpaper-ie6":"mpaper";

		if(typeof $proto.top.$proto.floattemp=='undefined'||$proto.top.$proto.floattemp==''){
			var s="";
			s+="<div id='p_win' class='p-win' style='height:[h0]px;width:[w]px;' data-mid='[t]'>";
				s+="<div class='p-win-head' style='width:[w]px;height:40px;overflow:hidden;z-index:33;'>";
					s+="<div class='headicon'>[title]</div>";
					s+="<div class='clear'></div><div class='headline'></div>";
					s+="<div class='close' style='position:absolute;top:10px;right:10px;width:20px;height:20px;cursor:pointer;font-size:18px;' onclick=\"km_scr.close()\">&#215;</div>";
				s+="</div>";
				s+="<div id='div_iframe' style='width:[w]px;margin:0 0 10px 0;min-height:100px;height:[h2]px;background-color:white;'>";
				s+="</div>";
			s+="</div>";
			$proto.top.$proto.floattemp=s;
		}
		if(!$$('div_m_floatbox_i1')){
			var s="";
			s+="<div id='div_m_floatbox_i1' class='float_box_km'>";
				s+="<div id='mPaper_i1' class='"+km_scr.ie6mpaper+"'>";
					s+=km_scr.ie6frame;
				s+="</div>";
				s+="<div class='area shadowb'></div>";
			s+="</div>";
			s+="<div id='div_m_floatbox_i2' class='float_box_km'>";
				s+="<div id='mPaper_i2' class='"+km_scr.ie6mpaper+"'>";
					s+=km_scr.ie6frame;
				s+="</div>";
				s+="<div class='area shadowb'></div>";
			s+="</div>";
			s+="<div id='lockLayer'></div>";
			$('.d-main').append(s);

			var s="";
			s+="<div id='div_m_floatbox_o1' class='float_box_km'>";
				s+="<div class='"+km_scr.ie6mpaper+"'>";
					s+=km_scr.ie6frame;
				s+="</div>";
				s+="<div class='area shadowb'></div>";
			s+="</div>";
			s+="<div id='div_m_floatbox_o2' class='float_box_km'>";
				s+="<div class='"+km_scr.ie6mpaper+"'>";
					s+=km_scr.ie6frame;
				s+="</div>";
				s+="<div class='area shadowb'></div>";
			s+="</div>";
			s+="<iframe style='display:none;' id='frm_history' name='frm_history' frameborder='0' width='0' height='0' scrolling='no' src='"+$proto.basepath['html']+"blank.html'></iframe>";
			$('body').append(s);
		}
	}
	,loaded:function (formname,action,target,after,clk){
		console.log('smart:loaded');
		if(formname){
			domGN(formname)[0].action=action;
			domGN(formname)[0].target=target;
		}
		//$$('frm_export').style.width='100%';
		var result='';
		try{
			result=$.trim($d.getWin($$('frm_export')).$('#result').html());
		}catch(e){
			console.log('smart: get result error.('+e.message+')');
		}
		console.log('smart:result '+result);
		var afterback=false;
		if(typeof after=='function'){
			console.log('smart:after');
			afterback=after(result);
		}
		//if(!afterback){
		//	km_scr.frm_control2('frm_export');
		//}
        $('#div_export').remove();
		if(afterback){return;}
        //$proto.top.$('#flalert .c div').eq(0).remove();
        if(typeof clk=='function'){
        	(function (){
        		var doclk=clk;
        		var _result=result;
	        	$proto.top.$('#flalert input.btn')[0].onclick=function (){
	        		doclk(_result);
	        	};
        	})();
        }else{
        	$proto.top.$('#flalert input.btn')[0].onclick=function (){Alert();}
        }
    	$proto.top.$('#flalert input.btn')[0].style.visibility='visible';
	}
	,smart:function (str,url,method,formname,after,clk){
		this.a(url,formname,'',after,clk);
	}
	,a:function (url,formname,before,after,clk){
		$proto.top.Alert('<div id="alert_waiting" style="text-align:left;"></div>');
		$proto.top.$('#flalert input.btn')[0].onclick=function (){}
		$proto.top.$('#flalert input.btn')[0].style.visibility='hidden';
		
		var x='';
		x+='<div id="div_export" style="display:none;">';
		x+="<iframe style='display:block;' id='frm_export' name='frm_export' frameborder='0' width='1' height='1' scrolling='no' src=''></iframe>";
		x+='</div>';
		$(document.body).append(x);

		(function (){
			var _url=url;
			var _after=after;
			var _clk=clk;
			var _formname=formname;
			var _action='';
			var _target='';
			if(formname){
				_action=domGN(formname)[0].action;
				_target=domGN(formname)[0].target;
			}
			if($$('frm_export').attachEvent){
				$$('frm_export').attachEvent("onload",function(){
					km_scr.loaded(_formname,_action,_target,_after,_clk);
			    });
			}else{
				$$('frm_export').onload=function(){
					km_scr.loaded(_formname,_action,_target,_after,_clk);
			    };
			}

			if(formname){
				var _done=function (){
					console.log('smart:submit');
					domGN(_formname)[0].action=_url;
					domGN(_formname)[0].target='frm_export';
					domGN(_formname)[0].submit();
				};
			}else{
				var _done=function (){
					console.log('smart:location replace');
					if(_url.indexOf('?')==-1){
						_url+='?_='+sd();
					}else{
						_url+='&_='+sd();
					}
					frm_export.location.replace(_url);
				};
			}

			if(typeof before=='function'){
				console.log('smart:before');
				before(_done);
			}else{
				$proto.top.$('#alert_waiting').html('正在执行操作...');
				_done();
			}
		})();
	}
};

function Alert(m_str,m_cmd,m_c,m_q){
	km_scr.ie6frame=(PF_ie6)?"<iframe style='display:block;' frameborder='0' width='100%' height='100%' scrolling='no' src='"+$proto.basepath['html']+"mpaper.html' allowTransparency='true'></iframe>":"";
	km_scr.ie6mpaper=(PF_ie6)?"mpaper-ie6":"mpaper";
	if($proto.top.$proto.ftype=='bootstrap'){
		if(typeof m_str=='undefined'||!m_str){
			$('#div_Alert').modal('hide');return;
		}
		if(typeof m_cmd=='undefined'||!m_cmd){
			m_cmd='$proto.top.Alert()';
		}
		(function (){
			var _cmd=m_cmd;
			var _r=m_str;
			if(!m_q){
				if(_cmd.indexOf("(")==-1&&m_cmd.indexOf("=")==-1){
					$('#div_Alert').on('hidden', function () {
						$proto.go(_cmd);
					})
				}else{
					$('#div_Alert').on('hidden', function () {
						try{$d.eval(_cmd);}catch(ee){
							$proto.top.Alert('');alert(ee.message);
						}
					})
				}
			}else{
				$('#div_Alert').on('hidden', function () {
					$('#div_Alert').modal('hide');return;
				})
			}
			$('#div_Alert .rtmsg').html(_r);
			$('#div_Alert').modal({backdrop:'static',keyboard:false});
		})();
		return;
	}
	if(!$$('flalert')){
		var s="";
		s+="<div id='flalert'>";
			s+="<div class='"+km_scr.ie6mpaper+"'>";
				s+=km_scr.ie6frame;
			s+="</div>";
			s+="<div class='area shadowb'></div>";
		s+="</div>";
		$('body').append(s);
	}
	if(!m_str){
		window.mb("flalert",0);
		window.$$("flalert").lastChild.innerHTML='';
		return;
	}
	window.$d.removeTextN(window.$$("flalert"));
	if(!m_cmd){m_cmd="Alert()";}
	window.scrollTo(0,0);

	var wx=$(window).width();
	var ww=400;
	if(wx<400){
		ww=wx-20;
	}
	var hh="auto";

	var eo=window.$$("flalert").lastChild;
	eo.style.left="50%";
	eo.style.marginLeft=(0-ww/2)+"px";
	eo.style.top="100px";
	eo.style.width=ww+"px";
	eo.style.height=(hh=="auto")?hh:hh+"px";

	window.mb("flalert",1);
	var r="<div class='t'>提示</div>";
	r+="<div class='c'></div>";
	if(!m_q){
		r+="<div style='text-align:center;margin:0px 0px 15px 0px;'>";
		if(typeof m_cmd=='function'){
			r+="<input type='button' class='btn btn-ok' style='width:60px;' value='确定'/>";
		}else if(m_cmd.indexOf("(")==-1&&m_cmd.indexOf("=")==-1){
			r+="<input type='button' class='btn btn-ok' style='width:60px;' value='确定' onclick=\"$proto.go('"+m_cmd+"')\"/>";
		}else{
			r+="<input type='button' class='btn btn-ok' style='width:60px;' value='确定' onclick=\"javascript:try{"+m_cmd+"}catch(ex){Alert();alert(ex.message);};\"/>";
		}
		if(m_c){
			if(typeof m_c=='string'){
				r+=m_c;
			}else{
				r+="&nbsp;<input type='button' class='btn' style='width:60px;' value='取消' onclick='Alert()'/>";
			}
		}
		r+="</div>";
	}
	window.$("#flalert div:last-child").html(r);
	window.$("#flalert div.c").html(m_str);

	if(typeof m_cmd=='function'){
		(function (){
			var _func=m_cmd;
			window.$("#flalert .btn-ok").on('click',function (){
				_func();
			});
		})();
	}
}

function _Alert(did){
	if(!did){did='d_Alert';}
	var self=this;
	this.did=did;
	this.html='';
	this.css={
		'margin-top':'-60px'
		,'height':'100px'
		,'top':'50%'
		,'left':'20px'
		,'right':'20px'
	};
	this.opts={
		autohide:true
		,before:function (done){
			done();
		}
		,after:function (){

		}
		,click:function (bid){
			if(bid=='ok'){
				self.a();
			}
		}		
	}
	this.a=function (s,css,opts){
		if(!s){
			$('#'+this.did).css({display:'none'});
			return;
		}
		this.html=s;
		if(css){this.css=css;}
		if(opts){
			for(var i in opts){
				this.opts[i]=opts[i];
			}
		}
		$('#'+this.did).css(this.css);

		this.opts.before(function (){
			$('#'+self.did).html(self.html);
			$('#'+self.did+' button').unbind().bind('click',function (){
				self.opts.click($(this).data('bid'));
			});
			self.opts.after();
		});
		
		if(this.opts.autohide){
			km_kb._set($('#'+this.did).get(0));
			setTimeout(function (){
				km_kb._try();
			},1500);
		}else{
			$('#'+this.did).css({display:'block'});
		}
	};
}




var km_btn={
	eo:null,
	bo:null,
	suspend:false,
	mo:function (eo,es,__et,zidx,bgc,flc){
		if(__et==null){
			var ent=$d.evt();
			if(ent.stopPropagation){
				ent.stopPropagation();
			}else{
				ent.cancelBubble=true;
			}
			var et=ent.type;
		}else{
			var et=__et;
		}

		eo=$$(eo);
		if(zidx){eo.style.zIndex=zidx;}
		var g_nl=eo.getElementsByTagName('div');
		var g_nd=null;
		for(var g_i=0;g_i<g_nl.length;g_i++){
			if((g_nl[g_i].className==es)||(g_nl[g_i].className==es+"_over")){
				g_nd=g_nl[g_i];
			}
		}

		if(bgc!=-1){
			if(!bgc){bgc="transparent";}
			if(bgc.indexOf(",")==-1){
				$$(eo,"style","backgroundColor:'"+bgc+"'");
			}else{
				var bga=bgc.split(",");
				if(et=="mouseover"){
					$$(eo,"style","backgroundColor:'"+bga[0]+"'");
				}else if(et=="mouseout"){
					$$(eo,"style","backgroundColor:'"+bga[1]+"'");
				}
			}
		}
		
		if(flc!=-1){
			if(et=="mouseover"){
				$$(eo,"style","overflow:'visible'");
			}else if(et=="mouseout"){
				$$(eo,"style","overflow:'hidden'");
			}
		}

		if(et=="mouseover"){
			$$(g_nd,"c",es+"_over");
			this.eo=eo;
		}else if(et=="mouseout"){
			$$(g_nd,"c",es);
			this.eo=null;
		}
	},
	bC3:function (eid,cls){
		var ent=$d.evt();
		if(ent.stopPropagation){
			ent.stopPropagation();
		}else{
			ent.cancelBubble=true;
		}
		var eo=($$(eid)==null)?$d.elem(ent):$$(eid);
		var et=ent.type;
		var _c=eo.className;
		if(cls){if(_c.indexOf(cls)==-1){return;}}
		var _c0=_c,_c1="";
		if(_c.indexOf(" ")!=-1){
			_c1=_c.substring(0,_c.indexOf(" "));
			_c0=_c.substring(_c.indexOf(" "),_c.length);
		}
		if(_c0.indexOf("_s")!=-1){return;}
		if((et=="mouseover")&&(_c0.indexOf("_over")==-1)){_c0=_c0+"_over";}
		if((et=="mouseout")&&(_c0.indexOf("_over")!=-1)){_c0=_c0.replace("_over","");}
		eo.className=_c1+_c0;
	},
	ep:function (tab_nd,tab_n){
		tab_n=(tab_n==null)?3:tab_n;
		var ent=$d.evt();
		try{window.event.cancelBubble=true;}catch(ef1){}
		tab_nd=(typeof tab_nd=="object")?tab_nd:$$(tab_nd);
		var pobj=tab_nd.children[tab_n];
		var c_cls=tab_nd.className;
		if(c_cls.indexOf("tab_01")==-1){return;}
		if(ent.type=="mouseover"){
			$$(tab_nd,"c",c_cls+"_over");
			$$(pobj,"style","display:'block'");
		}else if(ent.type=="mouseout"){
			$$(tab_nd,"c",c_cls.replace("_over",""));
			$$(pobj,"style","display:'none'");
		}
	},
	sc:function (o,para,func,func2,para2){
		if(!o){return;}
		km_kb._set(o,para,func,func2,para2);
	},
	fc:function (obj,et,func){
		var ent=$d.evt();
		if(ent.stopPropagation){
			ent.stopPropagation();
		}else{
			ent.cancelBubble=true;
		}
		var ent=$d.evt();
		if(!et){et=ent.type;}
		var ee=(et=="mouseover")?1:0;

		if(!obj){
			var eo=$d.elem(ent);
		}else{
			var eo=obj.children[0];
		}
		var istr=',input,select,option,tbody,tr,td,div,span,';
		if(eo.tagName.toLowerCase()=='select'||eo.tagName.toLowerCase()=='input'){
			if(et=='mouseout'){
				this.mb(this.bo,1);
				this.suspend=false;
				return;
			}
			this.mb(this.bo,1);
			this.suspend=true;
			return;
		}
		if(this.suspend){return;}
		if(et=='mouseout'){km_kb._try();}
		var _n=eo.getAttribute("name");
		while ((eo.className.indexOf('kmhint')!=-1)||(_n=="cc_text")||(_n=="cc_btn")||(_n=="cc_mb")||(_n=="cc_root")||istr.indexOf(','+eo.tagName.toLowerCase()+',')!=-1){
			if(_n=="cc_btn"){
				if((et=="mouseover")&&(eo.className.indexOf("_over")==-1)){
					if(eo.className.indexOf(' ')==-1){
						eo.className=eo.className+"_over";
					}else{
						var s=eo.className.substring(0,eo.className.indexOf(' '));
						eo.className=eo.className.replace(s,s+'_over');
					}
				}
				if(et=="mouseout"){eo.className=eo.className.replace("_over","");}
				try{
					var _k=0;_m="";
					fo=eo.children[_k];
					try{_m=fo.getAttribute("name");}catch(u1){_m="";}
					while((_m!="cc_mb")&&(_k<eo.children.length-1)){
						_k++;
						fo=eo.children[_k];
						try{_m=fo.getAttribute("name");}catch(u1){_m="";}
					}
					if(_m=="cc_mb"){this.mb(fo,ee);}
				}catch(u){}
			}else if(_n=="cc_root"){
				if((et=="mouseover")&&(eo.className.indexOf("_over")==-1)){
					if(eo.className.indexOf(' ')==-1){
						eo.className=eo.className+"_over";
					}else{
						var s=eo.className.substring(0,eo.className.indexOf(' '));
						eo.className=eo.className.replace(s,s+'_over');
					}
				}
				if(et=="mouseout"){eo.className=eo.className.replace("_over","");}
				try{
					var _k=0;_m="";
					fo=eo.children[_k];
					try{_m=fo.getAttribute("name");}catch(u1){_m="";}
					while((_m!="cc_mb")&&(_k<eo.children.length-1)){
						_k++;
						fo=eo.children[_k];
						try{_m=fo.getAttribute("name");}catch(u1){_m="";}
					}
					if(_m=="cc_mb"){this.mb(fo,ee);this.bo=fo;}
				}catch(u){}
				if(typeof func=="function"){func();}
				window.fo=eo;
				return;
			}else if(_n=="cc_mb"||eo.className.indexOf('kmhint')!=-1){
				this.mb(eo,ee);
				this.bo=eo;
			}else if(_n=="cc_text"){

			}
			eo=eo.parentNode;
			_n=eo.getAttribute("name");
		}
	},
	fcn:function (obj,ee,dir,pw,ph,func){
		if(!obj){return;}
		var eo=obj;
		if(eo.className.indexOf('kmhint')==-1){return;}
		if(ee==1){
			var _obj=obj,_func=func;
			(function (){
				eo.parentNode.onmouseout=function (){
					km_btn.fcn(_obj,0,'',0,0,_func);
				}
			})();
		}

		var w=eo.parentNode.offsetWidth;
		var h=eo.parentNode.offsetHeight;
		eo.style.width=pw+'px';
		eo.style.height=ph+'px';

		var hp=4,vp=4;

		if(dir=='up'){
			eo.style.left=(0-(pw-w)/2)+'px';
			eo.style.top=(0-ph-vp)+'px';
		}else if(dir=='down'){
			eo.style.left=(0-(pw-w)/2)+'px';
			eo.style.top=(h_vp)+'px';
		}else if(dir=='left'){
			eo.style.top=(0-(ph-h)/2)+'px';
			eo.style.left=(0-pw-hp)+'px';
		}else if(dir=='right'){
			eo.style.top=(0-(ph-h)/2)+'px';
			eo.style.left=(w+hp)+'px';
		}
		this.mb(eo,ee);
		if(typeof func=='function'){func();}
	},
	mb:function (d,j,cs,ch){
		if(typeof d!="object"){d=$$(d);}
		if((d=="")||(d==null)){return;}
		if(j==null){
			var s=(d.style.display=="none")?"block":"none";
		}else{
			var s=(j==1)?"block":"none";
		}
		if(cs!=null){d.className=cs;}
		if(ch!=null){d.innerHTML=ch;}
		d.style.display=s;
	}
	,btngroup:function (eo){
		var nl=eo.parentNode.children;
		for(var i=0;i<nl.length;i++){
			if(nl[i].className.indexOf('_select')!=-1){
				nl[i].className=nl[i].className.replace('_select','');
			}
		}
		eo.className=eo.className+'_select';
	}
};

var km_tab={
	tabclk:function (n,o,z,cb){
		if(!cb){cb='clsHide';} //clsHidden
		var ent=$d.evt();
		if(ent.stopPropagation){
			ent.stopPropagation();
		}else{
			ent.cancelBubble=true;
		}
		if(o){o=$$(o);}else{
			var _o=$d.elem(ent);
			if(_o.parentNode.childNodes.length>1){return;}
			o=_o.parentNode.parentNode.parentNode;
		}
		var _eo=$d.getChilds(o,"DIV",0);
		var eo=$d.getChilds(_eo,"DIV",n);
		if((_eo==null)||(eo==null)){return;}
		//var eo=o.firstChild.childNodes[n];
		if(eo.className.indexOf("_select")!=-1){return false;}

		var tobjs=$d.getChilds(_eo,"DIV");
		//var tobjs=$$(o.firstChild).childNodes;
		for (var b=0;b<tobjs.length;b++){
			if(tobjs[b].className.indexOf("_select")!=-1){
				var tcls=tobjs[b].className.replace("_select","");
				$$(tobjs[b],"c",tcls);
			}
		}
		var t_cls=eo.className;
		if(t_cls.indexOf("_over")!=-1){
			t_cls=t_cls.replace("_over","");
		}
		t_cls+="_select";
		$$(tobjs[n],"c",t_cls);
		try{if(ent.type=="mouseover"){tobjs[n].click();}}catch(p9){alert(p9.message);}

		var _l=$d.getChilds(o,"DIV").length;
		if(z==null){z=1;}
		var _eo=$d.getChilds(o,"DIV")[_l-z];
		var tobjs0=$d.getChilds(_eo,"DIV");
		//var tobjs0=$$(o.lastChild).childNodes;
		for (var b=0;b<tobjs0.length;b++){
			if((tobjs0[b].className!=cb)&&(tobjs0[b].className!="d-box-bot")){
				$$(tobjs0[b],"c",cb);
			}
		}
		$$(tobjs0[n],"c","");
	}
};

/* 
 * var a=new km_tab_a();
 * a.init(0,function (index,isfirst){ ... });
 * index 当前加载的第几个tab，从 0 开始
 * isfirst 是否是第一次加载，true or false
 */
function km_tab_a(){
	var self=this;
	this.ftype='';
	this.tabs=[];
	this.tabid='';
	this.init=function (n,callback){
		if(typeof callback=='function'){
			self['callback']=callback;
		}else if(typeof self['callback']!='function'){
			self['callback']=function (){};
		}

		$d.removeTextN($$(this.tabid));
		if(this.ftype=='bootstrap'){
			var nl=$$(this.tabid).getElementsByTagName('a');
		}else{
			var nl=$$(this.tabid).firstChild.children;
		}
		for(var i=0;i<this.tabs.length;i++){
			(function (){
				var _i=i;
				if(self.ftype=='bootstrap'){
					nl[i].onclick=function (){
						$('#'+self.tabid+' a[href="#'+self.tabs[_i].id+'"]').tab('show');
						var src=$$('frm_'+self.tabs[_i].id).src;
						if(src!=''&&src.indexOf('/blank.htm')==-1){
							self['callback'](_i,false);
							return;
						}
						var url=$('#'+self.tabs[_i].did).data('kmUrl');
						if(!url){url=self.tabs[_i].src;}
						if(url){
							$$('frm_'+self.tabs[_i].id).src=url;
							km_scr.frmloading('frm_'+self.tabs[_i].id,function (){
								self['callback'](_i,true);
							});
						}else{
							self['callback'](_i,true);
						}
					}
				}else{
					nl[i].onclick=function (){
						km_tab.tabclk(_i,self.tabid);
						if(!$$('frm_'+self.tabs[_i].id)){
							$d.frm({id:'frm_'+self.tabs[_i].id},self.tabs[_i].did);
						}
						var src=$$('frm_'+self.tabs[_i].id).src;
						if(src!=''&&src.indexOf('/blank.htm')==-1){
							self['callback'](_i,false);
							return;
						}
						var url=$('#'+self.tabs[_i].did).data('kmUrl');
						if(!url){url=self.tabs[_i].src;}
						if(url){
							$$('frm_'+self.tabs[_i].id).src=url;
							km_scr.frmloading('frm_'+self.tabs[_i].id,function (){
								self['callback'](_i,true);
							});
						}else{
							self['callback'](_i,true);
						}
					}
				}
			})();
		}
		if(typeof n!='undefined' && n!==null){
			nl[n].click();
		}
	}
}



/*
var imgO=new km_image();
imgO.himgs=[];
imgO.func=function (){}
imgO.after=function (){}
imgO.afterby=function (q){}
imgO.init();
*/

function km_image(){
    var self=this;
    this.imgs=null;
    this.bar_width=0;
    this.size=[];
    this.himgs=[];
    this.himgs_status={};
    this.imgsUnload=[];
    this.after=function (){};
    this.maxtimeby=20;//每张图片允许的最大加载时间(秒)
    this.it=200;//间隔时间(毫秒)
    this.its=100;//20*1000/200
    this.func=function (n,eo){
        $$("loadingline","style","width:"+Math.floor(parseFloat(n*eo.bar_width/eo.imgs.length))+"px");
        $$("loadingtxt","h","loading... "+Math.round(n*100/eo.imgs.length)+"%");
        /* after
        $$("loadingdef","h","");
        $$("loadingdef","style","display:'none'");
        */
    }
    this.init=function (){
        self.load();
        if(typeof self.after!='undefined'){
            self.timer=window.setInterval(function (){
                self.show();
            },self.it);
        }
    };
    this.load=function (){
        if(this.himgs.length==0){self.after(self);return;}
        self.imgs=[];
        self.himgs_status={};
        self.imgsUnload=[];
        for(var i=0;i<this.himgs.length;i++){
            var r=this.imgs.length;
            this.himgs_status[this.himgs[i]]=1;
            this.imgsUnload[r]=1;
            (function (){
                var m=i,q=r;
                self.imgs[q]=new Image();
                self.imgs[q].onload=function (){self.onloadImg(m,q)};
                self.imgs[q].onerror=function (){self.unloadImg(m,q)};
                self.imgs[q].onabort=function (){self.unloadImg(m,q)};
                self.imgs[q].src=self.himgs[m];
            })();
        }
    };
    this.onloadImg=function (m,q){
        self.size[q]={w:self.imgs[q].width,h:self.imgs[q].height};
        self.imgs[q].onload=null;
        self.imgs[q].onerror=null;
        self.imgs[q].onabort=null;
        self.himgs_status[self.himgs[m]]=1;
        self.imgsUnload[q]=1;
        console.log('onloadImg');
    };
    this.unloadImg=function (m,q){
        self.size[q]={w:0,h:0};
        self.imgs[q].onload=null;
        self.imgs[q].onerror=null;
        self.imgs[q].onabort=null;
        self.himgs_status[self.himgs[m]]=0;
        self.imgsUnload[q]=0;
        console.log('unloadImg');
    };
    this.show=function (){
        var imgNum=0;
        for (var j=0;j<self.imgs.length;j++){
            if ((self.imgs[j].complete)||(self.imgsUnload[j]==0)||(self.imgsUnload[j]>self.its)){
                imgNum++;
                console.log('imgNum: '+imgNum);
            }else{
                self.imgsUnload[j]++;
            }
        }
        self.func(imgNum,self);
        if (imgNum<self.imgs.length){return;}
        imgNum=self.imgs.length;
        window.clearInterval(self.timer);
        self.imgs=null;
        self.after(self);
    }
}

var km_image_util={
    resize:function (w1,h1,w2,h2,type){
        if(type=='corp'){
            //w1,h1 原图尺寸 w2,h2 容器的尺寸 iw,ih 缩放后的图片尺寸
            var iw,ih;
            if(w1/h1>=w2/h2){
                ih=h2;
                iw=(w1*h2)/h1;
                return [iw,ih,(0-(iw-w2)/2),0];
            }else{
                iw=w2;
                ih=(h1*w2)/w1;
                return [iw,ih,0,(0-(ih-h2)/2)];
            }
        }else if(type=='full'){
            var iw,ih;
            if(w1<w2){
                if(h1<h2){
                    return [w1,h1,(w2-w1)/2,(h2-h1)/2];
                }else{
                    return [w1,h1,(w2-w1)/2,0];
                }
            }
            if(w1/h1>=w2/h2){
                iw=w2;
                ih=(h1*w2)/w1;
                return [iw,ih,0,(h2-ih)/2];
            }else{
                ih=h2;
                iw=(w1*h2)/h1;
                return [iw,ih,(w2-iw)/2,0];
            }
        }else if(type=='matchwidth'){
            var iw,ih;
            if(w1<w2){
                if(h1<h2){
                    return [w1,h1,(w2-w1)/2,(h2-h1)/2];
                }else{
                    return [w1,h1,(w2-w1)/2,0];
                }
            }
            iw=w2;
            ih=(h1*w2)/w1;
            return [iw,ih,0,(h2-ih)/2];
        }else{
            var iw,ih;
            if(w1/h1>=w2/h2){
                if(w1<w2){
                    return [w1,h1,(w2-w1)/2,(h2-h1)/2];
                }else{
                    iw=w2;
                    ih=(h1*w2)/w1;
                    return [iw,ih,0,(0-(ih-h2)/2)];
                }
            }else{
                if(h1<h2){
                    return [w1,h1,(w2-w1)/2,(h2-h1)/2];
                }else{
                    ih=h2;
                    iw=(w1*h2)/h1;
                    return [iw,ih,(0-(iw-w2)/2),0];
                }
            }
        }
    }
};


/**
 * JS实现未知图片大小的等比例缩放
 */

 function AutoImg(options) {
    
    this.config = {
        autoImg     : '.autoImg',     // 未知图片dom节点
        parentCls   : '.parentCls'    // 父节点
    };

    this.cache = {
        
    };

    this.init(options);
 }
 
 AutoImg.prototype = {
    
     init: function(options){
        this.config = $.extend(this.config, options || {});
        var self = this,
            _config = self.config;
        
        $(_config.autoImg).each(function(index,img){
            
            var src = img.src,
                parentNode = $(img).closest(_config.parentCls),
                parentWidth = $(parentNode).width();
                
            // 先隐藏原图
            img.style.display = 'none';
            img.removeAttribute('src');

            

            // 获取图片头尺寸数据后立即调整图片
            imgReady(src, function (width,height) {

                // 等比例缩小
                if (width > parentWidth) {
                    height = parentWidth / width * height,
                    width = parentWidth;
                    img.style.width = width + 'px';
                    img.style.height = height + 'px';
                };
                // 显示原图
                img.style.display = '';
                
                img.setAttribute('src', src);
                
            });
        });
     }
 };

 var imgReady = (function(){
    var list = [],
        intervalId = null;

    // 用来执行队列
    var queue = function(){

        for(var i = 0; i < list.length; i++){
            list[i].end ? list.splice(i--,1) : list[i]();
        }
        !list.length && stop();
    };
    
    // 停止所有定时器队列
    var stop = function(){
        clearInterval(intervalId);
        intervalId = null;
    }
    return function(url, ready, error) {
        var onready = {}, 
            width, 
            height, 
            newWidth, 
            newHeight,
            img = new Image();
        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if(img.complete) {
            ready(img.width, img.height);
            return;
        }
        width = img.width;
        height = img.height;

        // 加载错误后的事件 
        img.onerror = function () {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };

        // 图片尺寸就绪
        var onready = function() {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
            ) {
                ready(img.width, img.height);
                onready.end = true;
            };
        };
        onready();
        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();
            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };
        
        
        // 加入队列中定期执行
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) {
                intervalId = setInterval(queue, 40);
            };
        };
    }
})();


var km_template={
	showaggregate:function (po,jo,sco){

		var cv_re=[[],[]];
		if(sco!=null){
			for(var i in sco){
				if(typeof sco[i]!='function'){
					if(sco[i]==null){sco[i]='';}
					var re="\["+i+"\]";
					if(typeof sco.val=='function'){
						cv_re[0].push({re:re,rv:sco.val(sco[i])});
					}else{
						cv_re[0].push({re:re,rv:sco[i]});
					}
				}
			}
		}

		if(jo.rows.length>0){
			var a=',';
			for(var i=0;i<po.adapter.re.length;i++){
				if(a.indexOf(','+po.adapter.re[i].s+',')==-1){
					a+=po.adapter.re[i].s+',';
				}
			}
			for(var i in jo.rows[0]){
				if(a.indexOf(','+i+',')==-1){
					po.adapter.re.push({s:i});
				}
			}
		}

		var _html='';
		if(jo!=null){
			var _n=jo.rows.length;
			if(_n>po.adapter.max){_n=po.adapter.max;}
			var ao=new obj_htmtemp(po.tran,'',_n,cv_re,po.adapter.tmp);
		}else{
			var ao=new obj_htmtemp(po.tran,'',0,cv_re,0);
		}

		try{
			ao.func[0]=function (s,o){
				for(var xi=0;xi<o.length;xi++){
					s=rC(s,o[xi].re,o[xi].rv);
				}
				return s;
			};
			ao.func[1]=function (i,s,o){
				if(typeof jo.rows[i]=='undefined'){return '';}
				var _a=po.adapter;
				var nd=jo.rows[i];
				for(var j=0;j<_a.re.length;j++){
					if(_a.re[j].s!=""){
						if(typeof jo.rows[i][_a.re[j].s]=='undefined'){jo.rows[i][_a.re[j].s]='';}
						var val=jo.rows[i][_a.re[j].s];
						if(typeof _a.re[j]['filter']!='undefined'&&_a.re[j]['filter']!=''){
						    if(_a.re[j]['filter']=='nohtml'){
						        val=val.replace(/</g,'&lt;');
						        val=val.replace(/>/g,'&gt;');
						    }else if(_a.re[j]['filter']=='noscript'){
						        val=filter_script(val);
						        val=val.replace(/</g,'&lt;');
						        val=val.replace(/>/g,'&gt;');
						    }
						}
						jo.rows[i][_a.re[j].s]=val;
						if(typeof _a.re[j].val=="function"){
							val=_a.re[j].val(_a,i,nd);
						}
						s=rC(s,"["+_a.re[j].s+"]",val);
					}
				}
				return s;
			};
			var _t=ao.loop();
			_t=_t.replace(/<\!--(.[^-<>]*)-->/g,"");
			_t=_t.replace(/(^\s*)|(\s*$)/g,"");
		}catch(e){
			console.log(e.message);return;
		}
		_html=_t;

		return _html;
	}

}
function obj_htmtemp(_htmstr,_sid,_lmax,_re,_choice){
	var self=this;
	this.htmstr=_htmstr;
	this.sid=_sid;
	this.lmax=_lmax;
	this.choice=_choice;
	this.loopstr=[];
	this.restr=_re;
	this.func=[];
	this.loop=function (x_exc){
		var x_s=this.htmstr;
		if(!x_s){return "";}
		this.htmstr=x_s;
		if(x_s.indexOf("</template>")!=-1){
			var x_ro=sodex_ro(x_s,"</template>");
			x_s=x_ro[1];
		}

		var x_n=0;
		var x_mat="</choice>";
		do {
			if(x_s.indexOf(x_mat)==-1){break;}
			var x_ro=sodex_ro(x_s,x_mat);
			var ri=x_ro[0]+x_ro[1]+x_mat;
			x_s=(this.choice==x_n)?x_s.replace(ri,x_ro[1]):x_s.replace(ri,"");
			x_n++;
		}while(x_s.indexOf(x_mat)!=-1)
		x_s=sodex_macro(x_s,1,1);//删除sodex:po
		var x_n=1;
		var x_mat="</loop>";
		do {
			if(x_s.indexOf(x_mat)==-1){break;}
			var x_ro=sodex_ro(x_s,x_mat);
			var ri=x_ro[0]+x_ro[1]+x_mat;

			try{
				this.loopstr[x_n-1]=x_ro[1];
				var x_lmax=this.lmax;
				if(!x_lmax){x_lmax=1;}
				var lstr=[];
				for(var x_m=0;x_m<x_lmax;x_m++){
					var g=(typeof this.func[x_n]!="undefined")?this.func[x_n](x_m,this.loopstr[x_n-1],this.restr[x_n]):this.loopstr[x_n-1];
					lstr.push(g);
				}
				x_s=x_s.replace(ri,lstr.join(""));
			}catch(ed4){
				console.log('a====='+ed4.message);
			}
			x_n++;
		}while(x_s.indexOf(x_mat)!=-1)

		if(typeof this.func[0]!="undefined"){
			x_s=this.func[0](x_s,this.restr[0]);
		}
		if(x_exc){
			x_s=sodex_script(x_s);
			x_s=sodex_script(x_s,2);
			x_s=sodex_script(x_s,3);
		}
		return x_s;
	};
}
function filter_script(ssc,ssn){
    if(ssn==null){ssn=1;}
    var x_mata=["","</script>","</sodex:script>","\[/sodex:script\]","\[/sodex:scripte\]"];
    var x_mat=x_mata[ssn];
    var x_idx=-1;
    do {
        if(ssc.indexOf(x_mat)==-1){break;}
        var x_ro=sodex_ro(ssc,x_mat);
        if(x_ro[2]<=x_idx){break;}
        x_idx=x_ro[2];
        var ri=x_ro[0]+x_ro[1]+x_mat;

        console.log('filter_script: '+x_ro[0]+'==='+x_ro[1]+'==='+x_mat);

        ssc=ssc.replace(ri,'');

    }while(ssc.indexOf(x_mat)!=-1)
    return ssc;
}
function sodex_ro(x_ssc,x_match){
	var x1=x_match.replace("/","");
	x1=x1.substring(0,x1.length-1);
	var x2=x_match.charAt(x_match.length-1);
	var i0=x_ssc.indexOf(x1);
	var i1=x_ssc.indexOf(x2,i0);
	var j0=x_ssc.indexOf(x_match,i0);
	return [x_ssc.substring(i0,i1+1),x_ssc.substring(i1+1,j0),i0];
}
function sodex_macro(ssc,ssn,sst){
	if(!ssc){return "";}
	if(ssn==null){ssn=1;}
	var x_mata=[
		"",
		"\[/sodex:po\]",
		"\[/sodex:macro\]",
		"\[/sodex:display\]",
		"\[/sodex:link\]",
		"\[/sodex:ad\]"
	];
	var x_mat=x_mata[ssn];
	var x_idx=-1;
	var myData="";
	do {
		if(ssc.indexOf(x_mat)==-1){break;}
		var x_ro=sodex_ro(ssc,x_mat);
		if(x_ro[2]<=x_idx){break;}
		x_idx=x_ro[2];
		var ri=x_ro[0]+x_ro[1]+x_mat;
		try {
			if(x_ro[1].indexOf("[sodex:")==-1&&x_ro[1].indexOf("[/sodex:")==-1){

				if(ssn==1){
					/*
					myData=JSON.parse(x_ro[1],function (key, value){
						return value;
					});
					*/
					myData=x_ro[1];
					ssc=ssc.replace(ri,"");
				}else if(ssn==2){

					ssc=ssc.replace(ri,"");

				}

			}
		}catch(se1){}
	}while(ssc.indexOf(x_mat)!=-1)
	
	if(sst!=1){
		return myData;
	}else{
		return ssc;
	}
}
function sodex_script(ssc,ssn){
	if(ssn==null){ssn=1;}
	var x_mata=["","</sodex:script>","\[/sodex:script\]","\[/sodex:scripte\]"];
	var x_mat=x_mata[ssn];
	var x_idx=-1;
	do {
		if(ssc.indexOf(x_mat)==-1){break;}
		var x_ro=sodex_ro(ssc,x_mat);
		if(x_ro[2]<=x_idx){break;}
		x_idx=x_ro[2];
		var ri=x_ro[0]+x_ro[1]+x_mat;
		try {
			if(x_ro[1].indexOf("[")==-1){
				window.ers="";
				$d.eval("window.ers="+x_ro[1]);
				ssc=ssc.replace(ri,window.ers);
			}
		}catch(se1){console.log(x_ro[1],x_ro[1]+" "+se1.message);}
		try{delete window["ers"];}catch(_ev){}
	}while(ssc.indexOf(x_mat)!=-1)
	return ssc;
}
function rC(cs,ic,oc){if(cs.indexOf(ic)>-1){var cs=cs.split(ic);cs=cs.join(oc);}return cs;}
function nTos(m){return (m<10)?"0"+String(m):String(m);}
function nTos2(m,b){var ss="";if(String(m).length<b){ss="0";for(i=1;i<b-String(m).length;i++){ss+="0";}}return ss+String(m);}
function domGN(name){return document.getElementsByName(name);}

function sTon(m){if((m=="")||(m==null)){return 0;}try{return parseFloat(m);}catch(_r){return 0;}}
function nTos(m){return (m<10)?"0"+String(m):String(m);}
function nTos2(m,b){var ss="";if(String(m).length<b){ss="0";for(i=1;i<b-String(m).length;i++){ss+="0";}}return ss+String(m);}
function sub_getPa(val,pa){
	if((pa==null)||(pa=="")){pa=top.location.href;}
	if(pa.indexOf(val+"=")==-1){return "";}
	var ppa1=pa.split(val+"=");
	var ppa2=(ppa1[1].indexOf('&')!=-1)?ppa1[1].split("&"):[ppa1[1]];
	return String(ppa2[0]);
}
function sd(){return new Date().getTime().toString()+nTos2(Math.floor(Math.random()*1000),4);}

function rC(cs,ic,oc){if(cs.indexOf(ic)>-1){var cs=cs.split(ic);cs=cs.join(oc);}return cs;}
function str_trim(s){s=s.replace(/(^\s*)|(\s*$)/g,"");return s;}
function str_trimMiddle(s){s=s.replace(/[\f\n\r\t\v]/g,"");return s;}
function str_trimSpace(s){s=s.replace(/(^\s*)|(\s*$)/g,"");s=s.replace(/[ \f\n\r\t\v]/g,"");return s;}
function str_trimHtml(s){s=s.replace(/<(.*)>.*<\/\1>|<(.*) \/>/,"");return s;}
function str_trimHtml2(s){s=s.replace(/<(.[^<]*)>/g,"");return s;}
function sub_trimValue(s){s=str_trim(s);s=str_trimMiddle(s);s=str_trimHtml(s);return s;}
function sub_txtToHtm(s,br){
	s=s.replace(/</g,"&lt;");
	s=s.replace(/>/g,"&gt;");
	if(br){
		s=s.replace(/\n/g,'<br>');
	}else{
		s=s.replace(/\n/g,' ');
	}
	return s;
}
function sub_htmToTxt(s){
	s=rC(s,"&lt;","<");
	s=rC(s,"&gt;",">");
	return s;
}

function _ij(x_by,x_cmd,x_from){
	var po={_by:x_by,_cmd:x_cmd};
	if(String($proto.cApp[x_by])!="undefined"){_ij_d("loaded",po);return;}
	var f=(!x_from)?$proto.du['_ij']:$proto.du[x_from];
	f=f.replace("[by]",x_by);
	if(!$proto.cacheable||!Modernizr.applicationcache){
		f+="?v="+new Date().getTime();
	}
	sX(f,function (_mx,_mo){_ij_d(_mx,_mo);},po);//*
}
function _ij_d(mx,mo){
	if(mx!="loaded"){
		if(typeof mx=="undefined"){mx="";}
		mx=mx.replace(/\[images\]/g,$proto.du.img);
		$proto.cApp[mo._by]=mx;
	}
	if(typeof mo._cmd=="function"){mo._cmd(mx,mo);return;}
}
function ij2(x_by,static_cmd,static_po,x_path,x_load){
	if(typeof $proto.scriptLoad=="undefined"){return;}
	if(x_by){
		if(!x_path){x_path="";}
		var x_byA=(x_by.indexOf(",")!=-1)?x_by.split(","):[x_by];
		var x_pathA=(x_path.indexOf(",")!=-1)?x_path.split(","):[x_path];
		for(var si=0;si<x_byA.length;si++){
			if(typeof $proto.scriptLoad[x_byA[si]]=="undefined"){
				var y_path=(typeof x_pathA[si]=="undefined")?"":x_pathA[si];
				if(y_path==""){y_path=$proto.du.ij2;}
				$proto.scriptLoad[x_byA[si]]={load:false,path:y_path};
			}
		}
	}

	var static_by="";
	for(si in $proto.scriptLoad){
		//alert(si+"|"+$proto.scriptLoad[si].load+"|"+$proto.scriptLoad[si].path);
		if(x_load==si){$proto.scriptLoad[si].load=true;}
		if(!$proto.scriptLoad[si].load){static_by=si;break;}
	}
	
	if(static_by==""){
		//$$("mPaper","c","clsHide");
		if(typeof static_cmd!="function"){return;}
		static_cmd(static_po);
		return;
	}

    var script=document.createElement("script");
    script.type="text/javascript";
	//$$("mPaper","c","");
	if(script.readyState){//IE
		script.onreadystatechange=function(){
			if(script.readyState=="loaded"||script.readyState=="complete"){
				script.onreadystatechange=null;
				ij2("",static_cmd,static_po,"",static_by);
			}
		};
	}else{//Others
		script.onload=function(){
			ij2("",static_cmd,static_po,"",static_by);
		};
	}

	var f=$proto.scriptLoad[static_by].path;
	var _v=($proto.debug)?sd():$proto.public_ver;
	f=f.replace("[v]",_v);
	if(!$proto.cacheable||!Modernizr.applicationcache){
		//f=sub_tranurl(f,_v);
	}
	script.src=f;
    document.getElementsByTagName("head")[0].appendChild(script);
}

var nls_date={
	_days_narrow:["日","一","二","三","四","五","六"],
	_pm:"下午",
	_am:"上午",
	_field_weekday:"星期",
	_field_year:"年",
	_field_day:"日",
	_field_month:"月",
	_field_yestoday:"昨天",
	_field_today:"今天",
	_field_prev_month:"上月",
	_field_next_month:"下月"
};
function sub_tformat(v){
	if((v=="")||(v==0)){return "00:00";}
	v=Math.floor(v);
	var m=Math.floor(v/60);
	v=nTos(m)+":"+nTos(v-m*60);
	return v;
}
function sub_getDateObj(r_sd,r_st){
	if(r_st==null){r_st="0:0:0";}
	r_sd=r_sd.split("-");
	r_st=r_st.split(":");
	r_d=new Date(r_sd[0],r_sd[1]-1,r_sd[2],r_st[0],r_st[1],r_st[2],0);
	return r_d;
}
function temp_dur(s_val,e_val,r_v,d_val){
	if(d_val==null){
		s_val=(s_val=="")?0:sTon(s_val);
		e_val=(e_val=="")?0:sTon(e_val);
		if((s_val==0)||(e_val==0)){return "-";}
		d_val=e_val-s_val;
	}
	if(d_val<=0){return '刚刚';}
	var dd=Math.floor(d_val/(1000*60*60*24));
	var hh=Math.floor((d_val-(1000*60*60*24)*dd)/(1000*60*60));
	var mm=(d_val-(1000*60*60*24)*dd-(1000*60*60)*hh)/(1000*60);
	
	if(r_v!=1){
		if(dd!=0){return dd+"天前";}
		if(hh!=0){return hh+"小时前";}
		if((mm<=1)&&(mm>0)){
			return "1分钟前";
		}else{
			return Math.floor(mm)+"分钟前";
		}
	}else{
		var r_s="";
		if(dd!=0){r_s+=dd+"天";}
		if(hh!=0){r_s+=hh+"小时";}
		if((mm>1)||(mm<=0)){
			r_s+=Math.floor(mm)+"分钟";
		}
		return r_s+'前';
	}
	return '-';
}
function sub_getdate(ts,d_x){
	if((ts!=null)&&(ts!="")&&((String(ts).indexOf("-")!=-1)||(String(ts).indexOf(":")!=-1)||(String(ts).indexOf(" ")!=-1))){
		var d=new Date();
		var a=(ts.indexOf(" ")!=-1)?ts.split(" "):[ts,""];
		var b=(a[0].indexOf("-")!=-1)?a[0].split("-"):["","",""];
		var c=(a[1].indexOf(":")!=-1)?a[1].split(":"):["","",""];
		var s="";
		if((b[0]!=String(d.getFullYear()))&&(d_x!=2)){s+=b[0]+"-";}
		if((b[0]==String(d.getFullYear()))&&(d_x==3)){s+=b[0]+"-";}
		s+=b[1]+"-"+b[2];
		return s;
	}
	if((ts=="today")||(ts=="")||(ts==null)){
		var d=new Date();
	}else if(ts=="yestoday"){
		var d_s=new Date().getTime()-24*60*60*1000;
		var d=new Date(d_s);
	}else{
		var d=new Date(ts);
	}
	if(d_x==1){
		if(d.getFullYear()==new Date().getFullYear()){
			return (d.getMonth()+1)+"月"+d.getDate()+"日";
		}else{
			return d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日";
		}
	}else if(d_x==2){
		if(d.getFullYear()==new Date().getFullYear()){
			return nTos(d.getMonth()+1)+"-"+nTos(d.getDate());
		}else{
			return d.getFullYear()+"-"+nTos(d.getMonth()+1)+"-"+nTos(d.getDate());
		}
	}else if(d_x==3){
		return d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日";
	}else{
		return d.getFullYear()+"-"+nTos(d.getMonth()+1)+"-"+nTos(d.getDate());
	}
}
function sub_gettime(ts,n){
	if((ts=="today")||(ts=="")||(ts==null)){
		var d=new Date();
	}else if(ts=="yestoday"){
		var d_s=new Date().getTime()-24*60*60*1000;
		var d=new Date(d_s);
	}else{
		var d=new Date(ts);
	}
	if(n==2){
		return nTos(d.getHours())+":"+nTos(d.getMinutes());
	}else{
		return nTos(d.getHours())+":"+nTos(d.getMinutes())+":"+nTos(d.getSeconds());
	}
}
function sub_getDatetime(ts,d_x){
	return sub_getdate(ts,d_x)+" "+sub_gettime(ts);
}
function sub_getWeek(n,d){
	if(n==null){
		if(d){n=new Date(d).getDay();}else{n=new Date().getDay();}
	}
	var x=nls_date._days_narrow;
	return nls_date._field_weekday+x[n];
}
function convertFormattedTime(fs){
   var a1=fs.indexOf(":");
   var a2=fs.lastIndexOf(":");
   var a3=fs.length;
   var strHH=parseFloat(fs.substring(0,a1))*3600;
   var strMM=parseFloat(fs.substring(a1+1,a2))*60;
   var strSS=parseFloat(fs.substring(a2+1,a3));
   return strHH+strMM+strSS;
}
function convertTotalSeconds(ts){
   var sec=(ts%60);
   ts-=sec;
   var tmp=(ts%3600);
   ts-=tmp;
   sec=Math.round(sec*100)/100;
   var strSec=new String(sec);
   var strWholeSec=strSec;
   var strFractionSec="";
   if(strSec.indexOf(".")!=-1){
	  strWholeSec= strSec.substring(0,strSec.indexOf("."));
	  strFractionSec=strSec.substring(strSec.indexOf(".")+1,strSec.length);
   }
   if(strWholeSec.length<2){
	  strWholeSec="0"+strWholeSec;
   }
   strSec=strWholeSec;
   if(strFractionSec.length){
	  strSec=strSec+"."+strFractionSec;
   }
   if((ts%3600)!=0){var hour=0;}else{var hour=(ts/3600);}
   if((tmp%60)!=0){var min=0;}else{var min=(tmp/60);}

   if((new String(hour)).length<2){hour="0"+hour;}
   if((new String(min)).length<2){min="0"+min;}
   var rtnVal=hour+":"+min+":"+strSec;
   return rtnVal;
}

var km_pageno={
	click:null
	,pageno_id:'d_pageno'
	,pagination_id:'d_pagination'
	,locurl:''
	,lout_pageno:function (rt){
		var r=[0,0,0];
		if(!$$(km_pageno.pageno_id)){return r;}
		var s=$$(km_pageno.pageno_id).innerHTML;
		s=s.replace(/[\f\r\t\v\n]/g,"");
		if(s.indexOf("当前页")==-1){
			r[0]=1;
		}else{
			a=s.split("当前页");
			a=a[1];
			a=a.split("&");
			a=a[0];
			r[0]=parseFloat(a);
		}
		if(s.indexOf("总记录")==-1){
			r[1]=1;
		}else{
			a=s.split("总记录");
			a=a[1];
			a=a.split("&");
			a=a[0];
			r[1]=parseFloat(a);
		}
		if(s.indexOf("每页显示条数")==-1){
			r[2]=1;
		}else{
			a=s.split("每页显示条数");
			a=a[1];
			a=a.split("&");
			a=a[0];
			r[2]=parseFloat(a);
		}
		if(!rt){return r[0];}
		return r;
	}
	,pagination:function (pr,url){//pr [pagenum(from 1),totalnum,pagemax]
		if(!url){url='';}
		km_pageno.locurl=url;
		if(!$$(km_pageno.pagination_id)){return;}
		if(!pr&&$$(km_pageno.pageno_id)){
			pr=km_pageno.lout_pageno(true);
		}
		
		var totalnum=parseFloat(pr[1]);
		var pagenum=parseFloat(pr[0]);
		var pagemax=parseFloat(pr[2]);
		if(pagemax==0){pagemax=10;}
		var totalpage=Math.ceil(totalnum/pagemax);
		if(pagenum<1||pagenum>totalpage){
			$$(km_pageno.pagination_id,"h","");
			return;
		}

		var s_prev='',s_next='',s_num='';
		if(pagenum>1){
			s_prev="<a href='javascript:;' class='c' onclick=\"km_pageno.gopage("+(pagenum-1)+","+pagenum+","+totalpage+")\"><i class='icon-angle-left'></i> 上一页</a>";
			s_prev+="";
		}
		if(pagenum<totalpage){
			s_next="";
			s_next+="<a href='javascript:;' class='c' onclick=\"km_pageno.gopage("+(pagenum+1)+","+pagenum+","+totalpage+")\">下一页 <i class='icon-angle-right'></i></a>";
		}
		var a=[];
		var b=pagenum-1;
		do{
			if(a.length>=10){break;}
			if(b-5>=0){a.push(b-5);}
			b++;
		}while(b-5<=totalpage-1)

		for(var i=0;i<a.length;i++){
			if((pagenum-1)==a[i]){
				s_num+="<a href='javascript:;' class='s'>"+(a[i]+1)+"</a>";
			}else{
				s_num+="<a href='javascript:;' class='c' onclick=\"km_pageno.gopage("+(a[i]+1)+","+pagenum+","+totalpage+")\">"+(a[i]+1)+"</a>";
			}
		}
		var s='';
		s+='<span>共 '+totalnum+' 条记录</span>';
		s+=s_prev+s_num+s_next;
		s+="<span>跳转到第</span>&nbsp;<input id='int_pageno' type='text' style='width:20px;' class='int' maxlength='5'>&nbsp;<span>页</span>";
		s+="&nbsp;<button type='button' class='btn' style='padding-left:2px;padding-right:2px;' onclick=\"km_pageno.gopage($('#int_pageno').val(),"+pagenum+","+totalpage+")\">Go</button>";
		if(totalnum<=pagemax){s='';}
		$$(km_pageno.pagination_id,"h",s);
		mb(km_pageno.pageno_id,0);
		mb(km_pageno.pagination_id,1);
	}
	,pn:function (pr,url){//pr [pagenum(from 1),totalnum,pagemax]
		if(!url){url='';}
		km_pageno.locurl=url;
		if(!$$(km_pageno.pagination_id)){return;}
		if(!pr&&$$(km_pageno.pageno_id)){
			pr=km_pageno.lout_pageno(true);
		}
		
		var pagenum=parseFloat(pr[0]);
		var totalnum=parseFloat(pr[1]);
		var pagemax=parseFloat(pr[2]);
		if(pagemax==0){pagemax=10;}
		var totalpage=Math.ceil(totalnum/pagemax);
		if(pagenum<1||pagenum>totalpage){
			$$(km_pageno.pagination_id,"h","");
			return;
		}

		var s_prev='',s_next='',s_num='';
		if(pagenum>1){
			s_prev="<a href='javascript:;' class='c' onclick=\"km_pageno.gopage("+(pagenum-1)+","+pagenum+","+totalpage+")\"><i class='icon-angle-left'></i> 上一页</a>";
			s_prev+="";
		}
		if(pagenum<totalpage){
			s_next="";
			s_next+="<a href='javascript:;' class='c' onclick=\"km_pageno.gopage("+(pagenum+1)+","+pagenum+","+totalpage+")\">下一页 <i class='icon-angle-right'></i></a>";
		}
		var a=[];
		var b=pagenum-1;
		do{
			if(a.length>=10){break;}
			if(b-5>=0){a.push(b-5);}
			b++;
		}while(b-5<=totalpage-1)

		for(var i=0;i<a.length;i++){
			if((pagenum-1)==a[i]){
				s_num+="<a href='javascript:;' class='s'>"+(a[i]+1)+"</a>";
			}else{
				s_num+="<a href='javascript:;' class='c' onclick=\"km_pageno.gopage("+(a[i]+1)+","+pagenum+","+totalpage+")\">"+(a[i]+1)+"</a>";
			}
		}
		var s='';
		//s+='<span>共 '+totalnum+' 条记录</span>';
		s+=s_prev+s_num+s_next;
		if(totalnum<=pagemax){s='';}
		$$(km_pageno.pagination_id,"h",s);
		mb(km_pageno.pageno_id,0);
		mb(km_pageno.pagination_id,1);
	}
	,pagination_a:function (pr,url){
		if(!url){url='';}
		km_pageno.locurl=url;

		var totalnum=parseFloat(pr[1]);
		var pagenum=parseFloat(pr[0]);
		var pagemax=parseFloat(pr[2]);
		var totalpage=Math.ceil(totalnum/pagemax);
		if(pagenum<1||pagenum>totalpage){
			$$(km_pageno.pageno_id,"h","");
			return;
		}

		var s="";
		s+="<table class='tbl'>";
			s+="<tr>";
				s+="<td class='l'>[l]</td>";
				s+="<td class='r'>[r]</td>";
			s+="</tr>";
		s+="</table>";

		var l="";
		l+="<span>当前页&nbsp;"+(pagenum)+"</span>";
		l+="<span>总页数&nbsp;"+totalpage+"</span>";
		l+="<span>总记录&nbsp;"+totalnum+"</span>";
		l+="<span>每页显示条数&nbsp;"+pagemax+"</span>";

		var s_prev='',s_next='',s_num='';
		if(pagenum>1){
			var lnk1='#',lnk2='#';
			if(km_pageno.locurl!=''){
				var u=km_pageno.locurl;
				u=u.replace('[targetpage]',(pagenum-1));
				u=u.replace('[currpage]',pagenum);
				u=u.replace('[totalpages]',totalpage);
				lnk1=u;

				var u=km_pageno.locurl;
				u=u.replace('[targetpage]',1);
				u=u.replace('[currpage]',pagenum);
				u=u.replace('[totalpages]',totalpage);
				lnk2=u;
			}
			s_prev+="<a href='"+lnk2+"'>首页</a>";
			s_prev+="<a href='"+lnk1+"'>上一页</a>";
			s_prev+="";
		}
		if(pagenum<totalpage){
			var lnk1='#',lnk2='#';
			if(km_pageno.locurl!=''){
				var u=km_pageno.locurl;
				u=u.replace('[targetpage]',(pagenum+1));
				u=u.replace('[currpage]',pagenum);
				u=u.replace('[totalpages]',totalpage);
				lnk1=u;

				var u=km_pageno.locurl;
				u=u.replace('[targetpage]',totalpage);
				u=u.replace('[currpage]',pagenum);
				u=u.replace('[totalpages]',totalpage);
				lnk2=u;
			}
			s_next+="<a href='"+lnk1+"'>下一页</a>";
			s_next+="<a href='"+lnk2+"' class=''>尾页</a>";
		}

		var r="";

		var lnk='#';
		if(km_pageno.locurl!=''){
			var u=km_pageno.locurl;
			u=u.replace('[targetpage]',1);
			u=u.replace('[currpage]',pagenum);
			u=u.replace('[totalpages]',totalpage);
			lnk=u;
		}
		r+=s_prev;
		r+=s_next;

		var lnk='#';
		if(km_pageno.locurl!=''){
			var u=km_pageno.locurl;
			u=u.replace('[targetpage]',totalpage);
			u=u.replace('[currpage]',pagenum);
			u=u.replace('[totalpages]',totalpage);
			lnk=u;
		}

		var pv=(pagenum<1)?'':pagenum;

		r+="<span>跳转到第</span>&nbsp;<input id='int_pageno' type='text' style='width:30px;' class='int' maxlength='5' value='"+pv+"'>&nbsp;<span>页</span>";
		r+="&nbsp;<button type='button' class='btn' style='padding-left:10px;padding-right:10px;' onclick=\"km_pageno.gopage($('#int_pageno').val(),"+pagenum+","+totalpage+")\">»</button>";
		s=s.replace('[l]',l);
		s=s.replace('[r]',r);
		$('#'+km_pageno.pageno_id).html(s);
		(function (){
			var _pagenum=pagenum;
			var _totalpage=totalpage;
			$('#int_pageno').bind('keydown',function (){
				$d.dk(function (){
					km_pageno.gopage($('#int_pageno').val(),_pagenum,_totalpage);
				});
			});
		})();
	}
	,pn_a:function (pr,url){
		if(!url){url='';}
		km_pageno.locurl=url;

		var totalnum=parseFloat(pr[1]);
		var pagenum=parseFloat(pr[0]);
		var pagemax=parseFloat(pr[2]);
		var totalpage=Math.ceil(totalnum/pagemax);
		if(pagenum<1||pagenum>totalpage){
			$$(km_pageno.pageno_id,"h","");
			return;
		}

		var s="";
		s+="<table class='tbl'>";
			s+="<tr>";
				s+="<td class='l'>[l]</td>";
				s+="<td class='r'>[r]</td>";
			s+="</tr>";
		s+="</table>";

		var l="";
		l+="<span>当前页&nbsp;"+(pagenum)+"</span>";
		l+="<span>总页数&nbsp;"+totalpage+"</span>";
		l+="<span>总记录&nbsp;"+totalnum+"</span>";
		l+="<span>每页显示条数&nbsp;"+pagemax+"</span>";

		var s_prev='',s_next='',s_num='';
		if(pagenum>1){
			var lnk='#';
			if(km_pageno.locurl!=''){
				var u=km_pageno.locurl;
				u=u.replace('[targetpage]',(pagenum-1));
				u=u.replace('[currpage]',pagenum);
				u=u.replace('[totalpages]',totalpage);
				lnk=u;
			}
			s_prev+="<a href='javascript:;' onclick=\"km_pageno.gopage(1,"+pagenum+","+totalpage+")\">首页</a>";
			s_prev+="<a href='javascript:;' onclick=\"km_pageno.gopage("+(pagenum-1)+","+pagenum+","+totalpage+")\">上一页</a>";
		}
		if(pagenum<totalpage){
			var lnk='#';
			if(km_pageno.locurl!=''){
				var u=km_pageno.locurl;
				u=u.replace('[targetpage]',(pagenum+1));
				u=u.replace('[currpage]',pagenum);
				u=u.replace('[totalpages]',totalpage);
				lnk=u;
			}
			s_next+="<a href='javascript:;' onclick=\"km_pageno.gopage("+(pagenum+1)+","+pagenum+","+totalpage+")\">下一页</a>";
			s_next+="<a href='javascript:;' onclick=\"km_pageno.gopage("+totalpage+","+pagenum+","+totalpage+")\">尾页</a>";
		}

		var r="";

		var lnk='#';
		if(km_pageno.locurl!=''){
			var u=km_pageno.locurl;
			u=u.replace('[targetpage]',1);
			u=u.replace('[currpage]',pagenum);
			u=u.replace('[totalpages]',totalpage);
			lnk=u;
		}
		r+=s_prev;
		r+=s_next;

		var lnk='#';
		if(km_pageno.locurl!=''){
			var u=km_pageno.locurl;
			u=u.replace('[targetpage]',totalpage);
			u=u.replace('[currpage]',pagenum);
			u=u.replace('[totalpages]',totalpage);
			lnk=u;
		}

		var pv=(pagenum<1)?'':pagenum;

		r+="<span>跳转到第</span>&nbsp;<input id='int_pageno' type='text' style='width:30px;text-align:center;' class='int' maxlength='5' value='"+pv+"'>&nbsp;<span>页</span>";
		r+="&nbsp;<button type='button' class='btn' style='padding-left:10px;padding-right:10px;height:25px;line-height:25px;' onclick=\"km_pageno.gopage($('#int_pageno').val(),"+pagenum+","+totalpage+")\">»</button>";
		s=s.replace('[l]',l);
		s=s.replace('[r]',r);
		$('#'+km_pageno.pageno_id).html(s);
		(function (){
			var _pagenum=pagenum;
			var _totalpage=totalpage;
			$('#int_pageno').bind('keydown',function (){
				$d.dk(function (){
					km_pageno.gopage($('#int_pageno').val(),_pagenum,_totalpage);
				});
			});
		})();
	}
	,gopage:function (targetpage,currpage,totalpages){
		targetpage=str_trim(String(targetpage));
		if(targetpage===''){$proto.top.Alert('请输入页码。');return;}
		var regu="^[0-9]+$";
		var re=new RegExp(regu);
		var _return=re.test(targetpage);
		if(!_return){$proto.top.Alert('页码只能输入数字。');return;}
		targetpage=parseFloat(targetpage);
		if(targetpage<1){return;}
		if(targetpage>totalpages){
			$proto.top.Alert('页码不存在。');return;
		}
		if(km_pageno.locurl!=''){
			var u=km_pageno.locurl;
			u=u.replace('[targetpage]',targetpage);
			u=u.replace('[currpage]',currpage);
			u=u.replace('[totalpages]',totalpages);
			//alert(u);
			window.location.href=u;
			return false;
		}

		if(typeof km_pageno['click']=='function'){
			//alert("km_pageno['click']");
			km_pageno['click'](targetpage,currpage,totalpages);
			return;
		}
	}
}
function km_pagenav(pr,url){
	km_pageno.pagination(pr,url);
}
function km_pagenav_a(pr,url){
	km_pageno.pagination_a(pr,url);
}

function km_cl(idx){
    var self=this;
    this.idx=idx;
    this.errorhandle=null;
    this.cmdA=[];
    this.cmdI=-1;
    this.doCmdA=function (){
        if(this.cmdI==-1){return 0;}
        if(this.cmdI==this.cmdA.length){this.cmdA=[];this.cmdI=-1;return 1;}
        var _n=this.cmdI;
        this.cmdI++;
        try{
            if(typeof this.cmdA[_n].func=="function"){
                var _para=(typeof this.cmdA[_n].para=="undefined")?'':this.cmdA[_n].para;
                this.cmdA[_n].func(_para);
            }else{
                
            }
        }catch(e){
            console.log('km_cl error ('+this.idx+') >>> '+e.message+', func: '+_n);
            if(typeof this.errorhandle=='function'){
                this.errorhandle(e.message);
            }
        }
    };
}
var km_cmdlist={};
var km_lout={
	lout_keydown:function (){
		var nl=document.getElementsByTagName("INPUT");
		if(!nl){return;}
		var kc=",191,222,220,";
		var kc_shift=",51,52,53,55,56,192,187,222,";
		var kc_allow=",8,35,36,37,39,";
		for(var h=0;h<nl.length;h++){
			if(nl[h].className.indexOf("int-vs")!=-1){
				nl[h].onkeydown=function (){
					var ent=$d.evt();
					if(kc.indexOf(","+String(ent.keyCode)+",")!=-1){ent.returnValue=false;}
					if(ent.shiftKey&&(kc_shift.indexOf(","+String(ent.keyCode)+",")!=-1)){ent.returnValue=false;}
					if(ent.keyCode==13){ent.returnValue=false;}
				}
				nl[h].onkeyup=function (){
					var ent=$d.evt();
					if(kc.indexOf(","+String(ent.keyCode)+",")!=-1){
						var _re=/([#$%&*`+]|\\|\/|\'|\")/g;
						this.value=this.value.replace(_re,"");
						ent.returnValue=false;
					}
					if(ent.shiftKey&&(kc_shift.indexOf(","+String(ent.keyCode)+",")!=-1)){
						var _re=/([#$%&*`+]|\\|\/|\'|\")/g;
						this.value=this.value.replace(_re,"");
						ent.returnValue=false;
					}
					if(ent.keyCode==13){ent.returnValue=false;}
				}
				$(nl[h]).change(function (){
					var _re=/([#$%&*`+]|\\|\/|\'|\")/g;
					if(_re.test(this.value)){
						this.value=this.value.replace(_re,"");
					}
				});
				$(nl[h]).focus(function (){
					var _re=/([#$%&*`+]|\\|\/|\'|\")/g;
					if(_re.test(this.value)){
						this.value=this.value.replace(_re,"");
					}
				});
			}
			if((nl[h].name=="Page")||(nl[h].name=="pageNo")){
				nl[h].onkeyup=function (){
					var ent=$d.evt();
					if(kc_allow.indexOf(","+ent.keyCode+",")!=-1){return;}

					var s=',48,49,50,51,52,53,54,55,56,57,';
					var re=/[^\x00-\xff]/g;
					var n=$d.elem(ent);
					var v=n.value;
					v=v.replace(re,"");
					var a=[];
					for(var i=0;i<v.length;i++){
						if(s.indexOf(','+v.charCodeAt(i)+',')!=-1){
							a.push(v.charAt(i));
						}
					}
					v=a.join('');
					n.value=v;
				}
				nl[h].onkeydown=function (){
					var imeKey=229;
					var ent=$d.evt();
					var _c_=(ent.keyCode<48)||( (ent.keyCode>57)&&(ent.keyCode<96) )||(ent.keyCode>105);
					_c_=_c_&&(kc_allow.indexOf(","+ent.keyCode+",")==-1);
					if(_c_&&ent.keyCode!=imeKey){ent.returnValue=false;}
				}
			}
		}
		if(typeof $proto.lout_keydown_customer=='function'){$proto.lout_keydown_customer();}
	},
	lout_checkkey:function (){
		var nl=document.getElementsByTagName("INPUT");
		if(!nl){return;}
		for(var h=0;h<nl.length;h++){
			if(nl[h].className.indexOf("int-vs")==0){
				var _re=/([`~,<.>=+?!@#$%&*]|\\|\/|\'|\")/g;
				nl[h].value=nl[h].value.replace(_re,"");
			}
		}
	},
	lout_hintattach:function (_fields){
		var nl=document.getElementsByTagName("INPUT");
		if(!nl){return;}
		for(var h=0;h<nl.length;h++){
			if(nl[h].className.indexOf("int-hs")!=-1){
				var __fields=_fields;
				nl[h].onmouseover=function (){km_lout.lout_nb(__fields,"floatHint",1)};
				nl[h].onmouseout=function (){km_lout.lout_nb(__fields,"floatHint",0)};
				nl[h].onmousemove=function (){km_lout.lout_nb(__fields,"floatHint",1)};
			}
		}
	},
	lout_dateattach:function (){
		var nl=document.getElementsByTagName("INPUT");
		if(!nl){return;}
		var n=29;
		for(var h=0;h<nl.length;h++){
			if(nl[h].className.indexOf("int-dt")!=-1){
				var _id=nl[h].id.substring(4,nl[h].id.length);
				if($$(_id)==null){
					var nd=$d.cc(nl[h].parentNode,"div",[['id',_id]]);
					nd.style.padding=0+'px';
					nd.parentNode.parentNode.style.zIndex=n;
					n--;
				}
			}
		}
	},
	lout_nb:function (_fields,d,n,r){
		if(_fields==''){return;}
		var ent=$d.evt();
		var eo=$d.elem(ent);
		if(!r){
			if(typeof $proto.config[_fields]=="undefined"){return;}
			if(typeof $proto.config[_fields][eo.name]!="undefined"){r=$proto.config[_fields][eo.name].hs;}
		}
		if(!r){return;}
		if(n==1){
			var t=document.body.scrollTop;
			$$(d,"style","pixelLeft:'"+ent.clientX+"',pixelTop:'"+(ent.clientY+t)+"',display:'block'");
		}else if(n==0){
			mb(d,0);
		}
		var pr=gE($$(d),"p");
		$$(pr[0],"h",r);
	}
};

/*

1:
<form name="form1">
<button id="int_submit" type="submit">
</form>
km_valid.initForm('fields_course','form1','int_submit','',function (){});

2:
km_valid.dosubmit(true);


$proto.config['fieldset_course']={
	form:'',
	action:'',
	beforesubmit:function (){},
	checkerror:function (ho){}
}
$proto.config['fields_course']={
	'course.title':{m:1,t:'课程标题',cls:'int-hs',type:'',hs:'',chk:function (co,vo){
		return true;
	}}
};
*/

var km_valid={
	currField:'',
	alert:false,
	formcheck_h:function (_ho,r,b,cls){
		var fieldset=this.currField.replace('fields_','fieldset_');
		if(_ho!=null){
			if(typeof _ho.notpass=="function"){
				_ho.notpass();
			}
		}
		sub_buttonHint(fieldset,r,b,cls,_ho);
	},
	formcheck_d:function (_fields,_h){
		if(domGN(_h).length==0){return true;}
		var co=domGN(_h)[0],vo=null;
		var _cls_s="";
		var _ho=$proto.config[_fields][_h];
		if(typeof _ho['ref']=='undefined'){_ho.ref=0;}

		if(co.className.indexOf('-hs_s')!=-1){
			co.className=co.className.replace('-hs_s','-hs');
		}
		$(co).parent().find('.formcheck').remove();

		if(typeof _ho.trim=="undefined"){
			_ho.trim=true;
		}
		if(_ho.trim){
			var _v_=str_trim($(co).val());
			if(_ho.type!="file"){
				$(co).val(_v_);
			}
		}
		if(typeof _ho.cls!="undefined"){
			_cls_s=_ho.cls+"_s";
		}
		var _check_c=true;
		_check_c=_check_c&&(_ho.m==1);
		_check_c=_check_c&&(_ho.ref!=1);
		if(typeof _ho.multi!="undefined"){
			_check_c=_check_c&&(_ho.multi!=1);
		}
		if(_check_c){
			var _t=_ho.t;
			if(_ho.type=="datetime"){
				if(co.value==""){
					if(typeof _ho.fieldset!="undefined"){
						km_scr.p_mb(_ho.fieldset,1);
					}
					this.formcheck_h(_ho,"“"+_t+"”为必填项!",$$("inputstatdate"+_ho.sd),"int-hs_s");
					return false;
				}
			}
			if(co.value==""||$(co).val()==''){this.formcheck_h(_ho,"“"+_t+"”为必填项!",co,_cls_s);return false;}
			//if(co.value=="无"){this.formcheck_h(_ho,"“"+_t+"”为必填项!",co,_cls_s);return false;}
			if((co.value.indexOf("请选择")!=-1)||(co.value.indexOf("-全部类型-")!=-1)||(co.value.indexOf("-全部等级-")!=-1)){
				this.formcheck_h(_ho,"“"+_t+"”为必填项!",co,_cls_s);return false;
			}
			if(_ho.type=="select"){
				if(co.value==-1||co.value==''){this.formcheck_h(_ho,"“"+_t+"”为必填项!",co,_cls_s);return false;}
			}
		}
		var _return=km_form.valid_max(_ho,co,_cls_s,"max");
		if(!_return){return false;}
		var _return=km_form.valid_max(_ho,co,_cls_s,"min");
		if(!_return){return false;}

		if(typeof _ho.extra=="undefined"){
			_ho.extra=0;
		}
		if((co.value!="")&&(_ho.extra!=1)&&(co.type!='file')){
			if(typeof km_form.chkchar!='undefined'){
				var _re=km_form.chkchar;
				var _str=km_form.chkcharhint;
			}else{
				var _re=/([$%&*`+]|\\|\'|\")/;
				var _str='输入的的内容不能包含以下字符：<br/>$ % & * ` + \\ \' \"';
			}
			if(_re!=null){
				var _return=!_re.test(co.value);
				if(!_return){
					this.formcheck_h(_ho,_str,co,_cls_s);
					return false;
				}
			}
		}

		if(_ho.m==0&&co.value==''){return true;}
		var o_cd=_ho.chk(co,vo);
		if(!o_cd){return false;}
		if(co.parentNode.lastChild.className=='h-valid'){
			co.parentNode.removeChild(co.parentNode.lastChild);
		}
		return true;
	},
	formcheck:function (_fields,_h,_func){
		if(_h){			
			var _rf=this.formcheck_d(_fields,_h);
			if(!_rf){
				return false;
			}
		}else{
			for(_h in $proto.config[_fields]){
				var _rf=this.formcheck_d(_fields,_h);
				if(!_rf){
					return false;
				}
			}
		}
		if(typeof _func=="function"){_func();}
		return true;
	},
	initFields:function (_fields){
		km_lout.lout_hintattach(_fields);
		if(typeof $proto.config[_fields]=="undefined"){return;}
		for(f in $proto.config[_fields]){
			if($proto.config[_fields][f].type=='datetime'){
				var _calo=$proto.config[_fields][f].calo;
				if((typeof $proto.config[_fields][f].calp!="undefined")&&(typeof calobj_a[_calo]=="undefined")){
					var _a=$proto.config[_fields][f].calp;
					initCalObj(_calo,_a[0],_a[1]);
				}
				sdate_init($proto.config[_fields][f].sd,$proto.config[_fields][f].hd,$proto.config[_fields][f].id,$proto.config[_fields][f].calo);
			}
		}
	},
	initForm:function (_fields,_form,_submit,_cls,_func){
		try{
			CookieUtil.set("pagestatus",window.location.href);
			CookieUtil.set('formstatus','');
		}catch(et){}
		km_lout.lout_dateattach();
		this.currField=_fields;
		if(!_cls){_cls="btn";}

		var _c=false;
		var __cls=_cls;
		var __fields=_fields;
		var __fieldset=__fields.replace('fields_','fieldset_');
		if(typeof $proto.config[__fieldset]!='undefined'){
			if(typeof $proto.config[__fieldset].fields!='undefined'){
				__fields=$proto.config[__fieldset].fields;
			}
		}
		km_valid.initFields(__fields);

		this.submitconfig={
			fields:__fields
			,fieldset:__fieldset
			,form:_form
			,func:(typeof _func=="function")?_func:function (){return true;}
		};

		if(_form!=null){
			if(domGN(_form).length!=0){
				domGN(_form)[0].onsubmit=km_valid.dosubmit;
				_c=true;
			}
		}
		if($$(_submit)&&!_c){
			$$(_submit).onclick=km_valid.dosubmit;
		}

		try{$('input, textarea').placeholder();}catch(ex){}
		console.log('initForm completed');
	},
	submitconfig:null,
	dosubmit:function (n){
		console.log('dosubmit begin');
		var func=km_valid.submitconfig.func;
		var form=km_valid.submitconfig.form;
		var fields=km_valid.submitconfig.fields;
		var fieldset=km_valid.submitconfig.fieldset;

		try{
			if(!km_valid.formcheck(fields,null,null)){
				km_valid.restoreph();
				return false;
			}
		}catch(ve){
			console.log('formcheck error: '+ve.message);
		}

		console.log('after valid');
		try{
			if(CookieUtil.get("formstatus")==CookieUtil.get("pagestatus")){
				km_valid.restoreph();
				return false;
			}else{
				if(typeof $proto['formcheckhint']=='function'){
					if(!$proto['formcheckhint'](fields)){
						km_valid.restoreph();
						return false;
					}
				}
				CookieUtil.set("formstatus",CookieUtil.get("pagestatus"));
			}
		}catch(ve){
			console.log('formstatus error: '+ve.message);
		}

		try{
			if(typeof $proto.config[fieldset]!='undefined'){
				if(domGN(form)[0].action==''&&$proto.config[fieldset].action!=''){
					domGN(form)[0].action=$proto.config[fieldset].action;
					if($proto.clientinfo){
						domGN(form)[0].action=sub_tranclientid(domGN(form)[0].action,$proto.clientinfo.clientid);
					}
				}
				if(domGN(form)[0].target==''&&typeof $proto.config[fieldset]['target']!='undefined'&&$proto.config[fieldset].target!=''){
					domGN(form)[0].target=$proto.config[fieldset].target;
				}
				if(typeof $proto.config[fieldset].beforesubmit=='function'){
					$proto.config[fieldset].beforesubmit();
				}
			}
		}catch(ve){
			console.log('fieldset error: '+ve.message);
		}

		try{
			window.onbeforeunload=null;
			//$$(__submit,"c",__cls);
			//$$(__submit,"style","cursor:'default'");
			km_valid.clearph();
		}catch(ve){
			console.log('clearph error: '+ve.message);
		}

		console.log('dosubmit prepare submit');

		if(!n){
			return func();
		}else{
			if(form){domGN(form)[0].onsubmit=function (){return true;}}
			func();
			if(form){
				domGN(form)[0].submit();
				return false;//防止重复提交
			}
		}
	},
	restoreph:function (){
		if(typeof $proto['clickObj']=='undefined'){$proto.clickObj=null;}
		var _fields=km_valid.currField;
		for(_h in $proto.config[_fields]){
			if(typeof $proto.config[_fields][_h].placeholder=='undefined'){
				$proto.config[_fields][_h].placeholder='';
			}
			if($proto.config[_fields][_h].placeholder!=''){
				if(domGN(_h)[0].value==''||$proto.config[_fields][_h].placeholder==domGN(_h)[0].value||$(domGN(_h)[0]).val()==$proto.config[_fields][_h].placeholder){
					if($proto.clickObj!=domGN(_h)[0]){
						$(domGN(_h)[0]).val('');
					}else{
						domGN(_h)[0].value='';
					}
				}
			}
			if(typeof $proto.config[_fields][_h].ajax!='undefined'){
				$proto.config[_fields][_h].ajax=false;
			}
		}
	},
	clearph:function (){
		var _fields=km_valid.currField;
		for(_h in $proto.config[_fields]){
			if(typeof $proto.config[_fields][_h].placeholder=='undefined'){
				$proto.config[_fields][_h].placeholder='';
			}
			if($proto.config[_fields][_h].placeholder!=''){
				if(domGN(_h)[0].value==$proto.config[_fields][_h].placeholder){
					domGN(_h)[0].value='';
				}
			}
		}
	}
};

var km_validm=function (isalert){
	var self=this;
	this.pagestatus='';
	this.formstatus='';
	this.currField='';
	this.alert=(isalert==true)?true:false;
	this.formcheck_h=function (_ho,r,b,cls){
		var fieldset=self.currField.replace('fields_','fieldset_');
		if(_ho!=null){
			if(typeof _ho.notpass=="function"){
				_ho.notpass();
			}
		}
		sub_buttonHint(fieldset,r,b,cls,_ho,self);
	};
	this.formcheck_d=function (_fields,_h){
		if(domGN(_h).length==0){return true;}
		var co=domGN(_h)[0],vo=null;
		var _cls_s="";
		var _ho=$proto.config[_fields][_h];
		if(typeof _ho['ref']=='undefined'){_ho.ref=0;}

		if(co.className.indexOf('-hs_s')!=-1){
			co.className=co.className.replace('-hs_s','-hs');
		}
		$(co).parent().find('.formcheck').remove();

		if(typeof _ho.trim=="undefined"){
			_ho.trim=true;
		}
		if(_ho.trim){
			var _v_=str_trim($(co).val());
			if(_ho.type!="file"){
				$(co).val(_v_);
			}
		}
		if(typeof _ho.cls!="undefined"){
			_cls_s=_ho.cls+"_s";
		}
		var _check_c=true;
		_check_c=_check_c&&(_ho.m==1);
		_check_c=_check_c&&(_ho.ref!=1);
		if(typeof _ho.multi!="undefined"){
			_check_c=_check_c&&(_ho.multi!=1);
		}
		if(_check_c){
			var _t=_ho.t;
			if(_ho.type=="datetime"){
				if(co.value==""){
					if(typeof _ho.fieldset!="undefined"){
						km_scr.p_mb(_ho.fieldset,1);
					}
					self.formcheck_h(_ho,"“"+_t+"”为必填项!",$$("inputstatdate"+_ho.sd),"int-hs_s");
					return false;
				}
			}
			if(co.value==""||$(co).val()==''){self.formcheck_h(_ho,"“"+_t+"”为必填项!",co,_cls_s);return false;}
			//if(co.value=="无"){self.formcheck_h(_ho,"“"+_t+"”为必填项!",co,_cls_s);return false;}
			if((co.value.indexOf("请选择")!=-1)||(co.value.indexOf("-全部类型-")!=-1)||(co.value.indexOf("-全部等级-")!=-1)){
				self.formcheck_h(_ho,"“"+_t+"”为必填项!",co,_cls_s);return false;
			}
			if(_ho.type=="select"){
				if(co.value==-1||co.value==''){self.formcheck_h(_ho,"“"+_t+"”为必填项!",co,_cls_s);return false;}
			}
		}
		var _return=km_form.valid_max(_ho,co,_cls_s,"max");
		if(!_return){return false;}
		var _return=km_form.valid_max(_ho,co,_cls_s,"min");
		if(!_return){return false;}

		if(typeof _ho.extra=="undefined"){
			_ho.extra=0;
		}
		if((co.value!="")&&(_ho.extra!=1)&&(co.type!='file')){
			if(typeof km_form.chkchar!='undefined'){
				var _re=km_form.chkchar;
				var _str=km_form.chkcharhint;
				if(typeof _ho['t']!='undefined'&&_ho['t']!=''){
					_str='“'+_ho.t+'”'+_str;
				}
			}else{
				var _re=/([$%&*`+]|\\|\'|\")/;
				var _str='输入的的内容不能包含以下字符：<br/>$ % & * ` + \\ \' \"';
				if(typeof _ho['t']!='undefined'&&_ho['t']!=''){
					_str='“'+_ho.t+'”'+_str;
				}
			}
			if(_re!=null){
				var _return=!_re.test(co.value);
				if(!_return){
					self.formcheck_h(_ho,_str,co,_cls_s);
					return false;
				}
			}
		}

		if(_ho.m==0&&co.value==''){return true;}
		var o_cd=_ho.chk(co,vo);
		if(!o_cd){return false;}
		if(co.parentNode.lastChild.className=='h-valid'){
			co.parentNode.removeChild(co.parentNode.lastChild);
		}
		return true;
	};
	this.formcheck=function (_fields,_h,_func){
		if(_h){			
			var _rf=self.formcheck_d(_fields,_h);
			if(!_rf){
				return false;
			}
		}else{
			for(_h in $proto.config[_fields]){
				var _rf=self.formcheck_d(_fields,_h);
				if(!_rf){
					return false;
				}
			}
		}
		if(typeof _func=="function"){_func();}
		return true;
	};
	this.initFields=function (_fields){
		km_lout.lout_hintattach(_fields);
		if(typeof $proto.config[_fields]=="undefined"){return;}
		for(f in $proto.config[_fields]){
			if($proto.config[_fields][f].type=='datetime'){
				var _calo=$proto.config[_fields][f].calo;
				if((typeof $proto.config[_fields][f].calp!="undefined")&&(typeof calobj_a[_calo]=="undefined")){
					var _a=$proto.config[_fields][f].calp;
					initCalObj(_calo,_a[0],_a[1]);
				}
				sdate_init($proto.config[_fields][f].sd,$proto.config[_fields][f].hd,$proto.config[_fields][f].id,$proto.config[_fields][f].calo);
			}
		}
	};
	this.initForm=function (_fields,_form,_submit,_cls,_func){
		self.pagestatus=window.location.href;
		self.formstatus='';
		km_lout.lout_dateattach();
		self.currField=_fields;
		if(!_cls){_cls="btn";}

		var _c=false;
		var __cls=_cls;
		var __fields=_fields;
		var __fieldset=__fields.replace('fields_','fieldset_');
		if(typeof $proto.config[__fieldset]!='undefined'){
			if(typeof $proto.config[__fieldset].fields!='undefined'){
				__fields=$proto.config[__fieldset].fields;
			}
		}
		self.initFields(__fields);

		self.submitconfig={
			fields:__fields
			,fieldset:__fieldset
			,form:_form
			,func:(typeof _func=="function")?_func:function (){return true;}
		};

		if(_form!=null){
			if(domGN(_form).length!=0){
				domGN(_form)[0].onsubmit=self.dosubmit;
				_c=true;
			}
		}
		if($$(_submit)&&!_c){
			$$(_submit).onclick=self.dosubmit;
		}

		try{$('input, textarea').placeholder();}catch(ex){}
		console.log('initForm completed');
	};
	this.submitconfig=null;
	this.dosubmit=function (n){
		console.log('dosubmit begin');
		var func=self.submitconfig.func;
		var form=self.submitconfig.form;
		var fields=self.submitconfig.fields;
		var fieldset=self.submitconfig.fieldset;

		try{
			if(!self.formcheck(fields,null,null)){
				self.restoreph();
				return false;
			}
		}catch(ve){
			console.log('formcheck error: '+ve.message);
		}

		console.log('after valid');
		try{
			if(self.formstatus==self.pagestatus){
				self.restoreph();
				return false;
			}else{
				if(typeof $proto['formcheckhint']=='function'){
					if(!$proto['formcheckhint'](fields)){
						self.restoreph();
						return false;
					}
				}
				self.formstatus=self.pagestatus;
			}
		}catch(ve){
			console.log('formstatus error: '+ve.message);
		}

		try{
			if(typeof $proto.config[fieldset]!='undefined'){
				if(domGN(form)[0].action==''&&$proto.config[fieldset].action!=''){
					domGN(form)[0].action=$proto.config[fieldset].action;
					if($proto.clientinfo){
						domGN(form)[0].action=sub_tranclientid(domGN(form)[0].action,$proto.clientinfo.clientid);
					}
				}
				if(domGN(form)[0].target==''&&typeof $proto.config[fieldset]['target']!='undefined'&&$proto.config[fieldset].target!=''){
					domGN(form)[0].target=$proto.config[fieldset].target;
				}
				if(typeof $proto.config[fieldset].beforesubmit=='function'){
					$proto.config[fieldset].beforesubmit();
				}
			}
		}catch(ve){
			console.log('fieldset error: '+ve.message);
		}

		try{
			window.onbeforeunload=null;
			//$$(__submit,"c",__cls);
			//$$(__submit,"style","cursor:'default'");
			self.clearph();
		}catch(ve){
			console.log('clearph error: '+ve.message);
		}

		console.log('dosubmit prepare submit');

		if(!n){
			return func();
		}else{
			if(form){domGN(form)[0].onsubmit=function (){return true;}}
			func();
			if(form){
				domGN(form)[0].submit();
				return false;//防止重复提交
			}
		}
	};
	this.restoreph=function (){
		if(typeof $proto['clickObj']=='undefined'){$proto.clickObj=null;}
		var _fields=self.currField;
		for(_h in $proto.config[_fields]){
			if(typeof $proto.config[_fields][_h].placeholder=='undefined'){
				$proto.config[_fields][_h].placeholder='';
			}
			if($proto.config[_fields][_h].placeholder!=''){
				if(domGN(_h)[0].value==''||$proto.config[_fields][_h].placeholder==domGN(_h)[0].value||$(domGN(_h)[0]).val()==$proto.config[_fields][_h].placeholder){
					if($proto.clickObj!=domGN(_h)[0]){
						$(domGN(_h)[0]).val('');
					}else{
						domGN(_h)[0].value='';
					}
				}
			}
			if(typeof $proto.config[_fields][_h].ajax!='undefined'){
				$proto.config[_fields][_h].ajax=false;
			}
		}
	};
	this.clearph=function (){
		var _fields=self.currField;
		for(_h in $proto.config[_fields]){
			if(typeof $proto.config[_fields][_h].placeholder=='undefined'){
				$proto.config[_fields][_h].placeholder='';
			}
			if($proto.config[_fields][_h].placeholder!=''){
				if(domGN(_h)[0].value==$proto.config[_fields][_h].placeholder){
					domGN(_h)[0].value='';
				}
			}
		}
	};
};

function s_bsf(b,cls){
	try{if(b.type!="hidden"){
		if(b.className.indexOf('int-hs')!=-1){b.value='';}
		b.focus();
	}}catch(_r){}
	if(cls!=null){b.className=cls;}
	try{$proto.checkfield=b;}catch(_r){}
}
function sub_buttonHint(fieldset,r,b,cls,ho,vm){
	if(!r){r='';}
	try{
		var isfrm='';
		if(typeof $proto.config[fieldset]!='undefined'){
			if(typeof $proto.config[fieldset]['frm']!='undefined'&&$proto.config[fieldset]['frm']!=''){
				isfrm=$proto.config[fieldset]['frm'];
			}
		}

		if(cls!=null){
			if(cls.indexOf('-hs_s')!=-1){
				b.className=b.className.replace('-hs_s','-hs');
				b.className=b.className.replace('-hs','-hs_s');
			}else{
				b.className=cls;
			}
		}
		var cc=km_valid.alert;
		if(vm){cc=vm.alert;}
		if(cc){
			var h_cmd="";
			if(typeof b=="object"){
				$proto.checkfield=b;
				if(isfrm!=''){
					h_cmd="$proto.top.Alert();$d.getWin($$('"+isfrm+"')).s_bsf($proto.checkfield)";
				}else{
					h_cmd="$proto.top.Alert();s_bsf($proto.checkfield)";
				}
			}
			if(typeof $proto.config[fieldset]!='undefined'&&typeof $proto.config[fieldset]['checkerror']=='function'){
				$proto.config[fieldset]['checkerror'](ho);
			}
			$proto.top.Alert(r,h_cmd);
		}else{
			$(b).parent().find('.formcheck').remove();
			$(b).parent().append('<div class="formcheck"><span>'+r+'</span></div>');
			if(typeof $proto.config[fieldset]!='undefined'&&typeof $proto.config[fieldset]['checkerror']=='function'){
				$proto.config[fieldset]['checkerror'](ho);
			}
			if(typeof b=="object"){
				if(isfrm!=''){
					$d.getWin($$(isfrm)).s_bsf(b);
				}else{
					s_bsf(b);
				}
			}
		}
	}catch(_r){
		console.log('sub_buttonHint: '+_r.message);
	}
}


function $list(list,func){
	var self=this;
	this.list=(typeof list=="array")?list:[];
	this.func=func;
	this.del=function (x_sid){
		if(!x_sid){return null;}
		var x_array=[];
		for(var i=0;i<this.list.length;i++){
			if(this.list[i].id!=x_sid){x_array.push(this.list[i]);}
		}
		this.list=x_array;
		this.trace();
	};
	this.delall=function (){
		this.list=[];
		this.trace();
	};
	this.set=function (x_sid,x_para){
		if(!x_sid){return;}
		for(var i=0;i<this.list.length;i++){
			if(this.list[i].id==x_sid){
				if(x_para!=null){
					this.list[i].pa=x_para;
					this.trace();
				}
				return this.list[i];
			}
		}
		t_o={id:x_sid,pa:x_para};
		this.list.push(t_o);
		this.trace();
		return t_o;
	};
	this.get=function (x_sid){
		if(x_sid){
			for(var i=0;i<this.list.length;i++){
				if(this.list[i].id==x_sid){return this.list[i];}
			}
		}
		return null;
	};
	this.trace=function (x_sid,x_para){
		if(x_sid==null){x_sid="";}
		var t_o=null;
		if(x_sid){
			var x_list=",";
			for(i in this.list){x_list+=this.list[i].id+",";}
			if(x_list.indexOf(","+x_sid+",")==-1){
				t_o={id:x_sid,pa:x_para};
				this.list.push(t_o);
			}
		}
		if(typeof this.func=="function"){this.func();}
		return t_o;
	};
};




// qTip - CSS Tool Tips - by Craig Erskine
// http://qrayg.com
//
// Multi-tag support by James Crooke
// http://www.cj-design.com
//
// Inspired by code from Travis Beckham
// http://www.squidfingers.com | http://www.podlob.com
//
// Copyright (c) 2006 Craig Erskine
// Permission is granted to copy, distribute and/or modify this document
// under the terms of the GNU Free Documentation License, Version 1.3
// or any later version published by the Free Software Foundation;
// with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
// A copy of the license is included in the section entitled "GNU
// Free Documentation License".

/*

<a href="#" data-tip="aaaaaa">aaa</a>
<script>
tooltip.init ();
</script>

div#qTip {
 padding: 3px;
 border: 1px solid #666;
 border-right-width: 2px;
 border-bottom-width: 2px;
 display: none;
 background: #999;
 color: #FFF;
 font: bold 9px Verdana, Arial, sans-serif;
 text-align: left;
 position: absolute;
 z-index: 1000;
}

*/


var qTipX = 0; //This is qTip's X offset//
var qTipY = 15; //This is qTip's Y offset//

//There's No need to edit anything below this line//
tooltip = {
  name : "qTip",
  offsetX : qTipX,
  offsetY : qTipY,
  tip : null
}

tooltip.init = function () {
	var tipNameSpaceURI = "http://www.w3.org/1999/xhtml";
	if(!tipContainerID){ var tipContainerID = "qTip";}
	var tipContainer = document.getElementById(tipContainerID);

	if(!tipContainer) {
	  tipContainer = document.createElementNS ? document.createElementNS(tipNameSpaceURI, "div") : document.createElement("div");
		tipContainer.setAttribute("id", tipContainerID);
	  document.getElementsByTagName("body").item(0).appendChild(tipContainer);
	}

	if (!document.getElementById) return;
	this.tip = document.getElementById (this.name);
	if (this.tip) document.onmousemove = function (evt) {tooltip.move (evt)};

	var a, sTitle, elements;
	
	elements = $('img[data-tip]');
	if(elements){
		for (var i = 0; i < elements.length; i ++){
			a = elements[i];
			sTitle = $(a).data("tip");
			if(sTitle)
			{
				a.setAttribute("tiptitle", sTitle);
				a.removeAttribute("title");
				a.removeAttribute("alt");
				a.onmouseover = function() {tooltip.show(this.getAttribute('tiptitle'))};
				a.onmouseout = function() {tooltip.hide()};
			}
		}
	}
}

tooltip.move = function (evt) {
	var x=0, y=0;
	if (document.all) {//IE
		x = (document.documentElement && document.documentElement.scrollLeft) ? document.documentElement.scrollLeft : document.body.scrollLeft;
		y = (document.documentElement && document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop;
		x += window.event.clientX;
		y += window.event.clientY;
		
	} else {//Good Browsers
		x = evt.pageX;
		y = evt.pageY;
	}
	this.tip.style.left = (x + this.offsetX) + "px";
	this.tip.style.top = (y + this.offsetY) + "px";
}

tooltip.show = function (text) {
	if (!this.tip) return;
	this.tip.innerHTML = text;
	this.tip.style.display = "block";
}

tooltip.hide = function () {
	if (!this.tip) return;
	this.tip.innerHTML = "";
	this.tip.style.display = "none";
}
/*
window.onload = function () {
	tooltip.init ();
}
*/
window.Echo=(function (window, document, undefined) {

  'use strict';

  var store=[], offset, throttle, poll;

  var _inView=function (el) {
    var coords=el.getBoundingClientRect();
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset));
  };

  var _pollImages=function () {
    for (var i=store.length; i--;) {
      var self=store[i];
      if (_inView(self)) {

        var a=[];
        if($(self).data('box')){
          var box=$(self).data('box');
          if(box.indexOf(',')!=-1){
            a=box.split(',');
            a[0]=parseFloat(a[0]);
            a[1]=parseFloat(a[1]);
          }
        }
        if($(self).data('showimage')){
          var showimage=$(self).data('showimage');
          window[showimage](self);
        }else if(a.length>0){
          _showImageBox(self,a);
        }else{
          _showImage(self);
        }

        var echoType=$(self).data('echoType');
        if(echoType=='expand'){
          var w=self.parentNode.offsetWidth;
          var h=self.parentNode.offsetHeight;
          $(self).animate({
            width:w
            ,height:h
          },500,function (){

          });
        }

        store.splice(i, 1);
      }
    }
    if(typeof window['afterEcho']!='undefined'){
      window['afterEcho']();
    }
  };

  var _showImage=function (self){
    (function (){
      var _self=self;
      var img=new Image();
      img.onload=function(){
          _self.src=$(_self).data('echo');
          img.onload=null;
          img=null;
      }
      if($(_self).data('error')){
        img.onerror=function (){
          if($(_self).data('error').indexOf($(_self).attr('src'))==-1){
            img.onload=null;
            img=null;
            $(_self).attr('src',$(_self).data('error'));
          }
        };
      }
      img.src=$(_self).data('echo');
    })();    
  }

  var _showImageBox=function (self,a){
    (function (){

      var _self=self;
      var _a=a;
      var img=new Image();
      img.onload=function(){
        var _w=img.width;
        var _h=img.height;
        var b=km_image_util.resize(_w,_h,_a[0],_a[1]);
        //console.log('a: '+a[0]+'|'+a[1]);
        //console.log('b: '+b[0]+'|'+b[1]);

        var _l=0,_t=0;
        if(_w>_a[0]){
          _l=0-(b[0]-_a[0])/2;
        }
        if(_h>_a[1]){
          _t=0-(b[1]-_a[1])/2;
        }

        $(_self).css({
          'position':'absolute'
          ,'top':_t
          ,'left':_l
          ,'width':b[0]+'px'
          ,'height':b[1]+'px'
        });

        _self.src=$(_self).data('echo');

        img.onload=null;
        img=null;

      };
      if($(_self).data('error')){
        img.onerror=function (){
          if($(_self).data('error').indexOf($(_self).attr('src'))==-1){
            img.onload=null;
            img=null;
            $(_self).attr('src',$(_self).data('error'));
          }
        };
      }
      img.src=$(_self).data('echo');

    })();

  }

  var _throttle=function () {
    clearTimeout(poll);
    poll=setTimeout(_pollImages, throttle);
  };

  var init=function (obj) {
    /*
    $('img[data-echo]').each(function (i){
        if($(this).data('error')){
          $(this).on('error',function (){
            if($(this).data('error').indexOf($(this).attr('src'))==-1){
              $(this).attr('src',$(this).data('error'));
            }
          });
        }
    });
    */
    var nodes=$('img[data-echo]');
    var opts=obj || {};
    offset=opts.offset || 0;
    throttle=opts.throttle || 250;

    for (var i=0; i < nodes.length; i++) {
      store.push(nodes[i]);
    }

    _throttle();

    if (document.addEventListener) {
      window.addEventListener('scroll', _throttle, false);
    } else {
      window.attachEvent('onscroll', _throttle);
    }
  };

  return {
    init: init,
    render: _throttle
  };

})(window, document);

function km_feed(options){
	var self=this;
	this.max=5;
	this.setpheight=90;
	this.time=7000;
	this.container='feed_learningactivity';
	this.animating=false;
	if(options){
		for(var i in options){
			self[i]=options[i];
		}
	}
	if(this.container){
		this.url=$('#'+this.container).data('kmUrl');
		if(typeof this.url=='undefined' || String(this.url)=='undefined'){this.url='';}
	}
	
	this.load=function (){
		if(self.url==''){return;}
		var posting=$.ajax({
			type: "GET"
			,url: self.url
			,cache: false
		});
		posting.done(function(data) {
			for(var i=0;i<data.rows.length;i++){
				/*
				data.rows[i]={
					owner:''
					,gender:''
					,createtime:''
					,content:''
				};
				*/
				var nd=$d.cc('','div',[['class','item']]);
				var s="";
				s+="<a class='userportrait' href='#' style='background-image:url(/resource/userportrait/[owner]_20x20.png)'></a>";
				s+="<span class='gender [gender]'></span>";
				s+="<span class='createtime'>[createtime]</span>";
				s+="<a class='owner' href='#'>[owner]</a>";
				s+="<div class='content'>[content]</div>";
				nd.innerHTML=s;
				self.container.appendChild(nd);
			}
		});
		posting.fail(function(data) {
			console.log(data);
		});
		posting.always(function() {
			self.start();
		});

	};
	this.start=function (){
		try{
			var len=$$(self.container).children.length;
			if(len>this.max){
				setTimeout(function (){
					self.tran();
				},self.time);
			}else{
				setTimeout(function (){
					self.load();
				},self.time);
			}
		}catch(eg){

		}
	};
	this.tran=function (){
		self.animating=true;
		$('#'+self.container).animate({top:(0-self.setpheight)+'px'},450,function (){
			self.animating=false;
			self.after();
		});
	};
	this.after=function (){
		$$(self.container).removeChild($$(self.container).children[0]);
		$$(self.container).style.top='0px';
		self.start();
	}

};

var km_slide={

	dottran:function (did,n,h){
		var eo=$d.elem($d.evt());
		var nl=eo.parentNode.children;
		for(var i=0;i<nl.length;i++){
			nl[i].className='dot';
		}
		nl[n].className='dot_select';
		$$(did).style.top=(0-n*h)+'px';
		if(Echo){Echo.render();}
	}
	,actran:function (did,n,h){
		var eo=$d.elem($d.evt());
		var nl=eo.parentNode.children;
		for(var i=0;i<nl.length;i++){
			nl[i].className='ac';
		}
		nl[n].className='ac_select';
		$$(did).style.top=(0-n*h)+'px';
		if(Echo){Echo.render();}
	}

};


function km_slidegrid(){
	var self=this;
	this.currpage=0;
	this.currtran=-1;
	this.container='';
	this.animating=false;
	this.tranpage=function (){
		self.currtran++;
		if(self.currtran==self.currpageitem.length-1){
			this.currpage++;
			if(self.currpage==self.allImages.length){self.currpage=0;}
			self.swap();
		}else{
			self.tran();
		}
	};
	this.tran=function (){
		var n=self.currpageitem[self.currtran];
		var nd=$$(self.container).children[n];
		var w=self.allImages[self.currpage][n].w;
		self.animating=true;
		var morph=new jsMorph();
		morph.concat(
			$$(nd.firstChild)
		    ,{left:(0-w)+'px'}
		    ,{duration:450}
		    ,function(n) {return --n*n*n+1}
		    ,null
		    ,null
			,function (objs, time, frames, jsMorphSpeed){

			}
		);
		morph.concat(
			$$(nd.lastChild)
		    ,{left:'0px'}
		    ,{duration:450}
		    ,function(n) {return --n*n*n+1}
		    ,null
		    ,null
			,function (objs, time, frames, jsMorphSpeed){
				self.animating=false;
				self.tranpage();
			}
		);
		morph.start();
	};
	this.swap=function (){
		var currpage=self.currpage;
		var nextpage=(currpage==self.allImages.length-1)?0:currpage+1;
		var nl=$$(self.container).children;
		for(var i=0;i<nl.length;i++){
			if(parseFloat(nl[i].firstChild.style.left.replace('px',''))<0){
				nl[i].removeChild(nl[i].firstChild);
			}
			$(nl[i]).append(self.allImages[nextpage][i].html);
			$(nl[i].lastChild).css('left',self.allImages[nextpage][i].w+'px');
		}
		self.currpageitem=getOrderStr(nl.length);
		//console.log(self.currpageitem.join(','));
		self.currtran=-1;
		setTimeout(function (){
			self.tranpage();
		},3000);
	}
	this.start=function (){
		self.swap();
	}
}

function getOrderStr(mp){
	var orderArray1=[],orderArray2=[];
	for(t=0;t<mp;t++){
		orderArray1[t]=t;
	}
	for(t=0;t<=orderArray1.length;t++){
		var rnd=Math.random();//生成伪随机数
		var rndChar=Math.floor(rnd*(orderArray1.length-t));
		orderArray2[t]=orderArray1[rndChar];
		for(u=rndChar;u<orderArray1.length-t;u++){
			orderArray1[u]=orderArray1[u+1];
		}
	}
	return orderArray2;
}


/*
var public_ad={
	'frm_ad_home_default_1':{did:'d_ad_home_default_1',url:''}
};
km_ad.load();
url - 可选，如果url 为空则取容器元素的data-km-url属性值
*/

var km_ad={
	callback:function (){}
	,load:function (callback){
		if(typeof callback=='function'){
			km_ad.callback=callback;
		}
		if(typeof window['public_ad']=='undefined'){
			km_ad.callback();
			return;
		}
		km_cmdlist['ad']=new km_cl('ad');
		var _after=function (frmid,doc){
			setTimeout(function (){
				//$proto.top.km_scr.frm_control2(frmid);
				km_cmdlist['ad'].doCmdA();
			},10);
			//return true;
		};

		for(var i in public_ad){
			var src='';
			if(typeof public_ad[i]['url']!='undefined' && public_ad[i]['url']!=''){
				src=public_ad[i]['url'];
			}else{
				src=$('#'+public_ad[i]['did']).data('kmUrl');
			}
			if(!src){continue;}
			$d.frm({id:i},public_ad[i].did);
			$$(i).src=src;
			(function (){
				var _i=i;
				km_cmdlist['ad'].cmdA.push({func:function (){
					km_scr.frmloading(_i,_after);
				}});
			})();
		}

		km_cmdlist['ad'].cmdA.push({func:function (){
			km_ad.callback();
		}});

		setTimeout(function (){
			km_cmdlist['ad'].cmdI=0;
			km_cmdlist['ad'].doCmdA();
		},500);
	}
};



/*
#smallmap {width: 240px;height: 280px;overflow: hidden;margin:0;}
#l-map {width: 763px;height: 600px;overflow: hidden;margin:0;}
*/

var km_map={
	map:null

	,marker1:null
	,infoWindow1:null

	,marker:[]
	,infoWindow:[]
	,markernl:document.getElementsByName('marker')
	,__datalist__:[
	    {
	    "name": "上海市闸北区社区学院",
	    "address": "原平路55",
	    "location": "121.439436,31.287051"
	    },
	    {
	    "name": "上海市卢湾区社区学院",
	    "address": "金陵中路191",
	    "location": "121.482781,31.230605"
	    },
	    {
	    "name": "上海市卢湾区社区学院",
	    "address": "建国西路154号",
	    "location": "121.470221,31.213448"
	    },
	    {
	    "name": "上海市静安区社区学院",
	    "address": "静安区胶州路727号",
	    "location": "121.445607,31.241992"
	    }
	]

	,drawmap_singlepoint:function (){
		/*
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=1b8027242390d93b9b2111278acd9fe0"></script>
		*/
		if($$('map_value')){
			var s=$$('map_value').value;
		}else{
			var s='121.439436,31.287051';
		}
		if(s.indexOf(',')!=-1){s=s.split(',');}

		km_map.map = new BMap.Map("smallmap");
		km_map.map.centerAndZoom(new BMap.Point(s[0],s[1]), 14);
		km_map.map.enableScrollWheelZoom();
		km_map.map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
		km_map.marker1 = new BMap.Marker(new BMap.Point(s[0],s[1]));  // 创建标注
		km_map.map.addOverlay(km_map.marker1);              // 将标注添加到地图中

		//创建信息窗口
		var opts = {
			width : 200     // 信息窗口宽度
			,height: 90     // 信息窗口高度
			,title : "信息"  // 信息窗口标题
			,enableMessage:false
		}
		km_map.infoWindow1 = new BMap.InfoWindow("普通标注",opts);
		km_map.marker1.addEventListener("click", function(){this.openInfoWindow(km_map.infoWindow1);});

		//创建复杂信息窗口
		/*
		varsContent='<p>adfadf</p>';
		var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
		km_map.marker1.addEventListener("click", function(){
		   this.openInfoWindow(infoWindow);
		   //图片加载完毕重绘infowindow
		   document.getElementById('imgDemo').onload = function (){
		       infoWindow.redraw();
		   }
		});
		*/


		//创建百度信息窗口
		/*
		var content="";
		var searchInfoWindow = new BMapLib.SearchInfoWindow(km_map.map, content, {
			title  : "百度大厦",      //标题
			width  : 290,             //宽度
			height : 105,              //高度
			panel  : "panel",         //检索结果面板
			enableAutoPan : true,     //自动平移
			searchTypes   :[
				BMAPLIB_TAB_SEARCH,   //周边检索
				BMAPLIB_TAB_TO_HERE,  //到这里去
				BMAPLIB_TAB_FROM_HERE //从这里出发
			]
		});
	    //marker.enableDragging(); //marker可拖拽
	    marker.addEventListener("click", function(e){
		    searchInfoWindow.open(marker);
	    })
		*/

		//创建小狐狸
		/*
		var pt = new BMap.Point(116.417, 39.909);
		var myIcon = new BMap.Icon("fox.gif", new BMap.Size(300,157));
		var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
		km_map.map.addOverlay(marker2);              // 将标注添加到地图中

		//让小狐狸说话（创建信息窗口）
		var infoWindow2 = new BMap.InfoWindow("<p style='font-size:14px;'>哈哈，你看见我啦！我可不常出现哦！</p><p style='font-size:14px;'>赶快查看源代码，看看我是如何添加上来的！</p>");
		marker2.addEventListener("click", function(){this.openInfoWindow(infoWindow2);});
		*/

		/*
		setTimeout(function(){
		    km_map.map.setCenter("广州");   //设置地图中心点。center除了可以为坐标点以外，还支持城市名
		    km_map.map.setZoom(10);  //将视图切换到指定的缩放等级，中心点坐标不变    
		}, 1500);
		*/

		/*
		//异步加载
		function loadScript() {  
			var script = document.createElement("script");  
			script.src = "http://api.map.baidu.com/api?v=1.5&ak=您的密钥&callback=initialize";//此为v1.5版本的引用方式  
			// http://api.map.baidu.com/api?v=1.5&ak=您的密钥&callback=initialize"; //此为v1.4版本及以前版本的引用方式  
			document.body.appendChild(script);  
		}  
		   
		window.onload = loadScript;
		*/
	}
	,drawmap_multipoint:function (){
		/*
		head
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=1b8027242390d93b9b2111278acd9fe0"></script>
		*/
	    km_map.map = new BMap.Map("l-map");

	    var myIcon = new BMap.Icon("markers.png", new BMap.Size(23, 25), {
	        // 指定定位位置。   
	        // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
	        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
	        // 图标中央下端的尖角位置。    
	        offset: new BMap.Size(10, 25)
	        // 设置图片偏移。   
	        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
	        // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
	        //imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移    
	    });
	    var s=[];
	    var n=0;
	    if(typeof km_map.markernl[0]!='undefined'&&km_map.markernl[0].value!=''){
	        n=km_map.markernl.length;
	        s=km_map.markernl[0].value.split(',');
	    }else if(typeof km_map.__datalist__[0]!='undefined'&&km_map.__datalist__[0].location!=''){
	        n=km_map.__datalist__.length;
	        s=km_map.__datalist__[0].location.split(',');
	    }
	    if(s.length==2){
	        km_map.map.centerAndZoom(new BMap.Point(s[0],s[1]), 14);
	    }
	    km_map.map.enableScrollWheelZoom();
	    km_map.map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件

	    if(n>12){n=12;}
	    for(var i=0;i<n;i++){
	        var s,icontent;
	        if(typeof km_map.markernl[i]!='undefined'){
	            s=km_map.markernl[i].value.split(',');
	            icontent="";
	            icontent+="<div>";
	            icontent+="<div>"+km_map.markernl[i].parentNode.children[0].innerHTML+"</div>";
	            icontent+="<div>"+km_map.markernl[i].parentNode.children[1].innerHTML+"</div>";
	            icontent+="</div>";
	        }else if(typeof km_map.__datalist__[i]!='undefined'){
	            s=km_map.__datalist__[i].location.split(',');
	            icontent="";
	            icontent+="<div>";
	            icontent+="<div>"+km_map.__datalist__[i].name+"</div>";
	            icontent+="<div>"+km_map.__datalist__[i].address+"</div>";
	            icontent+="</div>";
	        }

	        //km_map.marker[i] = new BMap.Marker(new BMap.Point(s[0],s[1]), {icon: myIcon});  // 创建标注
	        km_map.marker[i] = new BMap.Marker(new BMap.Point(s[0],s[1]));  // 创建标注
	        km_map.map.addOverlay(km_map.marker[i]); // 将标注添加到地图中

	        //创建信息窗口
	        var opts = {
	            width : 200,   // 信息窗口宽度
	            height: 90,    // 信息窗口高度
	            title : "信息" // 信息窗口标题
	        }
	        //创建信息窗口
	        km_map.infoWindow[i] = new BMap.InfoWindow(icontent,opts);

	        continue;
	        
	        (function (){
	            var _i=i;

	            if(typeof km_map.markernl[_i]=='undefined'){
	                var r='';
	                r+='<div>';
	                r+='<a href="#" class="txt-u">'+km_map.__datalist__[i].name+'</a>';
	                r+='&nbsp;<span class="txt-t" onclick="doClickItem('+_i+')">定位</span>';
	                r+='</div>';
	                r+='<div>';
	                r+=km_map.__datalist__[i].address;
	                r+='</div>';
	                var d=document.createElement('div');
	                var t=document.createAttribute('class');
	                t.value='item-link';
	                d.attributes.setNamedItem(t);
	                d.innerHTML=r;
	                $$('d_result').appendChild(d);
	            }

	            km_map.marker[_i].addEventListener("mouseover", function(){
	                this.openInfoWindow(km_map.infoWindow[_i]);
	                //图片加载完毕重绘infowindow
	                //document.getElementById('imgDemo').onload = function (){
	                    //km_map.infoWindow[_i].redraw();
	                //}
	            });
	        })();
	    }

	}
}

function doClickItem(idx){
    if(typeof km_map.markernl[idx]!='undefined'){
        var s=km_map.markernl[idx].value.split(',');
    }else if(typeof km_map.__datalist__[idx]!='undefined'){
        var s=km_map.__datalist__[idx].location.split(',');
    }
    km_map.map.setCenter(new BMap.Point(s[0],s[1]));   //设置地图中心点。center除了可以为坐标点以外，还支持城市名
    km_map.map.setZoom(14);  //将视图切换到指定的缩放等级，中心点坐标不变    	
}

/*
km_lout.lout_dateattach();
//initCalObj(1,2010,null);
sdate_init(0,'int_dt_1','dt_1',1);
sdate_init(1,'int_dt_2','dt_2',1);
*/
function calObj(x_ks1,x_ks2,x_ks_disable,x_start,x_len){
	this.len=x_len;
	this.start=x_start;
	this.ks1=x_ks1;
	this.ks2=x_ks2;
	this.ks_disable=x_ks_disable;
	this.ko=null;
	this.ho=null;
	this.ho_s=null;
	this.nlstr="";
	this.show=function (){};
	this.nlinit=function (){};
	this.roinit=function (){};
	this.changeCal=function (){};
	this.writehead=function (k_d,k_o,k_y,k_m,k_b){
		var ks1=((k_m==1)&&(k_y==this.start))?this.ks_disable:this.ks1;
		var ks2=((k_m==12)&&(k_y==(this.start+this.len-1)))?this.ks_disable:this.ks2;
		var kc1={y:k_y,m:k_m-1};
		var kc2={y:k_y,m:k_m+1};
		if((k_m==1)&&(k_y==this.start)){kc1={y:0,m:0};}
		if((k_m==1)&&(k_y!=this.start)){kc1={y:k_y-1,m:12};}
		if((k_m==12)&&(k_y==(this.start+this.len-1))){kc2={y:0,m:0};}
		if((k_m==12)&&(k_y!=(this.start+this.len-1))){kc2={y:k_y+1,m:1};}
		this.ko={ks1:ks1,ks2:ks2,kc1:kc1,kc2:kc2};

		var k_b1=(k_b==1)?imgR($proto.basepath['common']+"images/icon_left.gif",20,17):"";
		var k_b2=(k_b==1)?imgR($proto.basepath['common']+"images/icon_right.gif",20,17):"";
		var r="";
		r+="<div class='"+this.ko.ks1+"' onclick=\""+k_o+".changeCal("+this.ko.kc1.y+","+this.ko.kc1.m+")\">"+k_b1+"</div>";
		r+="<div class='cal_head'>";
			r+="<select class='cal_select_y' onchange=\""+k_o+".changeCal(this.value,"+k_m+")\">";
			for(var j=this.start;j<=(this.start+this.len-1);j++){var t=(j==k_y)?" selected":"";r+="<option value='"+j+"'"+t+">"+j+"年</option>";}
			r+="</select>";
			r+="<select class='cal_select_m' onchange=\""+k_o+".changeCal("+k_y+",this.value)\">";
			for(var j=1;j<=12;j++){var t=(j==k_m)?" selected":"";r+="<option value='"+j+"'"+t+">"+j+"月</option>";}
			r+="</select>";
		r+="</div>";
		r+="<div class='"+this.ko.ks2+"' onclick=\""+k_o+".changeCal("+this.ko.kc2.y+","+this.ko.kc2.m+")\">"+k_b2+"</div>";
		r+="<div class='clear'></div>";
		$$(k_d,"h",r);
	};
	this.hoinit=function (x_cls1,x_cls2){
		var r1="",r2="";
		for(var b=0;b<7;b++){r1+="<div class='dc'>"+nls_date._days_narrow[b]+"</div>";}
		for(var a=0;a<6;a++){for(var b=0;b<7;b++){r2+="<div>["+(a*7+b+1)+"]</div>";}}
		this.ho={r1:r1,r2:r2,cls1:x_cls1,cls2:x_cls2,id1:null,id2:null};
	};
	this.writebody=function (x_did){
		var x_id1=(this.ho.id1!=null)?" id='"+this.ho.id1+"'":"";
		var x_id2=(this.ho.id2!=null)?" id='"+this.ho.id2+"'":"";
		var r="";
		r+="<div"+x_id1+" class='"+this.ho.cls1+"'>"+this.ho.r1+"</div>";
		r+="<div"+x_id2+" class='"+this.ho.cls2+"'>"+this.ho.r2+"</div>";
	  	$$(x_did,"h",r);
	};
}

var yyArray=[];
var calby="";
var calbyid="";
var currLayout=0;
var currDay="";
var currcalid="";
var currnwid="";
var sdata_clear_str='清除';

var sdate_obj=[];
var sdate_curr=-1;
var sdate_def="";
var calobj_a=[];
function initCalObj(sd_obj,x_start,x_len){
	var calO=new calObj("cal_arrow","cal_arrow","cal_arrow_disabled",x_start,x_len);
	calO.show=function (yy,mm){
		if(calO.len==null){calO.len=parseFloat($proto.systemTime[0])-calO.start+1;}
		if(yy==null){yy=parseFloat($proto.systemTime[0]);}else{yy=parseFloat(yy);}
		if(mm==null){mm=parseFloat($proto.systemTime[1]);}else{mm=parseFloat(mm);}

		calO.nlinit();
		calO.writehead("divcalendar_head","calobj_a["+sd_obj+"]",yy,mm,1);

		calO.hoinit("cal_ca01","cal_ca02");
		calO.roinit(yy,mm);
		calO.writebody("divcalendar_body");
	};
	calO.changeCal=function (y_yy,y_mm){
		if((y_yy==0)&&(y_mm==0)){return;}
		calO.show(y_yy,y_mm);	
	};
	calO.roinit=function (y_yy,y_mm){
		for(var cal_i=0;cal_i<calO.len;cal_i++){
			yyArray[cal_i]={ar2:[],ar1:[]};
			yyArray[cal_i].ar2=[31,28,31,30,31,30,31,31,30,31,30,31];
			yyArray[cal_i].ar2[1]=(Math.floor((calO.start+cal_i)/4)==(calO.start+cal_i)/4)?29:28;
			for(var cal_j=0;cal_j<12;cal_j++){
				var b=(new Date(calO.start+cal_i,cal_j,1)-new Date(1900,0,1))/(3600*1000*24);
				var a=b-Math.floor(b/7)*7+1;
				if(a==7){a=0;}
				yyArray[cal_i].ar1[cal_j]=a;
			}
		}
		var n=0;
		for(var cal_i=0;cal_i<42;cal_i++){
			var r3="";
			if((cal_i<yyArray[y_yy-calO.start].ar1[y_mm-1])||(n>=yyArray[y_yy-calO.start].ar2[y_mm-1])){
				r3="<div class='cal_dc'>&nbsp;</div>";
			}else{
				n++;
				r3="<div class='cal_dc' onclick=\"temp_doCal("+y_yy+","+y_mm+","+n+")\">"+n+"</div>";
			}
			calO.ho.r2=calO.ho.r2.replace("<div>["+(cal_i+1)+"]</div>",r3);
		}
	};
	calobj_a[sd_obj]=calO;
}
//initCalObj(0,2010,10);

function temp_doCal(yy,mm,n){
	var sd_n=sdate_curr;
	var dvalue=yy+"-"+nTos(mm)+"-"+nTos(n);
	if(typeof $proto!='undefined'){
		if(typeof $proto.dateshowtype!='undefined'){
			if($proto.dateshowtype=='yyyymmdd'){
				dvalue=dvalue.replace(/-/g,'');
			}
		}
	}
	$$("inputstatdate"+sd_n).value=dvalue;
	$$(sdate_obj[sd_n]).value=dvalue;
	statdateCancel(sd_n);
}
function statdateClick(sd_n,sd_obj){
	for(var s_i=0;s_i<sdate_obj.length;s_i++){
		if($$(sdate_obj[s_i])!=null){
    		if($$(sdate_obj[s_i]).value.indexOf("[")>-1){$$(sdate_obj[s_i]).value="";}
    		var s_d=$$(sdate_obj[s_i]).value;
        	if((s_d=="")||(s_d==sdate_def)){
        		$$("inputstatdate"+s_i).value=sdate_def;
        	}else{
        		$$("inputstatdate"+s_i).value=s_d;
        	}
        }
	}
	
	var c_sd=sdate_curr;
	if(c_sd!=-1){statdateCancel(c_sd);}
	sdate_curr=sd_n;
	var s="";
	s+="<div id='divcalendar_head'></div>";
	s+="<div id='divcalendar_body'></div>";

	km_kb._set($$("divstatdate"+sd_n));

	$$("divstatdate"+sd_n).innerHTML=s;
	calobj_a[sd_obj].show();
}
function statdateClear(sd_n){
	$$("inputstatdate"+sd_n).value=sdate_def;
	$$(sdate_obj[sd_n]).value=sdate_def;
}
function statdateCancel(sd_n){
	$$("inputstatdate"+sd_n,"c","int_text_normal");
	mb("divstatdate"+sd_n,0);
	$$("divstatdate"+sd_n).innerHTML="";
	sdate_curr=-1;
}
function sdate_init(sd_n,sd_d,sd_did,sd_obj,opts){
	if(!opts){opts={showclear:true};}
	if(sd_obj==null){sd_obj=0;}
	if(!$$(sd_did)){return;}
	sd_n=parseFloat(sd_n);
	sdate_curr=-1;
	
	if($$(sd_d).value.indexOf("[")>-1){$$(sd_d).value="";}
	var s_s=$$(sd_d).value;
	if(s_s==""){
		s_s=sdate_def;
	}
	
	sdate_obj[sd_n]=sd_d;
	var sd_s="";
	sd_s+="<div class='calendar-int'>";
		if(opts.showclear){
			sd_s+="<div class='calendar-input'>";
				sd_s+="<input id='inputstatdate"+sd_n+"' type='text' maxlength='10' value='"+s_s+"' class='int_text_normal' onclick=\"statdateClick("+sd_n+","+sd_obj+")\" readonly/>";
				sd_s+="<div id='btnstatdate"+sd_n+"_clear' class='clearbtn' onclick=\"statdateClear("+sd_n+")\">"+sdata_clear_str+"</div>";
			sd_s+="</div>";
		}else{
			sd_s+="<div class='calendar-input'>";
				sd_s+="<input id='inputstatdate"+sd_n+"' type='text' maxlength='10' value='"+s_s+"' class='int_text_normal' onclick=\"statdateClick("+sd_n+","+sd_obj+")\" readonly/>";
			sd_s+="</div>";			
		}
		sd_s+="<div id='divstatdate"+sd_n+"' class='div_cal' style='display:none;'></div>";
	sd_s+="</div>";
	
	if(sd_did==null){return sd_s;}
	$$(sd_did,"h",sd_s);
}
function stime_init(sd_n,sd_d,sd_did){
	var s_hh="00",s_mm="00";
	if($$(sd_d).value.indexOf("[")>-1){$$(sd_d).value="";}
	var s_s=$$(sd_d).value;
	if(s_s!=""){
		var s_a=s_s.split(":");
		s_hh=s_a[0];
		s_mm=s_a[1];
	}
	
	stime_obj[sd_n]=sd_d;
	var sd_s="";
	sd_s+="<div style='float:left;width:27px;'>";
	sd_s+="<input id='stime_hh_"+sd_n+"' type='text' size='2' value='"+s_hh+"' style='margin:0px 2px -1px 0px;' class='int_text_normal' onfocus=\"this.blur()\" readonly/>";
	sd_s+="</div>";
	sd_s+="<div style='float:left;width:21px;'>";
	sd_s+="<div class='dbtn_up' onmouseover=\"stime_setiv(1,"+sd_n+",'hh',1)\" onmouseout=\"stime_setiv(0,"+sd_n+",'hh',1)\"></div>";
	sd_s+="<div class='dbtn_down' onmouseover=\"stime_setiv(1,"+sd_n+",'hh',0)\" onmouseout=\"stime_setiv(0,"+sd_n+",'hh',0)\"></div>";
	sd_s+="</div>";
	sd_s+="<div style='float:left;width:21px;padding-top:2px;'>点</div>";
	sd_s+="<div style='float:left;width:27px;'>";
	sd_s+="<input id='stime_mm_"+sd_n+"' type='text' size='2' value='"+s_mm+"' style='margin:0px 2px -1px 0px;' class='int_text_normal' onfocus=\"this.blur()\" readonly/>";
	sd_s+="</div>";
	sd_s+="<div style='float:left;width:21px;'>";
	sd_s+="<div class='dbtn_up' onmouseover=\"stime_setiv(1,"+sd_n+",'mm',1)\" onmouseout=\"stime_setiv(0,"+sd_n+",'mm',1)\"></div>";
	sd_s+="<div class='dbtn_down' onmouseover=\"stime_setiv(1,"+sd_n+",'mm',0)\" onmouseout=\"stime_setiv(0,"+sd_n+",'mm',0)\"></div>";
	sd_s+="</div>";
	sd_s+="<div style='float:left;width:21px;padding-top:2px;'>分</div>";

	if(sd_did==null){return sd_s;}
	$$(sd_did,"h",sd_s);
}
function stime_setiv(x_iv,sd_n,sd_p,sd_u){
	if(stime_iv!=null){clearInterval(stime_iv);}
	if(x_iv==1){
		var x_sd_n=sd_n;
		var x_sd_p=sd_p;
		var x_sd_u=sd_u;
		stime_iv=window.setInterval(function (){stime_c(x_sd_n,x_sd_p,x_sd_u)},250);
		$$("stime_"+sd_p+"_"+sd_n,"c","int_text_normal_r");
	}else{
		$$("stime_"+sd_p+"_"+sd_n,"c","int_text_normal");
	}
}
function stime_c(sd_n,sd_p,sd_u){
	var s_o=$$("stime_"+sd_p+"_"+sd_n);
	
	if((sd_p=="hh")&&(s_o.value=="00")&&(sd_u==0)){s_o.value="23";}
	else if((sd_p=="mm")&&(s_o.value=="00")&&(sd_u==0)){s_o.value="59";}
	else if((sd_p=="hh")&&(s_o.value=="23")&&(sd_u==1)){s_o.value="00";}
	else if((sd_p=="mm")&&(s_o.value=="59")&&(sd_u==1)){s_o.value="00";}
	else {
		var s_p=(sd_u==0)?-1:1;
		$$(s_o,"v",nTos(sTon(s_o.value)+s_p));
	}
	
	var s_ho=$$("stime_hh_"+sd_n);
	var s_mo=$$("stime_mm_"+sd_n);
	$$(stime_obj[sd_n],"v",s_ho.value+":"+s_mo.value+":00");
}




///////



function imgR(r,w,h,f_t){
	if(f_t==null){f_t="";}else{f_t="float:"+f_t+";";}
	var s="<img src=\"[img]\" width=\"[w]\" height=\"[h]\" border='0' style=\""+f_t+"\" />";
	s=s.replace("[img]",r);
	s=s.replace("[w]",w);
	s=s.replace("[h]",h);
	return s;
}



function initCalObj_big(sd_obj,x_start,x_len,w,h,opts){
	if(!opts){
		opts={
			showhead:true
			,headheight:40
			,weekheight:30
		};
	}
	if(typeof $proto.systemTime!='array'&&typeof $proto.systemTime!='object'){
		var d=new Date($proto.systemTime);
		$proto.systemTime=[d.getFullYear(),nTos(d.getMonth()+1),nTos(d.getDate())];
	}

	var calO=new calObj_big("cal_arrow","cal_arrow","cal_arrow_disabled",w,h,x_start,x_len);
	calO.opts=opts;
	calO.resize=function (w,h){
		if(w){calO.cal_width=w;}
		if(h){calO.cal_height=h;}
		var w_cell=(calO.cal_width-8)/7;
		var h_cell=(calO.cal_height-calO.opts.weekheight-7)/6;
		$('.cal_dc').css({
			width:w_cell+'px'
			,height:h_cell+'px'
		});
		$('.dc').css({
			width:w_cell+'px'
		});
		$('.cal_ca01').css({
			width:calO.cal_width+'px'
		});
		$('.cal_ca02').css({
			width:calO.cal_width+'px'
			,height:(calO.cal_height-calO.opts.weekheight)+'px'
		});
	};
	calO.show=function (yy,mm){
		if(calO.len==null){calO.len=parseFloat($proto.systemTime[0])-calO.start+1;}
		var w_cell=(calO.cal_width-8)/7;
		var h_cell=(calO.cal_height-calO.opts.weekheight-7)/6;
		if(yy==null){yy=parseFloat($proto.systemTime[0]);}else{yy=parseFloat(yy);}
		if(mm==null){mm=parseFloat($proto.systemTime[1]);}else{mm=parseFloat(mm);}

		calO.nlinit();
		if(calO.opts.showhead){
			calO.writehead("divcalendar_head0","calobj_a["+sd_obj+"]",yy,mm,1);
		}

		calO.hoinit(w_cell,"cal_ca01","cal_ca02");
		calO.roinit(yy,mm,w_cell,h_cell);
		calO.writebody("divcalendar_body0");
		if(typeof calO.aftershow=='function'){calO.aftershow(yy,mm);}
	};
	calO.changeCal=function (y_yy,y_mm){
		if((y_yy==0)&&(y_mm==0)){return;}
		calO.show(y_yy,y_mm);	
	};
	calO.roinit=function (y_yy,y_mm,y_w,y_h){
		for(var cal_i=0;cal_i<calO.len;cal_i++){
			yyArray[cal_i]={ar2:[],ar1:[]};
			yyArray[cal_i].ar2=[31,28,31,30,31,30,31,31,30,31,30,31];
			yyArray[cal_i].ar2[1]=(Math.floor((calO.start+cal_i)/4)==(calO.start+cal_i)/4)?29:28;
			for(var cal_j=0;cal_j<12;cal_j++){
				var b=(new Date(calO.start+cal_i,cal_j,1)-new Date(1900,0,1))/(3600*1000*24);
				var a=b-Math.floor(b/7)*7+1;
				if(a==7){a=0;}
				yyArray[cal_i].ar1[cal_j]=a;
			}
		}
		var cls3=" style='width:"+parseInt(y_w,10)+"px;height:"+parseInt(y_h,10)+"px;'";
		var n=0,n1=0;
		for(var cal_i=0;cal_i<42;cal_i++){
			var cls=(cal_i-Math.floor(cal_i/7)*7>3)?'callayout-r':'callayout-l';
			var r3="";
			if(cal_i<yyArray[y_yy-calO.start].ar1[y_mm-1]){
				var n2=((y_mm-1)==0)?31:yyArray[y_yy-calO.start].ar2[y_mm-2];
				n2=n2-yyArray[y_yy-calO.start].ar1[y_mm-1]+cal_i+1;

				var _y_yy=((y_mm-1)==0)?(y_yy-1):y_yy;
				var _y_mm=((y_mm-1)==0)?12:(y_mm-1);
				var day=_y_yy+'-'+nTos(_y_mm)+'-'+nTos(n2);
				//console.log(day);
				r3="<div"+cls3+" id='cal_dc_"+day+"' data-day='"+day+"' class='cal_dc "+cls+"'><li class='dark'>"+n2+"</li></div>";
			
			}else if(n>=yyArray[y_yy-calO.start].ar2[y_mm-1]){
				n1++;

				var _y_yy=(y_mm==12)?(y_yy+1):y_yy;
				var _y_mm=(y_mm==12)?1:y_mm+1;
				var day=_y_yy+'-'+nTos(_y_mm)+'-'+nTos(n1);
				//console.log(day);
				r3="<div"+cls3+" id='cal_dc_"+day+"' data-day='"+day+"' class='cal_dc "+cls+"'><li class='dark'>"+n1+"</li></div>";
			
			}else{
				n++;

				var day=y_yy+'-'+nTos(y_mm)+'-'+nTos(n);
				//console.log(day);
				r3="<div"+cls3+" id='cal_dc_"+day+"' data-day='"+day+"' class='cal_dc "+cls+"' onclick=\"\"><li>"+n+"</li></div>";
			
			}
			calO.ho.r2=calO.ho.r2.replace("<div>["+(cal_i+1)+"]</div>",r3);
		}
	};
	calobj_a[sd_obj]=calO;
}
function calObj_big(x_ks1,x_ks2,x_ks_disable,x_cw,x_ch,x_start,x_len){
	this.opts=null;
	this.len=x_len;
	this.start=x_start;
	this.cal_width=x_cw;
	this.cal_height=x_ch;
	this.ks1=x_ks1;
	this.ks2=x_ks2;
	this.ks_disable=x_ks_disable;
	this.ko=null;
	this.ho=null;
	this.ho_s=null;
	this.nlstr="";
	this.aftershow=null;
	this.show=function (){};
	this.nlinit=function (){};
	this.roinit=function (){};
	this.changeCal=function (){};
	this.writehead=function (k_d,k_o,k_y,k_m,k_b){
		var ks1=((k_m==1)&&(k_y==this.start))?this.ks_disable:this.ks1;
		var ks2=((k_m==12)&&(k_y==(this.start+this.len-1)))?this.ks_disable:this.ks2;
		var kc1={y:k_y,m:k_m-1};
		var kc2={y:k_y,m:k_m+1};
		if((k_m==1)&&(k_y==this.start)){kc1={y:0,m:0};}
		if((k_m==1)&&(k_y!=this.start)){kc1={y:k_y-1,m:12};}
		if((k_m==12)&&(k_y==(this.start+this.len-1))){kc2={y:0,m:0};}
		if((k_m==12)&&(k_y!=(this.start+this.len-1))){kc2={y:k_y+1,m:1};}
		this.ko={ks1:ks1,ks2:ks2,kc1:kc1,kc2:kc2};

		var k_b1=(k_b==1)?"上一月":"";
		var k_b2=(k_b==1)?"下一月":"";
		var r="";
		r+="<div class='cal_head'>";
			r+="<select class='cal_select_y' onchange=\""+k_o+".changeCal(this.value,"+k_m+")\">";
			for(var j=this.start;j<=(this.start+this.len-1);j++){var t=(j==k_y)?" selected":"";r+="<option value='"+j+"'"+t+">"+j+"年</option>";}
			r+="</select> ";
			r+="<select class='cal_select_m' onchange=\""+k_o+".changeCal("+k_y+",this.value)\">";
			for(var j=1;j<=12;j++){var t=(j==k_m)?" selected":"";r+="<option value='"+j+"'"+t+">"+j+"月</option>";}
			r+="</select> ";
		r+="</div>";
		r+="<div class='"+this.ko.ks1+"' onclick=\""+k_o+".changeCal("+this.ko.kc1.y+","+this.ko.kc1.m+")\">"+k_b1+"</div>";
		r+="<div class='"+this.ko.ks2+"' onclick=\""+k_o+".changeCal("+this.ko.kc2.y+","+this.ko.kc2.m+")\">"+k_b2+"</div>";
		r+="<div id='cal_headbar'></div>";
		r+="<div class='clear'></div>";
		
		if($$(k_d)){$$(k_d).parentNode.removeChild($$(k_d));}
		var x_n=$d.cc('','div',[['id',k_d],['class','']]);
		$$(x_n,"h",r);
		$$('t_calendar').appendChild(x_n);
	};
	this.hoinit=function (x_cell,x_cls1,x_cls2){
		var r1="",r2="";
		for(var b=0;b<7;b++){r1+="<div style='width:"+parseInt(x_cell,10)+"px;' class='dc'>"+nls_date._days_narrow[b]+"</div>";}
		for(var a=0;a<6;a++){for(var b=0;b<7;b++){r2+="<div>["+(a*7+b+1)+"]</div>";}}
		this.ho={r1:r1,r2:r2,cls1:x_cls1,cls2:x_cls2,id1:null,id2:null};
	};
	this.writebody=function (x_did){
		var x_id1=(this.ho.id1!=null)?" id='"+this.ho.id1+"'":"";
		var x_id2=(this.ho.id2!=null)?" id='"+this.ho.id2+"'":"";
		var r="";
		r+="<div"+x_id1+" class='"+this.ho.cls1+"' style='width:"+this.cal_width+"px;'>"+this.ho.r1+"</div>";
		r+="<div"+x_id2+" class='"+this.ho.cls2+"' style='width:"+this.cal_width+"px;height:"+(this.cal_height-this.opts.weekheight)+"px;'>"+this.ho.r2+"</div>";
		
		if($$(x_did)){$$(x_did).parentNode.removeChild($$(x_did));}
		var x_n=$d.cc('','div',[['id',x_did],['class','']]);
		$$(x_n,"h",r);
		$$('t_calendar').appendChild(x_n);

		var n=0;
		$('#t_calendar .cal_dc').each(function (i){
			$(this).css('z-index',62-i);
		});
	};
}



function km_freetile(){
	var self=this;
	this.container='freetile_work';
	this.loadbtn='freetile_work_btn';
	this.loadbtntext='';
	this.loadflag=false;
	this.animate=false;
	this.url='';
	this.afterload=null;
	this.afterrender=null;
	this.init=function (){
		$('#'+this.loadbtn).unbind().bind('click',function (){self.load();});
	};
	this.render=function (){
		if(this.animate){
			$('#'+self.container+' .item').hover(
				function (){
					$(this).find('.title').fadeIn();
				}
				,function (){
					$(this).find('.title').fadeOut();
				}
			);
			$('#'+self.container+' .item .title').each(function (i){
				$(this).css('height','30px');
				$(this).fadeOut();
			});
		}
		var opt={
			selector: '.item'
		};
		if(self.afterrender!=null){
			opt.callback=function (){self.afterrender();};
			opt.persistentCallback=true;
		}
		$('#'+self.container).freetile(opt);
	};
	this.load=function (){
		var url=$('#'+self.container).data('kmUrl');
		if(self.url=='' && url){
			self.url=url;
		}
		if(!self.url){return;}
		$('#'+self.loadbtn).unbind();
		$('#'+self.loadbtn).attr('class','btn-loadmore disabled');
		$('#'+self.loadbtn).html('正在加载...');
		var posting=$.ajax({
			type: "GET"
			,url: self.url
			,cache: false
		});
		posting.done(function(data) {
			data=JSON.parse(data);
			$('#'+self.loadbtn).html(self.loadbtntext);
			if(self.afterload!=null){
				self.afterload(data);
				return;
			}
			for(var i=0;i<data.rows.length;i++){
				/*
				data.rows[i]={
					url:''
					,photo:''
					,w:''
					,h:''
					,title:''
				};
				*/
				var s="";
				s+='<a href="'+data.rows[i].url+'" class="item" style="background-image:url('+data.rows[i].photo+');width:'+data.rows[i].w+'px;height:'+data.rows[i].h+'px;">';
					s+='<span class="title trim">'+data.rows[i].title+'</span>';
				s+='</a>';
				$('#'+self.container).append(s);
			}
			self.render();
			$$(self.loadbtn).onclick=function (){self.load();};
			workfreetile.loadflag=false;
			$('#'+self.loadbtn).attr('class','btn-loadmore');
		});
		posting.fail(function(data) {
			console.log(data);
		});
		posting.always(function() {

		});
	};
}




/*
km_fselect.ds={
	'select_type':{label:'栏目',clk:function (x){change();}}
	,'select_xs':{label:'教研形式',clk:function (x){}}
	,'select_zt':{label:'活动状态'}
	,'select_xd':{label:'学段',ref:'select_xk',clk:function (x){
		var selected = false;
	    for (m = select_xdTemp.options.length - 1; m >= 0; m--) {
	        select_xdTemp.options[m] = null;
	    }
	    for (i = 0; i < select_xdGroup[x].length; i++) {
	        select_xdTemp.options[i] = new Option(select_xdGroup[x][i].text, select_xdGroup[x][i].value);
	    }
	    if ((select_xdTemp.options.length > 0) && (! selected)) {
	       	select_xdTemp.options[0].selected = true;
	    }
	    km_fselect.draw('select_xk');
	}}
	,'select_xk':{label:'学科'}
	,'select_lx':{label:'资源类型'}
	,'select_gs':{label:'资源格式'}
	,'select_js':{label:'角色'}
	,'select_lm':{label:'新闻栏目'}
	,'select_sh':{label:'审核状态'}
	,'select_bq':{label:'标签'}
}
*/

var km_fselect={
	ds:null
	,style:{
		'cff':'cff'
		,'cfp':'cfp'
		,'cfp_s':'cfp_s'
		,'cflabel':'cflabel'
	}
	,init:function (option,did){
		if(!this.ds){return;}
		if(option){
			for(var i in option){
				km_fselect[i]=jQuery.extend(true,{},option[i]);
			}
		}
		if(did){
			this.draw(did);
		}else{
			for(var j in this.ds){
				this.draw(j);
			}
		}
	}
	,draw:function (did){
		if(!$$(did)){return;}
		var style=(typeof this.ds[did]['style']=='undefined')?this.style:this.ds[did]['style'];
		var ismulti=(typeof this.ds[did]['ismulti']=='undefined')?false:this.ds[did]['ismulti'];
		var ref=(typeof this.ds[did].ref=='undefined')?'':this.ds[did].ref;
		var nl=$$(did).children;
		var t='';
		if(this.ds[did]['label']){
			t+='<div class="'+style.cflabel+'">'+this.ds[did].label+'</div>';
		}
		for(var i=0;i<nl.length;i++){
			if(nl[i].text=='-'){
				continue;
			}
			var cls=(nl[i].selected)?style.cfp_s:style.cfp;
			t+='<div data-txt="'+nl[i].text+'" class="'+cls+'" onclick="km_fselect.clk(\''+did+'\',\''+nl[i].value+'\',\''+nl[i].text+'\',\''+ref+'\');">';
			if(typeof this.ds[did]['gettext']=='function'){
				t+=this.ds[did]['gettext'](nl[i].text);
			}else{
				t+=nl[i].text;
			}
			t+='</div>';
			if(ismulti){
				if(i!=0){
					if(nl[i].selected){
						t+='<div class="rm" onclick="km_fselect.rm(\''+did+'\',\''+nl[i].text+'\')" style="display:inline-block;*display:inline;zoom:1;">&#215;</div>';
					}else{
						t+='<div class="rm" onclick="km_fselect.rm(\''+did+'\',\''+nl[i].text+'\')" style="display:none;">&#215;</div>';
					}
				}
			}
		}
		t+='<div class="clear"></div>';

		if(!$$('d_'+did)){
			var x_i=document.createElement('DIV');
			var x_t=document.createAttribute('id');
			x_t.value='d_'+did;
			x_i.attributes.setNamedItem(x_t);
			var x_t=document.createAttribute('class');
			x_t.value=style.cff;
			x_i.attributes.setNamedItem(x_t);
			x_i.innerHTML=t;
			var x_o=$$(did).parentNode.appendChild(x_i);
		}else{
			$$('d_'+did).innerHTML=t;
		}

	}
	,rm:function (did,txt){
		var nl=$$(did).children;
		for(var i=0;i<nl.length;i++){
			if(nl[i].text==txt){
				nl[i].selected=false;
			}
		}
		km_fselect.draw(did);
		if(typeof this.ds[did].clk=='function'){
			this.ds[did].clk();
		}
	}
	,clk:function (did,val,txt,ref){
		var style=(typeof this.ds[did]['style']=='undefined')?this.style:this.ds[did]['style'];
		var ismulti=(typeof this.ds[did]['ismulti']=='undefined')?false:this.ds[did]['ismulti'];

		var nl=$$(did).children;
		var _i=-1;
		if(ismulti){
			for(var i=0;i<nl.length;i++){
				if(nl[i].value==val){
					nl[i].selected=true;
					_i=i;
				}
			}
			if(_i==0){
				for(var i=1;i<nl.length;i++){
					nl[i].selected=false;
				}
			}else{
				nl[0].selected=false;
			}
		}else{
			for(var i=0;i<nl.length;i++){
				if(nl[i].value==val){
					nl[i].selected=true;
					_i=i;
				}else{
					nl[i].selected=false;
				}
			}
		}
		var nl=$$('d_'+did).children;
		if(ismulti){
			for(var i=0;i<nl.length;i++){
				if(nl[i].className==style.cflabel||nl[i].className.indexOf('clear')!=-1||nl[i].className.indexOf('rm')!=-1){continue;}
				if($(nl[i]).data('txt')==txt){
					nl[i].className=style.cfp_s;
					if(PF_ie6||PF_ie7){
						$(nl[i]).next().eq(0).css('display','inline');
					}else{
						$(nl[i]).next().eq(0).css('display','inline-block');
					}
				}
			}
			if(_i==0){
				for(var i=1;i<nl.length;i++){
					if(nl[i].className==style.cflabel||nl[i].className.indexOf('clear')!=-1||nl[i].className.indexOf('rm')!=-1){continue;}
					nl[i].className=style.cfp;
					$(nl[i]).next().eq(0).css('display','none');
				}
			}else{
				nl[0].className=style.cfp;
			}
		}else{
			for(var i=0;i<nl.length;i++){
				if(nl[i].className==style.cflabel||nl[i].className.indexOf('clear')!=-1||nl[i].className.indexOf('rm')!=-1){continue;}
				if($(nl[i]).data('txt')==txt){
					nl[i].className=style.cfp_s;
				}else{
					nl[i].className=style.cfp;
				}
			}	
		}
		if(typeof this.ds[did].clk=='function'){
			this.ds[did].clk(_i,val);
		}
	}
};


var weatherAPI={
	url:''
	,callback:function (){}
	,get:function (loc,callback){
		if(!loc){loc='上海';}
		if(typeof callback=='function'){
			weatherAPI.callback=callback;
		}
		if(!__isLocalStorageNameSupported){
			$('.d-top-weather').css('width','0px');
			weatherAPI.callback();
			return;
		}
		var weather='';
		if(__isLocalStorageNameSupported){
			weather=store.get('weather');
		}
		var flag=true;
		if(typeof weather=='unedfined'||weather==''||weather==null||typeof weather['results']=='undefined'){
			flag=false;
		}
		if(flag){
			if(weather.date!=$proto.systemTime.join('-')){flag=false;}
		}
		if(flag){
			weatherAPI.show(weather);
			weatherAPI.callback();
			return;
		}
		var _url=weatherAPI.url.replace('[loc]',encodeURIComponent(loc));
		/*
		$.getJSON(_url,null,function (weather){
			if(__isLocalStorageNameSupported){
				store.set('weather',weather);
			}
			weatherAPI.show(weather);
			weatherAPI.callback();
		});
		//*/
		var posting=$.ajax({
			type: "GET"
			,url: _url
			,cache: false
		});
		posting.done(function(data) {
			try{
				var weather=JSON.parse(data);
				if(__isLocalStorageNameSupported){
					store.set('weather',weather);
				}
				weatherAPI.show(weather);
			}catch(ew){
				$('.d-top-weather').css('width','0px');
			}
		});
		posting.fail(function(data) {
			console.log(data);
		});
		posting.always(function() {
			weatherAPI.callback();
		});
	}
	,show:function (weather){
		if(typeof weather['results']=='undefined'){
			console.log('===result undefined.');
			return;
		}
		var w=weather.results[0].weather_data;
		if($$('d_weather')){
			$('#d_weather').on('mouseover',function (){
				$('#d_weather').css('z-index',4);
			});
			$('#d_weather').on('mouseout',function (){
				$('#d_weather').css('z-index',2);
			});
			$d.removeTextN($$('d_weather'));
			var nd=$$('d_weather').lastChild;
			var n=new Date($proto.systemTime[0],$proto.systemTime[1]-1,$proto.systemTime[2]).getDay();
			for(var i=0;i<3;i++){
				var ed=$d.cc('','div',[['class','days']]);
				var s="";
				var m=n+i;
				if(m>=7){m=m-7;}
				s+="<div class='date'>"+sub_getWeek(m)+"</div>";
				s+="<div class='pic'><img src='"+w[i].dayPictureUrl+"' border='0'/></div>";
				s+="<div class='weather'>"+w[i].weather+"</div>";
				s+="<div class='temperature'>"+w[i].temperature+"</div>";
				ed.innerHTML=s;
				$$('d_weather').insertBefore(ed,nd);
			}
			var t=w[0].temperature.replace(' ~ ','<br/>~</br/>');
			t=t.replace('\u2103','<br/>\u2103');
			var s="";
			s+=weather.results[0].currentCity+"<br/>"+t;
			nd.innerHTML=s;
		}
		if($$('span_weather')){
			var s="";
			s+=weather.results[0].currentCity+" "+w[0].temperature;
			$$("span_weather","h",s);
		}
	}
}


/*
var ybox1=new km_ybox('d_yc','ybox1');
ybox1.uploadconfig=[{...},{...}];
ybox1['views']['defaultview']={adapter:{},tran:''};
*/
var km_ybox=function (d,type){
	var self=this;
	this.type=(!type)?'flproto':type;
	this.d=d;
	this.uploadconfig=[];
	this.fieldconfig={};
	this.rows=null;
	this.currid='';
	this.init=function (){
		self.rows=[];
		var len=0;
		for(var i in self.fieldconfig){
			var nl=domGN(i);
			len=nl.length;
			break;
		}
		if(len>0){
			for(var i=0;i<len;i++){
				self.rows.push({});
			}
			for(var i=len-1;i>=0;i--){
				for(var j in self.fieldconfig){
					self.rows[i][j]=domGN(j)[i].value;
					domGN(j)[i].parentNode.removeChild(domGN(j)[i]);
				}
			}
		}
		self.actions.show();
	};
	this.views={};
	this.actions={
		show:function (view, para){
			if(!view){view='defaultview';}
			var vo=self.views[view];
			var jo={rows:self.rows};
			var so=null;
			var restr=km_template.showaggregate(vo,jo,so);
			if($$(self.d+'_c')){
				$$(self.d+'_c').parentNode.removeChild($$(self.d+'_c'));
				$$(self.d,'h','');
			}
			var eo=$d.cc(null,'div',[['id',self.d+'_c']]);
			eo.innerHTML=restr;
			eo=$$(self.d).appendChild(eo);

			for(var i=0;i<jo.rows.length;i++){
				for(var j in jo.rows[i]){
					var input=$d.cc(eo,'input',[['name',j],['type','hidden']]);
					input.value=jo.rows[i][j];
				}
			}
		}
		,add:function (){
			self.currid='';
			if(self.type=='bootstrap'){
				// for bootstrap
				$('#modal_'+self.modal_add.p).modal({backdrop:'static'});
				$('#modal_'+self.modal_add.p+' iframe:first-child').attr('src',self.modal_add.src);
				if(typeof window['yboxadd_timer']!='undefined'&&window['yboxadd_timer']!=null){
					window.clearInterval(window['yboxadd_timer']);
				}
				window['yboxadd_timer']=window.setInterval(function (){
					if(!$$(self.modal_add.frm)){return;}
					var _d=$d.getDoc($$(self.modal_add.frm));
					var _s1='',_s2='';
					try{
						_s1=str_trimSpace(_d.body.innerHTML);
						_s2=_d.body.outerHTML;
					}catch(e){}
					if(_s1!=''&&_s2.toLowerCase().indexOf('<\/body>')!=-1){
						window.clearInterval(window['yboxadd_timer']);
						self.actions.afteraddopen();
					}
				},500);
			}else{
				if(typeof $proto.pagelets=='undefined'){$proto.pagelets={};}
				if(typeof self.modal_add['p']=='undefined'||self.modal_add.p==''){
					self.modal_add.p='auto'+sd();
				}
				$proto.pagelets[self.modal_add.p]=self.modal_add;
				km_scr.modal(self.modal_add.p,'',null,self.actions.afteraddopen);
			}
		}
		,modify:function (id){
			self.currid=id;
			if(self.type=='bootstrap'){
				// for bootstrap
				$('#modal_'+self.modal_modify.p).modal({backdrop:'static'});
				$('#modal_'+self.modal_modify.p+' iframe:first-child').attr('src',self.modal_modify.src);
				if(typeof window['yboxmodify_timer']!='undefined'&&window['yboxmodify_timer']!=null){
					window.clearInterval(window['yboxmodify_timer']);
				}
				window['yboxmodify_timer']=window.setInterval(function (){
					var _d=$d.getDoc($$(self.modal_modify.frm));
					if(str_trimSpace(_d.body.innerHTML)!=''&&_d.body.outerHTML.toLowerCase().indexOf('<\/body>')!=-1){
						window.clearInterval(window['yboxmodify_timer']);
						self.actions.aftermodifyopen();
					}
				},500);
			}else{
				if(typeof $proto.pagelets=='undefined'){$proto.pagelets={};}
				if(typeof self.modal_modify['p']=='undefined'||self.modal_modify.p==''){
					self.modal_modify.p='auto'+sd();
				}
				$proto.pagelets[self.modal_modify.p]=self.modal_modify;
				km_scr.modal(self.modal_modify.p,'',null,self.actions.aftermodifyopen);
			}
		}
		,del:function (id){
			var jo=[];
			for(var i=0;i<self.rows.length;i++){
				if(i!=id){jo.push(self.rows[i]);}
			}
			self.rows=jo;
			self.actions.show();
		}
		,dosubmit:function (n,p){
			var po={};
			for(var i in self.fieldconfig){
				var check=true;
				if(typeof self.fieldconfig[i]['check']=='function'){
					check=self.fieldconfig[i]['check'](self.win.domGN(i)[0]);
				}
				if(!check){return;}
				var v=self.win.domGN(i)[0].value;
				po[i]=v;
			}
			self.rows[n]=po;
			self.actions.show();
			if(self.type=='bootstrap'){
				$proto.top.$('#modal_'+p).modal('hide');
				$proto.top.$('#modal_'+p+' iframe:first-child').attr('src',$proto.basepath['html']+'blank.html');
			}else{
				$proto.top.km_scr.close();
			}
		}
		,docancel:function (p){
			if(self.type=='bootstrap'){
				$proto.top.$('#modal_'+p).modal('hide');
				$proto.top.$('#modal_'+p+' iframe:first-child').attr('src',$proto.basepath['html']+'blank.html');
			}else{
				$proto.top.km_scr.close();
			}
		}
		,afteraddopen:function (){
			var did=self.modal_add.frm;
			self.win=$proto.top.$d.getWin($proto.top.$$(did));
			self.win.$('#btnSubmit').click(function (){
				self.actions.dosubmit(self.rows.length,self.modal_add.p);
			});
			self.win.$('#btnClose').click(function (){
				self.actions.docancel(self.modal_add.p);
			});
			self.actions.pageinit();
			if(typeof self.afteraddload=='function'){
				self.afteraddload();
			}
		}
		,aftermodifyopen:function (){
			var did=self.modal_modify.frm;
			self.win=$proto.top.$d.getWin($proto.top.$$(did));
			for(var i in self.fieldconfig){
				self.win.domGN(i)[0].value=self.rows[self.currid][i];
			}
			self.win.$('#btnSubmit').click(function (){
				self.actions.dosubmit(self.currid,self.modal_modify.p);
			});
			self.win.$('#btnClose').click(function (){
				self.actions.docancel(self.modal_modify.p);
			});
			self.actions.pageinit();
			if(typeof self.aftermodifyload=='function'){
				self.aftermodifyload();
			}
		}
		,pageinit:function (){
			if(typeof self['uploadconfig']=='undefined'){return;}
			for(var i=0;i<self.uploadconfig.length;i++){
				self.uploadconfig[i]['custom_settings']['files']=[];

				if(typeof self.uploadconfig[i]['custom_settings']['field']!='undefined'&&self.currid!==''){
					var _a=self.rows[self.currid][self.uploadconfig[i]['custom_settings']['field']];
					_a=_a.split(',');
					console.log('_a:'+_a);
					for(var j=0;j<_a.length;j++){
						var id=sd();
						console.log('files '+[j]+':'+id);
						self.uploadconfig[i]['custom_settings']['files'].push({
							id:id
							,index:50
							,name:''
							,size:0
							,type:''
							,creationdate:''
							,modificationdate:''
							,filestatus:'COMPLETE'
							,serverdata:_a[j]
						});
					}
				}

				self.win.km_upload.init(self.uploadconfig[i]);
			}
		}
		,onfilechange:function (idx){
			var v='';
			var n=0;
			if(typeof self.win.domGN('hidFileID_'+idx)[0]!='undefined'){
				var a=[];
				for(var i=0;i<self.win.domGN('hidFileID_'+idx).length;i++){
					a.push(self.win.domGN('hidFileID_'+idx)[i].value);
					n++;
				}
				v=a.join(',');
			}
			var fieldname=self.win.km_upload.uList[idx]['customSettings']['field'];
			self.win.domGN(fieldname)[0].value=v;
		}
	}
}


function km_cpcontainer(){
	var self=this;
	this.containerid='cp_container';
	this.frmid='frm_cp_container';
	this.loadcallback=function (){};
	this.loadCw=function (url,callback){
		if(typeof callback=='function'){this.loadcallback=callback;}
		if($$(self.frmid)){
			$$(self.frmid).parentNode.removeChild($$(self.frmid));
		}
		$$(self.containerid,'h','');
		var d=$d.cc(self.containerid,'div',[['id','div_'+self.containerid]]);
		$('#div_'+self.containerid).css({
			'background-color':'#000'
			,'position':'relative'
			,'font-size':'0'
			,'padding':'0'
			,'line-height':'0'
			/*
			,'position':'absolute'
			,'left':'0px'
			,'top':'0px'
			,'right':'0px'
			,'bottom':'0px'
			*/
		});
		$d.frm({id:self.frmid},'div_'+self.containerid);
		$$(self.frmid).src=url;
		km_scr.frmloading(self.frmid,function (){
			self.loadcallback();
		});
	};
	this.layout=function (option){
		$('#div_'+self.containerid).css(option);
	};
	this.fullscreen=function (n){
		if(n==1){
			$('#div_'+self.containerid).css({
				'position':'fixed'
				,'left':'0px'
				,'top':'0px'
				,'right':'0px'
				,'bottom':'0px'
			});
		}else if(n==0){
			$('#div_'+self.containerid).css({
				'position':'absolute'
				,'left':'0px'
				,'top':'0px'
				,'right':'0px'
				,'bottom':'0px'
			});
		}
	};
}

/**
 * 使用方法:
 * 
 * 		<link href="{{host}}/common/v1/css/guide.css?ver={{version}}" rel="stylesheet" media="screen"/>
 * 		<script src="{{host}}/vendor/flproto0_1_0/plugin/km_guide.js?ver={{version}}"></script>
 * 		<script>km_guide.show('guide1','showguide','','white');</script>
 * 
 */

var km_guide={
	siteid:''
	,curr:''
	,guidestore:''
	,baseurl:'/html/'
	,guide:null
	,guideconfig:null
	,theme:'grey'
	,ui:{
		grey:{mask:"mpapergrey.html"}
		,white:{mask:"mpaper.html"}
	}
	,init:function (siteid,guideconfig,baseurl,theme){
		km_guide.siteid=siteid;
		if(baseurl){km_guide.baseurl=baseurl;}
		if(theme){km_guide.theme=theme;}
		if(guideconfig){
			km_guide.guideconfig=guideconfig;
		}
	}
	/* 高级接口 */
	,start:function (id){
		km_guide.guide=store.get('km_guide_'+km_guide.siteid);

		if(typeof km_guide.guide=='undefined'||km_guide.guide==''){
			km_guide.guide={};
		}
		if(typeof km_guide.guide['list']=='undefined'){
			km_guide.guide.list={};
		}
		if(typeof km_guide.guide['list'][id]=='undefined'){
			km_guide.guide['list'][id]={hasshow:false};
		}		
		if(!km_guide.guide['list'][id].hasshow){
			km_guide.curr=id;
			if(!$$('flmpaper_grey')){
				var s="";
				s+="<div id='flmpaper_grey'>";
					s+="<div class='mpaper'>";
						s+="<iframe style='display:block;' frameborder='0' width='100%' height='100%' scrolling='no' src='"+km_guide.baseurl+km_guide.ui[km_guide.theme].mask+"' allowTransparency='true'></iframe>";
					s+="</div>";
				s+="</div>";
				$('body').append(s);
			}
			window.mb("flmpaper_grey",1);
			var s='';
			s+='<div id="d_guide_'+id+'" class="d-guide-'+km_guide.curr+'">';
				s+='<div class="close" onclick="km_guide.end(\''+id+'\')"></div>';
			s+='</div>';
			$(document.body).append(s);
		}
	}
	,end:function (id){
		window.mb("flmpaper_grey",0);
		$('#d_guide_'+km_guide.curr).remove();
		km_guide.guide['list'][id].hasshow=true;
		store.set('km_guide_'+km_guide.siteid,km_guide.guide);
	}

	/* 简易接口 */
	,show:function (id,guidestore,baseurl,theme){
		if(guidestore){km_guide.guidestore=guidestore;}
		if(baseurl){km_guide.baseurl=baseurl;}
		if(theme){km_guide.theme=theme;}
		km_guide.guide=store.get(km_guide.guidestore);

		if(typeof km_guide.guide=='undefined'||km_guide.guide==''){
			km_guide.guide={};
			km_guide.guide[id]=false;
		}

		if(!km_guide.guide[id]){
			km_guide.curr=id;
			if(!$$('flmpaper_grey')){
				var s="";
				s+="<div id='flmpaper_grey'>";
					s+="<div class='mpaper'>";
						s+="<iframe style='display:block;' frameborder='0' width='100%' height='100%' scrolling='no' src='"+km_guide.baseurl+km_guide.ui[km_guide.theme].mask+"' allowTransparency='true'></iframe>";
					s+="</div>";
				s+="</div>";
				$('body').append(s);
			}
			window.mb("flmpaper_grey",1);
			$(document.body).append('<div id="d_guide_'+id+'" class="d-guide-'+km_guide.curr+'"><div class="close" onclick="km_guide.close(\''+id+'\')"></div></div>');
		}
	}
	,close:function (id){
		window.mb("flmpaper_grey",0);
		$('#d_guide_'+km_guide.curr).remove();
		km_guide.guide[id]=true;
		store.set(km_guide.guidestore,km_guide.guide);
	}

};

/*
//html
<div id="abc" class="star-comment">
    <span class="star" data-km-star='0'></span>
    <span class="comment"></span>
    <input type="hidden" name="Level" value="">
</div>

//js
<script>
km_star_comment.init(['&nbsp;','很差','较差','还行','推荐','力荐']);
km_star_comment.afterclick=function (id){
	//这里的代码在用户点击了星星后执行,下面的 v 就是当前用户点击的星星的值(0 0.5 1 1.5 2 2.5 3 3.5 4 4.5 5中的一个数值)
	var v=$('#'+id+' input[type="hidden"]').val();
	alert(id + '\n' + v);
	//...
};
</script>

// 当用户点击星星后通过ajax提交了数据并返回新的数值后，调用
km_star_comment.setdata(id,val); //其中id在本例中是 "abc"，val是新的数值(0 5 10 15 20 25 30 35 40 45 50中的一个数值)


*/

var km_star_comment={
	txt:['','','','','','']
	,afterclick:null
	,setdata:function (id,val){
		$('#'+id).find('.star').data('kmStar',val);
		km_star_comment.init();
	}
	,init:function (txt){
		if(typeof txt!='undefined' && txt!=null){
			km_star_comment.txt=txt;
			console.log(km_star_comment.txt);
		}
		$('.star-comment').each(function (i){
			var n=$(this).find('.star').data('kmStar');
			$(this).find('.star').attr('class','star star'+n);
			$(this).find('.star').data('kmCurrStar',n);
			$(this).find('.comment').html('&nbsp;');
			$(this).find('.star').unbind('mousemove').bind('mousemove',function (){
				km_star_comment.over(this);
			});
			$(this).find('.star').unbind('mouseout').bind('mouseout',function (){
				km_star_comment.out(this);
			});
			$(this).find('.star').unbind('click').bind('click',function (){
				km_star_comment.click(this);
			});
		});
	}
	,over:function (eo){
		var x=$d.evt().clientX-$(eo).offset().left;
		var n=0;
		if(x<17){n=10;}
		else if(x<34){n=20;}
		else if(x<51){n=30;}
		else if(x<68){n=40;}
		else if(x<85){n=50;}
		$(eo).attr('class','star star'+n);
		var j=parseFloat(n)/10;
		$(eo).parent().find('.comment').html(km_star_comment.txt[j]);
		$(eo).data('kmCurrStar',n);
	}
	,out:function (eo){
		var n=$(eo).data('kmStar');
		var j=parseFloat(n)/10;
		$(eo).attr('class','star star'+n);
		$(eo).parent().find('.comment').html(km_star_comment.txt[j]);
	}
	,click:function (eo){

		$(eo).data('kmStar',$(eo).data('kmCurrStar'));
		var n=$(eo).data('kmStar');
		var j=parseFloat(n)/10;
		
		var jo=$(eo).parent().find('input[type="hidden"]');
		jo.val(j);

		if(typeof km_star_comment.afterclick=='function'){
			km_star_comment.afterclick($(eo).parent().attr('id'));
		}

	}
}

var km_photoview={
	currindex:-1
	,maxw:897
	,maxh:3007
	,imgw:0
	,imgh:0
	,len:8
	,did:''
	,so:null
	,url:''
	,init:function (did,len){
		km_photoview.did=did;
		km_photoview.len=len;
	}
	,showphoto:function (eo){
		km_photoview.url=$(eo).data('kmUrl');
		if($$(km_photoview.did+'_photo_view')){
			$('#'+km_photoview.did+'_photo_view').css('overflow','hidden');
			$('#'+km_photoview.did+'_photo_view img').remove();
			$('#'+km_photoview.did+'_photo_view').remove();
		}
		if(km_photoview.currindex>-1){
			$('#'+km_photoview.did+' .item').eq(km_photoview.currindex).removeClass('select');
		}
		km_photoview.currindex=$(eo).index()-1;
		$(eo).attr('class','item select');
		km_photoview.beforeloadimg();
	}
	,beforeloadimg:function (){
		var m=$('#'+km_photoview.did+' .item').size();
		var n=km_photoview.currindex;
		var len=km_photoview.len;
		var o=Math.floor(n/len)*len+len;

		var s='';
		s+='<div id="'+km_photoview.did+'_photo_view" class="expend">';
			s+='<div style="text-align:center;font-size:13px;height:50px;line-height:50px;">正在加载...</div>';
		s+='</div>';

		if(o>=m){
			$('#'+km_photoview.did+' .clear').before(s);
		}else{
			$('#'+km_photoview.did+' .item').eq(o).before(s);
		}
		$('#'+km_photoview.did+'_photo_view').css('visibility','visible');
		setTimeout(function (){
			km_photoview.loadimg();
		}, 500);
	}
	,loadimg:function (){
		var img=new Image();
		img.onload=function(){
	        km_photoview.imgw=img.width;
	        km_photoview.imgh=img.height;
	        console.log(km_photoview.imgw+'|'+km_photoview.imgh);
			km_photoview.afterimgload();
		};
		img.src=km_photoview.url;
	}
	,afterimgload:function (){
		var m=$('#'+km_photoview.did+' .item').size();
		var n=km_photoview.currindex;
		var len=km_photoview.len;
		var o=Math.floor(n/len)*len+len;

		var eo=$('#'+km_photoview.did+' .item').eq(n);
		var url=eo.data('kmUrl');

		var title=eo.attr('title');
		if(typeof title=='undefined'){
			title=eo.find('img').attr('title');
		}
		if(typeof title=='undefined'){
			title='';
		}
		var s='';
		//s+='<div id="'+km_photoview.did+'_photo_view" class="expend">';
			s+='<a href="'+url+'" target="_blank"><img src="'+url+'"></a>';
			if(n>0){s+='<div class="prev"></div>';}
			if(n<m-1){s+='<div class="next"></div>';}
			s+='<div class="close"></div>';
			s+='<div class="t">'+title+'</div>';
		//s+='</div>';

		$('#'+km_photoview.did+'_photo_view').html(s);

		km_photoview.so=o-km_photoview.len;
		if(n>0){
			$('#'+km_photoview.did+'_photo_view .prev').bind('click',function (){
				km_photoview.prev();
			});
		}
		if(n<m-1){
			$('#'+km_photoview.did+'_photo_view .next').bind('click',function (){
				km_photoview.next();
			});
		}
		$('#'+km_photoview.did+'_photo_view .close').bind('click',function (){
			km_photoview.close();
		});
		km_photoview.resize();
	}
	,close:function (){
		$('#'+km_photoview.did+'_photo_view').css({
			'overflow':'hidden'
			,'padding-top':0
			,'padding-bottom':0
		});
		$('#'+km_photoview.did+'_photo_view img').remove();
		$('#'+km_photoview.did+'_photo_view').animate({
			height:0
		},200,function (){
			if(km_photoview.currindex>-1){
				$('#'+km_photoview.did+' .item').eq(km_photoview.currindex).removeClass('select');
				console.log($('#'+km_photoview.did+' .item').eq(km_photoview.currindex).attr('class'));
			}
			km_photoview.currindex=-1;
			$('#'+km_photoview.did+'_photo_view').remove();
		});
	}
	,prev:function (){
		km_photoview.showphoto($('#'+km_photoview.did+' .item').eq(km_photoview.currindex-1));
	}
	,next:function (){
		km_photoview.showphoto($('#'+km_photoview.did+' .item').eq(km_photoview.currindex+1));
	}
	,resize:function (){
	    var w=km_photoview.imgw;
	    var h=km_photoview.imgh;
	    var fw=km_photoview.maxw;
	    var fh=km_photoview.maxh;
	    var iw,ih;
		if(w>0&&h>0){
            if(w/h>=fw/fh){
                if(w>fw){
                    iw=fw;
                    ih=(h*fw)/w;
                }else{  
                    iw=w;
                    ih=h;
                }
            }else{
                if(h>fh){
                    ih=fh;
                    iw=(w*fh)/h;
                }else{
                    iw=w;
                    ih=h;
                }
            }
        }
        //$('#'+km_photoview.did+'_photo_view').css({height:ih+'px'});
        $('#'+km_photoview.did+'_photo_view img').css({width:iw+'px',height:ih+'px'});
        $('#'+km_photoview.did+'_photo_view .prev').css('top',(Math.floor(ih/2))+'px');
        $('#'+km_photoview.did+'_photo_view .next').css('top',(Math.floor(ih/2))+'px');

        var rowpos = $('#'+km_photoview.did+' .item').eq(km_photoview.so).offset();
		$(document.body).scrollTop(rowpos.top-10);
		setTimeout(function (){
			$('#'+km_photoview.did+'_photo_view').css('visibility','visible');
			if(typeof km_photoview['func']!='undefined'){
				km_photoview['func']();
			}
		},50);
	}
};


var km_fold={
	init:function (did,cls,h){
		if(!h){
			h=$('#'+did+' .'+cls).data('kmMinheight');
			h=parseFloat(h);
		}
		var _h=$('#'+did+' .'+cls).height();
		if(_h>h){
			$('#'+did+' .'+cls).css({
				'overflow':'hidden'
				,'height':h
				,'min-height':h
			});
			$('#'+did+' .bot').css('display','block');
		}else{
			$('#'+did+' .bot').css('display','none');
		}
	}
	,toggle:function (did,cls,h){
		if(!h){
			h=$('#'+did+' .'+cls).data('kmMinheight');
			h=parseFloat(h);
		}
		var c=$('#'+did+' .'+cls).css('overflow');
		if(c=='hidden'){
			$('#'+did+' .'+cls).css('overflow','visible');
			$('#'+did+' .'+cls).css('height','auto');
			$('#'+did+' .bot a').text('收起');
		}else{
			$('#'+did+' .'+cls).css('overflow','hidden');
			$('#'+did+' .'+cls).css('height',h+'px');
			$('#'+did+' .bot a').text('显示全部');
		}
	}
}


var km_st={
	show:true
	,autohide:true
	,list:[]
	,expended:true
	,layout:null
	,expend:function (){
		if(km_st.expended){
			km_st.layout={
				'height':$('.d-scrolltop').height()
				,'overflow':'visible'
			};
			$('.d-scrolltop').css({
				'height':'29px'
				,'overflow':'hidden'
			});
			km_st.expended=false;
		}else{
			$('.d-scrolltop').css(km_st.layout);
			km_st.expended=true;
		}
	}
};


function km_more(did,maxtimes){
	var self=this;
	this.did=did;
	this.maxtimes=maxtimes;
	this.currtimes=0;
	this.url='';
	this.afterload=function (){};
	this.load=function (){
		if(self.url==''){
			self.url=$('#'+did).data('kmUrl');
		}
		//if(self.url==''){return;}
		self.currtimes++;
		if(self.currtimes>self.maxtimes){
			return;
		}
		//$('#'+self.did).find('.more').css('visibility','hidden');
		$('#'+self.did).find('.more').css('cursor','default');
		$('#'+self.did).find('.more').html('......');
		var posting=$.ajax({
			type: "GET"
			,url: self.url
			,cache: false
		});
		posting.done(function(data) {

			var s='<div id="'+self.did+'_'+self.currtimes+'" class="dv"></div>';
			$('#'+public_more.did+' .body').append(s);

			self.afterload(data,function (){
				self.show();
			});
		});
		posting.fail(function(data) {
			console.log(data);
		});
	};
	this.show=function (){
		if(self.currtimes<self.maxtimes){
			//$('#'+self.did).find('.more').css('visibility','visible');
			$('#'+self.did).find('.more').css('cursor','pointer');
			$('#'+self.did).find('.more').html('显示更多');
		}else{
			$('#'+self.did).find('.more').remove();
		}
		$('#'+self.did+'_'+self.currtimes).ScrollTo();
	};
}


var km_popover={
	init:function (options){
		(function (){
			var _options=options;
			$('#'+options['id']).hover(function (){
				if(!$$('d_popover')){
					km_popover.create($(this),_options);
				}
				$('#d_popover').animate({opacity:1},200);
			},function (){
				$('#d_popover').remove();
			});
		})();
	}
	,create:function (elem,options){
		if(typeof options['w']=='undefined'){options['w']='';}
		if(typeof options['h']=='undefined'){options['h']='';}
		if(typeof options['l']=='undefined'){options['l']='';}
		if(typeof options['sl']=='undefined'){options['sl']=3;}
		if(typeof options['t']=='undefined'){options['t']='';}
		if(typeof options['pcls']=='undefined'){options['pcls']='';}
		if(typeof options['cls']=='undefined'){options['cls']='';}
		if(typeof options['type']=='undefined'){options['type']='';}

		var w=200;
		var h='';
		if(options['w']!==''){w=options['w'];}
		if(options['h']!==''){h=options['h'];}

		var cls=options['cls'];
		var pcls=options['pcls'];
		var l;
		if(options['type']!=''){
			switch (options['type']){
				case 'top center':
					pcls='popover-bottom';
					cls=' arrow-top-center';
					l=0-w/2+elem.outerWidth()/2+options['sl'];
				break;
				case 'top left':
					pcls='popover-bottom';
					cls=' arrow-top-left';
					l=0+elem.outerWidth()/2-20;
				break;
				case 'top right':
					pcls='popover-bottom';
					cls=' arrow-top-right';
					l=0-w+elem.outerWidth()/2+20;
				break;
				case 'bottom center':
					pcls='popover-top';
					cls=' arrow-bottom-center';
					l=0-w/2+elem.outerWidth()/2+options['sl'];
				break;
				case 'bottom left':
					pcls='popover-top';
					cls=' arrow-bottom-left';
					l=0+elem.outerWidth()/2-20;
				break;
				case 'bottom right':
					pcls='popover-top';
					cls=' arrow-bottom-right';
					l=0-w+elem.outerWidth()/2+20;
				break;
			}
		}

		var s='';
		if(pcls.indexOf('-top')!=-1){
			s+='<div id="d_popover" class="popover '+pcls+' ">';
			s+='<div class="c">'+options.html+'</div>';
			s+='<div class="arrow '+cls+'"><div class="i"></div></div>';
			s+='</div>';
		}else{
			s+='<div id="d_popover" class="popover '+pcls+' ">';
			s+='<div class="arrow '+cls+'"><div class="i"></div></div>';
			s+='<div class="c">'+options.html+'</div>';
			s+='</div>';
		}
		$(document.body).append(s);

		var t=0-$('#d_popover .c').outerHeight()-30;
		if(options['l']!==''){l=options['l'];}
		if(options['t']!==''){t=options['t'];}

		var x=elem.offset().left+l;
		var y=elem.offset().top+t;

		var opt={
			top:y+'px'
			,left:x+'px'
			,width:w+'px'
			,visibility:'visible'
			,opacity:0
		};
		if(h!=''){opt.h=h;}

		$('#d_popover').css(opt);
	}
}

var km_siteinfo={
	check:function (){
		if(typeof $km['cd']!='undefined'){return;}
		if(PF_ie6 && top==window ){
			var nd=$d.cc(null,'div',[['id','d_browserchk'],['class','d-browserchk']]);
			nd.innerHTML='您正在使用IE6浏览器，升级您的浏览器可以获得更佳的浏览效果。';
			document.body.insertBefore(nd,document.body.children[0]);
		}
		if(!isCookieEnabled() && top==window ){
			var nd=$d.cc(null,'div',[['id','d_browserchk'],['class','d-browserchk']]);
			nd.innerHTML='您的浏览器已经设置为不保存cookies，这将使您无法正常注册和登录本网站，我们建议您修改浏览器的设置。<a href="#" target="_blank">了解更多</a>';
			document.body.insertBefore(nd,document.body.children[0]);
		}
	}
	,show:function (){
		km_siteinfo.check();
	}
	,bullshow:function (idx,html,domain,flag){
		//domain - shlll.net
		//idx - bullshow1
		if(!isCookieEnabled() || top!=window){return;}
		if(flag){Cookie.unset(idx,null,domain);}

		var __bullshow=Cookie.get(idx);
		if(!__bullshow){__bullshow='show';}
		if(__bullshow!='show'){return;}

		$('#d_bull').remove();
		var nd=$d.cc(null,'div',[['id','d_bull'],['class','d-bull']]);
		//nd.innerHTML='<p class="h">尊敬的用户：</p><p>为了保证服务质量，上海学习网活动频道及阅读频道将于 <span class="t">2014年6月7日(周六) 上午 11:00 至下午 16:00 </span>进行服务器维护，维护期间两个频道将暂时无法访问。给您带来的不便，敬请谅解，感谢您一直以来对我们的支持。<a href="javascript:void(\'\');" onclick="km_siteinfo.bullclose(\'[idx]\',\'d_bull\')">不再显示</a></p>';
		html=html.replace('[idx]',idx);
		nd.innerHTML=html;
		document.body.insertBefore(nd,document.body.children[0]);
	}
	,bullclose:function (idx,did){
		$('#'+did).remove();
		Cookie.set(idx,'hide',null,null,'shlll.net');
	}
};


/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "="; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
var sha={};
sha.hex_sha1=function (s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
sha.b64_sha1=function (s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
sha.str_sha1=function (s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
sha.hex_hmac_sha1=function (key, data){ return binb2hex(core_hmac_sha1(key, data));}
sha.b64_hmac_sha1=function (key, data){ return binb2b64(core_hmac_sha1(key, data));}
sha.str_hmac_sha1=function (key, data){ return binb2str(core_hmac_sha1(key, data));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
  return str;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

(function(a){function b(a,b){var c=(a&65535)+(b&65535),d=(a>>16)+(b>>16)+(c>>16);return d<<16|c&65535}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<a.length*32;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];c[(a.length>>2)-1]=undefined;for(b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<a.length*8;b+=8)c[b>>5]|=(a.charCodeAt(b/8)&255)<<b%32;return c}function l(a){return j(i(k(a),a.length*8))}function m(a,b){var c,d=k(a),e=[],f=[],g;e[15]=f[15]=undefined,d.length>16&&(d=i(d,a.length*8));for(c=0;c<16;c+=1)e[c]=d[c]^909522486,f[c]=d[c]^1549556828;return g=i(e.concat(k(b)),512+b.length*8),j(i(f.concat(g),640))}function n(a){var b="0123456789abcdef",c="",d,e;for(e=0;e<a.length;e+=1)d=a.charCodeAt(e),c+=b.charAt(d>>>4&15)+b.charAt(d&15);return c}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"use strict",typeof define=="function"&&define.amd?define(function(){return t}):a.md5=t})(this);
function $autocom(config){
	var self=this;
	this.url='';
	for(var i in config){
		this[i]=config[i];
	}
	this.item_over=-1;
	this.datalen=-1;
	this.datalist={};
	this.statusflag='';//请求状态loadstart loaded
	this.lastpara='';//最后一次变化的para
	this.currpara='';//当前请求的para

	this.trandata=function (){};
	this.itemclick=function (){};
	this.set=function (){
		var para='';
		var para2='';
		km_kb._set(this.elemd,para,function (_para){
			if(self.datalen<=0){return;}
			document.onkeyup=function (){
				var ent=$d.evt();
				if(ent.keyCode==37||ent.keyCode==38){
					if(self.item_over==0||self.item_over==-1){
						var n=self.datalen-1;
					}else{
						var n=self.item_over-1;
					}
					self.itemout(self.item_over);
					self.itemover(n);
				}else if(ent.keyCode==39||ent.keyCode==40){
					if(self.item_over==self.datalen-1||self.item_over==-1){
						var n=0;
					}else{
						var n=self.item_over+1;
					}
					self.itemout(self.item_over);
					self.itemover(n);
				}else if(ent.keyCode==13){
					self.itemclick();
				}
			}

		},function (o1,o2,_para){
			if(o2==self.elem){return false;}
			document.onkeyup=function (){}
			return true;
		},para2);
	};
	this.init=function (style){
		if(!this.idx){return;}
		var url=$('#__int_'+this.idx).data('kmUrl');
		if(!self.url && url){self.url=url;}
		if(!self.url){return;}
		if(!this.fieldname){this.fieldname="__int_"+this.idx+"_uid";}
		try{var input=document.createElement("<input name='"+this.fieldname+"'/>");}catch(e){var input=document.createElement("input");}
		input.type="hidden";
		input.id="__int_"+this.idx+"_uid";
		input.name=this.fieldname;
		input.value="";

		var cls=$('#__int_'+this.idx).data('kmClass');
		if(!cls){cls='clsdrop';}
		var d=document.createElement("div");
		var t=document.createAttribute("id");
		t.value="__drop_"+this.idx;
		d.attributes.setNamedItem(t);
		var t=document.createAttribute("class");
		t.value=cls;
		d.attributes.setNamedItem(t);
		if(!this.style){this.style="";}
		$$(d,"style",this.style);

		this.elem=$$('__int_'+this.idx);
		if(!$$('__int_'+this.idx)){return;}
		if(!$$("__int_"+this.idx+"_uid")){
			this.elem.parentNode.appendChild(input);
		}
		this.elem.parentNode.appendChild(d);
		this.elemd=$$('__drop_'+this.idx);
		this.hid=$$('__int_'+this.idx+'_uid');

		this.elem.onfocus=function (){
			console.log('focus');
			if(self.elemd.innerHTML==""){return;}
			for(var i=0;i<km_kb.showing.length;i++){
				if(km_kb.showing[i].o==self.elemd){
					if(self.elemd.style.display=="none"){self.elemd.style.display="block";}
					return;
				}
			}
			self.set();
		};
		this.elem.onkeyup=function (){

			/*
			//输入限制
			var kc=",191,222,220,";
			var kc_shift=",51,52,53,55,56,192,187,222,";
			var ent=$d.evt();
			if(kc.indexOf(","+String(ent.keyCode)+",")!=-1){
				var _re=/([#$%&*`+]|\\|\/|\'|\")/g;
				self.elem.value=self.elem.value.replace(_re,"");
				ent.returnValue=false;
			}
			if(ent.shiftKey&&(kc_shift.indexOf(","+String(ent.keyCode)+",")!=-1)){
				var _re=/([#$%&*`+]|\\|\/|\'|\")/g;
				self.elem.value=self.elem.value.replace(_re,"");
				ent.returnValue=false;
			}
			if(ent.keyCode==13){ent.returnValue=false;}
			*/

			if($$("__int_"+self.idx+"_uid")){
				if(self.elem.value==''){
					$$("__int_"+self.idx+"_uid").value='';
				}else{
					$$("__int_"+self.idx+"_uid").value='-1';
				}
			}
			self.pushrequest();
		};
		//console.log('inited');
	};
	this.pushrequest=function (){
		var para=str_trim(self.elem.value);
		if(para==''){return;}
		if(typeof self.datalist[self.sha(para)]=='undefined'){
			self.datalist[self.sha(para)]={
				para:para
				,jo:null
			};
		}
		self.lastpara=para;
		self.request(para);
	};
	this.request=function (para){
		if(self.datalist[self.sha(self.lastpara)]['jo']!=null){
			self.datalen=self.datalist[self.sha(self.currpara)]['jo']['rows'].length;
			self.set();
			self.elemd.innerHTML='';
			self.trandata(self);
			return;
		}
		if(self.statusflag=='loadstart'){return;}

		self.statusflag='loadstart';
		self.currpara=para;
		var f=self.url;
		f=f.replace('[sd]',sd());
		f=f.replace('[para]',encodeURIComponent(para));
		f=f.replace('[count]',self.count);
		if($$("__int_"+self.idx+"_uid")){
			if(self.elem.value==''){
				$$("__int_"+self.idx+"_uid").value='';
			}else{
				$$("__int_"+self.idx+"_uid").value='-1';
			}
		}

        var posting=$.ajax({
            type:'GET'
            ,url:f
            ,cache:false
        });
        posting.done(function(data){
        	//console.log('####data:\n'+data);
        	data=JSON.parse(data);

			self.statusflag='loaded';
			self.datalist[self.sha(self.currpara)]['jo']=data;
			
			if(self.currpara!=self.lastpara){
				self.request(self.lastpara);
				return;
			}

			if(typeof self.datalist[self.sha(self.currpara)]['jo']['rows']=='undefined'||self.datalist[self.sha(self.currpara)]['jo']['rows'].length==0){
				self.datalen=self.datalist[self.sha(self.currpara)]['jo']['rows'].length;
				self.elemd.innerHTML="";
				self.set();

				self.elemd.innerHTML="<div style='padding:4px;'>没有记录。</div>";
				return false;
			}else{
				self.datalen=0;
				self.elemd.innerHTML="";
				self.set();
				
			}
			self.elemd.innerHTML='';
			self.trandata(self);

        });
        posting.fail(function(data){
        	console.log(JSON.stringify(data));
        });
        posting.always(function(data){

        });

	};
	this.sha=function (para){
		//return sha.hex_sha1(para)+md5(para);
		return md5(para+'1qaz2wsx');
	};
	this.itemover=function (i){
		self.itemout(self.item_over);
		self.item_over=i;
		try{
			self.elemd.children[i].style.backgroundColor="#ddd";
		}catch(e1){}
	};
	this.itemout=function (i){
		self.item_over=-1;
		if(i==-1){return;}
		try{
			self.elemd.children[i].style.backgroundColor="#fff";
		}catch(e1){}
	};
	this.itemclick=function (){
		if(self.item_over==-1){return;}
		var item=self.datalist[self.sha(self.lastpara)]['jo']['rows'][self.item_over];

		
		self.elem.value=$$('__h_'+self.idx+'_elemdata_'+self.item_over).value;


		self.hid.value=$$('__h_'+self.idx+'_hiddata_'+self.item_over).value;
		self.item_over=-1;
		document.onkeyup=function (){};
		km_kb._hideo(self.elemd);
		if(typeof self.afterclick=='function'){self.afterclick();}
	};
	this.trandata=function (){
		var jo=self.datalist[self.sha(self.lastpara)]['jo'];
		for(var i=0;i<jo.rows.length;i++){
			var item=jo.rows[i];

			var s1=self.getval(self.val1,item);
			var s2=self.getval(self.val2,item);
			var d=document.createElement("div");
			var s="";
			s+=s1;
			s+="<input type='hidden' value='"+s1+"' id=\"__h_"+self.idx+"_elemdata_"+i+"\">";
			s+="<input type='hidden' value='"+s2+"' id=\"__h_"+self.idx+"_hiddata_"+i+"\">";
			d.innerHTML=s;
			var t=document.createAttribute("class");
			t.value="item";
			d.attributes.setNamedItem(t);
			(function (){
				var _i=i;
				d.onclick=function (){self.itemclick();}
				d.onmouseover=function (){self.itemover(_i);}
				d.onmouseout=function (){self.itemout(_i);}
			})();
			self.elemd.appendChild(d);
		}
	};
	this.getval=function (vo,item){
		var s=vo.str;
		for(var k=0;k<vo.field.length;k++){
			s=rC(s,"["+vo.field[k]+"]",item[vo.field[k]]);
		}
		return s;
	}
}

"use strict";function q(a){throw a;}var t=void 0,u=!1;var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
"undefined"!=typeof module&&module.exports&&(module.exports=sjcl);
sjcl.cipher.aes=function(a){this.j[0][0][0]||this.D();var b,c,d,e,f=this.j[0][4],g=this.j[1];b=a.length;var h=1;4!==b&&(6!==b&&8!==b)&&q(new sjcl.exception.invalid("invalid aes key size"));this.a=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return y(this,a,0)},decrypt:function(a){return y(this,a,1)},j:[[[],[],[],[],[]],[[],[],[],[],[]]],D:function(){var a=this.j[0],b=this.j[1],c=a[4],d=b[4],e,f,g,h=[],l=[],k,n,m,p;for(e=0;0x100>e;e++)l[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=k||1,g=l[g]||1){m=g^g<<1^g<<2^g<<3^g<<4;m=m>>8^m&255^99;c[f]=m;d[m]=f;n=h[e=h[k=h[f]]];p=0x1010101*n^0x10001*e^0x101*k^0x1010100*f;n=0x101*h[m]^0x1010100*m;for(e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8}for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function y(a,b,c){4!==b.length&&q(new sjcl.exception.invalid("invalid aes block size"));var d=a.a[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,l,k,n=d.length/4-2,m,p=4,s=[0,0,0,0];h=a.j[c];a=h[0];var r=h[1],v=h[2],w=h[3],x=h[4];for(m=0;m<n;m++)h=a[e>>>24]^r[f>>16&255]^v[g>>8&255]^w[b&255]^d[p],l=a[f>>>24]^r[g>>16&255]^v[b>>8&255]^w[e&255]^d[p+1],k=a[g>>>24]^r[b>>16&255]^v[e>>8&255]^w[f&255]^d[p+2],b=a[b>>>24]^r[e>>16&255]^v[f>>8&255]^w[g&255]^d[p+3],p+=4,e=h,f=l,g=k;for(m=0;4>
m;m++)s[c?3&-m:m]=x[e>>>24]<<24^x[f>>16&255]<<16^x[g>>8&255]<<8^x[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return s}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.O(a.slice(b/32),32-(b&31)).slice(1);return c===t?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.O(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return u;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},O:function(a,b,c,d){var e;e=0;for(d===t&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},k:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
sjcl.codec.base64={I:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.I,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.I,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++)h=f.indexOf(a.charAt(d)),
0>h&&q(new sjcl.exception.invalid("this isn't base64!")),26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e);e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.a[0]||this.D();a?(this.q=a.q.slice(0),this.m=a.m.slice(0),this.g=a.g):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.q=this.M.slice(0);this.m=[];this.g=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.m=sjcl.bitArray.concat(this.m,a);b=this.g;a=this.g=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)z(this,c.splice(0,16));return this},finalize:function(){var a,b=this.m,c=this.q,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.g/
4294967296));for(b.push(this.g|0);b.length;)z(this,b.splice(0,16));this.reset();return c},M:[],a:[],D:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}var b=0,c=2,d;a:for(;64>b;c++){for(d=2;d*d<=c;d++)if(0===c%d)continue a;8>b&&(this.M[b]=a(Math.pow(c,0.5)));this.a[b]=a(Math.pow(c,1/3));b++}}};
function z(a,b){var c,d,e,f=b.slice(0),g=a.q,h=a.a,l=g[0],k=g[1],n=g[2],m=g[3],p=g[4],s=g[5],r=g[6],v=g[7];for(c=0;64>c;c++)16>c?d=f[c]:(d=f[c+1&15],e=f[c+14&15],d=f[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+f[c&15]+f[c+9&15]|0),d=d+v+(p>>>6^p>>>11^p>>>25^p<<26^p<<21^p<<7)+(r^p&(s^r))+h[c],v=r,r=s,s=p,p=m+d|0,m=n,n=k,k=l,l=d+(k&n^m&(k^n))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;g[0]=g[0]+l|0;g[1]=g[1]+k|0;g[2]=g[2]+n|0;g[3]=g[3]+m|0;g[4]=g[4]+p|0;g[5]=g[5]+s|0;g[6]=
g[6]+r|0;g[7]=g[7]+v|0}
sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,l=h.bitLength(c)/8,k=h.bitLength(g)/8;e=e||64;d=d||[];7>l&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(f=2;4>f&&k>>>8*f;f++);f<15-l&&(f=15-l);c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.K(a,b,c,d,e,f);g=sjcl.mode.ccm.n(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),l=f.clamp(b,h-e),k=f.bitSlice(b,
h-e),h=(h-e)/8;7>g&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));l=sjcl.mode.ccm.n(a,l,c,k,e,b);a=sjcl.mode.ccm.K(a,l.data,c,d,e,b);f.equal(l.tag,a)||q(new sjcl.exception.corrupt("ccm: tag doesn't match"));return l.data},K:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,l=h.k;e/=8;(e%2||4>e||16<e)&&q(new sjcl.exception.invalid("ccm: invalid tag length"));(0xffffffff<d.length||0xffffffff<b.length)&&q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data"));
f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;65279>=c?g=[h.partial(16,c)]:0xffffffff>=c&&(g=h.concat([h.partial(16,65534)],[c]));g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(l(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(l(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,8*e)},n:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.k;var l=b.length,k=h.bitLength(b);c=h.concat([h.partial(8,
f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!l)return{tag:d,data:[]};for(g=0;g<l;g+=4)c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,k)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));var g,h=sjcl.mode.ocb2.G,l=sjcl.bitArray,k=l.k,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=k(n,m),p=p.concat(k(c,a.encrypt(k(c,m)))),c=h(c);m=b.slice(g);b=l.bitLength(m);g=a.encrypt(k(c,[0,0,0,b]));m=l.clamp(k(m.concat([0,0,0]),g),b);n=k(n,k(m.concat([0,0,0]),g));n=a.encrypt(k(n,k(c,h(c))));d.length&&
(n=k(n,f?d:sjcl.mode.ocb2.pmac(a,d)));return p.concat(l.concat(m,l.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));e=e||64;var g=sjcl.mode.ocb2.G,h=sjcl.bitArray,l=h.k,k=[0,0,0,0],n=g(a.encrypt(c)),m,p,s=sjcl.bitArray.bitLength(b)-e,r=[];d=d||[];for(c=0;c+4<s/32;c+=4)m=l(n,a.decrypt(l(n,b.slice(c,c+4)))),k=l(k,m),r=r.concat(m),n=g(n);p=s-32*c;m=a.encrypt(l(n,[0,0,0,p]));m=l(m,h.clamp(b.slice(c),p).concat([0,0,0]));
k=l(k,m);k=a.encrypt(l(k,l(n,g(n))));d.length&&(k=l(k,f?d:sjcl.mode.ocb2.pmac(a,d)));h.equal(h.clamp(k,e),h.bitSlice(b,s))||q(new sjcl.exception.corrupt("ocb: tag doesn't match"));return r.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.G,e=sjcl.bitArray,f=e.k,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);return a.encrypt(f(d(f(h,
d(h))),g))},G:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.n(!0,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.n(u,a,f,d,c,e);g.equal(a.tag,b)||q(new sjcl.exception.corrupt("gcm: tag doesn't match"));return a.data},U:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.k;e=[0,0,0,0];f=b.slice(0);
for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},f:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.U(b,a);return b},n:function(a,b,c,d,e,f){var g,h,l,k,n,m,p,s,r=sjcl.bitArray;m=c.length;p=r.bitLength(c);s=r.bitLength(d);h=r.bitLength(e);g=b.encrypt([0,
0,0,0]);96===h?(e=e.slice(0),e=r.concat(e,[1])):(e=sjcl.mode.gcm.f(g,[0,0,0,0],e),e=sjcl.mode.gcm.f(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.f(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.f(g,h,c));for(k=0;k<m;k+=4)n[3]++,l=b.encrypt(n),c[k]^=l[0],c[k+1]^=l[1],c[k+2]^=l[2],c[k+3]^=l[3];c=r.clamp(c,p);a&&(d=sjcl.mode.gcm.f(g,h,c));a=[Math.floor(s/0x100000000),s&0xffffffff,Math.floor(p/0x100000000),p&0xffffffff];d=sjcl.mode.gcm.f(g,d,a);l=b.encrypt(e);d[0]^=l[0];
d[1]^=l[1];d[2]^=l[2];d[3]^=l[3];return{tag:r.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.L=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.o=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.o[0].update(c[0]);this.o[1].update(c[1])};sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){a=(new this.L(this.o[0])).update(a).finalize();return(new this.L(this.o[1])).update(a).finalize()};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;(0>d||0>c)&&q(sjcl.exception.invalid("invalid params to pbkdf2"));"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,l,k=[],n=sjcl.bitArray;for(l=1;32*k.length<(d||1);l++){e=f=a.encrypt(n.concat(b,[l]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}k=k.concat(e)}d&&(k=n.clamp(k,d));return k};
sjcl.prng=function(a){this.b=[new sjcl.hash.sha256];this.h=[0];this.F=0;this.t={};this.C=0;this.J={};this.N=this.c=this.i=this.T=0;this.a=[0,0,0,0,0,0,0,0];this.e=[0,0,0,0];this.A=t;this.B=a;this.p=u;this.z={progress:{},seeded:{}};this.l=this.S=0;this.u=1;this.w=2;this.Q=0x10000;this.H=[0,48,64,96,128,192,0x100,384,512,768,1024];this.R=3E4;this.P=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;d===this.l&&q(new sjcl.exception.notReady("generator isn't seeded"));if(d&this.w){d=!(d&this.u);e=[];var f=0,g;this.N=e[0]=(new Date).valueOf()+this.R;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.b.length&&!(e=e.concat(this.b[g].finalize()),f+=this.h[g],this.h[g]=0,!d&&this.F&1<<g);g++);this.F>=1<<this.b.length&&(this.b.push(new sjcl.hash.sha256),this.h.push(0));this.c-=f;f>this.i&&(this.i=f);this.F++;
this.a=sjcl.hash.sha256.hash(this.a.concat(e));this.A=new sjcl.cipher.aes(this.a);for(d=0;4>d&&!(this.e[d]=this.e[d]+1|0,this.e[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.Q&&A(this),e=B(this),c.push(e[0],e[1],e[2],e[3]);A(this);return c.slice(0,a)},setDefaultParanoia:function(a){this.B=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.t[c],h=this.isReady(),l=0;d=this.J[c];d===t&&(d=this.J[c]=this.T++);g===t&&(g=this.t[c]=0);this.t[c]=(this.t[c]+1)%this.b.length;switch(typeof a){case "number":b===
t&&(b=1);this.b[g].update([d,this.C++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{"[object Array]"!==c&&(l=1);for(c=0;c<a.length&&!l;c++)"number"!=typeof a[c]&&(l=1)}if(!l){if(b===t)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,e>>>=1;this.b[g].update([d,this.C++,2,b,f,a.length].concat(a))}break;case "string":b===t&&(b=a.length);this.b[g].update([d,this.C++,3,b,f,a.length]);this.b[g].update(a);
break;default:l=1}l&&q(new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string"));this.h[g]+=b;this.c+=b;h===this.l&&(this.isReady()!==this.l&&C("seeded",Math.max(this.i,this.c)),C("progress",this.getProgress()))},isReady:function(a){a=this.H[a!==t?a:this.B];return this.i&&this.i>=a?this.h[0]>this.P&&(new Date).valueOf()>this.N?this.w|this.u:this.u:this.c>=a?this.w|this.l:this.l},getProgress:function(a){a=this.H[a?a:this.B];return this.i>=a?1:this.c>a?1:this.c/
a},startCollectors:function(){this.p||(window.addEventListener?(window.addEventListener("load",this.r,u),window.addEventListener("mousemove",this.s,u)):document.attachEvent?(document.attachEvent("onload",this.r),document.attachEvent("onmousemove",this.s)):q(new sjcl.exception.bug("can't attach event")),this.p=!0)},stopCollectors:function(){this.p&&(window.removeEventListener?(window.removeEventListener("load",this.r,u),window.removeEventListener("mousemove",this.s,u)):window.detachEvent&&(window.detachEvent("onload",
this.r),window.detachEvent("onmousemove",this.s)),this.p=u)},addEventListener:function(a,b){this.z[a][this.S++]=b},removeEventListener:function(a,b){var c,d,e=this.z[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},s:function(a){sjcl.random.addEntropy([a.x||a.clientX||a.offsetX||0,a.y||a.clientY||a.offsetY||0],2,"mouse")},r:function(){sjcl.random.addEntropy((new Date).valueOf(),2,"loadtime")}};
function C(a,b){var c,d=sjcl.random.z[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function A(a){a.a=B(a).concat(B(a));a.A=new sjcl.cipher.aes(a.a)}function B(a){for(var b=0;4>b&&!(a.e[b]=a.e[b]+1|0,a.e[b]);b++);return a.A.encrypt(a.e)}sjcl.random=new sjcl.prng(6);try{var D=new Uint32Array(32);crypto.getRandomValues(D);sjcl.random.addEntropy(D,1024,"crypto['getRandomValues']")}catch(E){}
sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},encrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.d({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.d(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||
4<f.iv.length)&&q(new sjcl.exception.invalid("json encrypt: invalid parameters"));"string"===typeof a&&(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt);"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.d(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return e.encode(f)},decrypt:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.d(e.d(e.d({},e.defaults),e.decode(b)),
c,!0);var f;c=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)&&q(new sjcl.exception.invalid("json decrypt: invalid parameters"));"string"===typeof a&&(f=sjcl.misc.cachedPbkdf2(a,b),a=f.key.slice(0,b.ks/32),b.salt=f.salt);"string"===
typeof c&&(c=sjcl.codec.utf8String.toBits(c));f=new sjcl.cipher[b.cipher](a);c=sjcl.mode[b.mode].decrypt(f,b.ct,b.iv,c,b.ts);e.d(d,b);d.key=a;return sjcl.codec.utf8String.fromBits(c)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b))switch(b.match(/^[a-z0-9]+$/i)||q(new sjcl.exception.invalid("json encode: invalid property name")),c+=d+'"'+b+'":',d=",",typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],
0)+'"';break;default:q(new sjcl.exception.bug("json encode: unsupported type"))}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");a.match(/^\{.*\}$/)||q(new sjcl.exception.invalid("json decode: this isn't json!"));a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++)(d=a[c].match(/^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i))||q(new sjcl.exception.invalid("json decode: this isn't json!")),b[d[2]]=d[3]?parseInt(d[3],10):d[2].match(/^(ct|salt|iv)$/)?
sjcl.codec.base64.toBits(d[4]):unescape(d[4]);return b},d:function(a,b,c){a===t&&(a={});if(b===t)return a;for(var d in b)b.hasOwnProperty(d)&&(c&&(a[d]!==t&&a[d]!==b[d])&&q(new sjcl.exception.invalid("required parameter overridden")),a[d]=b[d]);return a},X:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},W:function(a,b){var c={},d;for(d=0;d<b.length;d++)a[b[d]]!==t&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;
sjcl.misc.V={};sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.V,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===t?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};
