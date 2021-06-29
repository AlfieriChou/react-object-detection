import React, { useRef, useEffect } from 'react';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';

import './App.css';

const videoWidth = 640;
const videoHeight = 480;

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const draw = (detections, canvas) => {
    detections.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      const borderColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

      // eslint-disable-next-line no-param-reassign
      canvas.strokeStyle = borderColor;
      // eslint-disable-next-line no-param-reassign
      canvas.fillStyle = borderColor;
      // eslint-disable-next-line no-param-reassign
      canvas.font = '18px Arial';
      canvas.beginPath();
      canvas.fillText(prediction.class, x, y);
      canvas.rect(x, y, width, height);
      canvas.stroke();
    });
  };

  const detect = async (net) => {
    const camInfo = webcamRef.current;
    const canvas = canvasRef.current.getContext('2d');
    if (
      typeof camInfo !== 'undefined'
      && (camInfo && camInfo.video && camInfo.video.readyState === 4)
    ) {
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      const detectData = await net.detect(camInfo.video);

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      draw(detectData, canvas);
    }
  };

  const runCoco = async () => {
    const net = await cocoSsd.load();
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
            width: videoWidth,
            height: videoHeight,
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
            width: videoWidth,
            height: videoHeight,
          }}
        />
      </header>
    </div>
  );
}

export default App;
