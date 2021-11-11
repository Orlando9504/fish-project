import createError from 'http-errors';
import express from 'express';
import path from'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from '@s-routes/index';
import usersRouter from '@s-routes/users';

// modulos de webpack
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';
import webpackDevConfig from '../webpack.dev.config';

// Consultar el modo en que se esta ejecutando el programa
const env = process.env.NODE_ENV || 'development';

const app = express();

// Verificando el modo de ejecución de la aplicación

if (env === 'development') {
  console.log('> Execting in Development Mode: Webpack Hot Reloading');
  //  timeout=1000: Tiempo de espera entre recarga y recarga de la pagina
  //  paso 1 = Agregando la ruta de HMR
  //  reload habilita la recarga del frontend cuando hay cambios en el codigo fuente
  //  fuente del frontend
  webpackConfig.entry = [
    'webpack-hot-middleware/client?reload=true&timeout=1000',
    webpackConfig.entry,
  ];
  // Paso 2. Agregamos el plugin
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  // Paso 3. Crear el compilador de webpack
  const compiler = webpack(webpackConfig);

  // paso 4 Agregamdo el Middleware a la cadena de middlewares de nuestra aplicacion
  app.use(
    WebpackDevMiddleware(compiler, {
      publicPath: webpackDevConfig.output.publicPath,
    }),
  );
  // paso 5. Agregando el webpack hot middleware
  app.use(WebpackHotMiddleware(compiler));
} else {
  console.log('>Executing in Production Mode...');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
