var Core = {
	calendarSetup: ['', '', ''],
	
	init : function() {
		Panels.init();
		Core.content.init();
		MemberDropdown.init();
		
		var $s = $('headerSearch');
		if( $s ) {
			$s.addEvent('focus', function() { if( this.value == 'Search' ) this.value = ''; })
				.addEvent('blur', function() { if( this.value == '' ) this.value = 'Search'; });
		}
		
		//add effects on the events calendar box
		var d = new Date();
		new Calendar({
			baseUrl: '/events/filter/%year/%month/%day',
			todayClass: 'today',
			blurredClass: 'blurred',
			wrapperElementId: 'calWrapper', 
			calendarElementId: 'calMonth',
			prevHandleElement: $('calPrevMonth'),
			nextHandleElement: $('calNextMonth'),
			currentMonthElement: $('calCurrentMonth'),
			year: Core.calendarSetup[0] || d.getFullYear(),
			month: Core.calendarSetup[1] ? Core.calendarSetup[1] - 1 : d.getMonth(),
			day: Core.calendarSetup[2] || d.getDate()
		}); 
	},
	
	initCalendar: function(mysqlDate) {
		this.calendarSetup = mysqlDate.split('-');
		if( this.calendarSetup.length != 3 ) {
			this.calendarSetup = ['', '', ''];
		}
	},
	
	content : {
		origSize : null,
		offset : 20,
		
		init : function() {
			Core.content.origSize = $('mCenter').getSize().size.y;
			Core.content.resize();
		},
		
		resize : function() {
			var leftH = $('mLeft').getSize().size.y;
			var rightH = $('mRight').getSize().size.y;
			var centerH = $('mCenter').getSize().size.y;
			
			var maxH = Math.max( leftH, rightH ) + Core.content.offset;
			var main = $$('div#mCenter div.main')[0];
			
			var tH = $$('div#mCenter div.top')[0].getSize().size.y;
			var bH = $$('div#mCenter div.bottom')[0].getSize().size.y;

			if( maxH <= Core.content.origSize ) {
				if( centerH > Core.content.origSize )  {
					main.style.height = (Core.content.origSize - bH - tH) + 'px';
					return 1; 
				}
			}
			else {
				main.style.height = (maxH - bH - tH) + 'px';
				return 2;
			}
			return false;
		}
	},
	
	socialize: function(a, b) {
		var r = new Ajax('/xmlrpc/socialize.php', { method: 'get' });
		r.request('url=' + a + '&target=' + b);
	},
	
	clock: function(time) {
		var bits = time.split(',');
		if( Clock && Clock.init ) { Clock.init(bits[0], bits[1], bits[2], bits[3], bits[4], bits[5]); }
	},
	
	bookmark: function(title, url) {
		if( document.all ) {
			window.external.AddFavorite(url, title);
		}
		else if( window.sidebar ) {
			window.sidebar.addPanel(title, url, '');
		}
	},
	
	//TODO - once the flash map is replaced with google maps, this should be deleted
	insertMap: function( id ) {
		if( !swfobject ) { return; }
		var flashvars = {
				zoomifyHotspotsXML: '/swf/map.hotspots.php?lid=' + id, 
				zoomifyImagePath: '/usr/maps/park_1/', 
				zoomifyImagePath2: '/usr/maps/park_2/', 
				zoomifyX: '1050', 
				zoomifyY: '2000', 
				zoomifyZoom: '16.5'
		};
		var params = { menu: 'false', wmode: 'transparent', allowFullScreen: 'false', bgcolor: '#000' };
		swfobject.embedSWF('/swf/cp_base.swf', 'map', '400px', '500px', '9.0.45', '/swf/expressInstall.swf', flashvars, params);
	}
};

var Homepage = {
	init: function() {
		if( !swfobject ) { return; }
		var flashvars = {extXML: '/swf/plane.config.php', path: ''};
		var params = { menu: 'false', wmode: 'transparent', allowFullScreen: 'false' };
		var src = $($('cHeaderFlash').parentNode).hasClass('winter') ? '/swf/header.plane.winter.swf' : '/swf/header.plane.swf';
		swfobject.embedSWF(src, 'cHeaderFlash', '800px', '170px', '9.0.45', '/swf/expressInstall.swf', flashvars, params);
		
		var $email = $('newsletterPanelEmail');
		if( $email ) {
			var defaultValue = $email.value;
			$email.addEvent('focus', function() { if( this.value == defaultValue ) this.value = ''; })
					.addEvent('blur', function() { if( this.value == '' ) this.value = defaultValue; })
		}
	}
};

var Panels = {
	names : [	'sub1', 'sub2', 'sub3', 'sub8', 'sub7', 'sub5', 'sub4', 'sub6', 'sub11', 'sub12', 'sub13' ],
	statuses : [],
	
	init : function() {
		Panels.names.each( 
			function( n ) { 
				Panels.statuses[ Panels.statuses.length ] = null; 
			} 
		);
		
		$$('img.btnOpenClose').each(
			function( img ) {
				img.addEvent( 'click', Panels.toggle );
			}
		);
	},
	
	toggle : function( e ) {
		var e = new Event(e);
		var img = e.target;
		var id = img.id.replace('img', '');
		var foot = $( 'foot' + id );
		var sub = $( 'sub' + id );

		if( sub ) {
			sub.style.display = sub.style.display == 'none' ? 'block' : 'none';
		}
		if( img ) {
			img.src = img.src.indexOf( 'minus' ) >= 0 ? img.src.replace( 'minus', 'plus' ) : img.src.replace( 'plus', 'minus' );
		}
		if( foot ) {
			foot.style.display = foot.style.display == 'none' ? 'block' : 'none';
		}

		Cookie.set( 'boxes', Panels.storeState(), {duration: 1} );
		Core.content.resize();
			
	},
	
	storeState : function() {
		cnt = 0;
		Panels.names.each( 
			function( n ) { 
				n = $(n);
				if( !n ) {
					Panels.statuses[cnt] = null;
				}
				else {
					Panels.statuses[cnt] = (n.style.display == 'block') ? 1 : 0;
				}
				cnt++;
			} 
		);

		return Panels.statuses.toString();
	}
};

