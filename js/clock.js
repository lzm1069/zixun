var Clock = {
  running : false,
  id : false,
  diff : 0,
  
  months : [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
    
  init : function( y, m, d, h, min, s ) {
    if( Clock.running ) {
      clearTimeout(Clock.id);
    }
    
    Clock.running = false;
    var server = new Date( y, m, d, h, min, s );
    var client = new Date();
    Clock.diff = client - server;
    Clock.run();
  },
  
  run : function() {
    var clockValue = '';

    var now = new Date();
    now.setTime( now.getTime() - Clock.diff );
    
    var month = Clock.months[ now.getMonth() ];
    var day = now.getDate();
    switch ( day % 10 ) {
      case 1:
        var dayTh = day + 'st';
        break;

      case 2:
        var dayTh = day + 'nd';
        break;

      case 3:
        var dayTh = day + 'rd';
        break;

      default:
        var dayTh = day + 'th';
    }

    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    
    var ampm = '';
    if( hours > 12 ) {
      ampm = ' PM';
      hours -= 12;
    }
    else {
      ampm = ' AM';
    }
    
    clockValue += month + ' ' + dayTh + ', ' + now.getFullYear() + ' ' + hours + ':';
    clockValue += ( minutes < 10 ? '0' : '' ) + minutes + ampm;
    
    try {
      $('weather_clock').setHTML(clockValue);
    } catch(e) {}

    Clock.running = true;
    Clock.id = setTimeout( 'Clock.run()', 1000 );
  }
}


