var FirstEx = (function () { 
	var getSocailData = function(socialNetowrk, url) {

		return new Promise(function(resolve, reject){
			var apiStr;

			switch (socialNetowrk.toLowerCase()) {

				case 'facebook':
					apiStr = 'https://graph.facebook.com/fql?q=select%20%20like_count,share_count,comment_count%20from%20link_stat%20where%20url="' + url + '"';
				break;

				case 'linkedin':
					apiStr = 'http://www.linkedin.com/countserv/count/share?url=' + url + '&callback=?';
				break;
			}

			$.ajax({
				dataType: "json",
				url: apiStr,
				success: function (data){	
					resolve(data); //fetches data from the API. Note that facebook data is stored in an array called 'data'
				},
				error: function () {
					reject("API error");	
				}
			});
		});
	}

	var GetSocialCount = function(provider, pageurl, callback) { // output of this function will be an object in a format of object.provider.URL.data
		var socialDataObj = {};
		getSocailData(provider, pageurl).then(function(socialData) {
			socialDataObj[provider] = socialData;
			callback(socialDataObj);
		}).catch(function (error) {
			console.log(error);
		});			
	}

	return {GetSocialCount: GetSocialCount};
}) ();

var SecondEx = (function () { 
	var getSocailDataArray = function(socialNetowrk, urlArr) {

		return new Promise(function(resolve, reject){
			var pageObj = {};

			for (var i = 0; i < urlArr.length; i++) {				
				var apiStr;

				switch (socialNetowrk.toLowerCase()) {
					case 'facebook':
						apiStr = 'https://graph.facebook.com/fql?q=select%20%20like_count,share_count,comment_count%20from%20link_stat%20where%20url="' + urlArr[i] + '"';
					break;

					case 'linkedin':
						apiStr = 'http://www.linkedin.com/countserv/count/share?url=' + urlArr[i] + '&callback=?';
					break;
				}
				(function(i) { // AJAX call inside a loop requires a function wrap
					$.ajax({
						dataType: "json",
				        url: apiStr,
				        success: function (data){	
				        	pageObj[urlArr[i]] = data;
						},
						error: function () {
							reject("API error");	
						}
					});
				})(i);	
			}
			resolve(pageObj);	
		} );
	}

    var GetSocialCount = function(provider, pageurl, callback) { // output of this function will be an object in a format of object.provider.URLs.data
		var socialDataObj = {};	
		getSocailDataArray(provider, pageurl).then(function(socialData) {
			socialDataObj[provider] = provider;
			console.log(socialData);
			socialDataObj[provider] = socialData;
			callback(socialDataObj);
		}).catch(function (error) {
			console.log(error);
		});
	}

	return {GetSocialCount: GetSocialCount};
})();

var ThirdEx = (function () { 
	var getSocailDataArrays = function(socialNetowrk, urlArr) {

		return new Promise(function(resolve, reject){
			var pageObj = {};

			for (var i = 0; i < socialNetowrk.length; i++) {
				pageObj[socialNetowrk[i]] = {};

				for (var j = 0; j < urlArr.length; j++) {	
					var apiStr;
					var socialData;
					var snName = socialNetowrk[i]; //saved the social network name in order to pass it to inner function

					switch (socialNetowrk[i].toLowerCase()) {

						case 'facebook':
							apiStr = 'https://graph.facebook.com/fql?q=select%20%20like_count,share_count,comment_count%20from%20link_stat%20where%20url="' + urlArr[j] + '"';
						break;

						case 'linkedin':
							apiStr = 'http://www.linkedin.com/countserv/count/share?url=' + urlArr[j] + '&callback=?';
						break;
					}					
					(function(j,snName) {
						$.ajax({
							dataType: "json",
					        url: apiStr,
					        success: function (data){	
					        	pageObj[snName][urlArr[j]] = data;
							},
							error:function () {
								reject("API error");	
							}
						});
					})(j,snName);	
				}
			}	
			resolve(pageObj);	
		} );
	}

	var GetSocialCount = function(provider, pageurl, callback) { // output of this function will be an object in a format of object.providers.URLs.data
		var socialDataObj = {};	
		getSocailDataArrays(provider, pageurl).then(function(socialData) {
			callback(socialData);
		}).catch(function (error) {
			console.log(error);
		});		
	}

	return { GetSocialCount:GetSocialCount };
})();