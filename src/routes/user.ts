import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const userSchemaFromBody = z.object({
      username: z.string(),
    })

    const { username } = userSchemaFromBody.parse(request.body)

    const user = await knex('users')
      .insert({
        id: randomUUID(),
        username,
      })
      .returning('id')

    const [{ id }] = user

    let userId = request.cookies.userId

    if (!userId) {
      userId = id

      reply.setCookie('userId', userId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return reply.status(201).send()
  })
}
