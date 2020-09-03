var points = [[52.560069, 13.309797],
              [53.011165, 11.640379],
              [53.558045, 9.998084],
              [52.458608, 5.524312],
              [52.320055, 4.779994], 
              [52.077740, 4.311036],
              [50.848447, 4.350446],
              [50.899377, 4.457018],
             ];
var next = [[50.899377, 4.457018], [49.618016, 6.188661], [48.859821, 2.336384], [49.024639, 2.524955]];
var map = L.map('map-container').setView(points[0], 5);

L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

L.polyline(points, {
    color: 'black'
}).addTo(map);

L.polyline(next, {
    color: 'black',
    dashArray: '9'
}).addTo(map);

L.marker([52.560069, 13.309797]).bindPopup("<b>Start</b>").openPopup().addTo(map);
L.marker([53.011165, 11.640379]).bindPopup("<b>Leg 1 (<a href='https://www.twitch.tv/videos/723267146'>Video</a>)</b>").openPopup().addTo(map);
L.marker([52.320055, 4.779994]).bindPopup("<b>Leg 2 (<a href='https://www.twitch.tv/videos/725063939'>Video</a>)</b>").openPopup().addTo(map);
L.marker([50.899377, 4.457018]).bindPopup("<b>Leg 3 (<a href='https://www.twitch.tv/videos/729190127'>Video</a>)</b>").openPopup().addTo(map);
