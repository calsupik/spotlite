/* Entry point for express web server
 * to listen for HTTP requests
 */

// import newrelic from 'newrelic'
import http from 'http'
import https from 'https'
import os from 'os'
import url from 'url'
import fs from 'fs'
import express from 'express'
import throng from 'throng'
import bodyParser from 'body-parser'
import path from 'path'
import bunyan from 'bunyan'
import Routes from '../libs/Routes'
import PostgresClient from '../libs/PostgresClient'
import config from '../config'

const app         = express()
const httpServer  = http.Server(app)
const pgClient    = new PostgresClient()
const log         = bunyan.createLogger(config.logger.options)

// entry point to enrichment apps
// throng allows for multiple processes based on
// concurrency configurations (i.e. num CPUs available.)
throng({
  workers:  config.server.WEB_CONCURRENCY,
  lifetime: Infinity,
  grace:    8000,
  start:    startApp
})

async function startApp() {
  try {
    const routes = await Routes.get()

    //view engine setup
    app.set('views', path.join(__dirname, '..', '..', 'views'))
    app.set('view engine', 'pug')

    app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}))
    app.use(bodyParser.json({limit: '1mb'}))

    // Enable CORS for all routes
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      res.header("Access-Control-Max-Age", "600")

      // Handles preflight request for CORS
      if (req.method.toLowerCase() === 'options')
        return res.sendStatus(200)

      next()
    })

    //static files
    // app.use('/public', express.static(path.join(__dirname, '..', '/public')))

    // initialize routes object to be used to bind express routes
    const routePath = path.join(__dirname, '..', 'routes')
    const aRoutes = fs.readdirSync(routePath).filter(file => fs.lstatSync(path.join(routePath, file)).isFile())
    let oRoutes = {}
    aRoutes.forEach(r => oRoutes[r] = require(path.join('..', 'routes', r)))

    //setup route handlers in the express app
    routes.forEach(route => {
      try {
        app[route.verb.toLowerCase()](route.path, oRoutes[route.file].default)
        log.debug(`Successfully bound route to express; method: ${route.verb}; path: ${route.path}`)
      } catch(err) {
        log.error(err, `Error binding route to express; method: ${route.verb}; path: ${route.path}`)
      }
    })

    httpServer.listen(config.server.PORT, () => log.info(`listening on *: ${config.server.PORT}`))

  } catch(err) {
    log.error("Error starting server", err)
    process.exit()
  }

  //handle if the process suddenly stops
  process.on('SIGINT', () => { console.log('got SIGINT....'); process.exit() })
  process.on('SIGTERM', () => { console.log('got SIGTERM....'); process.exit() })
}
