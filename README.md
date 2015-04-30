# Github repos search sample app

## Abstract

This application is a test at using the following languages and technologies :

- ES6
- React/JSX
- Flux architecture
- Brunch.io build pipeline

## Demo

See live sample at http://slyg.github.io/brunch-ES6-react-sample-app/.

## Installation steps

Install dependencies

`npm install && bower install`

Then start development watcher

`npm run watch`

Open browser at http://localhost:3333/.

Live-reload is active.

## Advantages and drawbacks using Brunch.io

Brunch.io static assets pipeline is really easy and simple to handle. Needless to say that as a first sight it is far better than using complex configurations using `grunt` or `gulp`. Defining a set of conventions is a clever point of view.

However, as is, testing is hard to achieve! Brunch.io handles differently external modules (exposed as globals) from project source files (exposed via require). As a consequence, headless unit testing fails because globals are not injected, that's where things are becoming dirty and hacky.

Moreover, `bower` modules are still a mandatory rule but should be replaced by `npm`.

Brunch.io recently released an npm integration (~ a week ago) allowing vendor libs to be installed via `npm` and exposed as modules. This crashes unit tests/ But it still fails on many modules so I can't use it now. Hope it'll be stable and usable soon.

## Flux Architecture

<img src="https://raw.githubusercontent.com/facebook/flux/master/docs/img/flux-diagram-white-background.png" style="width: 100%;" />

I've been using Flux architecture as showcased by [Facebook's Flux documentation](http://facebook.github.io/flux/).

For the sake of code simplicity, the web api utilities and action creators modules have cross-dependencies, something I'm not well-comfortable with (see [`SearchService`](./app/js/services/SearchService.js) and [`SearchActions`](./app/js/actions/SearchActions.js) modules).

Flux architecture can be considered slightly overkill for this demo but it is a good start at understanding it. This app could evolve quite nicely from these first steps I think.

## Tests

Well well, as pointed out earlier, Brunch.io is a blocker to me. Still work to do to find the best way to correctly test this app :-/ with the help of browserify or something else.