Element.extend({
	hide: function() {
		return this.setStyle('display', 'none');
	},
	show: function() {
		return this.setStyle('display', '');
	},
	toggle: function() {
		return (this.style.display == 'none') ? this.show() : this.hide();
	},
	
	setMaxLength: function(limit, event) {
		if( !$defined(limit) ) { return true; }
		if( this.nodeName.toLowerCase() != 'textarea' ) { return true; }
		
		event = new Event(event);
		if( !$defined(event) ) { return true; }

		if( event.alt || event.meta || event.control || event.shift ) {
			return true;
		}

		switch( event.key ) {
			case 'up':
			case 'down':
			case 'left':
			case 'right': 
			case 'backspace':
			case 'delete': 
			case 'esc':
				return true;
		}
		
		return this.value.length < limit; 
	},
	
	bindWithCounter: function( el, limit, event ) {
		if( !$defined(el) ) { return; }
		if( this.nodeName.toLowerCase() != 'textarea' ) { return true; }

		el.readonly = 'readonly';
		var ret = this.setMaxLength(limit, event);
		
		if( ret ) {
			this.addEvent('keyup', (function() {var v = limit - this.value.length; el.value = v < 0 ? 0 : v;}).bind(this));
		}
		
		return ret;
	}
});

var Registry = {
	Set: function(namespace, value) {
		if( Registry.Has(namespace) ) { return null; }
		
		Registry[namespace] = value;
		return value;
	},
	
	Get: function(namespace) {
		return $defined(Registry[namespace]) ? Registry[namespace] : null;
	},
	
	Has: function(namespace) {
		return $defined(Registry[namespace]);
	}
};

var Events = {
	onMouseOver: function(e) {
		if( !e ) return;
		$(e).addClass('hover');
	},
	
	onMouseOut: function(e) {
		if( !e ) return;
		$(e).removeClass('hover');
	},
	
	quickSearchOpener: function(e) {
		var q = $(e.parentNode).getElement('.quickSearch');
		if( q.hidden ) {
			new Fx.Styles(q, {duration: 500}).start({height: 0});
			q.hidden = false;
		}
		else {
			new Fx.Styles(q, {duration: 500}).start({height: 25});
			q.hidden = true;
		}
		 
		return false;
	},
	
	quickSearch: function(e) {
		if( !e.action || !e.q || !e.q.value ) { return true; }
		var q = e.q.value.toLowerCase().replace(/[^a-z0-9]+/g, '+').replace(/^\+/g, '').replace(/\+$/g, '');
		var ds, de = '';
		if( e.evDateStart && e.evDateStart.value ) {
			var	ds = e.evDateStart.value;
		}
		if( e.evDateEnd && e.evDateEnd.value && ds ) {
			var	de = e.evDateEnd.value;
		}
		
		document.location = e.action + '?q=' + q + (ds ? '&ds=' + ds : '') + (de ? '&de=' + de : '');

		return false;
	},
	
	validateReminderDate: function( form ) {
		$(form).getElements('div.flash_error').each(function(e) { e.remove(); });
		if( form['delete'] && form['delete'].value == 'delete' ) { return true; }
		
		if( !form.date.value ) { 
			new Element('div', {'class': 'flash_error'}).setText('Please pick a date for your reminder').injectTop( $(form) );
			return false; 
		}

		var rd = new Date(form.date.value), now = new Date();
		now.setHours(0); now.setMinutes(0); now.setSeconds(0);
		
		if( rd <= now ) {
			new Element('div', {'class': 'flash_error'}).setText('Please pick a date that is in the future').injectTop( $(form) );
			return false;
		}
		
		return true;
	},
	
	deleteReminder: function( form ) {
		$(form).adopt( new Element('input', {type: 'hidden', value: 'delete', 'name': 'delete'}) );
		$(form).submit();
		return false;
	}
};

var MemberDropdown = {
	$panel: null,
	$button: null,
	$buttonParent: null,
	panelCoords: {},
	buttonCoords: {},
	blurTimeout: null,
	typing: false,

	init: function() {
		MemberDropdown.$button = $$('#cHeader ul li.panelButton a')[0];
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
//			transition: Fx.Transitions.Expo.easeOut,
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
//			transition: Fx.Transitions.Expo.easeOut,
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
		var d = new Date();
		return (d.getFullYear() == year) &&
				(d.getMonth() == month) &&
				(d.getDate() == day);
	}, 
	
	createCalendarArray: function(year, month) {
		var r = [[], [], [], [], [], []]; //6 by 7 array
		var days = this.getDaysInMonth(year, month);
		var x = new Date(year, month, 1).getDay(), y = 0, day = 1;
		var date = new Date(year, month, 1);

		//run current month
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
		
		//fill with previous month
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

		//fill with next month
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

window.addEvent( 'load', Core.init );
