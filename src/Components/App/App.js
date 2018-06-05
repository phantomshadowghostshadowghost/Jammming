import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			SearchResults: [],
			playlistName: 'New playlist',
			playlistTracks: []
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
	}

	addTrack(track) {
		let tracks = this.state.playlistTracks;
		if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
		}
		tracks.push(track);
		this.setState({ playlistTracks: tracks });
	}

	removeTrack(track) {
		this.setState({
			playlistTracks: this.state.playlistTracks.filter((playlistItem) => playlistItem.id !== track.id)
		});
	}

	updatePlaylistName(name) {
		if (this.playlistName !== name) {
			this.setState({ playlistName: name });
		}
	}

	savePlaylist() {
		let trackURIs = this.state.playlistTracks.map((track) => track.uri);
		Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
			this.setState({
				playlistName: 'New playlist',
				searchResults: [],
				playlistTracks: []
			});
		});
	}

	search(term) {
		Spotify.search(term).then((tracks) => {
			this.setState({
				searchResults: tracks
			});
		});
	}

	render() {
		return (
			<div>
				<h1>
					Ja<span className="highlight">mmm</span>ing
				</h1>
				<div className="App">
					<SearchBar onSearch={this.search} />
					<div className="App-playlist">
						<SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
						<Playlist
							playlistName={this.state.playlistName}
							playlistTracks={this.state.playlistTracks}
							onRemove={this.removeTrack}
							onNameChange={this.updatePlaylistName}
							onSave={this.savePlaylist}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
