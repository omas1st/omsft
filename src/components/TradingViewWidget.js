import React, { useEffect, useRef, useState } from 'react';
import './TradingViewWidget.css';

const TradingViewWidget = () => {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://s3.tradingview.com';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: 'FX:EURUSD',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: true,      // side panel hidden
          hide_top_toolbar: false,      // top toolbar visible again
          allow_symbol_change: true,
          container_id: containerRef.current.id,
        });
        setLoaded(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div className="tradingview-wrapper">
      {!loaded && (
        <div className="tradingview-skeleton">
          <div className="skeleton-chart"></div>
        </div>
      )}
      <div
        id="tradingview_widget"
        ref={containerRef}
        className={`tradingview-container ${loaded ? 'visible' : 'hidden'}`}
      ></div>
    </div>
  );
};

export default TradingViewWidget;