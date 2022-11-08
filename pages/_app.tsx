require('antd/dist/antd.less');
require('../styles/globals.less');

import type { AppProps, NextWebVitalsMetric } from "next/app";
import { ReactElement, ReactNode, useEffect, useState } from 'react'

import type { NextPage } from 'next'
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import React from "react";
import { persistStore } from "redux-persist";
import { useStore } from "@redux/store";
import { Spin } from "antd";
import Loader from "@components/atoms/Loader/Loader";
import { useRouter } from "next/router";
import { getCurrentEnvironment } from "@helpers/util.helper";

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  if (metric.label === "web-vital") {
    // console.log(metric); // The metric object ({ id, name, startTime, value, label }) is logged to the console
  }
}


type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout): React.ReactElement => {
  const store = useStore(pageProps?.initialReduxState);
  const persistor = persistStore(store);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isDev = getCurrentEnvironment() !== 'production';

  useEffect(() => {
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) window.location.reload();
    });
    router.events.on('beforeHistoryChange', () => {
      // Do something when history change event fired
    });
    router.events.on('routeChangeStart', (url) => {
      // eslint-disable-next-line no-console
      if (isDev) console.log('routeChangeStart: ', url);
      setLoading(true);
    });
    router.events.on('routeChangeComplete', (url) => {
      setLoading(false);
      // eslint-disable-next-line no-console
      if (isDev) console.log('routeChangeComplete: ', url);
    });
    return () => {
      router.events.off('routeChangeStart', () => {
        // cleaning up
      });
      router.events.off('routeChangeComplete', () => {
        // cleaning up
      });
    };
  }, []);
  
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Provider store={store}>
        <PersistGate
          loading={
            <Loader />
          }
          // eslint-disable-next-line react/jsx-props-no-spreading
          persistor={persistor}
        >
          
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Spin spinning={loading} delay={200}> {getLayout(<Component {...pageProps} persistor={persistor} />)}</Spin>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
