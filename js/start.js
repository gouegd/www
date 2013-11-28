require(['domReady!', 'lodash', 'rsvp', 'api', 'ractive', 'leaflet', 'text!templates/sets.html'],
    function (doc, _, rsvp, api, R, L, t_sets) {
  
  rsvp.on('error', function (event) {
    console.error && console.error('Error in promise');
    console.dir && console.dir(event);
  });

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
    if (!latlon) {
      map.removeLayer(marker);
      return;
    }
    marker = marker ?
      marker.setLatLng(latlon).addTo(map) :
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
      var photoset = _.find(resp.sets.photosets.photoset, function(photoset) {
        return photoset.id === set.id;
      });

      if (photoset) {
        set.img = photoset.primary_photo_extras.url_s;
      }

      var result = RE_LL.exec(set.description);
      if (!result) {
        return;
      }

      var lat = +result[1];
      var lon = +result[2];
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return;
      }
      set.latlon = [lat, lon];
    });

    sets.set({sets: kiwiSets, notEmpty: function(arr){return arr && arr.length;}});

    sets.on('locate', function onLocate(event) {
      var latlon = this.get(event.keypath).latlon;
      moveMap(latlon);
    });

    sets.on('go', function onLocate(event) {
      var latlon = this.get(event.keypath).latlon;
      var zoom = map.getZoom();
      map.setZoomAround(latlon, 9, {animate: true});
    });

    console.dir(sets);

  });

});