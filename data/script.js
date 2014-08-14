var App = angular.module('App', []);


App.controller('TwitterCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {

  $scope.parsing = true;

  $http.jsonp('tweets.jsonp?callback=JSON_CALLBACK')
    .success(function(data){

            var tweets = [];

            for (var i=0; i<data.length; i++) {

                var tweet_id;
                var tweet_author_login;
                var tweet_text;
                var tweet_type;
                var urls_to_be_changed;

                if (data[i].retweeted_status) {
                    tweet_id = data[i].retweeted_status.id_str;
                    tweet_text = data[i].retweeted_status.text;
                    tweet_author_login = data[i].retweeted_status.user.screen_name;
                    urls_to_be_changed = data[i].entities.urls;
                } else {
                    tweet_id = data[i].id_str;
                    tweet_text = data[i].text;
                    tweet_author_login = data[i].user.screen_name;
                    urls_to_be_changed = data[i].entities.urls;
                }

                for (var j=0; j<urls_to_be_changed.length; j++) {
                    tweet_text = tweet_text.replace(
                        urls_to_be_changed[j].url,
                        "<a class='link' href='"
                        + urls_to_be_changed[j].expanded_url
                        + "'>"
                        + urls_to_be_changed[j].display_url
                        + "</a>"
                    );
                }

                tweet_text = $sce.trustAsHtml(tweet_text);

                tweets.push({
                    text : tweet_text,
                    id : tweet_id,
                    login : tweet_author_login,
                });

            }

            $scope.tweets = tweets;
            $scope.parsing = false;
        });
}]);
