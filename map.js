/* City map: one numbered pin per city. Clicking a pin (or a city in the list) opens a box
   listing the companies that serve it, with links to their profiles further down this page. */
(function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pinIcon(k) {
    var size = Math.round(22 + Math.min(k, 10) * 1.4);
    return L.divIcon({ className: '', html: '<span class="pin" style="width:' + size + 'px;height:' + size + 'px">' + k + '</span>',
                       iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
  }
  function popupHtml(c) {
    var rows = c.co.map(function (b) {
      return '<li><a class="pp-name" href="#' + b.a + '">' + esc(b.n) + '</a>' +
             '<span class="pp-meta">' + (b.b === c.n ? 'Local' : 'Based in ' + esc(b.b)) +
             (b.p ? ' · <a href="tel:' + b.t + '">' + esc(b.p) + '</a>' : '') + '</span></li>';
    }).join('');
    return '<div class="pp"><p class="pp-city">' + esc(c.n) + ', WI</p><p class="pp-count">' + c.k +
           (c.k === 1 ? ' company serves this city' : ' companies serve this city') + '</p><ol>' + rows + '</ol></div>';
  }
  window.drawCityMap = function (el, cities) {
    var map = L.map(el, { scrollWheelZoom: false, zoomSnap: 0.25 });
    map.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18, attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    var markers = {}, pts = [];
    cities.forEach(function (c) {
      var m = L.marker([c.lat, c.lon], { icon: pinIcon(c.k), title: c.n, keyboard: true, zIndexOffset: c.k * 10 }).addTo(map);
      m.bindTooltip('<b>' + esc(c.n) + ', WI</b><br>' + c.k + (c.k === 1 ? ' company' : ' companies'), { direction: 'top', offset: [0, -14] });
      m.bindPopup(popupHtml(c), { maxWidth: 300, minWidth: 240, autoPanPadding: [24, 24] });
      m.on('popupopen', function () { m.closeTooltip(); });
      markers[c.s] = m; pts.push([c.lat, c.lon]);
    });
    map.fitBounds(pts, { padding: [44, 44] });
    document.querySelectorAll('[data-city]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = markers[btn.getAttribute('data-city')];
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        map.setView(m.getLatLng(), Math.max(map.getZoom(), 11));
        m.openPopup();
      });
    });
    return map;
  };
})();
