import fs from 'fs'
import lodash, { get } from 'lodash'
import path from 'path'

let data = {
  directory: '3741',
  hash: 'b684d322eff3690ec68950f41219e255',
  height: 1488,
  id: 4233171,
  image: '94b38c2adf730b1d497a3b2de89b36bc5071fa0c.png',
  change: 1605849374,
  owner: 'bot',
  parent_id: 0,
  rating: 'explicit',
  sample: true,
  sample_height: 601,
  sample_width: 850,
  score: 25,
  tags:
    '2020 2boys anal anal_sex ass balls bodily_fluids bottomless chair_position clothed clothing computer cum cum_in_ass cum_inside cum_leaking cum_string dacad desk dipstick_ears duo erection feral from_behind_position fur furniture gay genital_fluids genitals half-closed_eyes hi_res human human_on_feral humanoid_genitalia humanoid_penis interspecies larger_human larger_male male mammal multicolored_ears narrowed_eyes nintendo nude open_mouth orgasm penetration penile penile_penetration penis pikachu pokémon_(species) poképhilia pokemon precum sex shallow_penetration size_difference smaller_ambiguous smaller_feral text url video_games yellow_body yellow_fur zoophilia',
  width: 2105,
}

let json = fs.readFileSync(
  path.resolve(__dirname, '../rules/rule34.json'),
  'utf-8',
)

let rule = JSON.parse(json)

function parserStringValue(string = '', obj = {}) {
  let keyArr = string.match(/@\{.*?\}/g)
  keyArr.forEach((key) => (string = string.replace(`${key}`, obj[key])))
  return string
}

function parserItemValue(data, path = '') {
  let v = { $: data }
  return get(v, path)
}

function evalScript(script, ...value) {
  let _rs
  let scriptStr = `_rs=(${script})(${value
    .map((v) => {
      if (lodash.isObject(v)) return JSON.stringify(v)
      return v
    })
    .join(',')})`
  eval(scriptStr)
  return _rs
}

// console.log(
//   parserStringValue(rule.discover.url, {
//     '@{searchString}': 'dacad',
//     '@{pageLimit}': 10,
//     '@{pageNum}': 2,
//   }),
// )

// console.log(parserItemValue(data,'$.id'))

// console.log(
//   evalScript('($)=>`https://rule34.xxx/${$.directory}/${$.image}`', data),
// )
