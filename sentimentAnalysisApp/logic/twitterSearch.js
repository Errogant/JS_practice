//includes
var util = require('util'),
	twitter = require('twitter'),
	sentimetAnalysis = require('./sentimentAnalysis'),
	db = require('diskdb');

db = db.connect('db', ['sentiments']);
//config
var config = {
  consumer_key: 't98HH1JSk806cU6MknVfOCPUU',
  consumer_secret: '2OIcmMzmvL7WLuVfRKoV16ZwlCn0BizEOkin7aUOHO7wRwWeFC',
  access_token_key: '992097384271368192-429SHdKzdqnmrGx67bO5wYnzGBnnAtg',
  access_token_secret: 'iYwcPHiKb5BgzfZtTRkfOplJQ3bVrnQSBmJwYqJII60Dx'
};

module.exports = function(text, callback) {
	var twitterClient = new twitter(config);
	var response = [], dbData = []; //to store the tweets and sentiment
	
	twitterClient.search(text, function(data) {
		for (var i = 0; i < data.statuses.length; i++) {
			var resp = {};

			resp.tweet = data.statuses[i];
			resp.sentiment = sentimetAnalysis(data.statuses[i].text);
			dbData.push({
				tweet: resp.tweet.text,
				score: resp.sentiment.score
			});
			response.push(resp);
		};
		db.sentiments.save(dbData);
		callback(response);
	});
}