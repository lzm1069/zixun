function getObj(name) {
	if (document.getElementById) {
		if(document.getElementById(name)) {
			this.obj = document.getElementById(name);
			this.style = document.getElementById(name).style;
		}
	}
	else if (document.all) {
		if(document.all[name]) {
			this.obj = document.all[name];
			this.style = document.all[name].style;
		}
	}
	else if (document.layers) {
		if (document.layers[name]) {
			this.obj = document.layers[name];
			this.style = document.layers[name];
		}
	}
}


function checkLen(target, targetCharsCounter, maxChars) {
	len = target.value.length;
	
	if ( len == 1 && target.value.substring(0, 1) == " " ) {
		target.value = ""; len = 0;
	}
	
	if ( len > maxChars ) {
		target.value = target.value.substring( 0, maxChars );
		charsLeft = 0;
	} else {
		charsLeft = maxChars - len;
	}
	oCounter = new getObj(targetCharsCounter);
	oCounter.obj.value = charsLeft;
}


//------ resizer
function findPosX(obj) {
	var curleft = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curleft += obj.offsetLeft
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}

function findPosY(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		while (obj.offsetParent) {
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
	return curtop;
}


function resizeContent(originalSize) {
	if(originalSize == undefined)
		iOriginalSize = null;
	else
		iOriginalSize = originalSize;
		
	//get objects
	oLeftContainer 	= new getObj('container_left');
	oRightContainer = new getObj('container_right');
	oContent 				= new getObj('alt_middle_3');
	
	//test to see if they exist
	if(oLeftContainer.obj && oRightContainer.obj && oContent.obj && oContent.style) {
		//iLeftContainerY		= findPosY(oLeftContainer.obj);
		//iRightContainerY	= findPosY(oRightContainer.obj);
		
		//get sizes
		iOffset							= 20;
		iLeftContainerSize	= oLeftContainer.obj.offsetHeight;
		iRightContainerSize	= oRightContainer.obj.offsetHeight;
		iContentSize 				= oContent.obj.offsetHeight;

		if(iOriginalSize == null)
			iOriginalSize			= iContentSize;
		
		//choose the larger one
		iSize = Math.max(iLeftContainerSize, iRightContainerSize);
		iSize = Math.max(iSize, iOriginalSize);
		
		oContent.style.height = iSize + 'px';
		if(iOriginalSize != null)
			return iOriginalSize;

		return 0;
	}
}

/*
function resizeIndex() {
	oLeft 	= new getObj('middle_middle_1');
	oRight 	= new getObj('middle_middle_3');
	
	iLeftHeight 	= oLeft.obj.offsetHeight;
	iRightHeight 	= oRight.obj.offsetHeight;
	
	iMax = Math.max(iLeftHeight, iRightHeight) + 15;
	
	oLeft.style.height 		= iMax + 'px';
	oRight.style.height 	= iMax + 'px';
}
*/

function bookmarksite(title, url){
	if (document.all)
		window.external.AddFavorite(url, title);
	else if (window.sidebar)
		window.sidebar.addPanel(title, url, "");
}


//used on home page only
function resizeIndex() {
	oLeftColumn 	= new getObj('middle_middle_1');;
	oRightColumn 	= new getObj('middle_middle_3');

	oLeftContainer 	= new getObj('container_left');
	oRightContainer = new getObj('container_right');
	
	iLeftHeight 	= oLeftColumn.obj.offsetHeight;
	iRightHeight 	= oRightColumn.obj.offsetHeight;
	iMax = Math.max(iLeftHeight, iRightHeight);

	iLeftCHeight 	= oLeftContainer.obj.offsetHeight;
	iRightCHeight = oRightContainer.obj.offsetHeight;
	iCMax = Math.max(iLeftCHeight, iRightCHeight);

	if( iCMax > iMax ) {
		iCMax -= 0;
		oLeftColumn.style.height 		= iCMax + 'px';
		oRightColumn.style.height 	= iCMax + 'px';
	}
	else {
		iMax -= 0;
		oLeftColumn.style.height 		= iMax + 'px';
		oRightColumn.style.height 	= iMax + 'px';
	}
}
	
	
function getWW() {
	if (parseInt(navigator.appVersion)>3) {
		if (navigator.appName=="Netscape") {
			return window.innerWidth-16;
		}
		if (navigator.appName.indexOf("Microsoft")!=-1) {
			return document.body.offsetWidth-20;
		}
	}
}


function popItUp() {
	mywidth = 300;
	myheight = 300;
	myright =	getWW();
	myright -= (25 + mywidth);
	mytop = 10;

	window.open('homepopup.php', '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width = ' + mywidth + ',height = ' + myheight + ',left = ' + myright + ',top = ' + mytop);
}
	
	
function showHide( subNum ) {	
		oB = new getObj('sub' + subNum);
		oBox = oB.obj;
		oBoxStyle = oB.style;
		
		oF = new getObj('foot' + subNum);
		oFooter = oF.obj;
		oFooterStyle = oF.style;
		
		oI = new getObj('img' + subNum);
		oImage = oI.obj;

		if( !oBox || !oFooter || !oImage )
			return false;
			
		if( oBoxStyle.display != 'block' ) { //box closed - open it
			oBoxStyle.display = 'block';
			oFooterStyle.display = 'none';
			oImage.src = _globalPathRoot + 'images/icons/btn_minus.gif';
    }
		else { //box opened - close it
			oBoxStyle.display = 'none';
			oFooterStyle.display = 'block';
			oImage.src = _globalPathRoot + 'images/icons/btn_plus.gif';
		}
		
		//call the resize function each time when the box closes/opens
		resizeContent(origSize);
		adjustBoxes();
}
	
	function changeSubmit() {
		oSubmit = new getObj('submitMemberInfoID');
		oAgree = new getObj('agree');
		
		if(oSubmit.obj && oAgree.obj) {
			if(oAgree.obj.value) {
				oSubmit.obj.disabled = false;
			}
			else {
				oSubmit.obj.disabled = true;
			}
		}
		else
			return false;
	}

	function checkSubmit() {
		oSubmit = new getObj('submitMemberInfoID');
		oAgree = new getObj('agree');

		if(oSubmit.obj && oAgree.obj) {
			if(!oAgree.obj.checked) {
				oSubmit.obj.disabled = true;
				alert('You have to read the Terms of Use and Privacy Policy and agree.');
				return false;
			}
			else
				return true;
		}
		else
			return false;
	}

function setStyles(object) {
	object.T_BGCOLOR='#0E7982';
	object.T_BORDERWIDTH=0;
	object.T_FONTCOLOR='#C5F3F6';
	object.T_OFFSETX=-20;
	object.T_OFFSETY=20;
	object.T_FONTFACE="arial,helvetica,sans";
	object.T_FONTSIZE="11px";
	object.T_WIDTH = "150px";
	object.T_OPACITY = 85;
	object.T_PADDING = 3;
	object.T_TEXTALIGN='center';
}

//-------- AJAX ----------
function createRequestObject() {
	req = false;
	// branch for native XMLHttpRequest object
	if(window.XMLHttpRequest) {
		try {
			req = new XMLHttpRequest();
		}
		catch(e) {
			req = false;
		}

		// branch for IE/Windows ActiveX version
	}
	else if(window.ActiveXObject) {
	 	try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch(e) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(e) {
				req = false;
			}
		}
	}
	
	return req;	
}

