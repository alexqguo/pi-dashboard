const https = require('https');
const request = require('request');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const apiKey = require('./secrets').mtaApiKey;

const stops = Object.freeze({
  'penn-station-ind': {
    stopIds: ['A28N', 'A28S'],
    feedUrl: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace',
    canonicalName: 'Penn Station (A/C/E)',
    id: 'A28',
  },
  'penn-station-irt': {
    stopIds: ['128N', '128S'],
    feedUrl: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs',
    canonicalName: 'Penn Station (1/2/3)',
    id: '128',
  },
  'hudson-yards-ift': {
    stopIds: ['726N', '726S'],
    feedUrl: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs',
    canonicalName: 'Hudson Yards',
    id: '726',
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

const decorateResults = (results, stopInfo) => ({
  id: stopInfo.id,
  schedule: results,
  canonicalName: stopInfo.canonicalName,
});

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
          // There are a lot of other useless entity types so just throw everything in a try/catch
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

        resolve(decorateResults(results, stopInfo));
      } else {
        resolve({ error: true });
      }
    });
  });
};

module.exports = {
  getFeed,
};
