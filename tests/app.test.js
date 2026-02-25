const request = require('supertest')
const app = require('../app')
const { calculateValue } = require('../logic')

describe('Suite de Pruebas de Calidad de Software', () => {

  describe('Pruebas Unitarias', () => {

    test('Debe calcular correctamente el valor total (10 * 5 = 50)', () => {
      const result = calculateValue(10, 5)
      expect(result).toBe(50)
    })

    test('Debe retornar 0 si se ingresan valores negativos', () => {
      const result = calculateValue(-10, 5)
      expect(result).toBe(0)
    })

    //precio cero
    test('Debe retornar 0 si el precio es 0', () => {
      const result = calculateValue(0, 10)
      expect(result).toBe(0)
    })

    //stock negativo
    test('Debe retornar 0 si el stock es negativo', () => {
      const result = calculateValue(100, -1)
      expect(result).toBe(0)
    })

  })

  describe('Pruebas de Integración', () => {

    test('GET /health - Debe responder con status 200 y JSON correcto', async () => {
      const response = await request(app).get('/health')
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('status', 'OK')
    })

    test('GET /items - Debe validar la estructura del inventario', async () => {
      const response = await request(app).get('/items')
      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('stock')
    })

    //cada item tiene propiedad name
    test('GET /items - Cada item debe tener propiedad name', async () => {
      const response = await request(app).get('/items')
      expect(response.statusCode).toBe(200)
      response.body.forEach(item => {
        expect(item).toHaveProperty('name')
      })
    })

    //ruta inexistente devuelve 404
    test('GET /ruta-inexistente - Debe responder con status 404', async () => {
      const response = await request(app).get('/ruta-inexistente')
      expect(response.statusCode).toBe(404)
    })

  })

})