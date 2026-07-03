import React from 'react';
import { renderToString } from 'react-dom/server';
import SymptomChecker from './src/pages/SymptomChecker.jsx';

try {
  console.log(renderToString(React.createElement(SymptomChecker)));
} catch (e) {
  console.error("CRASH:", e);
}