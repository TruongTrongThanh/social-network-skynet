import * as fs from 'fs'
import * as path from 'path'

const ROOT = path.resolve(__dirname, '..\\..\\static\\files')
const APP_URL = 'http://localhost:3000/files'

export async function upload(binaryFile: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.writeFile(ROOT + '\\' + filename, binaryFile, err => {
      if (err) reject(err)
      resolve(APP_URL + '/' + filename)
    })
  })
}
