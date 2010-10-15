var weekday = ["الأحد","الأثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
var months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function myFlags( obj, options )
{
	var str = '';

	for ( var i in options.countries )
	{
		if ( i == options.defaultCountry )
		{
			setDefaultCountry( obj, options );
		}
		str+= '<li rel="' + i + '"><div class="flag_' + i + '">' + options.countries[i].name + '</div></li>';
	}

	return str;
}
function myDate( obj, country )
{
	var d = new Date();
	localTime = d.getTime();
	localOffset = d.getTimezoneOffset() * 60000;
	utc = localTime + localOffset;
	d = new Date( utc + ( 3600000 * country.timeZone ) );

	date = weekday[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
	time = ( d.getHours() % 12 || 12 ) + ':' + (( d.getMinutes() < 10 ? '0' : '') + d.getMinutes() ) + ' ' + ( d.getHours() < 12 ? 'ص' : 'م' );
	obj.find('.mtoolbar-time .mdate').text( date );
	obj.find('.mtoolbar-time .mtime').text( time );
}
function weather( obj, options )
{
code = options.countries[options.defaultCountry].code;
url = 'http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location%3D%22'+options.countries[options.defaultCountry].code+'%22%20%20and%20u%3D%22c%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';

jQuery.ajax({
    url: url,
    type: 'get',
    dataType: 'jsonp',
    contentType: "text/html",
    success: function(data){
      item = data.query.results.channel.item;

      obj.find('.weatherNow').text( item.condition.temp + '°' ).attr('class', '').addClass('weatherNow weather-icon weather' + item.condition.code);
      
      var d = new Date();
  
      var str = '';
      for ( var row in item.forecast )
      {
        str+= '<li><b>' + weekday[d.getDay()] + '</b>';
        str+= '<span class="weather-icon weather' + item.forecast[row].code + '" title="' + item.forecast[row].text + '">' + item.forecast[row].high + '°</span>';
        str+= '<span class="weather-icon weather' + item.forecast[row].code + '" title="' + item.forecast[row].text + '">' + item.forecast[row].low + '°</span></li>';
        d.setDate(d.getDate()+1);
      }
      obj.find('.mtoolbar-weather ul').html( str );

    }
});

}
function myPray( obj, options )
{

	// get the default country
	var country = options.countries[options.defaultCountry];

	//define the configration
	prayTime.setCalcMethod(  isNaN(country.prayMethod) ? options.prayMethod : country.prayMethod );
	prayTime.setTimeFormat( prayTime.Time12 );
	prayTime.timeNames[0] = 'صلاة الفجر';
	prayTime.timeNames[1] = 'شروق الشمس';
	prayTime.timeNames[2] = 'صلاة الظهر';
	prayTime.timeNames[3] = 'صلاة العصر';
	prayTime.timeNames[4] = 'غروب الشمس';
	prayTime.timeNames[5] = 'صلاة المغرب';
	prayTime.timeNames[6] = 'صلاة العشاء';


	var date = new Date();
	var times = prayTime.getPrayerTimes(date, country.latitude, country.longitude, country.timeZone);

	if ( prayTime.nextPray === 1 || prayTime.nextPray === 4)//if Sunrise or Sunset display zuhr or magreb
	{
		prayTime.nextPray++;
	}

	obj.find('.mtoolbar-prayTimes li b').text( prayTime.timeNames[prayTime.nextPray] );
	obj.find('.mtoolbar-prayTimes li span').text( times[prayTime.nextPray] );

	var str = '';

	for(var i = 0; i < times.length; i++)
	{
		//if ( i == 1 || i == 4) //don't show Sunrise and Sunset
			//continue;

		str += '<li class="pray' + i + '"><b>' + prayTime.timeNames[i] + '</b>';
		str += '<span>'+ times[i] + '</span></li>';
	}

	obj.find('.mtoolbar-prayTimes-sub').html( str );

	return str;
}

function setDefaultCountry( obj, options )
{
	var country = options.countries[options.defaultCountry];

	obj.find('.mtoolbar-country li .current').attr('class', '').addClass( 'current flag_' + options.defaultCountry ).text( country.name );
	obj.find('.mtoolbar-weather .capitalName').text( country.capital );

	if ( options.useTime === true )
	{
		myDate( obj, country );
	}

	if ( options.usePray === true )
	{
		myPray( obj, options );
	}

	if ( options.useWeather === true )
	{
		weather( obj, options );
	}
}

(function($){
	$.fn.mtoolbar = function(options) {

	var defaults = {
					useLinks	: true,
					useTime		: true,
					usePray		: true,
					useWeather	: true,
					useCountry	: true,
					countries	: {
						'ae': {name: 'الأمارات',		capital: 'أبو ظبي',	longitude: 54.36, latitude: 24.46, timeZone: 4, code: 'AEXX0001'},
						'bh': {name: 'البحرين',		capital: 'المنامة',	longitude: 50.58, latitude: 26.21, timeZone: 3, code: 'BAXX0001'},
						'dj': {name: 'جيبوتي',		capital: 'جيبوتي',	longitude: 43.16, latitude: 11.60, timeZone: 3, code: 'DJXX0001'},
						'dz': {name: 'الجزائر',		capital: 'الجزائر',	longitude:  5.05, latitude: 36.28, timeZone: 1, code: 'AGXX0001'},
						'eg': {name: 'مصر',			capital: 'القاهرة',	longitude: 31.39, latitude: 30.12, timeZone: 2, code: 'EGXX0004', prayMethod: 5},
						'iq': {name: 'العراق',		capital: 'بغداد',	longitude: 44.43, latitude: 33.33, timeZone: 3, code: 'IZXX0008'},
						'jo': {name: 'الأردن',		capital: 'عمان',	longitude: 35.93, latitude: 31.94, timeZone: 2, code: 'JOXX0002'},
						//'km': {name: 'جزر القمر',	capital: 'موروني',	longitude: 43.20, latitude:-11.75, timeZone: 3, code: 'CNXX0003'},
						'kw': {name: 'الكويت',		capital: 'الكويت',	longitude: 47.97, latitude: 29.36, timeZone: 3, code: 'KUXX0003'},
						'lb': {name: 'لبنان',		capital: 'بيروت',	longitude: 35.53, latitude: 52.39, timeZone: 2, code: 'LEXX0003'},
						'ly': {name: 'ليبيا',		capital: 'طرابلس',	longitude: 13.18, latitude: 32.90, timeZone: 2, code: 'LYXX0009'},
						'ma': {name: 'المغرب',		capital: 'الرباط',	longitude: -6.83, latitude: 34.03, timeZone: 0, code: 'MOXX0007'},
						'mr': {name: 'موريتانيا',	capital: 'نواكشوط',	longitude:-15.95, latitude: 18.10, timeZone: 0, code: 'MRXX0004'},
						'om': {name: 'عمان',		capital: 'مسقط',	longitude: 58.54, latitude: 23.61, timeZone: 4, code: 'MUXX0003'},
						'ps': {name: 'فلسطين',		capital: 'القدس',	longitude: 35.21, latitude: 31.78, timeZone: 3, code: 'ISXX0010'},
						'qa': {name: 'قطر',			capital: 'الدوحة',	longitude: 51.53, latitude: 25.28, timeZone: 3, code: 'QAXX0003'},
						'sa': {name: 'السعودية',	capital: 'الرياض',	longitude: 46.71, latitude: 24.63, timeZone: 3, code: 'SAXX0017'},
						'sd': {name: 'السودان',		capital: 'الخرطوم',	longitude: 32.53, latitude: 15.63, timeZone: 3, code: 'SUXX0002'},
						'so': {name: 'الصومال',		capital: 'مقديشيو',	longitude: 45.35, latitude:  2.03, timeZone: 3, code: 'SOXX0002'},
						'sy': {name: 'سوريا',		capital: 'دمشق',	longitude: 36.27, latitude: 33.51, timeZone: 2, code: 'SYXX0004'},
						'tn': {name: 'تونس',		capital: 'تونس',	longitude: 10.17, latitude: 36.80, timeZone: 1, code: 'TSXX0010'},
						'ye': {name: 'اليمن',		capital: 'صنعاء',	longitude: 44.20, latitude: 15.40, timeZone: 3, code: 'YMXX0005'}
					},
					defaultCountry: 'eg',
					/*
					 * 0 : Ithna Ashari
					 * 1 : University of Islamic Sciences, Karachi
					 * 2 : Islamic Society of North America (ISNA)
					 * 3 : Muslim World League (MWL)
					 * 4 : Umm al-Qura, Makkah
					 * 5 : Egyptian General Authority of Survey
					 * 6 : Custom Setting
					 * 7 : Institute of Geophysics, University of Tehran
					 */
					prayMethod	: 4
	};

	options = $.extend(defaults, options);

	return this.each(function() {
		
		if ( $.browser.msie === true && $.browser.version < 7 )
		{
			$(this).hide();
			return ;
		}
		obj = $(this);

		// drobdown menus
	    $("ul.mtbarDropdown li").hover(function(){
	        
	        $(this).addClass("hover");
	        $('ul:first',this).css('visibility', 'visible');
	    
	    }, function(){
	    
	        $(this).removeClass("hover");
	        $('ul:first',this).css('visibility', 'hidden');
	    
	    });
	    $("ul.mtbarDropdown li ul li:has(ul)").addClass('has-a-child');

			if ( options.useCountry === true )
			{
				obj.find('.mtoolbar-flags').html( myFlags( obj, options ) );

				$('.mtoolbar-flags li').live( 'click', function () {

					//TODO: save contry by cookie
					options.defaultCountry  = $(this).attr('rel');
					obj.find('.mtoolbar-flags').css('visibility', 'hidden');
					setDefaultCountry( obj, options );

				});
			}

		});
	};
})(jQuery);
