import React, { useRef, useEffect } from 'react';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';

import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const drawRect = (detections, canvas) => {
    detections.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;

      // eslint-disable-next-line semi
      const borderColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`

      // eslint-disable-next-line no-param-reassign
      canvas.strokeStyle = borderColor;
      // eslint-disable-next-line no-param-reassign
      canvas.font = '18px Arial';

      canvas.beginPath();
      // eslint-disable-next-line no-param-reassign
      canvas.fillStyle = borderColor;
      canvas.fillText(prediction.class, x, y);
      canvas.rect(x, y, width, height);
      canvas.stroke();
    });
  };

  const detect = async (net) => {
    // eslint-disable-next-line semi
    const camInfo = webcamRef.current
    if (
      typeof camInfo !== 'undefined'
      && camInfo !== null
      && camInfo.video.readyState === 4
    ) {
      const { video } = camInfo;
      const { videoWidth, videoHeight } = video;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const detectData = await net.detect(video);

      const canvas = canvasRef.current.getContext('2d');
      drawRect(detectData, canvas);
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
