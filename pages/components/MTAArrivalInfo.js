import React from 'react';
import TrainLine from './TrainLine';

const endpoints = [
  'penn-station-ind',
  'penn-station-irt',
  'hudson-yards-ift',
];

class MTAArrivalInfo extends React.Component {

  static pollingInterval = 50000;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  async getData() {
    try {
      const result = [];
      const calls = endpoints.map(endpoint => fetch(`/data/mta-feed/${endpoint}`));
      const feeds = await Promise.all(calls);

      for (let i = 0; i < feeds.length; i++) {
        result.push(await feeds[i].json());
      }

      return result;
    } catch (e) {
      // Lol
      console.error(e);
    }
  }

  async componentDidMount() {
    const initialData = await this.getData();
    this.setState({
      loading: false,
      arrivalInfo: initialData,
    });

    setInterval(async () => {
      const data = await this.getData();
      this.setState({
        arrivalInfo: data,
      });
    }, MTAArrivalInfo.pollingInterval);
  }

  render() {
    if (this.state.loading) return <>Loading...</>;

    return (
      <section>
        {this.state.arrivalInfo.map(arrival => <TrainLine arrivalInfo={arrival} />)}
      </section>
    );
  }
}

export default MTAArrivalInfo;