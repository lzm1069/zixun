function readCookie(name)
{
  var cookieValue = "";
  var search = name + "=";
  if(document.cookie.length > 0)
  { 
    offset = document.cookie.indexOf(search);
    if (offset != -1)
    { 
      offset += search.length;
      end = document.cookie.indexOf(";", offset);
      if (end == -1) end = document.cookie.length;
      cookieValue = unescape(document.cookie.substring(offset, end))
    }
  }
  return cookieValue;
}


function makeCookie(name, value, days){
	var when = new Date();
	when.setTime(when.getTime() + days * 24 * 60 * 60 * 1000);
	when.setFullYear(when.getFullYear() + 1);
	document.cookie=escape(name)+"="+escape(value)+";expires="+when.toGMTString()+";path="+_globalPathIndex;
}


function checkBoxes() {
	oBoxesStatus = new Array();
	oBoxesNames = new Array();

	oBoxesNames[0] = 'sub1'; //member login or account
	oBoxesNames[1] = 'sub2'; //calendar
	oBoxesNames[2] = 'sub3'; //newsletter
	oBoxesNames[3] = 'sub8'; //news
	oBoxesNames[4] = 'sub7'; //weather (edit)
	oBoxesNames[5] = 'sub5'; //inner
	oBoxesNames[6] = 'sub4'; //red box
	oBoxesNames[7] = 'sub6'; //photorated
	oBoxesNames[8] = 'sub11'; //poll
	oBoxesNames[9] = 'sub12'; //trivia
	
	oBoxesStatus[0] = null; //member login or account
	oBoxesStatus[1] = null; //calendar
	oBoxesStatus[2] = null; //newsletter
	oBoxesStatus[3] = null; //news
	oBoxesStatus[4] = null; //weather (edit)
	oBoxesStatus[5] = null; //inner or photorated
	oBoxesStatus[6] = null; //report a bug
	oBoxesStatus[7] = null; //report a bug
	oBoxesStatus[8] = null; //poll
	oBoxesStatus[9] = null; //trivia

	for(i = 0; i < oBoxesNames.length; i++) {
		oObj = new getObj(oBoxesNames[i]);
		
		if ( !oObj.obj ) {
			oBoxesStatus[i] = null;
		}
		else {
			oBoxesStatus[i] = ( oObj.style.display == 'block' ) ? 1 : 0;
		}
	}
	
	return oBoxesStatus.toString();
}


function adjustBoxes() {
		str = checkBoxes();
		makeCookie('boxes', str, 1);
}


function client_data(info) {
	if (info == 'width') {
		width = (screen.width) ? screen.width : '';
		height = (screen.height) ? screen.height : '';
		width_height_html = width + " x " +	height + " pixels";
		if(width && height) 
			return width_height_html;
	}
	else if (info == 'js' ) {
		return 'JavaScript enabled';
	}
	else if (info == 'cookies') {
		if ( readCookie('boxes') )
				return 'Cookies enabled';
		else
			return 'Cookies disabled';
	}
}
