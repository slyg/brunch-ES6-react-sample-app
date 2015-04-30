# Github repos search sample app

## Abstract

This application is a test at using the following languages and technologies :

- ES6
- React/JSX
- Flux architecture
- Brunch build pipeline

## Installation steps

Install dependencies

`npm install && bower install`

Then start development watcher

`npm run watch`

Open browser at http://localhost:3333/.

## Advantages and Drawbacks of using Brunch

Brunch static assets pipeline is really easy and simple to handle. Needless to say that as a first sight it is far better than using complex configurations using `grunt` or `gulp`.

However, testing is a mess. Brunch handles differently external modules (exposed as globals) from project source files (exposed via require). As a consequence, headless unit testing fails because globals are not injected, and things are becoming hacky.

`Bower` modules are still a mandatory rule but should be replaced by `npm`.

Brunch recently released an npm integration (a week ago)  allowing vendor modules to be installed via `npm` and exposed as modules. But it still fails on many modules so I can't use it now. Hope it'll be stable soon.
