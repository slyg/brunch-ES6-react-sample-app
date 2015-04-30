exports.config =

  paths: public: 'public'

  plugins: autoReload: enabled: true

  modules:
    nameCleaner: (path) -> path.replace /^app\/js\//, '' # remove app/js from modules refs

  files:

    javascripts:
      joinTo:
        'js/vendor.js': /^bower_components/
        'js/app.js': /^app\/js/

    stylesheets:
      joinTo:
        'css/main.css': /^app\/css/
        'css/vendor.css': /^bower_components/
