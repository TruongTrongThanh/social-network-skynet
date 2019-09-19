import * as fs from 'fs'
import { rejects } from 'assert'

const ROOT = 'E:\\Projects\\skynet\\backend\\static\\files'
const APP_URL = 'http://localhost:3000/files'

export async function upload(binaryFile: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.writeFile(ROOT + '\\' + filename, binaryFile, err => {
      if (err) reject(err)
      resolve(APP_URL + '/' + filename)
    })
  })
}
