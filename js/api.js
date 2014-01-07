define(['reqwest'], function(reqwest) {
  
  var reqwestFlickrJson = function(cb, params){
    var promise = reqwest({
        url: 'http://api.flickr.com/services/rest/'
      , type: 'jsonp'
      , jsonpCallbackName: 'jsonFlickrApi'
      , data: _.extend(params, {
          api_key: '1eee600a4243513b3894294794e44169',
          user_id: '61601734@N00',
          format: 'json'
        })
    });
    if (cb) {
      promise = promise.then(cb);
    }

    return promise;
  };

  return {

    getTags: function(cb){
      return reqwestFlickrJson(cb, {
        method: 'flickr.tags.getListUser'
      });
    },

    getCollections: function(cb){
      return reqwestFlickrJson(cb, {
        method: 'flickr.collections.getTree',
        collection_id: '6556115-72157635171144622'
      });
    },

    getSets: function(cb){
      return reqwestFlickrJson(cb, {
        method: 'flickr.photosets.getList',
        primary_photo_extras: 'url_s'
      });
    }
  }

});