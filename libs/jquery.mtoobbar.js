(function($){
	$.fn.mtoolbar = function(options) {

		var defaults = {
						useLinks	: true,
						useTime		: true,
						usePray		: true,
						useWeather	: true,
						countries	: {
										egy: {name: 'Egypt', longitude: 31.21, latitude: 30.2, timeZone: 3},
										uae: {name: 'United Arab Emarats', longitude: 55.20, latitude: 25.18, timeZone: 2}
						},
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
				//here we will start
			});
		};
})(jQuery);