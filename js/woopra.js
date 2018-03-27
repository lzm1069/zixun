var woopraTracker=false;

function WoopraScript(_src,_hook,_async){

        this.src=_src;
        this.hook=_hook;
        this.async=_async;

        var pntr=false;

        this.init=function(){
               	pntr=this;
        }

        this.load=function(){

                var script=document.createElement('script');
                script.type='text/javascript';
                script.src=pntr.src;
		script.async=pntr.async;

                if(pntr.hook){
                        script.onload=function(){
				setTimeout(function(){pntr.hook.apply();},400);
			}
                        script.onreadystatechange = function() {
                                if (this.readyState == 'complete'|| this.readyState=='loaded') {
					setTimeout(pntr.hook,400);
				}
			}
                }

                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
	}
	this.init();
}

function WoopraKeyValue(_k,_v){
	this.k=_k;
	this.v=_v;
}

function WoopraEvent(_name){

	var entries=new Array();
	var visitor=new Array();
	this.name=_name;
	this.mod=0;

	this.addProperty=function(key,value){
		entries[entries.length]=new WoopraKeyValue(key,value);
	}
	this.addVisitorProperty=function(key,value){
		visitor[visitor.length]=new WoopraKeyValue(key,value);
	}
	this.fire=function(){
		var t=woopraTracker;
		var buffer='';

		this.addProperty('name',this.name);

		for (var i=0;i<entries.length;i++){
			buffer+='&'+encodeURIComponent('ce_'+entries[i].k)+'='+encodeURIComponent(entries[i].v);
		}
		for(var i=0;i<visitor.length;i++){
			buffer+='&'+encodeURIComponent('cv_'+visitor[i].k)+'='+encodeURIComponent(visitor[i].v);
		}
		buffer+='&'+'mod'+'='+this.mod;
		buffer+='&'+'alias'+'='+t.site();
		buffer+='&'+''+'cookie'+'='+t.readcookie('wooTracker');
		buffer+='&'+''+'meta'+'='+encodeURIComponent(t.meta());
		buffer+='&'+''+'screen'+'='+encodeURIComponent(t.screeninfo());
		buffer+='&'+''+'language'+'='+encodeURIComponent(t.langinfo());

		if(buffer!=''){
			var _mod = ((document.location.protocol=="https:")?'/woopras/ce.jsp?':'/ce/');
			var _url= t.getEngine() + _mod +'ra='+t.randomstring()+buffer;
			t.request(_url);
		}
	}
}

