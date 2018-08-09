// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// iohooks since we don't want to rely on focus or whatever
let iohook = require('iohook');

let {ipcMain} = require('electron')

function eventHandler(event) {
  console.log(event);
}



app.on('ready', () => {
  iohook.start();
  // iohook.on('mouseclick', eventHandler);
  iohook.on('keydown', (ke) => {
    // console.log(ke);
    mainWindow.webContents.send('ihkeydown', ke);
    // mainWindow.webContents.send('ping', 'keydown!')
  });
  iohook.on('keyup', (ke) => {
    mainWindow.webContents.send('ihkeyup', ke);
    // mainWindow.webContents.send('ping', 'keyup!')
  });
  iohook.on('keypress', (ke) => {
    // console.log("keypress", ke);
    mainWindow.webContents.send('ihkeypress', ke);
  })
  // iohook.on('mousewheel', eventHandler);
  // iohook.on('mousemove', eventHandler);
  // console.log('Try move your mouse or press any key');
});

app.on('before-quit', () => {
  iohook.unload();
  iohook.stop();
});


function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, frame: false, titleBarStyle: 'hidden', });
  mainWindow.setFullScreen(true);

  // mainWindow.webContents.on('did-finish-load', () => {
  //   mainWindow.webContents.send('ping', 'whoooooooh!')
  // })
  

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
