const request = require('request');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const { busApiKey, trainApiKey } = require('../secrets');

const NQRW_FEED_URL = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw';
const getBusApi = (stopId) => `https://bustime.mta.info/api/siri/stop-monitoring.json?key=${busApiKey}&version=2&MonitoringRef=${stopId}`;

/**
 * Both subway and bus times are provided by the MTA in GTFS realtime format.
 * However, they're not really documented. Bus times have alternative rest APIs which are simpler.
 *
 * Both functions in this file call these respective APIs and transform data to a unified simple format.
 *
 * Following links have a bit of documentation on stop information
 * Trains: http://web.mta.info/developers/data/nyct/subway/Stations.csv
 * Buses: Search on https://bustime.mta.info
 */
const STOPS = {
  train: {
    astoriaDitmarsSouthbound: {
      stopId: 'R01S',
    }
  },
  bus: {
    q100Southbound: {
      stopId: '553229'
    },
    q69Southbound: {
      stopId: '552956'
    },
    q69Northbound: {
      stopId: ''
    }
  }
}

const fetchSubwayTimes = async () => {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      encoding: null,
      url: NQRW_FEED_URL,
      headers: {
        'x-api-key': trainApiKey
      }
    }, (err, resp, body) => {
      if (!err && resp.statusCode === 200) {
        const results = [];
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        feed.entity.forEach((entity) => {
          // There are a lot of other useless entity types so just throw everything in a try/catch
          try {
            entity.tripUpdate.stopTimeUpdate.forEach((update) => {
              if (update.stopId === STOPS.train.astoriaDitmarsSouthbound.stopId) {
                results.push({
                  routeId: entity.tripUpdate.trip.routeId,
                  arrivalTime: update.arrival.time.low * 1000,
                  departureTime: update.departure.time.low * 1000,
                });
              }
            });
          } catch (e) {}
        });
        resolve(results);
      } else {
        console.error(`Returned status code ${resp.statusCode}`);
        console.error(err);
        reject(error);
      }
    });
  });
};

const fetchBusTimes = () => {
  return new Promise((resolve, reject) => {
    request.get(getBusApi(STOPS.bus.q100Southbound.stopId), (err, resp, body) => {
      if (!err && resp.statusCode === 200) {
        resolve(body);
      } else {
        console.error(`Returned status code ${resp.statusCode}`);
        console.error(err);
        reject(error);
      }
    });
  });
};

module.exports = {
  fetchSubwayTimes,
  fetchBusTimes,
};