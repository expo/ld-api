let React = require('react');

let games = require('./games');

let { ipcRenderer } = require('electron');

class App extends React.Component {
  state = {
    overlayShown: false,
  };

  componentDidMount() {
    ipcRenderer.on('ihkeydown', (event, ke) => {
      if (ke.keycode === 15) {
        // console.log('tab down');
        this.setState({overlayShown: true});
      }
      // console.log('keydown:', ke);
    });
    ipcRenderer.on('ihkeyup', (event, ke) => {
      if (ke.keycode === 15) {
        // console.log('tab up');
        this.setState({overlayShown: false});
      }
      // console.log('keyup:', ke);
    });
  }

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 0,
        }}>
        <Game
          style={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
          }}
          game={games[4]}
        />
        {this.state.overlayShown && (
          <InstructionsOverlay
            style={{
              position: 'absolute',
              zIndex: 2,
              backgroundColor: 'orange',
              width: 250,
              height: 500,
              top: 0,
              left: 0,
            }}
          />
        )}
        {this.state.overlayShown && (
          <NextOverlay
            style={{
              position: 'absolute',
              zIndex: 3,
              backgroundColor: 'aliceblue',
              width: 300,
              height: 600,
              top: 0,
              right: 0,
            }}
          />
        )}
      </div>
    );
  }
}

class NextOverlay extends React.Component {
  render() {
    return <div style={this.props.style}>This is where you choose what to play next</div>;
  }
}

class InstructionsOverlay extends React.Component {
  render() {
    return <div style={this.props.style}>These are some instructions</div>;
  }
}

class Game extends React.Component {
  render() {
    return (
      <iframe
        style={this.props.style}
        title={this.props.game.name + ' by ' + this.props.game.author}
        ref="iframe"
        mozallowfullscreen="true"
        // allow="autoplay; fullscreen; geolocation; microphone; camera; midi"
        frameBorder="0"
        src={'https:' + this.props.game.embedUrl}
        msallowfullscreen="true"
        scrolling="no"
        allowFullScreen="true"
        webkitallowfullscreen="true"
        id="game_drop"
        allowtransparency="true"
      />
    );
  }
}

window._App = <App />;
module.exports = App;
