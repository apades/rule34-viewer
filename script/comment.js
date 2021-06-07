let inq = require('inquirer')
const { execSync } = require('child_process')

inq
  .prompt([
    {
      name: 'ctype',
      message: 'select type',
      choices: [
        '[chore]',
        '[fix]',
        '[feat]',
        '[ui]',
        '[core]',
        '[rewrite]',
        '[update]',
        '[test]',
      ],
      type: 'list',
    },
    {
      name: 'comment',
      message: 'comment:',
      type: 'input',
    },
  ])
  .then((res) => {
    try {
      execSync(
        `git add . && git commit -am "${res['ctype']} ${res['comment']}"`,
      )
    } catch (error) {
      console.log(error.toString())
    }
  })
