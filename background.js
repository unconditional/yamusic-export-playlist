'use strict';

const urlRegex = /^https:\/\/music.yandex.ru\/users\/(.*)\/playlists\/(\d+)/;
var xhr = new XMLHttpRequest();

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
    
    // ...check the URL of the active tab against our pattern and...
    if (urlRegex.test(tab.url)) {

        var match = tab.url.match(urlRegex);
        var owner = match[1];
        var playlist_id = match[2];

        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'https://music.yandex.ru/handlers/playlist.jsx?owner='+owner+'&kinds='+playlist_id, false);
        xhr.send();
        
        var playlist_obj = JSON.parse(xhr.responseText);
        var rows = [];
        var playlist_name = playlist_obj.playlist.title || 'playlist';
        
        console.log("Got playlist of %d tracks", playlist_obj.playlist.tracks.length);
        
        playlist_obj.playlist.tracks.forEach(function(item, index, arr) {
            var artist = item.artists[0].name;
            var title = item.title;
            
            if (item.hasOwnProperty('matchedTrack')) {
                artist = item.matchedTrack.artists[0].name;
                title = item.matchedTrack.title;
            }
            rows.push(artist + " - " + title);
        });
        
        var fileContent = "data:text/plain;charset=utf-8," + rows.join("\r\n")
        var encodedUri = encodeURI(fileContent);
        
        var link = document.createElement('a');
        link.download = playlist_name;
        link.href = encodedUri;
        link.click();
    }
})
