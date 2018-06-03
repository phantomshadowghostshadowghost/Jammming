
let accessToken = null
const clientId ='01c010bd40af4bd8bae96e662488dc9d'
const redirectURI = 'http://lamido.surge.sh/';
let expires_in;
let userId;


let Spotify = {
    getAccessToken() {
      const checkAccessToken = window.location.href.match(/access_token=([^&]*)/);
      if(accessToken){
        return accessToken;
      }else if (checkAccessToken) {
        accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
        expires_in = window.location.href.match(/expires_in=([^&]*)/)[1];
        window.setTimeout(() => accessToken = '', expires_in * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

    }
    
  },

    search(term) {

      return fetch(
          `https://api.spotify.com/v1/search?type=track&q=${term}`,
          {
            headers: { Authorization: `Bearer ${this.getAccessToken()}`, 
            'Content-Type': 'application/json' },
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
      }).then(jsonResponse => {
        if (jsonResponse) {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri,
              
            }
          });
         
        }else{
          return [];
        }
      });
    },
  
    savePlaylist(playlistName, tracks) {
      if (playlistName && tracks.length > 0) {
        return fetch(
          'https://api.spotify.com/v1/me',
          {
            headers: { Authorization: `Bearer ${this.getAccessToken()}`, 
            'Content-Type': 'application/json' },
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
      }).then(jsonResponse => {
        userId = jsonResponse;}
      ).then(()=>{
        return fetch(
            `https://api.spotify.com/v1/users/${userId.id}/playlists`, 
            {
              headers: { Authorization: `Bearer ${this.getAccessToken()}`, 
              'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
        }).then(jsonResponse => {
          
          return fetch(`https://api.spotify.com/v1/users/${userId.id}/playlists/${jsonResponse.id}/tracks`, {
            headers: { 'Authorization': `Bearer ${this.getAccessToken()}`, 
            'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({uris: tracks})
          }).then(response => {
            if(response.ok) {
              return response.json();
            }
          })
        });
      });
      }else{
       return;

      } 
    }
  };
  
  export default Spotify;
    
    
    
    
    