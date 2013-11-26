require(['domReady!', 'lodash', 'rsvp', 'api', 'ractive', 'leaflet', 'text!templates/sets.html'],
    function (doc, _, rsvp, api, R, L, t_sets) {
  
  var RE_LL = /^LL:(-?[\d\.]+),\s?(-?[\d\.]+)/;
  var NZ_LATLON = [-41.29225, -185.22537];
  var NZ_SETNAME = 'New Zealand';

  var sets = new R({
    el: 'sets',
    template: t_sets
  });

  var map = L.map('map');
  map.setView(NZ_LATLON, 4);
  L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
    attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 16,
    key: 'de8efc7432d34bb6ae69673b27cf52f3',
    styleId: '114653'
  }).addTo(map);
  var marker;

  var moveMap = function moveMap(latlon) {
    marker = marker ?
      marker.setLatLng(latlon) :
      L.circleMarker(latlon, {
        color: 'red',
        radius: 8,
        weight: 1,
        fill: false,
        opacity: 1
      }).addTo(map);
  };

  rsvp.hash({
    cols: api.getCollections(),
    sets: api.getSets()
  }).then(function onData(resp) {
    console.dir(resp);
    var kiwiCollection = _.find(resp.cols.collections.collection, function(collection){
      return collection.title === NZ_SETNAME;
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
      set.hasGPS = true;

      console.log(latlon);
    });

    sets.set({sets: kiwiSets});

    sets.on('locate', function onLocate(event) {
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