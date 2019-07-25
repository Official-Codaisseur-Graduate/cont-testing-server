const { Router } = require('express');
const router = new Router();
const Evaluation = require('./model');
const Student = require('../students/model');
const Question = require('../questions/model');
const Exercise = require('../exercises/model')
const { Op } = require('sequelize')


router.get('/evaluations', (req, res, next) => {
  Evaluation
    .findAll({
      attributes: [['studentId', 'studentId'], ['questionId', 'questionId']],
      group: ['studentId', 'questionId'],
      order: [['studentId', 'ASC'], ['questionId', 'ASC'],],
    })
    .then(evaluations => {
      const evaluationArray = evaluations.map(evaluation => {
        return Evaluation
          .findAll({
            include: [{ model: Student },
            { model: Question, include: [Exercise] }
            ],
            limit: 1,
            where: {
              studentId: evaluation.studentId,
              questionId: evaluation.questionId
            },
            order: [['createdAt', 'DESC']]
          })
          .then(fullEvaluation => {
            return fullEvaluation
          })
          .catch(error => next(error))
      })

      Promise.all(evaluationArray)
        .then(() => {
          return res.send({
            evaluationArray
          })
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

router.get('/evaluations-by-question/', (req, res, next) => {
  // Get Date Range interested in.
  const rangeDate = req.query.range 
  console.log('THIS RANGE!!!!!!!!!!!!!!!!', rangeDate)
  const currentDate = new Date()
  const selectedRange = new Date()

  const range = {
    'today': 1,
    'lastWeek': 7,
    'lastMonth': 30,
    'lastYear': 365,
    'allData': 365*5
  }
 
  selectedRange.setDate(selectedRange.getDate() - range[rangeDate]);
  // Exercise.findAll({
  //   where: {package_version: "data-transformations@1.2.0"},
  //   include: [{ model: Question }]
  // })
  // .then( result => {
  //   console.log('Results', result)
  // })


  Evaluation
    .findAll({
      where: {
        createdAt: {
          [Op.gt]: selectedRange
        }
      },
      attributes: [['studentId', 'studentId'], ['questionId', 'questionId']],
      group: ['studentId', 'questionId'],
      order: [['studentId', 'ASC'], ['questionId', 'ASC'],],
    })
    .then(evaluations => {
      const evaluationArray = evaluations.map(evaluation => {
        return Evaluation
          .findAll({
            include: [{ model: Student },
            { model: Question, include: [Exercise] }
            ],
            limit: 1,
            where: {
              studentId: evaluation.studentId,
              questionId: evaluation.questionId
            },
            order: [['createdAt', 'DESC']]
          })
          .then(fullEvaluation => {
            return fullEvaluation
          })
          .catch(error => next(error))
      })

      Promise.all(evaluationArray)
        .then(results => {
          //map over evaluationArray and gets questions id 
          const repeatedQuestion = results.map(result => {

           return result[0].dataValues.question.key
           //option for only sending the question letter ( [A],[b],[c]...):
          //  return result[0].dataValues.question.key[1]
          })
          //make sure there is no repeating questions
          const distinctQuestions = [...new Set(repeatedQuestion.sort().reverse())]


          //map over questions id and for each question filter only the passed
          const passedPerQuestion = distinctQuestions.map(distinctQuestionKey => {
            const filtered = results.filter(evaluation => {
             return evaluation[0].dataValues.question.key === distinctQuestionKey
            //option for only sending the question letter ( [A],[b],[c]...):
            //  return evaluation[0].dataValues.question.key[1] === distinctQuestionKey
                &&
                evaluation[0].dataValues.passed === true
            })
            //return an object with qustion key and number of students who passed
            return {
              questionKey: distinctQuestionKey,
              studentsPassed: filtered.length
            }
          })
          return res.send({ passedPerQuestion })
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

router.get('/evaluations-by-student/', (req, res, next) => {
  // Get Date Range interested in.
  const rangeDate = req.query.range 
  console.log('THIS RANGE!!!!!!!!!!!!!!!!', rangeDate)
  const currentDate = new Date()
  const selectedRange = new Date()

  const range = {
    'today': 1,
    'lastWeek': 7,
    'lastMonth': 30,
    'lastYear': 365,
    'allData': 365*5
  }
 
  selectedRange.setDate(selectedRange.getDate() - range[rangeDate]);

  Evaluation
    .findAll({
      where: {
        createdAt: {
          [Op.gt]: selectedRange
        }
      },
      attributes: [['studentId', 'studentId'], ['questionId', 'questionId']],
      group: ['studentId', 'questionId'],
      order: [['studentId', 'ASC'], ['questionId', 'ASC'],],
    })
    .then(evaluations => {
      const evaluationArray = evaluations.map(evaluation => {
        return Evaluation
          .findAll({
            include: [{ model: Student },
            { model: Question, include: [Exercise] }
            ],
            limit: 1,
            where: {
              studentId: evaluation.studentId,
              questionId: evaluation.questionId
            },
            order: [['createdAt', 'DESC']]
          })
          .then(fullEvaluation => {
            return fullEvaluation
          })
          .catch(error => next(error))
      })

      Promise.all(evaluationArray)
        .then(results => {
          //map over evaluationArray and gets students gitName
          const repeatedStudents = results.map(result => {
            return result[0].dataValues.student.gitName
          })
          //make sure there is no repeating students
          const distinctStudent = [...new Set(repeatedStudents.sort())]


          //map over students name and for each student filter only the passed
          const passedPerStudent = distinctStudent.map(distinctStudentName => {
            const filtered = results.filter(evaluation => {
              return evaluation[0].dataValues.student.gitName === distinctStudentName
                &&
                evaluation[0].dataValues.passed === true
            })
            //return an object with student gitName and number of questions passed
            return {
              studentName: distinctStudentName,
              questionsPassed: filtered.length
            }
          })
          return res.send({ passedPerStudent })
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

router.get('/stack-evaluations-by-student/', (req, res, next) => {

  // Get Date Range interested in.
  const rangeDate = req.query.range 
  console.log('THIS RANGE!!!!!!!!!!!!!!!!', rangeDate)
  const currentDate = new Date()
  const selectedRange = new Date()

  const range = {
    'today': 1,
    'lastWeek': 7,
    'lastMonth': 30,
    'lastYear': 365,
    'allData': 365*5
  }
 
  selectedRange.setDate(selectedRange.getDate() - range[rangeDate]);

  Evaluation
  .findAll({
    where: {
      createdAt: {
        [Op.gt]: selectedRange
      }
    },
    attributes:[['studentId','studentId'], ['questionId','questionId']],
    group: ['studentId','questionId'],
    order:[['studentId', 'ASC'],['questionId', 'ASC'],],
    })
    .then(evaluations => {
      const evaluationArray =  evaluations.map(evaluation => {
        return Evaluation
          .findAll({
            include: [ {model: Student},
              {model: Question, include: [Exercise]} 
              ],
            limit: 1,
            where: {
              studentId: evaluation.studentId,
              questionId: evaluation.questionId
            },
            order: [ [ 'createdAt', 'DESC' ]]
          })
          .then(fullEvaluation => {
            return fullEvaluation
          })
          .catch(error => next(error)) 
      })

      Promise.all(evaluationArray)
      .then( results => {
        //map over evaluationArray and gets students gitName
        const repeatedStudents = results.map( result => {
          return result[0].dataValues.student.gitName
          })
        //make sure there is no repeating students
        const distinctStudent = [...new Set(repeatedStudents.sort())]

        //map over students name and for each student filter only the passed
        const attemptedPerStudent = distinctStudent.map(distinctStudentName => {
          const filteredAtt = results.filter(evaluation =>  {
          return evaluation[0].dataValues.student.gitName === distinctStudentName
            && 
            evaluation[0].dataValues.attempted
          })
            const filteredPass = filteredAtt.filter(attemptedEvaluation =>  {
            return attemptedEvaluation[0].dataValues.passed
            })
          //return an object with student gitName and number of questions attempted
          return { studentName: distinctStudentName,
                  questionsAttempted: filteredAtt.length,
                  questionsPassed: filteredPass.length,
                  questionsFailed: filteredAtt.length-filteredPass.length
                }
        })
          return res.send({ attemptedPerStudent })
      })
      .catch(error => next(error))   
    })
      .catch(error => next(error))
  })

router.get('/all-evaluations', (req, res, next) => {
  Evaluation
    .findAll({
      include: [{ model: Student },
      { model: Question, include: [Exercise] }
      ]
      , order: [['createdAt', 'DESC']]
    })
    .then(evaluations => {
      res.send({ evaluations })
    })
    .catch(error => next(error))
})

router.get('/evaluations/:id', (req, res, next) => {
  const id = req.params.id
  Evaluation
    .findByPk(id)
    .then(evaluation => {
      if (!evaluation) {
        return res.status(404).send({
          message: 'Evaluation does not exist (anymore)'
        })
      }
      return res.send(evaluation)
    })
    .catch(error => next(error))
})


router.post('/evaluations', (req, res, next) => {
  const day = req.body.day
  const student = {
    gitName: req.body.gitName,
    gitEmail: req.body.gitEmail
  }

  const evaluationArray = JSON.parse(JSON.stringify(req.body.evaluation))

  const exercisesArray = evaluationArray.map(question => {
    return question.exercise
  })

  const questionsArray = evaluationArray.map(question => {
    return {
      exercise: question.exercise,
      attempted: question.attempted,
      passed: question.passed,
      key: question.key
    }
  })

  const exercisesUnique = exercisesArray.filter(function (question, index) {
    return exercisesArray.indexOf(question) >= index;
  })

  //Writing the exercise name to the db
  const createExercise = exercisesUnique.map(exercise => {
    return Exercise
      .findOrCreate({ where: { name: exercise, packageVersion: day } })
      .then(exercise => {
        return exercise
      })
  })


  //Writing the student info to the db
  const createStudent = Student
    .findOrCreate({ where: { gitEmail: student.gitEmail }, defaults: { gitName: student.gitName } })
    .then(([student]) => {
      return student.id
    })
    .catch(next)

  const promiseArray = [createStudent, ...createExercise]

  Promise.all(promiseArray)
    .then(values => {
      const studentId = values[0]
      let evaluation = { studentId }

      const createQuestion = questionsArray.map(question => {
        return Exercise
          .findOne({ where: { name: question.exercise } })
          .then(exercise => {

            Question
              .findOrCreate({ where: { key: question.key, exerciseId: exercise.id } })
              .then(createdQuestion => {
                evaluation = {
                  ...evaluation,
                  passed: question.passed,
                  attempted: question.attempted,
                  questionId: createdQuestion[0].id
                }

                Evaluation
                  .create(evaluation)
                  .then(newEvaluation => newEvaluation)
              })

            return createQuestion
          })
          .catch(error => next(error))
      })
    })
})

router.get('/evaluations-by-question-student/', (req, res, next) => {

   // Get Date Range interested in.
   const rangeDate = req.query.range 
   console.log('THIS RANGE!!!!!!!!!!!!!!!!', rangeDate)
   const currentDate = new Date()
   const selectedRange = new Date()
 
   const range = {
     'today': 1,
     'lastWeek': 7,
     'lastMonth': 30,
     'lastYear': 365,
     'allData': 365*5
   }
  
   selectedRange.setDate(selectedRange.getDate() - range[rangeDate]);

  Evaluation
    .findAll({
      where: {
        createdAt: {
          [Op.gt]: selectedRange
        }
      },

      attributes: [['studentId', 'studentId'], ['questionId', 'questionId']],
      group: ['studentId', 'questionId'],
      order: [['studentId', 'ASC'], ['questionId', 'ASC'],],
    })
    .then(evaluations => {
      const evaluationArray = evaluations.map(evaluation => {
        return Evaluation
          .findAll({
            include: [{ model: Student },
            { model: Question, include: [Exercise] }
            ],
            limit: 1,
            where: {
              studentId: evaluation.studentId,
              questionId: evaluation.questionId
            },
            order: [['createdAt', 'DESC']]
          })
          .then(fullEvaluation => {
            return fullEvaluation
          })
          .catch(error => next(error))
      })

      Promise.all(evaluationArray)
        .then(results => {
          const passedTotal = results.filter(evaluation => {
            return evaluation[0].dataValues.passed === true
          })
          const questionsPassed = passedTotal.length
          return questionsPassed

            .then(
              Promise.all([
                Student.count(),
                Question.count()
              ])
                .then(([students, questions]) => {
                  res.send({ students, questions, questionsPassed })
                })
                .catch(error => next(error))   
        )})
    })
})

router.get('/evaluations-by-date/:range', (req, res, next) => {
  const rangeDate = req.params.range 

  const currentDate = new Date()
  const selectedRange = new Date()

  const range = {
    'today': 0,
    'lastWeek': 7,
    'lastMonth': 30,
    'lastYear': 365
  }
 
  selectedRange.setDate(selectedRange.getDate() - range[rangeDate]);

  console.log('SELECTED RANGE!!!!', selectedRange)

  Evaluation
    .findAll({
      where: {
        createdAt: {
          [Op.gt]: selectedRange
        }
      }
    })
    .then( evaluations => {
      res.status(200).send(evaluations)
    })
  
})




module.exports = router