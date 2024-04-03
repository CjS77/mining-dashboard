const express = require('express');
const router = express.Router();
const dummyStats = require('../dummy-stats');
const minerStats = require('../miner-stats');
const {testSuite} = require('../tests');
const xmrig = require('../xmrig');

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

module.exports = router;
