import React, { useEffect, useRef } from 'react';
import './TradingViewWidget.css';

const TradingViewWidget = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
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
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return <div id="tradingview_widget" ref={containerRef} className="tradingview-container"></div>;
};

export default TradingViewWidget;