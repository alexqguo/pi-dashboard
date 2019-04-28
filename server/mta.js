const MTA = require('mta-gtfs');
const apiKey = require('./secrets').mtaApiKey;

const JFK19_STOPS = {
  pennStationIND: {
    id: 'A28',
    feedId: 26, // IND feed id
  },
  pennStationIRT: {
    id: '128', 
    feedId: 1, // IRT feed id
  },
  hudsonYards: {
    id: null,
    client: null,
  },
};

function getArrivalInfo(stop = JFK19_STOPS.pennStationIND) {
  const client = new MTA({
    key: apiKey,
    feed_id: stop.feedId,
  });
  
  return client.schedule(stop.id)
    .catch((err) => { 
      console.error(err);
      return { error: true };
    });
}

module.exports = {
  getArrivalInfo,
  JFK19_STOPS,
};

/*
{ stop_id: '128',
  stop_code: '',
  stop_name: '34 St - Penn Station',
  stop_desc: '',
  stop_lat: '40.750373',
  stop_lon: '-73.991057',
  zone_id: '',
  stop_url: '',
  location_type: '1',
  parent_station: '' }
{ stop_id: '128N',
  stop_code: '',
  stop_name: '34 St - Penn Station',
  stop_desc: '',
  stop_lat: '40.750373',
  stop_lon: '-73.991057',
  zone_id: '',
  stop_url: '',
  location_type: '0',
  parent_station: '128' }
{ stop_id: '128S',
  stop_code: '',
  stop_name: '34 St - Penn Station',
  stop_desc: '',
  stop_lat: '40.750373',
  stop_lon: '-73.991057',
  zone_id: '',
  stop_url: '',
  location_type: '0',
  parent_station: '128' }

{ stop_id: 'A28',
  stop_code: '',
  stop_name: '34 St - Penn Station',
  stop_desc: '',
  stop_lat: '40.752287',
  stop_lon: '-73.993391',
  zone_id: '',
  stop_url: '',
  location_type: '1',
  parent_station: '' }
{ stop_id: 'A28N',
  stop_code: '',
  stop_name: '34 St - Penn Station',
  stop_desc: '',
  stop_lat: '40.752287',
  stop_lon: '-73.993391',
  zone_id: '',
  stop_url: '',
  location_type: '0',
  parent_station: 'A28' }
{ stop_id: 'A28S',
  stop_code: '',
  stop_name: '34 St - Penn Station',
  stop_desc: '',
  stop_lat: '40.752287',
  stop_lon: '-73.993391',
  zone_id: '',
  stop_url: '',
  location_type: '0',
  parent_station: 'A28' }
*/