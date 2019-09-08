import { Pool } from 'pg'

const PB = new Pool()

export default PB

export function init() {
  const query = `CREATE TABLE IF NOT EXISTS public."User"
  (
      id character varying(50) COLLATE pg_catalog."default" NOT NULL,
      fullname character varying(50) COLLATE pg_catalog."default" NOT NULL,
      password character varying(100) COLLATE pg_catalog."default" NOT NULL,
      avatar character varying(200) COLLATE pg_catalog."default",
      "createdAt" date NOT NULL,
      "modifiedAt" date NOT NULL,
      CONSTRAINT "User_pkey" PRIMARY KEY (id)
  )`
  PB.query(query, (err, res) => {
    if (err) throw err
    console.log('CREATE DATABASE: User')
  })
}
