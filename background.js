'use strict';

let urlRegex = /^https:\/\/music.yandex.ru\/users\/(.*)\/playlists\/(\d+)/;
let xhr = new XMLHttpRequest();

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
	
    // ...check the URL of the active tab against our pattern and...
    if (urlRegex.test(tab.url)) {

    		var match = tab.url.match(urlRegex);
    		var owner = match[1];
    		var playlist_id = match[2];

    		var xhr = new XMLHttpRequest();
    		xhr.open("GET", 'https://music.yandex.ru/handlers/playlist.jsx?owner='+owner+'&kinds='+playlist_id, false); //false is async
    		xhr.send();
    		
    		let playlist_obj = JSON.parse(xhr.responseText);
    		let i = 0;
    		let rows = [];
    		let playlist_name = 'playlist';
    		rows.push(['title', 'artist', 'album']);
    		playlist_obj.playlist.tracks.forEach(function(item) {
    			rows.push([item.title.replace(/"/g, '\"'), item.artists[0].name, item.albums[0].title]);
    		});
    		
    		for (let x in rows)
    		{
    			playlist_name = x == 0 ? 'playlist' : playlist_obj.playlist.title;
    			rows[x].push(playlist_name);
    			
    			rows[x].forEach(function(item, i)
    			{
    				rows[x][i] = '"'+item.replace(/"/g, '""')+'"';
    			});
    		}
    		
    		let csvContent = "data:text/csv;charset=utf-8,";
    		rows.forEach(function(rowArray, index)
    		{
    		   let row = rowArray.join(",");
    		   csvContent += row+"\r\n";
    		}); 

    		var encodedUri = encodeURI(csvContent);
    		window.open(encodedUri);
    }
})
