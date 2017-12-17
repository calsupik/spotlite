import bunyan from 'bunyan'
import config from '../config'

const log = bunyan.createLogger(config.logger.options)

export default async function Index(req, res) {
  // res.json(true)
  res.sendStatus(404)
}
