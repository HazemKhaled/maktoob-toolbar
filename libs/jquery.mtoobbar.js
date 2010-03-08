(function($){
	$.fn.mtoolbar = function(options) {

	var defaults = {
					useLinks	: true,
					useTime		: true,
					usePray		: true,
					useWeather	: true,
					countries	: {
					         	   	'egy': {name: 'مصر', longitude: 31.21, latitude: 30.2, timeZone: 3, prayMethod: 5},
									'uae': {name: 'الأمارات', longitude: 55.20, latitude: 25.18, timeZone: 2},
									'ksa': {name: 'السعودية', longitude: 44.20, latitude: 27.18, timeZone: 2}
					},
					defaultCountry: 'egy',
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

	var options = $.extend(defaults, options);

	return this.each(function() {
		obj = $(this);

			if ( options.useTime == true )// Time
			{
				$(this).find('.mtoolbar-time').html( myDate() );
			}

			if ( options.usePray == true )
			{
				$(this).find('.mtoolbar-prayTimes').html( myPray( options ) );
			}

		});
	};
})(jQuery);

function myDate()
{
	
	var weekday = new Array(7);
	weekday[0] = "الأحد";
	weekday[1] = "الأثنين";
	weekday[2] = "الثلاثاء";
	weekday[3] = "الأربعاء";
	weekday[4] = "الخميس";
	weekday[5] = "الجمعة";
	weekday[6] = "السبت";
	
	var months = new Array(12);
	months[0] = 'يناير';
	months[1] = 'فبراير';
	months[2] = 'مارس';
	months[3] = 'أبريل';
	months[4] = 'مايو';
	months[5] = 'يونيو';
	months[6] = 'يوليو';
	months[7] = 'أغسطس';
	months[8] = 'سبتمبر';
	months[9] = 'أكتوبر';
	months[10] = 'نوفمبر';
	months[11] = 'ديسمبر';
	
	var d = new Date();
	
	return weekday[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function myPray( opt )
{
	//define the configration
	prayTime.setCalcMethod( opt.prayMethod );
	prayTime.setTimeFormat( prayTime.Time12 );
	prayTime.timeNames[0] = 'صلاة الفجر';
	prayTime.timeNames[1] = 'شروق الشمس';
	prayTime.timeNames[2] = 'صلاة الظهر';
	prayTime.timeNames[3] = 'صلاة العصر';
	prayTime.timeNames[4] = 'غروب الشمس';
	prayTime.timeNames[5] = 'صلاة المغرب';
	prayTime.timeNames[6] = 'صلاة العشاء';
	
	// get the default country
	var contry = opt.countries[opt.defaultCountry];


	var date = new Date();
	var times = prayTime.getPrayerTimes(date, contry.latitude, contry.longitude, contry.timeZone);

	var str = '';
	
	for(var i = 0; i < times.length; i++)
	{
		str += '<li><b>'+ prayTime.timeNames[i]+ '</b>';
		str += '<span>'+ times[i]+ '</span></li>';
	}//TODO: scroll to next pray

	return str;
}