import React, { useEffect, useRef } from 'react';

type FaviconUpdaterProps = {
  hasNewMessages: boolean;
};

const FaviconUpdater: React.FC<FaviconUpdaterProps> = ({ hasNewMessages }) => {
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

    if (hasNewMessages) {
      favicon.setAttribute('href', '/oki-notification.svg');
    } else {
      favicon.setAttribute('href', '/oki.svg');
    }
  }, [hasNewMessages]);

  return null;
};

export default FaviconUpdater;
