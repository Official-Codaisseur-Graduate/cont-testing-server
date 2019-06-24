const { Router } = require('express');
const router = new Router();
const Evaluation = require('./model');
const Student = require('../students/model');
const Question = require('../questions/model');
const Exercise = require('../exercises/model')

router.get('/evaluations', (req, res, next) => {
  Evaluation
  .findAll({attributes:[['studentId','studentId'], ['questionId','questionId']],
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
      .then( () => {
         return res.send({ 
        evaluationArray })
      })
      .catch(error => next(error))   
    })
      .catch(error => next(error))
  })

  router.get('/evaluations-by-question', (req, res, next) => {
    Evaluation
    .findAll({attributes:[['studentId','studentId'], ['questionId','questionId']],
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
          //map over evaluationArray and gets questions id 
          const repeatedQuestion = results.map( result => {
            return result[0].dataValues.question.key[1]
            })
            console.log('repeatedQuestion:', repeatedQuestion)
          //make sure there is no repeating questions
          const distictQuestions = [...new Set(repeatedQuestion.sort())]

            console.log('distictQuestions:', distictQuestions)

          //map over questions id and for each question filter only the passed
          const passedPerQuestion = distictQuestions.map(distinctQuestionKey => {
            const filtered = results.filter(evaluation =>  {
            return evaluation[0].dataValues.question.key[1] === distinctQuestionKey
              && 
              evaluation[0].dataValues.passed === true
            })
            //return an object with qustion id and number of students who passed
            return { questionKey: distinctQuestionKey,
                    studentsPassed: filtered.length}
          })
           return res.send({ passedPerQuestion })
        })
        .catch(error => next(error))   
      })
        .catch(error => next(error))
    })

    //attemp to bring question key as well:
    // Promise.all(evaluationArray)
    //     .then( results => {
    //       //map over evaluationArray and gets questions id 
    //       const repeatedQuestion = results.map( result => {
    //         return result[0].dataValues.questionId
    //         })

    //         console.log('repeatedQuestion:', repeatedQuestion)
    //       //make sure there is no repeating questions
    //       const distictQuestions = [...new Set(repeatedQuestion)]
    //         // const distictQuestions = [...new Set(
    //         //   {
    //         //     questionId: repeatedQuestion.questionId,
    //         //     questionKey: repeatedQuestion.questionKey
    //         //   }
    //         //   )]

    //         console.log('distictQuestions:', distictQuestions)

    //       //map over questions id and for each question filter only the passed
    //       const passedPerQuestion = distictQuestions.map(distinctQuestionId => {
    //         const filtered = results.filter(evaluation =>  {
    //         return evaluation[0].dataValues.questionId === distinctQuestionId
    //           && 
    //           evaluation[0].dataValues.passed === true
    //           &&
    //           evaluation[0].dataValues.question.key[1]

    //         })
    //         //return an object with qustion id and number of students who passed
    //         return { questionId: distinctQuestionId,
    //                   questionKey: filtered[0].key,
    //                 studentsPassed: filtered.length}
    //       })
    //        return res.send({ passedPerQuestion })
    //     })
    // const totalPassedQuestions =  results.filter(evaluation => {
    //   // console.log('filter evaluation:', evaluation[0].dataValues.passed)
    //   return evaluation[0].dataValues.passed === true})


  router.get('/all-evaluations', (req, res, next) => {
    Evaluation
    .findAll({
      include: [ {model: Student},
         {model: Question, include: [Exercise]} 
        ]
      , order:[['createdAt', 'DESC']]
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
      gitName:req.body.gitName,
      gitEmail: req.body.gitEmail
    }
    
    const evaluationArray = JSON.parse(JSON.stringify(req.body.evaluation))
    
    const exercisesArray = evaluationArray.map(question => {
      return question.exercise
    })
    
    const questionsArray = evaluationArray.map(question => {
      return {
        exercise: question.exercise,
        attempted:question.attempted,
        passed: question.passed,
        key: question.key
      }
    })
    
    const exercisesUnique = exercisesArray.filter(function(question, index){
      return exercisesArray.indexOf(question) >= index;
    })
    
    //Writing the exercise name to the db
    const createExercise = exercisesUnique.map(exercise => {
      return Exercise
      .findOrCreate({ where: {name: exercise, packageVersion: day} })  
      .then( exercise =>  {
        return exercise
      })
    })
    
    
    //Writing the student info to the db
    const createStudent = Student
    .findOrCreate({where: {gitEmail: student.gitEmail}, defaults: {gitName: student.gitName}})
    .then(([student]) => {
      return student.id 
    })
    .catch(next)
    
    const promiseArray = [createStudent, ...createExercise ]
    
    Promise.all(promiseArray)
    .then(values => {
      const studentId = values[0] 
      let evaluation = { studentId }
      
      const createQuestion = questionsArray.map(question => {
        return Exercise
        .findOne({ where: {name: question.exercise} })  
        .then( exercise =>  {

          Question
          .findOrCreate({ where: { key: question.key, exerciseId: exercise.id } })
          .then(createdQuestion => {
            evaluation = { 
              ...evaluation,
              passed:question.passed,
              attempted: question.attempted,
              questionId: createdQuestion[0].id 
            }
            
            Evaluation
            .create(evaluation)
            .then(newEvaluation =>  newEvaluation)
          })
          
          return createQuestion
        })
        .catch(error => next(error))
      })
    })
  })
  
  module.exports = router