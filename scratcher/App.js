let url = require('url');

let React = require('react');
let Markdown = require('react-markdown');

let electron = require('electron');
let { shell, screen } = electron;
let primaryDisplay = screen.getPrimaryDisplay();
let dimensions = primaryDisplay.size;

// let Api = require('./Api');

// let itches = require('./itches42b');
let itches;

let { ipcRenderer } = require('electron');

class App extends React.Component {
  state = {
    loading: true,
  };
  _loadDataAsync = async () => {
    let response = await fetch('http://ccheever.com/scratcher/itches42b.json');
    itches = await response.json();
    this.setState({ loading: false });
  };
  componentDidMount() {
    this._loadDataAsync();
  }
  render() {
    if (this.state.loading) {
      return (
        <p
          style={{
            fontFamily: 'RGO-SemiBold',
            fontSize: 48,
          }}>
          Loading data...
        </p>
      );
    } else {
      return <ScratcherApp />;
    }
  }
}

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
          Hit TAB to show/hide instructions and to navigate to other games.
          <br />
          Hit ENTER while the overlay is up to go to another game.
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

class ScratcherApp extends React.Component {
  state = {
    startScreen: true,
    loadingData: true,
    overlayShown: true,
    gameIndex: this._randomGameIndex(),
  };

  _randomGameIndex() {
    // return 626; // Sacculous saga. Link problems
    let x = Math.floor(Math.random() * itches.length);
    console.log('Picked ' + x);
    return x;
  }

  componentDidMount() {
    ipcRenderer.on('ihkeydown', (event, ke) => {
      // if (ke.keycode === 15) {
      //   // console.log('tab down');
      //   this.setState({ overlayShown: true });
      // }
      // console.log('keydown:', ke);
    });
    ipcRenderer.on('ihkeyup', (event, ke) => {
      // if (ke.keycode === 15) {
      //   // console.log('tab up');
      //   this.setState({ overlayShown: false });
      // }
      // console.log('keyup:', ke);
    });

    ipcRenderer.on('ihkeypress', (event, ke) => {
      // console.log('keypress:', ke);
      let switchGamesKeyPressed = false;
      // console.log("keychar=", ke.keychar, ke);
      if (ke.keychar === 13) {
        // console.log('ENTER');
        switchGamesKeyPressed = true;
      }

      if (ke.keychar === 92) {
        switchGamesKeyPressed = true;
      }

      if (ke.keychar === 9) {
        this.setState({ overlayShown: !this.state.overlayShown });
      }
      if (switchGamesKeyPressed && this.state.overlayShown) {
        console.log('Switch games');
        // let gameIndex = (this.state.gameIndex + 1) % games.length;
        let gameIndex = this._randomGameIndex();
        this.setState({ gameIndex });
      }
    });
  }

