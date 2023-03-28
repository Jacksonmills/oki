import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../constants';

const Logo2 = () => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 251.44 272.94">
      <defs>
        <Gradient
          id="linear-gradient"
          x1="19.95"
          y1="116.78"
          x2="117.1"
          y2="20.17"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={COLORS.primary} />
          <stop offset="1" stopColor={COLORS.secondary} />
        </Gradient>
      </defs>
      <Background d="m38.72,67.99c-.22,4.92-.44,9.84-.67,14.76-.07.25-.13.49-.2.73-2.38,4.56-4.5,9.27-7.15,13.66-7.72,12.8-15.15,25.68-18.71,40.43-5.24,21.7-2.61,42.46,5.24,60.36.71,1.63,1.47,3.23,2.27,4.81,15.18,31.03,46.25,49.74,79.71,56.03,1.97.37,3.94.7,5.93.98,7.99,1.01,16.06,1.48,24.06,1.33,1.33-.02,2.66-.07,3.99-.13,17.29-1.14,35.71-4.21,50.88-12.97,1.62-.91,3.22-1.86,4.8-2.84,1.58-.99,3.15-2.01,4.69-3.06,1.16-.81,2.3-1.64,3.42-2.51,1.55-1.07,3.07-2.16,4.57-3.29,10.45-7.89,19.6-17.48,26.78-28.5.82-1.37,1.6-2.77,2.35-4.18,5.26-9.91,8.95-20.87,11.09-32.85.24-1.33.22-2.71.33-4.07,0-4.63.01-9.27.02-13.9-1.83-22.49-10.7-42.1-24.38-59.77l-5.83-7.23c-.98-22.47-2.05-49.14-3.07-71.66-6.14,4.1-11.26,9.21-16.74,13.95-1.33,1.29-2.64,2.59-3.92,3.92-8.99,9.3-16.91,19.56-24.39,29.22-1.54-1.02-3.21-1.76-4.69-2.25-19.88-3.89-40.35-3.89-60.28-2.38-1.63.17-3.25.35-4.86.56-.36.07-.73.15-1.09.23-3.27.72-6.5,1.83-9.65,3.58-11.02-17.57-24.42-32.75-40.59-46.67-.25,3.96-.44,6.96-.62,9.95-.14,1.07-.29,2.15-.43,3.22-.13,1.53-.25,3.05-.38,4.58-.14,1.21-.28,2.42-.42,3.63-.13.25-.08.46.14.63-.14,1.36-.28,2.73-.42,4.09h0c-.5,8.23-1.01,16.45-1.51,24.68-.08.98-.17,1.96-.25,2.94Z" /><path d="m250.97,149.06c-.11-.78-.22-1.56-.33-2.34-.29-2.13-.46-4.3-.9-6.4-3.52-16.83-10.82-31.91-21.27-45.49-1.87-2.43-3.4-4.98-4.48-7.7-.54-1.36-.98-2.76-1.3-4.21-1.78-21.8-2.78-43.8-4.26-66.28-.11-1.72-.23-3.44-.34-5.16-.11-1.72-.23-3.44-.34-5.16-.09-.19-.19-.37-.25-.56-.02-.07.09-.17.14-.26-.13-1.1-.26-2.2-.51-4.22-2.92.98-5.48,1.45-7.65,2.64-17.55,9.71-32.06,23.1-45.33,37.95-1.36,1.53-2.75,3.03-4.14,4.5-1.38,1.48-2.75,2.93-4.08,4.35-18.03-1.61-35.03-2.61-53.05-2.18-1.44.08-2.89.19-4.37.31-.33.02-.65.04-.98.07-1.63.11-3.25.23-4.86.34-.27.02-.55.03-.82.05-.82.05-1.64.1-2.47.14-12.54-17.46-28.14-32.05-45.86-44.4-2.74-1.91-5.89-3.24-9.26-5.05-.34,2.21-.51,3.36-.69,4.5-.13,1.25-.27,2.5-.4,3.76-.49,8.04-.98,16.08-1.47,24.12-.17,1.69-.34,3.38-.52,5.06-.53,7.22-1.06,14.45-1.59,21.67l-.43,2.81c-.18,3.26-.36,6.51-.54,9.77l-.28,1.62c-.22,2.32-.45,4.64-.67,6.96-.23.78-.59,2-.82,2.78-3.06,5.98-5.9,12.09-9.29,17.88-7.67,13.12-13.95,26.71-15.97,41.95l-.39,1.48-.4,6.28c-.13,1.03-.26,2.06-.39,3.09-1.12,11.48.28,22.71,3.25,33.79l.02.11c1.61,5.49,3.63,10.73,6.03,15.74.8,1.67,1.64,3.31,2.53,4.93,18.67,34.06,51,55.34,86.48,61.96,1.87.35,3.74.66,5.63.92,9.59,1.84,19.52,2.15,29.44,1.25,1.42-.13,2.83-.28,4.24-.46,14.9-1.88,29.9-5.88,44.13-12.37,1.51-.71,3-1.46,4.48-2.23,4.43-2.32,8.73-4.92,12.87-7.8,1.03-.68,2.06-1.38,3.07-2.09,1.01-.71,2.01-1.44,2.99-2.18,1.62-1.15,3.21-2.34,4.76-3.57,10.89-8.58,20.2-18.98,27.01-31.27.84-1.45,1.64-2.92,2.41-4.42,3.84-7.48,6.83-15.51,8.93-24.09l.33-1.04c2.59-10.51,2.9-21.17,1.98-31.9Zm-35.36-53.87c13.37,17.26,22.03,36.41,23.81,58.38,0,4.53-.01,9.05-.02,13.58-.1,1.33-.09,2.67-.32,3.98-2.09,11.7-5.7,22.41-10.83,32.08-.73,1.38-1.5,2.74-2.29,4.08-7.01,10.76-15.95,20.13-26.16,27.84-1.46,1.1-2.95,2.17-4.46,3.22-1.09.85-2.21,1.66-3.34,2.45-1.51,1.03-3.04,2.03-4.58,2.99-1.55.96-3.11,1.89-4.69,2.77-14.81,8.55-32.81,11.55-49.7,12.67-1.3.06-2.6.1-3.9.12-7.81.14-15.69-.32-23.5-1.3-1.94-.28-3.87-.6-5.79-.96-32.68-6.14-63.04-24.42-77.86-54.73-.78-1.54-1.52-3.11-2.22-4.7-7.67-17.49-10.23-37.76-5.11-58.96,3.48-14.4,10.74-26.98,18.28-39.49,2.59-4.29,4.66-8.89,6.98-13.34.07-.24.13-.48.19-.72.22-4.81.43-9.61.65-14.42.08-.96.17-1.91.25-2.87.49-8.03.99-16.06,1.48-24.09h0c.14-1.34.27-2.67.41-4.01-.21-.17-.26-.37-.14-.61.14-1.18.27-2.36.41-3.55.12-1.49.24-2.98.37-4.47.14-1.05.28-2.1.42-3.15.18-2.92.37-5.84.61-9.72,15.8,13.59,28.88,28.43,39.65,45.58,3.08-1.72,6.23-2.79,9.43-3.5.36-.08.71-.15,1.07-.22,1.57-.2,3.15-.39,4.74-.55,19.47-1.48,39.47-1.48,58.88,2.32,1.45.48,3.09,1.2,4.59,2.2,7.31-9.44,15.04-19.46,23.82-28.54,1.25-1.3,2.53-2.58,3.83-3.83,5.35-4.63,10.35-9.63,16.35-13.63,1,22,2.04,48.06,3,70l5.7,7.07Z" /><path d="m215.42,162.92c-2.7-15.95-9.48-28.96-22.13-38.33-2.2-1.63-5.08-1.75-7.41-.34-1.37.83-2.64,1.66-3.74,2.71-6.05,5.79-19.92,21.07-25.72,27.15-11.37,11.93-14.59-.26-25.97,11.65-4.57,4.78-5.72,4.63-10.2-.2-8.17-8.82-16.3-2.68-24.47-11.5-8.41-9.07-16.65-18.33-25.36-27.07-6.49-6.51-10.33-6.33-16.79.11-10.13,10.08-16.72,22.19-17.9,37.14-.03,3.37-.06,6.74-.09,10.11.02.7.04,1.39.06,2.09.92,17.19,9.42,30.06,21.55,40.42,16.49,14.09,35.7,21.11,56.8,22.58,1.87.25,3.75.5,5.62.75,5.72-.04,11.37-.08,17.09-.12,1.37-.2,2.74-.41,4.11-.61,1.87-.23,3.74-.45,5.61-.68v-.25s.21.12.21.12c18.04-3.68,34.42-11.14,48.52-23.78.5-.46,1-.92,1.5-1.38,1.06-1.08,2.8-2.84,3.86-3.92,0,0,.01-.01.02-.02.77-.78,1.53-1.55,2.3-2.33,1.29-2,2.65-3.95,3.85-6.01,4.17-7.16,8.38-14.32,8.54-23.13l.47-2.94c.02-3.22.04-6.38.06-9.61l-.39-2.64Zm-125.48,45.03c-3.41.07-7.23-1.16-11.34-4.57-16.54-13.71-15.92-33.69-11.4-48.27,5.34,3.16,11.47,7.38,17.69,13,10.71,9.68,17.63,19.81,21.97,27.49-.61,1.12-6.82,12.13-16.92,12.34Zm83.77-4.57c-4.11,3.41-7.93,4.64-11.34,4.57-10.1-.21-16.31-11.23-16.92-12.34,4.34-7.68,11.26-17.82,21.97-27.49,6.22-5.62,12.34-9.84,17.69-13,4.52,14.58,5.13,34.55-11.4,48.27Z" />
    </SVG>
  );
};

const SVG = styled.svg`
  width: 2em;
  height: 2em;
`;

const Background = styled.path`
  fill: url(#linear-gradient);
`;

const Gradient = styled.linearGradient`
`;

export default Logo2;