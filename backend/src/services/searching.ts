import PB from '../database'
import { SearchEntity } from '../models/search'

export async function searchPeople(text: string): Promise<SearchEntity[]> {
  const query = `SELECT * FROM searching($1);`
  const params = [text]
  const res = await PB.query(query, params)
  return res.rows
}

