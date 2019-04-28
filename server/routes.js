const router = require('express').Router();
const mtaResolver = require('./mta');

router.get('/', (req, res) => {
  return res.json({test: true});
});

// TODO: param for which stop
router.get('/mta', async (req, res) => {
  const arrivalInfo = await mtaResolver.getArrivalInfo();
  return res.json(arrivalInfo);
});

module.exports = router;
