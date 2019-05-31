const express = require('express');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const dashButton = require('node-dash-button');

const secrets = require('./server/secrets');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const dataRouter = require('./server/routes');
const dash = dashButton(secrets.dashAddress);

app.prepare().then(() => {
  const server = express();

  server.use('/data', dataRouter);

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000')
  });

  dash.on('detected', () => {
    console.log(`Appointment with Dr. Java created on ${Date.now()}!`);
  });
})
