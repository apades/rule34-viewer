import Axios from 'axios'

let request = Axios.create({})

request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    console.error('axios error'.red)
  }
)

export default request
