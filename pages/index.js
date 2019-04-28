import React from 'react';
import Head from 'next/head';
import 'isomorphic-unfetch';

class IndexPage extends React.Component {
  static async getInitialProps({ req }) {
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
    const result = await fetch(`${baseUrl}/data/mta`);
    const arrivalInfo = await result.json();

    return { arrivalInfo };
  }

  render() {
    return (
      <div>
        <Head>
          <title>Hello world</title>
        </Head>
  
        something
        <div style={{ fontFamily: 'Courier' }}>
          { JSON.stringify(this.props.arrivalInfo) }
        </div>
      </div>
    );
  }
}

export default IndexPage;
