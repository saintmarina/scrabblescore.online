cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-ionic-webview.IonicWebView",
      "file": "plugins/cordova-plugin-ionic-webview/src/www/util.js",
      "pluginId": "cordova-plugin-ionic-webview",
      "clobbers": [
        "Ionic.WebView"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-ionic-webview": "4.1.3",
    "cordova-plugin-whitelist": "1.3.4"
  };
});