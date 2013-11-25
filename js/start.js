require(['domReady!', 'lodash', 'api', 'ractive', 'leaflet', 'text!templates/sets.html'],
    function (doc, _, api, R, L, t_sets) {
  
  var RE_LL = /^LL:(-?[\d\.]+),(-?[\d\.]+)/;

  var sets = new R({
    el: 'sets',
    template: t_sets
  });

  var map = L.map('map');
  L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
    attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 16,
    key: 'de8efc7432d34bb6ae69673b27cf52f3',
    styleId: '114653'
  }).addTo(map);

  var moveMap = function moveMap (latlon) {
    map.setView(latlon, 6, {animate: true});
    var circle = L.circleMarker(latlon, {
      color: 'red'
    }).addTo(map);
  };

  api.getSets().then(function (resp) {
    console.dir(resp);
    var kiwiCollection = _.find(resp.collections.collection, function(collection){
      return collection.title === 'New Zealand';
    });

    var kiwiSets = kiwiCollection.set;

    _.each(kiwiSets, function (set) {
      var result = RE_LL.exec(set.description);
      if (!result) {
        return;
      }

      var lat = +result[1];
      var lon = +result[2];
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return;
      }

      var latlon = set.latlon = [lat, lon];

      console.log(latlon);
    });

    sets.set({sets: kiwiSets});

    sets.on('locate', function (event) {
      // `this` is the ractive
      // `event` contains information about the proxy event
      var id = event.node.getAttribute('data-setid');
      var sets = this.get('sets');
      var setToLocate = _.find(sets, function(set) {
        return set.id === id;
      });

      if (!setToLocate || !setToLocate.latlon) {
        return;
      }

      moveMap(setToLocate.latlon);
    });

  });

});