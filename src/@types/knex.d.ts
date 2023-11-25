// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: string
      meal_date: string
      meal_time: string
      is_part_of_the_diet: boolean
      user_id?: string
    }

    users: {
      id: string
      username: string
    }
  }
}
