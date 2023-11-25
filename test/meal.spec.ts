import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Meals route', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be possible to create a new meal', async () => {
    const createUser = await request(app.server)
      .post('/users')
      .send({ username: 'Thiago' })

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'New Meal',
        description: 'new meal from test',
        meal_date: '15-03-2022',
        meal_time: '21:00',
        is_part_of_the_diet: true,
      })
      .expect(201)
  })

  it("must be possible to list all of the user's meals", async () => {
    const createUser = await request(app.server)
      .post('/users')
      .send({ username: 'Thiago' })

    const cookies = createUser.get('Set-Cookie')

    await request(app.server).get('/meals').set('Cookie', cookies).expect(200)
  })

  it('must be possible to list one meal by id', async () => {
    const createUser = await request(app.server)
      .post('/users')
      .send({ username: 'Thiago' })

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'New Meal',
        description: 'new meal from test',
        meal_date: '15-03-2022',
        meal_time: '21:00',
        is_part_of_the_diet: true,
      })
      .expect(201)

    const meals = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealsId = meals.body.meals[0].id

    const getMealById = await request(app.server)
      .get(`/meals/${mealsId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealById.body.meal).toEqual(
      expect.objectContaining({
        name: 'New Meal',
        description: 'new meal from test',
      }),
    )
  })

  it("must be possible to update data on a user's meal", async () => {
    const createUser = await request(app.server)
      .post('/users')
      .send({ username: 'Thiago' })

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'New Meal',
        description: 'new meal from test',
        meal_date: '15-03-2022',
        meal_time: '21:00',
        is_part_of_the_diet: true,
      })
      .expect(201)

    const meals = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)
    const mealsId = meals.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealsId}`)
      .send({
        name: 'desc',
        description: 'oiiiiiiiiiiiiii',
        meal_date: '05-03-2024',
        meal_time: '20:00',
        is_part_of_the_diet: true,
      })
      .set('Cookie', cookies)
      .expect(200)
  })

  it("must be possible to delete a user's meal", async () => {
    const createUser = await request(app.server)
      .post('/users')
      .send({ username: 'Thiago' })

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'New Meal',
        description: 'new meal from test',
        meal_date: '15-03-2022',
        meal_time: '21:00',
        is_part_of_the_diet: true,
      })
      .expect(201)

    const meals = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)
    const mealsId = meals.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealsId}`)
      .set('Cookie', cookies)
      .expect(200)
  })
})
