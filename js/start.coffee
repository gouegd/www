require ['domReady!', 'lodash', 'rsvp', 'api', 'ractive', 'leaflet', 'text!templates/sets.html'],
(doc, _, rsvp, api, R, L, t_sets) ->
  
  # Make errors on promises readable
  rsvp.on 'error', (event) ->
    console.error? 'Error in promise'
    console.dir? event

  RE_LL = /^LL:(-?[\d\.]+),\s?(-?[\d\.]+)/
  NZ_LATLON = [-41.29225, -185.22537]
  NZ_SETNAME = 'New Zealand'

  sets = new R
    el: 'sets'
    template: t_sets

  map = L.map 'map', zoomControl: false
  map.setView NZ_LATLON, 4
  L.tileLayer 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
    attribution: '<a href="http://openstreetmap.org">OSM</a> | <a href="http://cloudmade.com">CloudMade</a>'
    maxZoom: 16
    key: 'de8efc7432d34bb6ae69673b27cf52f3'
    styleId: '114653'
  .addTo map

  marker = null
  moveMap = (latlon) ->
    unless latlon
      map.removeLayer marker
      marker = null
      return
    
    if marker
      marker.setLatLng latlon
    else
      marker = L.circleMarker latlon,
        color: 'red'
        radius: 8
        weight: 1
        fill: false
        opacity: 1
    marker.addTo map
  
  # await
  #   api.getCollections defer jsonCollections
  #   api.getSets defer jsonSets

  rsvp.hash
    collections: api.getCollections()
    sets: api.getSets()
  .then (promises) ->

    kiwiCollection = _.find promises['collections'].collections.collection, (collection) ->
      collection.title is NZ_SETNAME

    kiwiSets = kiwiCollection.set.reverse();

    _.each(kiwiSets, (set) ->
      photoset = _.find promises['sets'].photosets.photoset,
        (photoset) -> photoset.id is set.id

      if photoset
        set.img = photoset.primary_photo_extras.url_s

      result = RE_LL.exec set.description
      unless result
        return

      lat = +result[1]
      lon = +result[2]
      if Number.isNaN lat or Number.isNaN lon
        return

      set.latlon = [lat, lon]
    );

    sets.set
      sets: kiwiSets
      notEmpty: (arr) -> arr?.length

    sets.on 'locate', (event) ->
      latlon = this.get(event.keypath).latlon;
      moveMap latlon

    sets.on 'go', (event) ->
      latlon = this.get(event.keypath).latlon
      zoom = map.getZoom()
      map.setZoomAround latlon, 9, animate: true

    console.dir sets