import React from 'react';
import { GetStaticComponentProps } from '@sitecore-jss/sitecore-jss-nextjs';
import Head from 'next/head';

interface CheapFlight {
  id: string;
  origin: string;
  destination: string;
  price: number;
}

type FlightsProps = {
  rendering: any;
  params: { [key: string]: string };
  flights: CheapFlight[];
  headTitle: string;
};

const CheapFlightsDefaultComponent = (props: FlightsProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}>
    <div className="component-content bg-gray-100 p-4 rounded-md">
      <span className="is-empty-hint">Cheap Price Grid Price</span>
    </div>
  </div>
);

export const Default = (props: FlightsProps): JSX.Element => {
  if (props.flights) {
    return (
      <div className={`component cheap-flights ${props.params.styles}`} id={props.params.RenderingIdentifier ?? undefined}>
        <Head>
          <title>{props.headTitle}</title>
        </Head>
        <h2>Cheap Flights</h2>
        <table className="border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Origin</th>
              <th className="border px-4 py-2">Destination</th>
              <th className="border px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {props.flights.map((flight) => (
              <tr key={flight.id}>
                <td className="border px-4 py-2">{flight.origin}</td>
                <td className="border px-4 py-2">{flight.destination}</td>
                <td className="border px-4 py-2">{flight.price} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <CheapFlightsDefaultComponent {...props} />;
};

export const getStaticProps: GetStaticComponentProps = async (rendering, layoutData, context) => {
  const destination = context.params?.requestPath?.[0];
  const flightQuery = `
    query {
      allIberia_VuelosBaratos(where: { pageName_eq: "${destination}" }) {
        results {
          pageName
          cheapFligths {
            results {
              id
              origin
              destination
              price
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://iberia.sitecoresandbox.cloud/api/graphql/preview/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GQL-Token': 'Y3hMS2U2Rm9nd3RVSWpnREtBRXpEOHdEaVYxL2pUTWVRK2d1Wld1emhnST18aWJlcmlhZDA5NzFlMTE=',
      },
      body: JSON.stringify({ query: flightQuery }),
    });

    if (!response.ok) {
      // Handle error response (e.g., throw an error or return an appropriate value)
    }

    const { data } = await response.json();
    const flightsData = data.allIberia_VuelosBaratos.results[0].cheapFligths.results;

    if (!flightsData) {
      return {
        props: {
          params: context.params,
          flights: [],
        },
      };
    }

    const flights = flightsData.map((flight: any) => ({
      id: flight.id,
      origin: flight.origin['en-US'],
      destination: flight.destination['en-US'],
      price: flight.price,
    }));

    return {
      params: context.params,
      flights: flights,
      headTitle: `Cheap flights to ${destination}`,
    };
  } catch (error) {
    // Handle fetch or JSON parsing error (e.g., throw an error or return an appropriate value)
  }
};
