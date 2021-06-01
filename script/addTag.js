const { execSync } = require('child_process')
const dayjs = require('dayjs')

async function main() {
  try {
    let out1 = await execSync('git describe --tags --abbrev=0')
    let lastVer = out1.toString().trim(),
      lastCode = lastVer.substring(lastVer.length, lastVer.length - 7)

    let out2 = await execSync('git log -1')
    let newCode = out2
      .toString()
      .match(/commit (.*?)\n/s)[1]
      .trim()
      .substring(0, 7)

    console.log(newCode, lastCode)
    if (newCode === lastCode) execSync(`git tag -d ${lastVer}`)

    let newVer = `${dayjs(new Date()).format('MM-DD_HH-mm-ss')}_${newCode}`
    await execSync(`git tag ${newVer}`)
    console.log(`add tag ${newVer}`)
  } catch (error) {
    console.error(`build脚本发生错误`, error)
  }
}

main()
