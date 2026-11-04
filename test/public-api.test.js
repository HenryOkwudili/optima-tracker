'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../server');

const docs = [];
const audit = [];
let revision = 1;

async function query(sql, params = []) {
  if (sql.startsWith('SELECT v FROM meta')) return { rows: [{ v: revision }] };
  if (sql.startsWith('SELECT coll, id, data FROM docs')) return { rows: docs };
  if (sql.startsWith('UPDATE meta')) {
    revision++;
    return { rows: [{ v: revision }] };
  }
  if (sql.startsWith('SELECT COALESCE(MAX')) {
    return { rows: [{ n: docs.filter((doc) => doc.coll === 'tasks').length + 1 }] };
  }
  if (sql.startsWith('INSERT INTO docs')) {
    docs.push({ coll: params[0], id: params[1], data: params[2] });
  }
  if (sql.startsWith('INSERT INTO audit')) audit.push(params);
  return { rows: [], rowCount: 1 };
}

const pool = {
  query,
  async connect() {
    return { query, release() {} };
  },
};

test('anonymous visitors can read and edit without session cookies', async (t) => {
  const server = createApp(pool).listen(0, '127.0.0.1');
  t.after(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;

  const read = await fetch(`${base}/api/sync`);
  assert.equal(read.status, 200);
  assert.equal((await read.json()).tasks.length, 0);

  const write = await fetch(`${base}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: { title: 'Anonymous task', day: '2026-11-05', status: 'todo', priority: 'med' },
    }),
  });
  assert.equal(write.status, 201);
  assert.equal(audit.at(-1)[0], 'Anonymous');

  const signIn = await fetch(`${base}/api/login`, { method: 'POST' });
  assert.equal(signIn.status, 404);
});
