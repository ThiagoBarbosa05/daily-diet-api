import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('description')
    table.string('meal_date').notNullable()
    table.string('meal_time').notNullable()
    table.boolean('is_part_of_the_diet').notNullable()
    table.text('user_id')
    table.foreign('user_id').references('users.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
