/* City map: draws one numbered pin per city; clicking a pin opens that city's page. */
(function () {
  function pinIcon(k, active) {
    var size = Math.round(22 + Math.min(k, 10) * 1.4);
    return L.divIcon({
      className: '',
      html: '<span class="pin' + (active ? ' pin-active' : '') + '" style="width:' + size + 'px;height:' + size + 'px">' + k + '</span>',
      iconSize: [size, size], iconAnchor: [size / 2, size / 2]
    });
  }
  window.drawCityMap = function (el, cities, opts) {
    opts = opts || {};
    var map = L.map(el, { scrollWheelZoom: false, zoomSnap: 0.25 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var pts = [];
    cities.forEach(function (c) {
      var active = opts.active === c.s;
      var m = L.marker([c.lat, c.lon], { icon: pinIcon(c.k, active), title: c.n, keyboard: true,
                                         zIndexOffset: active ? 1000 : c.k * 10 }).addTo(map);
      m.bindTooltip('<b>' + c.n + ', WI</b><br>' + c.k + (c.k === 1 ? ' company' : ' companies'),
                    { direction: 'top', offset: [0, -14], permanent: active });
      m.on('click', function () { window.location.href = opts.base + c.s + '.html'; });
      pts.push([c.lat, c.lon]);
    });
    (opts.extra || []).forEach(function (p) {
      L.circleMarker([p.lat, p.lon], { radius: 5, color: '#16191d', weight: 2, fillColor: '#fff', fillOpacity: 1 })
        .bindTooltip(p.label, { direction: 'right', offset: [8, 0] }).addTo(map);
      if (opts.to) L.polyline([[p.lat, p.lon], [opts.to.lat, opts.to.lon]],
                              { color: '#c98600', weight: 2, dashArray: '4 6', opacity: .8 }).addTo(map);
      pts.push([p.lat, p.lon]);
    });
    if (opts.center) map.setView(opts.center, opts.zoom || 11);
    else map.fitBounds(pts, { padding: [44, 44] });
    return map;
  };
})();
