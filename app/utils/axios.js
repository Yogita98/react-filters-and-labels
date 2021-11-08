import axios from 'axios';
import { BASE_SERVER_URL } from './constants';

export default function axiosHelper(method, url, data = '') {
  return axios({
    method,
    url: BASE_SERVER_URL + url,
    data,
    headers: {
      user_id: '24b456',
    },
  });
}
