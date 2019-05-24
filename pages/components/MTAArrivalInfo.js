import React from 'react';
import TrainLine from './TrainLine';

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
      const result = await fetch('/data/mta')
      const arrivalInfo = await result.json();
      return arrivalInfo;
    } catch (e) {

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