function WoopraTracker(){

	var pntr=false;
	var chat=false;

	var wx_static=false;
	var wx_engine=false;

	var alias=false;

	var visitor_data=false;
	var idle_timeout=4*60*1000;
	var vs=0;

	var queue=new Array();
	var pageLoaded=0;

	this.initialize=function(){

		pntr=this;
		visitor_data=new Array();
		var _c=false;
		_c=pntr.readcookie('wooTracker'); 
		if(!_c){
			_c=pntr.randomstring();
			pntr.createcookie('wooTracker', _c, 10*1000);
		}

		if(document.location.protocol=="https:"){
			wx_engine="https://sec1.woopra.com";
			wx_static="https://static.woopra.com";
		}else{
			wx_engine='http://'+pntr.site()+'.woopra-ns.com';
			wx_static="http://static.woopra.com";
		}

		if(document.addEventListener){
			document.addEventListener("mousedown",pntr.clicked,false);
			document.addEventListener("mousemove",pntr.moved,false);
			document.addEventListener("keydown",pntr.typed,false);
		}else{
			document.attachEvent("onmousedown",pntr.clicked);
			document.attachEvent("onmousemove",pntr.moved);
			document.attachEvent("onkeydown",pntr.typed);
		}
	}

	this.onPageLoad=function(){
		pageLoaded=1;
		var i=0;
		for(i=0;i<queue.length;i++){
			queue[i].load();
		}
	}

	this.site=function(){
		if(alias){
			return alias;
		}
		return pntr.trimSite(location.hostname);
	}

	this.trimSite=function(s){
		return ((s.indexOf('www.')<0)?s:s.substring(4));
	}

	this.addVisitorProperty=function(key,value){
		var cursor=visitor_data.length;
		visitor_data[cursor]=new WoopraKeyValue(key,value);
	}

	this.getStatic=function(){
		return wx_static;
	}
	
	this.getEngine=function(){
		return wx_engine;
	}

	this.setEngine=function(e){
		wx_engine=e;
	}

	this.setDomain=function(site){
		alias=pntr.trimSite(site);
		if(document.location.protocol=="http:"){
			wx_engine='http://'+alias+'.woopra-ns.com';
		}
		var _c=pntr.readcookie('wooTracker');
		if(!_c){
			_c=pntr.randomstring();
		}
		pntr.createcookie('wooTracker', _c, 10*1000);
	}

	this.sleep=function(millis){
		var date = new Date();
		var curDate = new Date();
		while(curDate-date < millis){
			curDate=new Date();
		}
	}

	this.randomstring=function(){
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var s = '';
		for (var i = 0; i < 32; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			s += chars.substring(rnum, rnum + 1);
		}
		return s;
	}

	this.langinfo=function(){
		return (navigator.browserLanguage || navigator.language || "");
	}

	this.screeninfo=function(){
		return screen.width + 'x' + screen.height;
	}

	this.readcookie=function(k) {
		var c=""+document.cookie;
		var ind=c.indexOf(k);
		if (ind==-1 || k==""){
			return "";
		}
		var ind1=c.indexOf(';',ind);
		if (ind1==-1){
			ind1=c.length;
		}
		return unescape(c.substring(ind+k.length+1,ind1));
	}

	this.createcookie=function(k,v,days){
		var exp='';
		if(days>0){
			var expires = new Date();
			expires.setDate(expires.getDate() + days);
			exp = expires.toGMTString();
		}
		cookieval = k + '=' + v + '; ' + 'expires=' + exp + ';' + 'path=/'+';domain=.'+pntr.site();
		document.cookie = cookieval;
	}

	this.request=function(url,hook){
		var script=new WoopraScript(url,hook,true);
		if(pageLoaded==0){
			queue[queue.length]=script;
		}else{
			script.load();
		}
	}

	this.verify=function(){
	}

	this.rescue=function(){
	}

	this.meta=function(){
		var meta='';
		if(pntr.readcookie('wooMeta')){
			meta=pntr.readcookie('wooMeta');
		}
		return meta;
	}

	this.track=function(_page,_title,_arr){

		var date=new Date();

		var arr=new Array();

		arr[arr.length]=new WoopraKeyValue('cookie',pntr.readcookie('wooTracker'));
		arr[arr.length]=new WoopraKeyValue('meta',pntr.meta());
		arr[arr.length]=new WoopraKeyValue('alias',pntr.site());
		arr[arr.length]=new WoopraKeyValue('language',pntr.langinfo());

		if(_page){
			arr[arr.length]=new WoopraKeyValue('page',_page);
		}else{
			arr[arr.length]=new WoopraKeyValue('page',window.location.pathname);
		}

		if(_title){
			arr[arr.length]=new WoopraKeyValue('pagetitle',_title);
		}else{
			arr[arr.length]=new WoopraKeyValue('pagetitle',document.title);
		}

		arr[arr.length]=new WoopraKeyValue('referer',document.referrer);
		arr[arr.length]=new WoopraKeyValue('screen',pntr.screeninfo());
		arr[arr.length]=new WoopraKeyValue('localtime',date.getHours()+':'+date.getMinutes());

		if(_arr){
			for (var ite in _arr) {
				arr[arr.length]=new WoopraKeyValue('ce_'+ite,_arr[ite]);
			}
		}

		var c=0;

		for (c=0;c<visitor_data.length;c++){
			arr[arr.length]=new WoopraKeyValue('cv_'+visitor_data[c].k,visitor_data[c].v);           
		}

		c=0;

		var url='';
		for (c=0;c<arr.length;c++){
			url+="&"+encodeURIComponent(arr[c].k)+"="+encodeURIComponent(arr[c].v);
		}

		var _mod = ((document.location.protocol=="https:")?'/woopras/visit.jsp?':'/visit/');

		pntr.request(wx_engine + _mod +'ra='+pntr.randomstring()+url);
	}

	this.pingServer=function(){
		var _mod = ((document.location.protocol=="https:")?'/woopras/ping.jsp?':'/ping/');
		var _url = wx_engine + _mod;
		_url+='cookie='+pntr.readcookie('wooTracker');
		_url+='&alias='+pntr.site();
		_url+='&idle='+parseInt(idle/1000);
		if(vs==2){
			_url+='&vs=w';
			vs=0;
		}else{
			if(idle==0){
				_url+='&vs=r';
			}else{
				_url+='&vs=i';
			}
		}
		_url+='&ra='+pntr.randomstring();
		pntr.request(_url);
	}

	this.typed=function(e){
		vs=2;
	}

	this.clicked=function(e) {
		pntr.moved();

		var cElem = (e.srcElement) ? e.srcElement : e.target;
		if(cElem.tagName == "A"){
			var link=cElem;
			var _download = link.pathname.match(/(?:doc|eps|jpg|png|svg|xls|ppt|pdf|xls|zip|txt|vsd|vxd|js|css|rar|exe|wma|mov|avi|wmv|mp3)($|\&)/);
			var ev=false;
			if(_download && (link.href.toString().indexOf('woopra-ns.com')<0)){
				ev=new WoopraEvent('download');
				ev.addProperty('url',link.href);
				ev.fire();
				pntr.sleep(100);
			}
			if (!_download&&link.hostname != location.host && link.hostname.indexOf('javascript')==-1 && link.hostname!=''){
				ev=new WoopraEvent('exit');
				ev.addProperty('url',link.href);
				ev.fire();
				pntr.sleep(400);
			}
		}
	}

	var last_activity=new Date();
	var idle=0;

	this.moved=function(){
		last_activity=new Date();       
		idle=0;
	}

	this.setIdleTimeout=function(t){
		idle_timeout=t;
	}

	this.ping=function(){
		if(idle>idle_timeout){
			return;
		}
		pntr.pingServer();
		var now=new Date();
		if(now-last_activity>10000){
			idle=now-last_activity;
		}
	}
    
	this.loadScript=function(src,hook){
		pntr.request(src,hook);
	}

}

