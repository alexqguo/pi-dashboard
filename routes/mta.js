const Express = require('express');
const router = Express.Router();
const { fetchSubwayTimes, fetchBusTimes } = require('../data/mta');

router.get('/train', async (req, res) => {
  const result = await fetchSubwayTimes();
  res.json({ mta: result });
});

router.get('/bus', async (req, res) => {
  const result = await fetchBusTimes();
  res.json(result)
});

module.exports = router;
