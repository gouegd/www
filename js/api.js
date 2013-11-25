define(['reqwest'], function(reqwest) {
  
  var reqwestFlickrJson = function(params){
    return reqwest({
        url: 'http://api.flickr.com/services/rest/'
      , type: 'jsonp'
      , jsonpCallbackName: 'jsonFlickrApi'
      , data: _.extend(params, {
          api_key: '1eee600a4243513b3894294794e44169',
          user_id: '61601734@N00',
          format: 'json'
        })
      });
  };

  return {

    getTags: function(){
      return reqwestFlickrJson({
        method: 'flickr.tags.getListUser'
      });
    },

    getSets: function(){
      return reqwestFlickrJson({
        method: 'flickr.collections.getTree',
        collection_id: '6556115-72157635171144622'
      });
    }
  }

});