function WoopraTransaction(orderID,affiliation,total,tax,shipping,city,state,country){
	var pntr=false;
	var ev=new WoopraEvent('ecommerce');
	ev.addProperty('orderid',orderID);
	ev.addProperty('affiliation',affiliation);
	ev.addProperty('total',total);
	ev.addProperty('tax',tax);
	ev.addProperty('shipping',shipping);
	ev.addProperty('city',city);
	ev.addProperty('state',state);
	ev.addProperty('country',country);
	var items=new Array();

	this.init=function(){
		pntr=this;
	}
	this.addItem=function(item){
		items[items.length]=item;
	}
	this.toXML=function(){
		var xml='';
		var i=0;
		for(i=0;i<items.length;i++){
			var m=items[i];
			xml+='<r c="'+encodeURIComponent(m.code)+'" n="'+encodeURIComponent(m.name)+'" a="'+encodeURIComponent(m.category)+'" p="'+m.unitPrice+'" q="'+m.quantity+'"/>';
		}
		return xml;
	}
	this.track=function(){
		ev.mod=3;
		ev.addProperty('items',pntr.toXML());
		ev.fire();
	}

	this.init();
}
function WoopraItem(code,name, category, unitPrice,quantity){
	this.code=code;
	this.name=name;
	this.category=category;
	this.unitPrice=unitPrice;
	this.quantity=quantity;
}


woopraTracker=new WoopraTracker();
woopraTracker.initialize();

if(typeof(window.addEventListener)!="undefined"){
	window.addEventListener("load",woopraTracker.onPageLoad,false);
}else{
	if(typeof(document.addEventListener)!="undefined"){
		document.addEventListener("load",woopraTracker.onPageLoad,false);
	}else{
		if(typeof window.attachEvent!="undefined"){
			window.attachEvent("onload",woopraTracker.onPageLoad);
		}
	}
}
function woopra_compat(){

var __k=false;
var __v=false;

if(typeof woopra_array!='undefined'){
    for (__k in woopra_array){
        __v=woopra_array[__k];
        try{
            if(__v && (typeof __v != 'function') && __v.toString().length<128){
                woopraTracker.addVisitorProperty(__k,__v);
            }
	}catch(e){}
    }
}

if(typeof woopra_visitor!='undefined'){
    for (__k in woopra_visitor){
        __v=woopra_visitor[__k];
        try{
            if(__v && (typeof __v != 'function') && __v.toString().length<128){
                woopraTracker.addVisitorProperty(__k,__v);
            }
	}catch(e){}
    }
}
}

woopra_compat();

setTimeout(function(){woopraTracker.track();},200);


