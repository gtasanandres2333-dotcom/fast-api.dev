var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// 🔥 NUEVO
const client = require('prom-client')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var itemsRouter = require('./routes/items')

var app = express()

// 🔥 MÉTRICAS POR DEFECTO
client.collectDefaultMetrics()

// 🔥 MÉTRICAS PERSONALIZADAS
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP',
  labelNames: ['metodo', 'ruta', 'estado_http'],
})

const activeUsersGauge = new client.Gauge({
  name: 'active_users_current',
  help: 'Usuarios activos simulados'
})

// 🔥 MIDDLEWARE PARA CONTAR REQUESTS
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      metodo: req.method,
      ruta: req.url,
      estado_http: res.statusCode
    })
  })
  next()
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 🔥 RUTA DE MÉTRICAS (LA MÁS IMPORTANTE)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.send(await client.register.metrics())
})

// 🔥 OPCIONAL (para k6)
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

// 👇 AQUÍ YA TENÍAS TUS RUTAS
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/items', itemsRouter)

// 🔥 SIMULAR USUARIOS ACTIVOS
setInterval(() => {
  activeUsersGauge.set(Math.floor(Math.random() * 100))
}, 5000)

module.exports = app