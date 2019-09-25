import axios from 'axios'
import { SearchEntity } from '@/models/search'

const API_URL = process.env.VUE_APP_SERVER_API
axios.defaults.withCredentials = true

export async function searchPeople(text: string): Promise<SearchEntity[]> {
  const url = API_URL + `/search?text=${text}`
  const res = await axios.get(url)
  return res.data
}


