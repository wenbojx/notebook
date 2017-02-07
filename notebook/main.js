const path = require('path')
const glob = require('glob')
const electron = require('electron')
const autoUpdater = require('./auto-updater')
const ipcMain = require('electron').ipcMain;
global.APP_PATH = __dirname;
global.UID = null;

const BrowserWindow = electron.BrowserWindow
const app = electron.app

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('记事本')

global.COMMON = require(path.join(global.APP_PATH, './main-process/common.js'));
global.ENCRYPTPREFIXLOCAL = '$@yi!lu*hao@';

var mainWindow = null


function initialize () {
  var shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  loadMainProcess()

  function createWindow () {
    var windowOptions = {
      width: 850,
      minWidth: 850,
      height: 650,
      frame:false,
      title: app.getName()
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/default/mini_logo.ico')
    }

    mainWindow = new BrowserWindow(windowOptions)
    //mainWindow.loadURL(path.join('file://', __dirname, '/login.html'))
    mainWindow.loadURL(path.join('file://', __dirname, '/welcome.html'))
    //mainWindow.loadURL('http://www.yiluhao.com/login')

    // Launch fullscreen with DevTools open, usage: npm run debug
    mainWindow.webContents.openDevTools()
    /*
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
    }
    */

    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }

  app.on('ready', function () {
    createWindow()
    autoUpdater.initialize()
    global.COMMON.checkLogin(loginSucess, loginFail)
    //global.COMMON.checkLogin(loginFail, loginFail)
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

function loginSucess(){
  console.log('loginSucess')
  console.log("uid+"+global.UID);
  mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
}
function loginFail(){
  console.log('loginFail')
  mainWindow.loadURL('http://www.yiluhao.com/login/desktoplogin/')
}
// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadMainProcess () {
  var files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach(function (file) {
    require(file)
  })
  autoUpdater.updateMenu()
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(function () { app.quit() })
    break
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function () { app.quit() })
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}


ipcMain.on('welcomeFinish', function(event, datas) {
  //mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
});



