const router = require('express').Router();
const mtaResolver = require('./mta');
const mtaFeed = require('./mtaFeed');

router.get('/', (req, res) => {
  return res.json({test: true});
});

// TODO: param for which stop
router.get('/mta', async (req, res) => {
  const { JFK19_STOPS } = mtaResolver;
  const stops = [ JFK19_STOPS.pennStationIND, JFK19_STOPS.pennStationIRT, JFK19_STOPS.hudsonYardsIFT ];
  const arrivalInfo = await mtaResolver.getArrivalInfo(stops);
  return res.json(arrivalInfo);
});

router.get('/mta-feed/:feed', async (req, res) => {
  const result = await mtaFeed.getFeed(req.params.feed);

  return res.json(result);
});

module.exports = router;
