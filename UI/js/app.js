var App = (function () { 

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
					resolve(data);
				},
				error: function () {
					reject("API error");	
				}
			});
		});
	}

	var renderFbLike = function (fbObj) {
		if (typeof fbObj.facebook.data[0] !== 'undefined') { //check if data was fetched
			$('.fb-likes').remove(); // clear in case results are already given
			var strToRender = '<div class="fb-likes">' + fbObj.facebook.data[0].like_count + '<br>likes </div>'
			$( ".result-box" ).append(strToRender);
		}
		else {
			alert('No data was found');
		}
	}

	var GetSocialCount = function(provider, pageurl, callback) {		
		var socialDataObj = {};
		getSocailData(provider, pageurl).then(function(socialData) {
			socialDataObj[provider] = socialData;
			callback(socialDataObj);
		}).catch(function (error) {
			alert(error);
		});			
	}

	return {
		GetSocialCount: GetSocialCount,
		renderFbLike: renderFbLike
	};
}) ();

$( document ).ready(function() {
	$('#btn').on('click', function () { //binds click on 'send' buttons and triggers the function
		var val = $('#in').val();
		App.GetSocialCount("facebook", val, App.renderFbLike);
	});    
});