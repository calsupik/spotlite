const appName = process.env.APP_NAME || "spotlite"

export default {
  app: {
    name: appName
  },

  server: {
    IS_PRODUCTION:    process.env.NODE_ENV === 'production',
    PORT:             process.env.PORT || 8080,
    WEB_CONCURRENCY:  parseInt(process.env.WEB_CONCURRENCY || 1),
    HOST:             process.env.HOSTNAME || "http://localhost:8080"
  },

  newrelic: {
    key:    process.env.NEWRELIC_KEY,
    level:  process.env.NEWRELIC_LEVEL || 'info'
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },

  postgres: {
    connection_string: process.env.DATABASE_URL || 'postgres://localhost:5432/spotlite'
  },

  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL
  },

  logger: {
    options: {
      name:   appName,
      level:  process.env.LOGGING_LEVEL || "info",
      stream: process.stdout
    }
  }
}
