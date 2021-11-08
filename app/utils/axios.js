import axios from 'axios';
import { BASE_SERVER_URL } from './constants'

export default function axiosHelper(method, url, data = '', handleError) {
  return axios({
    method: method,
    url: BASE_SERVER_URL + url,
    data: data,
    headers: {
      user_id: '24b456',
    },
  }).catch(error => handleError);
}
