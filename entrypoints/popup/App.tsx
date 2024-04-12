import './App.css';
import Graph from './graph';
import { useRef } from 'react';

export default function App() {
  return (
    <>
      <div id="App">
        <h1>React D3 Force Graph</h1>
        <Graph id="5"/>
      </div>
    </>
  );
}
