import Koa from 'koa';
import convert from 'koa-convert';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
import historyApiFallback from 'koa-connect-history-api-fallback';
import serve from 'koa-static';
import proxy from 'koa-proxy';
import _debug from 'debug';
import config from '../config';
import webpackDevMiddleware from './middleware/webpack-dev';
import webpackHMRMiddleware from './middleware/webpack-hmr';

// import React from 'react';
// import {renderToString} from 'react-dom/server';
// import {Provider} from 'react-redux';
// import {createMemoryHistory, match, RouterContext} from 'react-router'
// import {syncHistoryWithStore, routerReducer} from 'react-router-redux'
// import configureStore from '../src/redux/configureStore';
// import Root from '../src/containers/Root';
// import routes from '../src/routes';

let router = require('koa-router')();
let r = require('rethinkdb');

const debug = _debug('app:server');
const paths = config.utils_paths;
const app = new Koa();

let dbConn;
let connPromise = r.connect({
  host: '192.168.99.100',
  db: 'techmatrix'
});
connPromise.then(conn => {
  dbConn = conn;
}).error(err => {
  console.log(err);
});

// Enable koa-proxy if it has been enabled in the config.
if (config.proxy && config.proxy.enabled) {
  app.use(convert(proxy(config.proxy.options)));
}

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
// app.use(convert(historyApiFallback({
//   verbose: false
// })));

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig);

  // Enable webpack-dev and webpack-hot middleware
  const {publicPath} = webpackConfig.output;

  app.use(webpackDevMiddleware(compiler, publicPath));
  app.use(webpackHMRMiddleware(compiler));

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(convert(serve(paths.client('static'))));
} else {
  app.use(convert(serve(paths.base(config.dir_dist))));
}

// app.use(handleRender);

// async function handleRender(ctx, next) {
//   const memoryHistory = createMemoryHistory(ctx.req.path);
//
//   let projects = await (await r.table('projects').run(dbConn)).toArray();
//   const initialState = {projectsReducer: {projects, receivedAt: Date.now()}};
//
//   // Create a new Redux store instance
//   const store = configureStore(initialState, memoryHistory);
//
//   const history = syncHistoryWithStore(memoryHistory, store);
//
//   // Render the component to a string
//   const html = renderToString(
//     <Root history={history} routes={routes} store={store}/>
//   );
//
//   // Grab the initial state from our Redux store
//   const finalState = store.getState();
//
//   // Send the rendered page back to the client
//   ctx.body = renderFullPage(html, finalState);
// }

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Techmatrix</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `;
}


router.get('/api/projects', async(ctx, next) => {
  let projects = await r.table('projects').run(dbConn);
  ctx.body = await projects.toArray();
});

app
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
