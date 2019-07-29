### `continuous-student-testing-server`

A group project to aggregate student test results in real time. Server side, based on Express and Sequelize.

This app shows student progress in data transformation exercises in real time. It compiles the latest submission by each student for each question she/he attempted using Jest tests in their local computers. Test results are sent to a database by a server. This is the back end, where the routes are set to read/write from/to the database.

### `installation and other relevant repositories`

To install and run this app:

Currently the server is not deployed to Heroku.
Last version: https://continuous-testing.herokuapp.com/

**Github:** https://github.com/Official-Codaisseur-Graduate/cont-testing-server.git

**config vars**

The DATABASE_URL for Heroku is *postgres://uprirxcxkbrpkr:b238047354a4f0263aefbce4feccd3a4701cb9bda07d0cad427060b330da7466@ec2-54-246-84-100.eu-west-1.compute.amazonaws.com:5432/d98eep4745c0lc*

For testing purposes we recommend having a local PostgreSQL database running (and point to it on line 2 of file [db.js](https://github.com/Official-Codaisseur-Graduate/cont-testing-server/blob/master/db.js) ). If you use Docker, [here](https://docs.docker.com/engine/reference/commandline/start/) is how to do it.

Once it is up and running, go to the terminal and run the following commands:

```
1) Install the server
$ git clone git@github.com:Official-Codaisseur-Graduate/cont-testing-server.git
$ cd cont-testing-server
$ npm install
$ nodemon .
// nodemon will restart the app after every saved changes.

2) Install the client

$ git clone git@github.com:Official-Codaisseur-Graduate/cont-testing-client.git
$ cd cont-testing-client
$ npm install
$ npm start

Setting up a local DB
You can set your own local database using Postgress and dockers. 

Run this command:
docker run -p 5432:5432 --name some-postgres -e POSTGRES_PASSWORD=secret -d postgres

3) Run the exercise Data Transformation to get your own data.
https://github.com/Official-Codaisseur-Graduate/data-transformation-exercise

$ git clone git@github.com:Official-Codaisseur-Graduate/data-transformation-exercise.git
$ npm run test
```

<b>Important note</b>: if you submit mock data to test using httpie, it will not work. We recommend posting using axios or superagent.

The front end of the app is available [here](https://github.com/Official-Codaisseur-Graduate/cont-testing-client).

The exercises and jest tests are available [here](https://github.com/Official-Codaisseur-Graduate/data-transformation-exercise).

### API endpoints

--> Heroku App is from previous group, there is not a heroku app running at this moment due to the fact that we want to create one for all the academy which is not created yet.

The current base URL is https://continuous-testing.herokuapp.com/.

To get all students: https://continuous-testing.herokuapp.com/students.

To get all exercise groups: https://continuous-testing.herokuapp.com/exercises.

To get all questions: https://continuous-testing.herokuapp.com/questions.

To get all evaluations: https://continuous-testing.herokuapp.com/evaluations.

To get how many students have a passing result for each question: https://continuous-testing.herokuapp.com/evaluations-by-question.

To get how many questions each student has passed: https://continuous-testing.herokuapp.com/evaluations-by-student.

## Local endpoints to get data for the Graphs

GET ('/evaluations-by-question/') 
  --> Get the data for the "Students Passing each question graph"
GET ('/evaluations-by-question-student/')
  --> Get the data for the No of passed questions by student graph.

GET ('/evaluations-by-student/')
  --> Get data for the % of questions passed by students

GET ('/stack-evaluations-by-student/')
  --> Get data for the No of passed and failed questions by student.


## contributors
This continuous testing project was developed by 
- [Andrea Van Liere](https://github.com/ajvanliere)
- [Keren Kinberg](https://github.com/kerenki)
- [Rafael Olivares](https://github.com/rafaelrolivares)
- [Pedro Abel Diaz](https://github.com/coderhook)


As graduates of the Codaisseur Academy in Amsterdam we developed this tool with the help of Rein op ‘t Land and Kelley van Evert - teachers and developers at Codaisseur. 
