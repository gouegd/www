require(['domReady!', 'lodash', 'api', 'ractive', 'text!templates/tags.html'],
    function(doc, _, api, R, t_tags) {
  
  var tags = new R({
    el: 'tags',
    template: t_tags
  });

  api.getTags().then(function (resp) {
    var allTags = _.map(resp.who.tags.tag, function(tag){
      return {name: tag._content};
    });
    tags.set({tags: allTags});
  });

});