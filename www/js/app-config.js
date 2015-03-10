
function initializeCordovaApplication() {
  window.open = cordova.InAppBrowser.open;
}

document.addEventListener('deviceready', initializeCordovaApplication, false);