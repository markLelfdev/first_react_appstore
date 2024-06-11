// api/db.js
import pgPromise from 'pg-promise';

const pgp = pgPromise();

const db = pgp('postgres://postgres:12345@localhost:5432/store_online');

export default db;

