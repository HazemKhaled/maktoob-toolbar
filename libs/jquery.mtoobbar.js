(function($){
	$.fn.mtoolbar = function(options) {

	var defaults = {
					useLinks	: true,
					useTime		: true,
					usePray		: true,
					useWeather	: true,
					useCountry	: true,
					countries	: {
					         	   	'eg': {name: 'مصر',			capital: 'القاهرة',	longitude: 31.36, latitude: 30.05, timeZone: 2, prayMethod: 5},
									'ae': {name: 'الأمارات',		capital: 'أبو ظبي',	longitude: 54.36, latitude: 24.46, timeZone: 4},
									'sa': {name: 'السعودية',	capital: 'الرياض',	longitude: 46.71, latitude: 24.63, timeZone: 3},
									'jo': {name: 'الأردن',		capital: 'عمان',	longitude: 35.93, latitude: 31.94, timeZone: 2},
									'ye': {name: 'اليمن',		capital: 'صنعاء',	longitude: 44.20, latitude: 15.40, timeZone: 3},
									'om': {name: 'عمان',		capital: 'مسقط',	longitude: 58.54, latitude: 23.61, timeZone: 4},
									'qa': {name: 'قطر',			capital: 'الدوحة',	longitude: 51.53, latitude: 25.28, timeZone: 3},
									'bh': {name: 'البحرين',		capital: 'المنامة',	longitude: 50.58, latitude: 26.21, timeZone: 3},
									'kw': {name: 'الكويت',		capital: 'الكويت',	longitude: 47.97, latitude: 29.36, timeZone: 3},
									'iq': {name: 'العراق',		capital: 'بغداد',	longitude: 44.43, latitude: 33.33, timeZone: 3},
									'sy': {name: 'سوريا',		capital: 'دمشق',	longitude: 36.27, latitude: 33.51, timeZone: 2},
									'lb': {name: 'لبنان',		capital: 'بيروت',	longitude: 35.53, latitude: 52.39, timeZone: 2},
									'ps': {name: 'فلسطين',		capital: 'القدس',	longitude: 35.21, latitude: 31.78, timeZone: 3},
									'ly': {name: 'ليبيا',		capital: 'طرابلس',	longitude: 13.18, latitude: 32.90, timeZone: 2},
									'dz': {name: 'الجزائر',		capital: 'الجزائر',	longitude:  5.05, latitude: 36.28, timeZone: 1},
									'ma': {name: 'المغرب',		capital: 'الرباط',	longitude: -6.83, latitude: 34.03, timeZone: 0},
									'tn': {name: 'تونس',		capital: 'تونس',	longitude: 10.17, latitude: 36.80, timeZone: 1},
									'mr': {name: 'موريتانيا',	capital: 'نواكشوط',	longitude:-15.95, latitude: 18.10, timeZone: 0},
									'sd': {name: 'السودان',		capital: 'الخرطوم',	longitude: 32.53, latitude: 15.63, timeZone: 3},
									'so': {name: 'الصومال',		capital: 'مقديشيو',	longitude: 45.35, latitude:  2.03, timeZone: 3},
									'km': {name: 'جزر القمر',	capital: 'موروني',	longitude: 43.20, latitude:-11.75, timeZone: 3},
									'dj': {name: 'جيبوتي',		capital: 'جيبوتي',	longitude: 43.16, latitude: 11.60, timeZone: 3}
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

	var options = $.extend(defaults, options);

	return this.each(function() {
		obj = $(this);

			if ( options.useCountry == true )
			{
				obj.find('.mtoolbar-flags').html( myFlags( obj, options ) );

				// flags menu
				obj.find('.mtoolbar-country').hover( function () {
					obj.find('.mtoolbar-flags').css(
							{top: obj.find('.mtoolbar-country').position()['top'] + obj.height(), left: obj.find('.mtoolbar-country').position()['left']}
					).slideDown(300);
				}, function () {
					obj.find('.mtoolbar-flags').slideUp(300);
				} );
				

				$('.mtoolbar-flags li').live( 'click', function () {

					//TODO: save contry by cookie
					options.defaultCountry  = $(this).attr('rel');
					obj.find('.mtoolbar-flags').slideUp(300);
					setDefaultCountry( obj, options );
					
				});
			}

		});
	};
})(jQuery);

function myDate( obj, country )
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
	localTime = d.getTime();
	localOffset = d.getTimezoneOffset() * 60000;
	utc = localTime + localOffset;
	d = new Date( utc + ( 3600000 * country.timeZone ) );
	
	date = weekday[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
	time = ( d.getHours() % 12 || 12 ) + ':' + (( d.getMinutes() < 10 ? '0' : '') + d.getMinutes() ) + ' ' + ( d.getHours() < 12 ? 'ص' : 'م' );
	obj.find('.mtoolbar-time').text( date ).attr( 'title', time );
}

function myPray( options )
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

	var str = '';
	
	for(var i = 0; i < times.length; i++)
	{
		str += '<li><b>' + prayTime.timeNames[i] + '</b>';
		str += '<span>'+ times[i] + '</span></li>';
	}//TODO: scroll to next pray

	return str;
}
function myFlags( obj, options )
{
	var str = '';
	
	for ( var i in options.countries )
	{
		if ( i == options.defaultCountry )
		{
			setDefaultCountry( obj, options );
		}
		str+= '<li class="flag_' + i + '" rel="' + i + '">' + options.countries[i].name + '</li>';
	}
	
	return str;
}
function setDefaultCountry( obj, options )
{
	var country = options.countries[options.defaultCountry];
	
	obj.find('.mtoolbar-country').addClass( 'flag_' + options.defaultCountry ).find('span').text( country.name );
	obj.find('.mtoolbar-weather .capitalName').text( country.capital );

	if ( options.useTime == true )
	{
		myDate( obj, country );
	}

	if ( options.usePray == true )
	{
		obj.find('.mtoolbar-prayTimes').html( myPray( options ) );
	}
}