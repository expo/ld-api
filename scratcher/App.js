let React = require('react');
let Markdown = require('react-markdown');

let itches = require('./itches');

let { ipcRenderer } = require('electron');

class Intro extends React.Component {
  advance() {
    this.props.advance && this.props.advance();
  }

  componentDidMount() {
    this._advance = () => {
      this.advance();
    };
    document.addEventListener('keypress', (event, kp) => {
      console.log('keypress', event, kp);
    });
    document.addEventListener('keypress', this._advance);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this._advance);
  }

  render() {
    return (
      <div
        onClick={() => {
          this._advance();
        }}
        style={{
          display: 'flex',
          flex: 1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <img
          src="./assets/ghost-gamer-logo.png"
          height="350"
          width="350"
          style={{
            height: 350,
            width: 350,
          }}
        />

        <p
          style={{
            fontFamily: 'RGO-SemiBold',
            fontSize: 48,
          }}>
          SCRATCHER
        </p>
        <p
          style={{
            fontFamily: 'Sansation-Light',
            fontSize: 30,
            padding: 15,
          }}>
          Hit TAB to show instructions and to navigate to other games.
          <br />
          Hit ENTER while holding tab to go to the next game.
          <br />
        </p>
        <p
          style={{
            fontFamily: 'RGO-Regular',
            fontSize: 30,
          }}>
          Press any key or click to start
        </p>
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    startScreen: true,
    overlayShown: false,
    gameIndex: this._randomGameIndex(),
  };

  _randomGameIndex() {
    let x = Math.floor(Math.random() * itches.length);
    console.log('Picked ' + x);
    return x;
  }

  componentDidMount() {
    ipcRenderer.on('ihkeydown', (event, ke) => {
      if (ke.keycode === 15) {
        // console.log('tab down');
        this.setState({ overlayShown: true });
      }
      // console.log('keydown:', ke);
    });
    ipcRenderer.on('ihkeyup', (event, ke) => {
      if (ke.keycode === 15) {
        // console.log('tab up');
        this.setState({ overlayShown: false });
      }
      // console.log('keyup:', ke);
    });
    ipcRenderer.on('ihkeypress', (event, ke) => {
      // console.log('keypress:', ke);
      if (ke.keychar === 13) {
        // console.log('ENTER');
      }
      if (ke.keychar === 13 && this.state.overlayShown) {
        console.log('Switch games');
        // let gameIndex = (this.state.gameIndex + 1) % games.length;
        let gameIndex = this._randomGameIndex();
        this.setState({ gameIndex });
      }
    });
  }

  render() {
    if (this.state.startScreen) {
      return (
        <Intro
          advance={() => {
            this.setState({ startScreen: false });
          }}
        />
      );
    }
    let gameIndex = this.state.gameIndex;
    // let game = games[gameIndex];
    let game = itches[gameIndex];
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
        {/* {games.map((game, gameIndex) => ( */}
        <Game
          key={'gameIndex-' + gameIndex}
          active={gameIndex === this.state.gameIndex}
          style={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
          }}
          game={game}
        />
        {/* ))} */}
        {this.state.overlayShown && (
          <InstructionsOverlay
            game={game}
            style={{
              position: 'absolute',
              zIndex: 20,
              backgroundColor: 'orange',
              top: 0,
              left: 0,
            }}
          />
        )}
        {this.state.overlayShown && (
          <NextOverlay
            game={game}
            style={{
              fontFamily: 'Sansation-Light',
              position: 'absolute',
              zIndex: 30,
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
    return (
      <div
        style={Object.assign({}, this.props.style, {
          fontFamily: 'Sansation-Light',
          width: '35%',
          height: '100%',
          padding: 10,
        })}>
        <h1>{this.props.game.name}</h1>
        <h3>by {this.props.game.itchUsername}</h3>
        <Markdown source={this.props.game.instructionsMarkdown} />
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    if (this.props.active) {
      console.log('active = ' + this.props.game.name);
    }
    return (
      <iframe
        style={{
          ...this.props.style,
          zIndex: 1 + 5 * this.props.active,
          display: this.props.active ? 'block' : 'none',
        }}
        title={this.props.game.name + ' by ' + this.props.game.itchUsername}
        ref="iframe"
        mozallowfullscreen="true"
        // allow="autoplay; fullscreen; geolocation; microphone; camera; midi"
        frameBorder="0"
        src={'https:' + this.props.game.itchEmbedUrl}
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