/*
function createRequestObject2() {
	var oRequest;
	var browser = navigator.appName;
	if(browser == "Microsoft Internet Explorer") {
		oRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
	else {
		oRequest = new XMLHttpRequest();
	}
	
	return oRequest;
}
*/

// -- create xmlhttprequest object --
var http = createRequestObject(); 
// -- create xmlhttprequest object --

function voteForPoll() {
	if( !http ) {
		return false;
	}

	oChoiceSelected = new getObj('choiceSelected');

	if( !oChoiceSelected.obj ) {
		return false;
	}
	
	if( !oChoiceSelected.obj.value ) {
		return false;
	}

	http.open( 'get', _globalPathIndex + 'ajax/polls.php?answer=' + oChoiceSelected.obj.value );
	http.onreadystatechange = handlePoll; 
	http.send(null);
}

function voteForTrivia() {
	if( !http ) {
		return false;
	}

	oChoiceSelected = new getObj('choiceSelected');

	if( !oChoiceSelected.obj ) {
		return false;
	}
	
	if( !oChoiceSelected.obj.value ) {
		return false;
	}

	http.open('get', _globalPathIndex + 'ajax/trivia.php?answer=' + oChoiceSelected.obj.value + '');
	http.onreadystatechange = handleTrivia; 
	http.send(null);
}


