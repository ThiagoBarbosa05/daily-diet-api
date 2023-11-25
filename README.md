<h1>Daily Diet Api</h1>

<p>Application built where a user can monitor their diet by registering their meals.</p>

## 🛠 Technologies

The following tools were used to build the project:

- [TypeScript](https://www.typescriptlang.org/) 
- [Eslint](https://eslint.org/) 
- [supertest](https://www.npmjs.com/package/supertest) 
- [tsup](https://github.com/egoist/tsup) 
- [tsx](https://www.npmjs.com/package/tsx) 
- [sqlite](https://www.sqlite.org/index.html) 
- [vitest](https://vitest.dev/) 
- [dotenv](https://www.npmjs.com/package/dotenv)
- [fastify](https://fastify.dev/)
- [knex.js](https://knexjs.org/) 
- [zod](https://zod.dev/) 



## How to install


clone the repository to the folder where your project will be located
```
$ git clone https://github.com/ThiagoBarbosa05/daily-diet-api.git
```

After that, type the following command to install the dependencies
```
$ npm install
```

then enter the following command to make migrations to the database
```
$ npm run knex -- migrate:latest
```

finally you can run the application with the following command
```
$ npm run dev
```

the application also contains test files, to run them enter the following command
```
$ npm test
```

## Features
- [x] It must be possible to create a user
- [x] It must be possible to identify the user between requests
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações: 

      - Name
      - Description
      - Date & time
      - It's part of the diet
      
- [x] It must be possible to edit a meal, being able to change all the data above
- [x] It should be possible to delete a meal
- [x] It should be possible to list all of a user's meals
- [x] It must be possible to view a single meal
- [x] Deve ser possível recuperar as métricas de um usuário
      
      - Total number of meals recorded
      - Total number of meals within the diet
      - Total number of meals outside the diet
      - Better sequence of meals within the diet
      
- [x] The user can only view, edit and delete the meals he created

