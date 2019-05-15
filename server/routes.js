const router = require('express').Router();
const mtaResolver = require('./mta');

router.get('/', (req, res) => {
  return res.json({test: true});
});

// TODO: param for which stop
router.get('/mta', async (req, res) => {
  const { JFK19_STOPS } = mtaResolver;
  const stops = [ JFK19_STOPS.pennStationIND, JFK19_STOPS.pennStationIRT ];
  const arrivalInfo = await mtaResolver.getArrivalInfo(stops);
  return res.json(arrivalInfo);
});

module.exports = router;
