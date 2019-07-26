const express = require('express');
const bodyParser = require('body-parser');
const RawDataRouter = require('./raw_data/routes')
const cors = require('cors')
const question = require('./questions/routes')
const evaluation = require('./evaluations/routes')
const student = require('./students/routes')
const exercise = require('./exercises/routes')

const app = express()

const port = process.env.PORT || 4000

// Heroku url: https://continuous-testing.herokuapp.com/ | https://git.heroku.com/continuous-testing.git
// Created postgresql-rigid-49293 as DATABASE_URL

app
  .use(cors())
  .use(bodyParser.json())
  .use(evaluation, student, question, exercise, RawDataRouter)

function onListen() {
  console.log(`Running on port ${port}`)
}

app.listen(port, onListen);