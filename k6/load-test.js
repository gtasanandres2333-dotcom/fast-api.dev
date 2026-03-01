import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m',  target: 10 },
    { duration: '10s', target: 0  },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed:   ['rate<0.01'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {

  const health = http.get(`${BASE_URL}/health`)
  check(health, {
    'GET /health - status 200':      (r) => r.status === 200,
    'GET /health - tiene status OK': (r) => r.json('status') === 'OK',
    'GET /health - tiempo < 200ms':  (r) => r.timings.duration < 200,
  })

  sleep(1)

  const items = http.get(`${BASE_URL}/items`)
  check(items, {
    'GET /items - status 200':      (r) => r.status === 200,
    'GET /items - es un arreglo':   (r) => Array.isArray(r.json()),
    'GET /items - tiene elementos': (r) => r.json().length > 0,
    'GET /items - tiempo < 200ms':  (r) => r.timings.duration < 200,
  })

  sleep(1)
}
