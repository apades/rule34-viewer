import { getList } from '../api'

async function main() {
  try {
    let data = await getList({ tags: 'dacad' })
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

main()
