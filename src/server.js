import http from 'node:http'
import { routes } from './routes/routes.js'
import { toJSON } from './middlewares/JSON.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await toJSON(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url) 
  })

  if (route) {
    const routeParams = req.url.match(route.path)
    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}
    
    return route.handler(req, res)
  }

  res.writeHead(404).end()
})

server.listen(3000)