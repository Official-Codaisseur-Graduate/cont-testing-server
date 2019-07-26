const { Router } = require('express')
const bodyParser = require('body-parser')
const Exercise = require('./model')
const Question = require('../questions/model')

const cors = require('cors')
const router = new Router()

router.use(cors())
router.use(bodyParser.json()) 

router.post('/exercises', (req, res, next) => {
  const exercise = {
    name: req.body.name,
    packageVersion: req.body.packageVersion
}
  Exercise
    .create(exercise)
    .then(exercise => {
      return res.status(201).json(exercise)
    })
    .catch(error => {
      console.log(error)
      next(error)
    })  
})

router.get('/exercises', (req, res, next) => { 
  Exercise.findAll({order:[['id', 'ASC']]})
  .then(exercises => {
    res.json({ exercises: exercises })
  })
  .catch(error => next(error))
}) 

router.get('/exercises/versions', (req, res, next) => { 
  Exercise.findAll()
  .then(exercises => {
    const diffVersions = [...new Set(exercises.map(x => x.packageVersion))]
    res.json(diffVersions)
  })
  .catch(error => next(error))
}) 

router.get('/exercises/:id', (req, res) => {
  const id = req.params.id
  Exercise.findByPk(id, { include: [Question] })
  .then(exercise => {
    res.json({ exercise: exercise })
  })
  .catch(err => {
    res.status(500).json({
      message: 'Something went wrong'
    })
  })
})

router.put('/exercises/:id', (req, res, next) => {
  const id = req.params.id
  Exercise.findByPk(id)
  .then(exercise => exercise.update(req.body))
  .then(exercise => {
    res.json({ message: `Exercise updated: ${exercise.name} ` })
})
  .catch(err => {
    res.status(500).json({
      message: 'Something went wrong'
    })
  })
})

router.delete('/exercises/:id', (req, res, next) => {
  const id = req.params.id
  Exercise.findByPk(id)
  .then(exercise => exercise.destroy())
  .then(res.json({ message: `Exercise deleted` }))
  .catch(error => next(error))
})

module.exports = router