ççCopy/paste the following in the terminal, when you need mock data.

http :4000/students gitName=andrea gitEmail=andrea@github.com
http :4000/students gitName=keren gitEmail=keren@github.com
http :4000/students gitName=rafael gitEmail=rafael@github.com

http :4000/exercises name='Map-filter-find' packageVersion='0.0.1'
http :4000/exercises name='Reduce' packageVersion='0.0.1'
http :4000/exercises name='Data-mining' packageVersion='0.0.1'

http :4000/questions key="[A] Find the heaviest Pokemon" exerciseId=1
http :4000/questions key="[B] Get a pokemon object by their id" exerciseId=2
http :4000/questions key="[C] Transforms an array of pokemon into an array of "rare" pokemon" exerciseId=3

http :4000/evaluations studentId=1 questionId=1 passed=true attempted=true attemptsCount=3
http :4000/evaluations studentId=1 questionId=2 passed=false attempted=true attemptsCount=5
http :4000/evaluations studentId=1 questionId=3 passed=true attempted=true attemptsCount=7
http :4000/evaluations studentId=2 questionId=1 passed=false attempted=false attemptsCount=8
http :4000/evaluations studentId=2 questionId=2 passed=true attempted=true attemptsCount=6
http :4000/evaluations studentId=2 questionId=3 passed=false attempted=true attemptsCount=4
http :4000/evaluations studentId=3 questionId=1 passed=true attempted=true attemptsCount=3
http :4000/evaluations studentId=3 questionId=2 passed=false attempted=false attemptsCount=3
http :4000/evaluations day='data-transformations@1.0.0' gitName='kerenKi' gitEmail='kkinberg13@gmail.com' evaluation="{questions:[{ exercise: 'Array methods: map, filter & find: ',
attempted: true,
passed: true,
key: '[B] getPokemonById: Gets a pokemon object by their id',
failureMessages: [],
meta: { learning_goals: [Array] } },
{ exercise: 'Array methods: map, filter & find: ',
attempted: false,
passed: false,
key:
 '[C] getRarePokemons: Transforms an array of pokemon into an array of \"rare\" (spawn_chance is less than 0.1) pokemon',
failureMessages: [],
meta: { learning_goals: [Array] } },
{ exercise: 'Array methods: map, filter & find: ',
attempted: false,
passed: false,
key:
 '[D] getMidSizedPokemon: Gets the pokemon that weighs \"38.0 kg\"',
failureMessages: [],
meta: { learning_goals: [Array] } }]}"




{ evaluator: 'STUDENT_LOCAL_JEST_RUN',
  day: 'data-transformations@1.0.0',
  context: '(unknown)',
  input: '(unknown)',
  git_name: 'kerenKi',
  git_email: 'kkinberg13@gmail.com',
  evaluation: [ { key: 'ROOT', questions: [Array], score: 2 } ] }

  { exercise: 'Array methods: map, filter & find: ',
    attempted: true,
    passed: true,
    key: '[B] getPokemonById: Gets a pokemon object by their id',
    failureMessages: [],
    meta: { learning_goals: [Array] } },
  { exercise: 'Array methods: map, filter & find: ',
    attempted: false,
    passed: false,
    key:
     '[C] getRarePokemons: Transforms an array of pokemon into an array of "rare" (spawn_chance is less than 0.1) pokemon',
    failureMessages: [],
    meta: { learning_goals: [Array] } },
  { exercise: 'Array methods: map, filter & find: ',
    attempted: false,
    passed: false,
    key:
     '[D] getMidSizedPokemon: Gets the pokemon that weighs "38.0 kg"',
    failureMessages: [],
    meta: { learning_goals: [Array] } },
