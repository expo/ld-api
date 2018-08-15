let typedError = require('./typedError');

let PRODUCTION_API_BASE_URL = 'https://expo-pound-random.app.render.com';

let _AsyncStorage = {};
let AsyncStorage = {
  mergeItem: async (key, value) => {
    _AsyncStorage[key] = Object.assign({}, _AsyncStorage[key], value);
  },
  setItem: async (key, value) => {
    _AsyncStorage[key] = value;
  },
  getItem: async (key) => {
    return _AsyncStorage[key];
  },
};

function clientError(code, message, props) {
  let err = new Error(message);
  err.type = 'CLIENT_ERROR';
  err.code = code;
  err.props = props;
  return err;
}

class Api {
  constructor(context) {
    this.context = context;
  }

  async setSessionAsync(session) {
    let userId = session.userId;
    if (!userId) {
      throw new Error('No userId associated with session', { session });
    }

    let x = {};
    x[userId] = session;
    try {
      await AsyncStorage.mergeItem('sessions', JSON.stringify(x));
    } catch (e) {
      // If this barfs for some other reason than there being not-a-JSON-object under "sessions",
      // then this could logout people, but we can deal with that later.
      // The fix is to verify that the error is because the data can't be merged, not bc of
      // an intermittent failure or something
      await AsyncStorage.setItem('sessions', JSON.stringify(x));
    }
    await AsyncStorage.setItem('userId', JSON.stringify(userId));

    return session;
  }

  async getAllSessionsAsync() {
    try {
      return JSON.parse(await AsyncStorage.getItem('sessions'));
    } catch (e) {
      return {};
    }
  }

  async getSessionAsync() {
    let userId = null;
    let sessions = {};
    try {
      userId = JSON.parse(await AsyncStorage.getItem('userId'));
    } catch (e) {
      console.warn('Trouble fetching userId from AsyncStorage');
    }

    try {
      sessions = JSON.parse(await AsyncStorage.getItem('sessions'));
    } catch (e) {
      console.warn('Trouble fetching sessions from AsyncStorage');
    }

    let s = null;
    if (sessions) {
      s = sessions[userId];
    }
    return s;
  }

  async getUserIdAsync() {
    // Get this from the session rather than from AsyncStorage because its only
    // valid if there's a session for it
    let s = await this.getSessionAsync();
    if (s) {
      return s.userId;
    }
  };

  async selectUserAsync(userId) {
    await AsyncStorage.setItem('userId', JSON.stringify(userId));
  };
}

let api = new Api();

api.getBaseUrlAsync = () => {
  return PRODUCTION_API_BASE_URL;
};

Object.assign(api, {
  PRODUCTION_API_BASE_URL,
});

module.exports = api;
