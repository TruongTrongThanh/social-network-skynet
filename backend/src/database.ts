import { Pool } from 'pg'
import * as fs from 'fs'
import * as path from 'path'

const PB = new Pool()

export default PB

export function databaseInit() {
  const query = fs.readFileSync(path.resolve(__dirname, 'sql/skynet_script.sql')).toString()
  PB.query(query, (err, res) => {
    if (err) throw err
	console.log('DATABASE INIT COMPLETE')
  })
}