function handlePoll() {
	/* 
		Make sure that the transaction has finished. The XMLHttpRequest object 
		has a property called readyState with several states:
		0: Uninitialized
		1: Loading
		2: Loaded
		3: Interactive
		4: Finished 
	*/
	if(http.readyState == 4){ //Finished loading the response
		var response = http.responseText;
		
		oPollResults = new getObj('pollResults');
		oPollCastVote = new getObj('pollCastVote');
		
		if( !oPollResults.obj || !oPollCastVote.style )
			return false;
			
		oPollResults.obj.innerHTML = response;
		oPollCastVote.style.display = 'none';
	}
}

function handleTrivia() {
	/* 
		Make sure that the transaction has finished. The XMLHttpRequest object 
		has a property called readyState with several states:
		0: Uninitialized
		1: Loading
		2: Loaded
		3: Interactive
		4: Finished 
	*/
	if(http.readyState == 4){ // Finished loading the response
		var response = http.responseText;
		
		oTriviaResults = new getObj('triviaResults');
		oTriviaCastVote = new getObj('triviaCastVote');
		
		if( !oTriviaResults.obj || !oTriviaCastVote.style ) 
			return false;
		
		oTriviaResults.obj.innerHTML = response;
		oTriviaCastVote.style.display = 'none';
	}
}
//-------- AJAX END ----------




var MemberDropdown = {
	$panel: null,
	$button: null,
	$buttonParent: null,
	panelCoords: {},
	buttonCoords: {},
	blurTimeout: null,
	typing: false,

	init: function() {
		MemberDropdown.$button = $$('#right ul li.panelButton a')[0];
		MemberDropdown.$panel = $('mDropdownPanel');
		if( !MemberDropdown.$button || !MemberDropdown.$panel ) { return; }

		MemberDropdown.$buttonParent = $(MemberDropdown.$button.parentNode);
		MemberDropdown.buttonCoords = MemberDropdown.$button.getCoordinates();

		MemberDropdown.panelCoords = MemberDropdown.$panel.setStyles({height: 'auto'}).getCoordinates();
		MemberDropdown.$panel.setStyles({
			height: 0,
			top: (MemberDropdown.buttonCoords.top + MemberDropdown.buttonCoords.height - 1) + 'px',
			left: (MemberDropdown.buttonCoords.right - MemberDropdown.panelCoords.width) + 'px'
		});

		MemberDropdown.$button.state = false;
		MemberDropdown.$button.addEvent('click', MemberDropdown.onClick);
	},

	onClick: function(e) {
		e = new Event(e);
		e.stop();
		MemberDropdown.$button.state ? MemberDropdown.close() : MemberDropdown.open();
	},

	open: function() {
		MemberDropdown.$panel.setStyles({
			top: (MemberDropdown.buttonCoords.top + MemberDropdown.buttonCoords.height - 1) + 'px',
			left: (MemberDropdown.buttonCoords.right - MemberDropdown.panelCoords.width) + 'px'
		});
		new Fx.Styles(MemberDropdown.$panel, {
			duration: 300,
//				transition: Fx.Transitions.Expo.easeOut,
			onStart: function() { 
				if( window.ie6 && MemberDropdown.$buttonParent.hasClass('account') ) { MemberDropdown.$buttonParent.addClass('accountOpenIe6'); }
				else { MemberDropdown.$buttonParent.addClass('open'); }
			}
		}).start({
			height: MemberDropdown.panelCoords.height
		});

		MemberDropdown.observeBlur();
		MemberDropdown.$button.state = true;
	},

	close: function() {
		new Fx.Styles(MemberDropdown.$panel, {
			duration: 300,
//				transition: Fx.Transitions.Expo.easeOut,
			onComplete: function() { 
				if( window.ie6 && MemberDropdown.$buttonParent.hasClass('account') ) { MemberDropdown.$buttonParent.removeClass('accountOpenIe6'); }
				else { MemberDropdown.$buttonParent.removeClass('open'); } 
			}
		}).start({
			height: 0
		});

		MemberDropdown.unobserveBlur();
		MemberDropdown.$button.state = false;
	},

	observeBlur: function() {
		$$(MemberDropdown.$button, MemberDropdown.$panel).addEvent('mouseleave', function() {
			if( MemberDropdown.typing ) { return; }
			MemberDropdown.blurTimeout = setTimeout(MemberDropdown.close, 350);
		});

		MemberDropdown.$button.addEvent('mouseenter', MemberDropdown.removeTimeout);
		MemberDropdown.$panel.addEvent('mouseenter', MemberDropdown.removeTimeout);
		MemberDropdown.$panel.getElements('input')
			.addEvent('focus', function() { MemberDropdown.removeTimeout(); MemberDropdown.typing = true; })
			.addEvent('blur', function() { MemberDropdown.removeTimeout(); MemberDropdown.typing = false; });
	},

	unobserveBlur: function() {
		MemberDropdown.$button.removeEvents('mouseleave');
		MemberDropdown.$panel.removeEvents('mouseleave');
		MemberDropdown.$panel.getElements('input').removeEvents(['focus', 'blur']);
		MemberDropdown.blurTimeout = null;
	},

	removeTimeout: function() {
		if( MemberDropdown.blurTimeout ) {
			clearTimeout(MemberDropdown.blurTimeout);
		}
	}
};

