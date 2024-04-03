const express = require('express');
const router = express.Router();
const dummyStats = require('../lib/dummy-stats');
const minerStats = require('../lib/miner-stats');
const { events } = require('../lib/wallet-events');
const {testSuite} = require('../lib/tests');
const xmrig = require('../lib/xmrig');
const debug = require('debug')('routes');

/* GET home page. */
router.get('/health', (req, res) => {
  res.json({ status: '👍' });
});

router.get('/miner-stats-dummy', (req, res) => {
  const stats = dummyStats.getStats();
  res.json(stats);
});

router.get('/miner-stats', (req, res) => {
  const stats = minerStats.getStats();
  res.json(stats);
});

router.get('/test', async (req, res) => {
  const results = await testSuite();
  res.json({results});
});

router.get('/xmrig', async (req, res) => {
    const url = xmrig.getXmrigUrl();
    const stats = await xmrig.fetchXmrigStats(url);
    res.json(stats);
});

router.post('/wallet-events', (req, res) => {
    let body = req.body;
    events.addEvent(body);
    debug("Stats: ", events.getStats());
    res.status(200).send('OK');
});

module.exports = router;
