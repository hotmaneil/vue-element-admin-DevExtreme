/** 暫時用 */
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { closeLoading } from '@/utils/loading' // loading遮罩

// create an axios instance
const service = axios.create({
  // eslint-disable-next-line
  baseURL:  window.sunstige_conf.API_DOMAIN,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    config.headers['Access-Control-Allow-Origin'] = window.sunstige_conf.API_DOMAIN
    config.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS'
    config.headers['Content-Type'] = 'application/json'

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.config.responseType === 'blob') {
      const fileName = ''
      return Promise.resolve({ data: response.data, fileName: fileName })
    }
    return response
  },
  error => {
    // const error_code = error.response.data.StatusCode
    console.log('error.response.data', error.response.data)
    console.log('err', error) // for debug

    Message({
      message: error.response.data.Message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
