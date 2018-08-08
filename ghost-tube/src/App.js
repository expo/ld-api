import React, { Component } from 'react';

import keydown from 'react-keydown';

// import logo from './logo.svg';
// import './App.css';

import games from './games';

class App extends Component {

  componentDidMount() {
    document.addEventListener("keypress", (ke) => {
      console.log(ke);
    });
  }
  render() {
    return (
      <div>
        <div className="App">
          {games.map((g) => {
            return <div>{g.name}</div>;
          })}
        </div>
        <EmbeddedGame game={games[3]} />
      </div>
    );
  }
}

class EmbeddedGame extends React.Component {
  componentDidMount() {
    this.fullscreen();
  }

  render() {
    return (
      <div>
        <iframe
          title={this.props.game.name + ' by ' + this.props.game.author}
          ref="iframe"
          mozallowfullscreen="true"
          allow="autoplay; fullscreen; geolocation; microphone; camera; midi"
          frameborder="0"
          src={this.props.game.embedUrl}
          msallowfullscreen="true"
          scrolling="no"
          allowfullscreen="true"
          webkitallowfullscreen="true"
          id="game_drop"
          allowtransparency="true"
        />
        <button
          onClick={() => {
            this.fullscreen();
          }}
          title="Fullscreen"
        />
      </div>
    );
  }

  fullscreen() {
    // check if fullscreen mode is available
    if (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    ) {
      // which element will be fullscreen
      var iframe = this.refs.iframe;
      // Do fullscreen
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    } else {
      document.querySelector('.error').innerHTML = 'Your browser is not supported';
    }
  }
}

export default App;
