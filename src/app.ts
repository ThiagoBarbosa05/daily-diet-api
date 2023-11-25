import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/user'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.get('/', async () => {
  return 'hello world!'
})
