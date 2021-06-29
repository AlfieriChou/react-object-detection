import React, { useRef, useEffect } from 'react';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';

import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const drawRect = (detections, ctx) => {
    detections.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      const text = prediction.class;

      const color = Math.floor(Math.random() * 16777215).toString(16);
      ctx.strokeStyle = `#${color}`;
      ctx.font = '18px Arial';

      ctx.beginPath();
      ctx.fillStyle = `#${color}`;
      ctx.fillText(text, x, y);
      ctx.rect(x, y, width, height);
      ctx.stroke();
    });
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== 'undefined'
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4
    ) {
      const { video } = webcamRef.current;
      const { videoWidth } = webcamRef.current.video;
      const { videoHeight } = webcamRef.current.video;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const detectData = await net.detect(video);

      const ctx = canvasRef.current.getContext('2d');
      drawRect(detectData, ctx);
    }
  };

  const runCoco = async () => {
    const net = await cocoSsd.load();
    // console.log('Hand pose model loaded.');
    setInterval(() => {
      detect(net);
    }, 100);
  };

  useEffect(() => { runCoco(); }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
