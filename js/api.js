define(['reqwest'], function(reqwest) {
  
  return {

    getTags: function() {
      return reqwest({
        url: 'http://api.flickr.com/services/rest/?method=flickr.tags.getListUser&api_key=1eee600a4243513b3894294794e44169&user_id=61601734%40N00&format=json'
      , type: 'jsonp'
      , jsonpCallbackName: 'jsonFlickrApi'
      });
    }
  }


});