var Calendar = Class({
	date: null,
	scrollDate: null,
	classes: {},
	$wrapper: null,
	$cal: null,
	$next: null,
	$prev: null,
	$current: null,
	baseUrl: '',
	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	pos: 0,
	
	initialize: function(options) {
		options = options || {};
		if( $defined(options.year) && $defined(options.month) && $defined(options.day) ) {
			this.date = new Date(options.year, options.month, options.day);
		}
		else {
			this.date = new Date();
		}
		
		this.scrollDate = new Date(this.date.getTime());
		this.scrollDate.setDate(1);
		
		this.baseUrl = options.baseUrl || '';
		this.classes = {
				today: options.todayClass || 'today', 
				blurred: options.blurredClass || 'blurred'
		};
		
		this.$wrapper = $(options.wrapperElementId || 'calWrapper');
		this.$cal = $(options.calendarElementId || 'calMonth');
		this.$prev = $(options.prevHandleElement || 'calPrevMonth');
		this.$next = $(options.nextHandleElement || 'calNextMonth');
		this.$current = $(options.currentMonthElement || 'calCurrentMonth');
		
		if( !this.$wrapper || !this.$cal || !this.$prev || !this.$next || !this.$current ) {
			return false;
		}
		
		this.$cal.addClass('cal_' + this.scrollDate.getFullYear() + '_' + this.scrollDate.getMonth());
		
		this.$next.addEvent('click', this.nextMonth.bind(this));
		this.$prev.addEvent('click', this.prevMonth.bind(this));
	},
	
	nextMonth: function(e) {
		e = new Event(e);
		e.stop();
		
		this.scrollDate.setMonth(this.scrollDate.getMonth() + 1);
		this.updateCurrentMonth();
		if( this.$wrapper.getElement('.cal_' + this.scrollDate.getFullYear() + '_' + this.scrollDate.getMonth()) ) {
			return this.animate('left');
		}
		
		var cal = this.createCalendarArray(this.scrollDate.getFullYear(), this.scrollDate.getMonth());
		var html = this.createHtml(cal);
		html.inject( this.$wrapper.setStyles({width: (this.$wrapper.getCoordinates().width + 145) + 'px'}) );
		this.animate('left');
	},
	
	prevMonth: function(e) {
		e = new Event(e);
		e.stop();

		this.scrollDate.setMonth(this.scrollDate.getMonth() - 1);
		this.updateCurrentMonth();
		if( this.$wrapper.getElement('.cal_' + this.scrollDate.getFullYear() + '_' + this.scrollDate.getMonth()) ) {
			return this.animate('right');
		}
		
		var cal = this.createCalendarArray(this.scrollDate.getFullYear(), this.scrollDate.getMonth());
		var html = this.createHtml(cal);
		this.pos -= 145;
		html.injectTop(this.$wrapper.setStyles({width: (this.$wrapper.getCoordinates().width + 145) + 'px', left: this.pos + 'px'}));
		this.animate('right');
	},
	
	getDayUrl: function(year, month, day) {
		month += 1;
		return this.baseUrl.replace('%year', year)
							.replace('%month', month < 10 ? '0' + month : month)
							.replace('%day', day < 10 ? '0' + day : day);
	},
	
	getMonthUrl: function(year, month) {
		var u = this.getDayUrl(year, month, '');
		return u.substr(0, u.length - 2);
	},
	
	updateCurrentMonth: function() {
		new Fx.Styles(this.$current, {
			duration: 400,
			onComplete: (function() {
				this.$current.setText( this.monthNames[this.scrollDate.getMonth()] + ' ' + this.scrollDate.getFullYear() );
				this.$current.href = this.getMonthUrl(this.scrollDate.getFullYear(), this.scrollDate.getMonth());
				this.$current.title = 'See what\'s happening in Central Park in ' + this.monthNames[this.scrollDate.getMonth()];
				new Fx.Styles(this.$current, {duration: 400}).start({opacity: 1});
			}).bind(this)
		}).start({opacity: 0});
	},
	
	getDaysInMonth: function( year, month ) {
		var d = new Date(year, month, 1);
		d.setMonth(d.getMonth() + 1);
		d.setTime(d.getTime() - 24 * 3600 * 1000);
		return d.getDate();
	},
	
	isToday: function(year, month, day) {
		return (this.date.getFullYear() == year) &&
		(this.date.getMonth() == month) &&
		(this.date.getDate() == day);
	}, 
	
	createCalendarArray: function(year, month) {
		var r = [[], [], [], [], [], []]; //6 by 7 array
		var days = this.getDaysInMonth(year, month);
		var x = new Date(year, month, 1).getDay(), y = 0, day = 1;
		var date = new Date(year, month, 1);
		while( day <= days ) {
			r[y][x] = {
				today: this.isToday(date.getFullYear(), date.getMonth(), day),
				blurred: false,
				text: day,
				url: this.getDayUrl(date.getFullYear(), date.getMonth(), day)
			};

			x = ++x % 7;
			if( 0 == x ) { y++; }
			day++;
		}
		
		date.setMonth(date.getMonth() - 1);
		var prevMonthDay = this.getDaysInMonth(date.getFullYear(), date.getMonth());
		if( !$defined(r[0][0]) ) {
			for(var i = 6; i >= 0; i--) {
				if( !$defined(r[0][i]) ) {
					r[0][i] = {
						today: false,
						blurred: true,
						text: prevMonthDay,
						url: this.getDayUrl(date.getFullYear(), date.getMonth(), prevMonthDay)
					};
					prevMonthDay--;
				}
			}
		}

		date.setMonth(date.getMonth() + 2);
		var nextMonthDay = 1;
		for(i = 4; i <= 5; i++) {
			for(var k = 0; k < 7; k++) {
				if( !$defined(r[i][k]) ) {
					r[i][k] = {
						today: false,
						blurred: true,
						text: nextMonthDay,
						url: this.getDayUrl(date.getFullYear(), date.getMonth(), nextMonthDay)
					};
					nextMonthDay++;
				}
			}
		}
		
		return r;
	},
	
	createHtml: function(calArray) {
		var i, j, data, ul, a, div;
		div = new Element('div', {id: 'calMonth', 'class': 'cal_' + this.scrollDate.getFullYear() + '_' + this.scrollDate.getMonth()});
		
		for(j = 0; j < 6; j++) {
			if( null === calArray[j] ) { continue; } 
			ul = new Element('ul');
			for(i = 0; i < 7; i++) {
				if( $defined(calArray[j][i]) ) {
					data = calArray[j][i]; 
					a = new Element('a', {
							href: data.url, 
							title: 'Click to view events', 
							'class': data.today ? this.classes.today : (data.blurred ? this.classes.blurred : '') 
						}).setText(data.text);
					
					ul.adopt(new Element('li').adopt(a));
				}
				//else { ul.adopt(new Element('li')); }
			}
			div.adopt(ul);
		}
		
		return div;
	},
	
	animate: function( dir ) {
		if( dir == 'left') {
			this.pos -= 145;
		}
		else if( dir == 'right' ) {
			this.pos += 145;
		}
		else { return; }
		new Fx.Styles(this.$wrapper, {duration: 750, transition: Fx.Transitions.Elastic.easeOut}).start({left: this.pos + 'px'});
	}
});


window.addEvent( 'load', function() { 
	MemberDropdown.init(); 
	var $s = $('headerSearch');
	if( $s ) {
		$s.addEvent('focus', function() { if( this.value == 'Search' ) this.value = ''; })
			.addEvent('blur', function() { if( this.value == '' ) this.value = 'Search'; });
	}

	//add effects on the events calendar box
	new Calendar({
		baseUrl: '/events/filter/%year/%month/%day',
		todayClass: 'today',
		blurredClass: 'blurred',
		wrapperElementId: 'calWrapper', 
		calendarElementId: 'calMonth',
		prevHandleElement: $('calPrevMonth'),
		nextHandleElement: $('calNextMonth'),
		currentMonthElement: $('calCurrentMonth')
	}); 
});
