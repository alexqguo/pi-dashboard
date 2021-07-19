const https = require('https');
const request = require('request');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const apiKey = require('./secrets').mtaApiKey;

const stops = Object.freeze({
  'penn-station-ind': {
    stopIds: ['A28', 'A28N', 'A28S'],
    feedUrl: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace',
  },
  'penn-station-irt': {
    stopIds: ['128', '128N', '128S'],
    feedUrl: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs',
  },
  'hudson-yards-ift': {
    stopIds: ['726', '726N', '726S'],
    feedUrl: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs',
  }
});

const baseApiOptions = Object.freeze({
  method: 'GET',
  encoding: null,
  headers: {
    'x-api-key': apiKey,
  },
});

const arrivalTimeCompare = (a, b) => a.arrivalTime - b.arrivalTime;

const getFeed = async (stop) => {
  const stopInfo = stops[stop];
  if (!stopInfo) return Promise.resolve({});

  const { feedUrl, stopIds } = stopInfo;
  const results = stopIds.reduce((acc, cur) => {
    acc[cur] = [];
    return acc;
  }, {});

  return new Promise((resolve, reject) => {
    request({
      ...baseApiOptions,
      url: feedUrl,
    }, (err, resp, body) => {
      if (!err && resp.statusCode === 200) {
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        feed.entity.forEach((entity) => {
          try {
            entity.tripUpdate.stopTimeUpdate.forEach((update) => {
              if (stopIds.indexOf(update.stopId) > -1) {
                results[update.stopId].push({
                  routeId: entity.tripUpdate.trip.routeId,
                  arrivalTime: update.arrival.time.low * 1000,
                });
              }
            });
          } catch (e) {}
        });

        for (const [stopId, arrivals] of Object.entries(results)) {
          results[stopId] = arrivals.sort(arrivalTimeCompare);
        }

        resolve(results);
      } else {
        resolve({ fail: true });
      }
    });
  });
};

module.exports = {
  getFeed,
};