  render() {
    let go = (game, gameIndex) => {
      console.log('go! to ' + gameIndex);
      this.setState({ gameIndex });
    };
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
              flex: 1,
            }}
          />
        )}
        {this.state.overlayShown && (
          <NextOverlay
            go={go}
            game={game}
            style={{
              fontFamily: 'Sansation-Light',
              position: 'absolute',
              zIndex: 30,
              backgroundColor: 'aliceblue',
              width: 350,
              height: '100%',
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
    return (
      <div style={this.props.style}>
        <RandomNextGameCard key="r1" go={this.props.go} />
        <RandomNextGameCard key="r2" go={this.props.go} />
        <RandomNextGameCard key="r3" go={this.props.go} />
        <RandomNextGameCard key="r4" go={this.props.go} />
      </div>
    );
  }
}

class RandomNextGameCard extends React.Component {
  render() {
    let gameIndex = Math.floor(Math.random() * itches.length);
    let game = itches[gameIndex];
    return <NextGameCard game={game} gameIndex={gameIndex} {...this.props} />;
  }
}

class NextGameCard extends React.Component {
  render() {
    let size = this.props.size || 120;
    return (
      <div
        onClick={() => {
          this.props.go && this.props.go(this.props.game, this.props.gameIndex);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <img
          src={this.props.game.coverImage}
          height={size}
          width={size}
          style={{
            height: size,
            width: size,
          }}
        />
        <h4>{this.props.game.name}</h4>
        <h5>by {this.props.game.itchUsername}</h5>
      </div>
    );
  }
}

class HTMLComment extends React.Component {
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    ReactDOM.unmountComponentAtNode(el);
    el.outerHTML = this.createComment();
  }

  createComment() {
    let text = this.props.text;

    if (this.props.trim) {
      text = text.trim();
    }

    return `<!-- ${text} -->`;
  }

  render() {
    return <div />;
  }
}

class MarkdownImage extends React.Component {
  render() {
    return (
      <img
        style={{
          maxWidth: '85%',
          margin: 10,
        }}
        src={this.props.src}
        alt={this.props.alt}
      />
    );
  }
}

class MarkdownLink extends React.Component {
  render() {
    return (
      <a
        href={this.props.href}
        onClick={(e) => {
          shell.openExternal(this.props.href);
          e.preventDefault();
          return true;
        }}
        {...this.props}
      />
    );
  }
}

class InstructionsOverlay extends React.Component {
  render() {
    let ldUrl = 'https://ldjam.com/events/ludum-dare/42/' + this.props.game.ld.slug;
    return (
      <div
        style={Object.assign({}, this.props.style, {
          fontFamily: 'Sansation-Light',
          width: '35%',
          height: '100%',
          padding: 10,
        })}>
        <HTMLComment text={JSON.stringify(this.props.game)} />
        <h1>{this.props.game.name}</h1>
        <p>
          <MarkdownLink href={ldUrl}>{ldUrl}</MarkdownLink>
        </p>
        <p>
          <MarkdownLink href={this.props.game.itchUrl}>{this.props.game.itchUrl}</MarkdownLink>
        </p>
        <h3>by {this.props.game.itchUsername}</h3>
        <img
          src={this.props.game.coverImage}
          height={200}
          width={200}
          style={{
            height: 200,
            width: 200,
          }}
        />
        <Markdown
          source={this.props.game.instructionsMarkdown}
          renderers={{
            image: MarkdownImage,
            link: MarkdownLink,
          }}
          transformImageUri={(uri) => {
            if (!uri) {
              return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';
            }
            let imageUrl = url.resolve('https://static.jam.vg', uri.replace(/^\/+/, '/'));
            // console.log({
            //   imageUrl,
            //   itchUrl: this.props.game.itchUrl,
            //   uri,
            // });
            return imageUrl;
          }}
          transformLinkUri={(uri) => {
            return url.resolve(this.props.game.itchUrl || '', uri || '');
          }}
        />
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._iframeRef = React.createRef();
  }
  componentDidMount() {
    console.log('gameIframe', this._iframeRef);
    window._gameIframe = this._iframeRef.current;
    // this._resizeCanvas();
    window._gameComponent = this;
    window._gameIframe.contentDocument.addEventListener('DOMContentLoaded', () => {
      console.log('content loaded?');
      // this._resizeCanvas();
    });
  }

  _resizeCanvas() {
    let win = this._iframeRef.current.contentWindow;
    let winHeight = dimensions.height; // win.innerHeight;
    let winWidth = dimensions.width; // win.innerWidth;
    let doc = this._iframeRef.current.contentDocument;
    let canvasElements = doc.getElementsByTagName('canvas');
    console.log('canvasElements', canvasElements);
    if (canvasElements.length > 0) {
      let ce = canvasElements[0];
      ce.parentElement.removeChild(ce);
      doc.body.appendChild(ce);
      ce.style.position = 'absolute';
      ce.style.top = '0px';
      ce.style.left = '0px';
      ce.style.width = '100%';
      ce.style.height = '100%';
      doc.body.style.margin = '0px 0px 0px 0px';
      doc.body.style.padding = '0px 0px 0px 0px';
    }
  }

  render() {
    if (this.props.active) {
      console.log('active = ' + this.props.game.name);
    }
    return (
      <iframe
        ref={this._iframeRef}
        style={{
          ...this.props.style,
          zIndex: 1 + 5 * this.props.active,
          display: this.props.active ? 'block' : 'none',
        }}
        title={this.props.game.name + ' by ' + this.props.game.itchUsername}
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
