/* eslint-disable camelcase */
import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-session-id-exists'

const paramsSchema = z.object({
  id: z.string().uuid(),
})

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const createMealsBodyScema = z.object({
      name: z.string(),
      description: z.string().nullable(),
      meal_date: z.string(),
      meal_time: z.string(),
      is_part_of_the_diet: z.boolean(),
    })

    // eslint-disable-next-line camelcase
    const { name, description, meal_date, meal_time, is_part_of_the_diet } =
      createMealsBodyScema.parse(request.body)

    const { userId } = request.cookies

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description: description || '',
      meal_date,
      meal_time,
      is_part_of_the_diet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.get('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const { userId } = request.cookies

    const meals = await knex('meals').where('user_id', userId).select()

    if (!meals) {
      return reply.status(400).send({ msg: 'There are no meals yet' })
    }

    return { meals }
  })

  app.put(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const mealsDataToUpdateSchema = z.object({
        name: z.string(),
        description: z.string(),
        meal_date: z.string(),
        meal_time: z.string(),
        is_part_of_the_diet: z.boolean(),
      })

      const { name, description, is_part_of_the_diet, meal_date, meal_time } =
        mealsDataToUpdateSchema.parse(request.body)

      const { id } = paramsSchema.parse(request.params)
      const { userId } = request.cookies

      await knex('meals').where({ id, user_id: userId }).update({
        name,
        description,
        is_part_of_the_diet,
        meal_date,
        meal_time,
      })

      return reply.status(200).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const { id } = paramsSchema.parse(request.params)
      const { userId } = request.cookies

      await knex('meals').where({ id, user_id: userId }).delete()

      return reply.status(200).send()
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const { id } = paramsSchema.parse(request.params)
      const { userId } = request.cookies

      const meal = await knex('meals').where({ id, user_id: userId }).first()

      if (!meal) {
        return reply.status(204).send({ msg: 'Meal not found.' })
      }

      return { meal }
    },
  )

  app.get('/metrics', { preHandler: [checkUserIdExists] }, async (request) => {
    const { userId } = request.cookies

    const totalOfMeals = await knex('meals')
      .where('user_id', userId)
      .count('*', { as: 'total' })

    const totalMealsOnDiet = await knex('meals')
      .where({ user_id: userId, is_part_of_the_diet: true })
      .count('*', { as: 'totalMealsOnDiet' })

    const totalMealsNotOnDiet = await knex('meals')
      .where({ user_id: userId, is_part_of_the_diet: false })
      .count('*', { as: 'totalMealsNotOnDiet' })

    const sequenceOfMealsInTheDiet = await knex('meals')
      .select('meal_date', 'meal_time')
      .where({
        user_id: userId,
        is_part_of_the_diet: true,
      })
      .orderBy('meal_date', 'meal_time')

    return {
      totalOfMeals,
      totalMealsOnDiet,
      totalMealsNotOnDiet,
      sequenceOfMealsInTheDiet,
    }
  })
}
