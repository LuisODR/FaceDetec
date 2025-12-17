import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FaceDetection } from '@mediapipe/face_detection';
import type { Results } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

function App() {
  const [screen, setScreen] = useState<'inicio' | 'capturando' | 'sucesso'>('inicio');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>("Carregando IA...");
  const [borderColor, setBorderColor] = useState<string>('#dc3545');
  const [isProcessing, setIsProcessing] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    if (screen === 'capturando') {
      const faceDetection = new FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      });

      faceDetection.setOptions({
        model: 'short',
        minDetectionConfidence: 0.6,
      });

      faceDetection.onResults(onResults);

      if (webcamRef.current && webcamRef.current.video) {
        const camera = new Camera(webcamRef.current.video, {
          onFrame: async () => {
            if (webcamRef.current?.video && !isProcessing) {
              await faceDetection.send({ image: webcamRef.current.video });
            }
          },
          width: 300,
          height: 400
        });
        
        camera.start();
        cameraRef.current = camera;
        setStatusMsg("Posicione o rosto no centro...");
        setBorderColor('#dc3545');
      }
    }

  }, [screen]);

  const onResults = (results: Results) => {
    if (isProcessing) return;

    if (results.detections.length > 0) {
      setBorderColor('#28a745');
      setStatusMsg("Rosto detectado!");
      takePhoto();
    } else {
      setBorderColor('#dc3545');
      setStatusMsg("Procurando rosto...");
    }
  };

  const takePhoto = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    setStatusMsg("Foto capturada! Aguarde...");

    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        localStorage.setItem('minhaFotoSalva', imageSrc);
      }
    }

    setTimeout(() => {
      setScreen('sucesso');
      setIsProcessing(false);
    }, 3000);
  };

  const handleStart = () => {
    setScreen('capturando');
    setIsProcessing(false);
    setBorderColor('#dc3545');
  };

  const handleReset = () => {
    setScreen('inicio');
    setCapturedImage(null);
    setStatusMsg("Carregando IA...");
    setIsProcessing(false);
  };

  if (screen === 'sucesso') {
    return (
      <div style={styles.pageWrapper}>
        <style>{`body, html { margin: 0; padding: 0; width: 100%; height: 100%; }`}</style>
        
        <div style={styles.card}>
          <h2 style={{ color: '#28a745', marginBottom: '10px' }}>Sucesso!</h2>
          <p style={{ marginBottom: '20px', color: '#555' }}>Face detectada e salva.</p>
          
          <div style={styles.resultImageContainer}>
            {capturedImage && (
              <img src={capturedImage} alt="Face Capturada" style={styles.capturedImg} />
            )}
          </div>
          <button onClick={handleReset} style={styles.buttonSecondary}>
            Refazer Processo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <style>{`body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }`}</style>

      <h1 style={{ marginBottom: '30px', color: '#333', textAlign: 'center' }}>Validação Facial</h1>

      <div style={{...styles.ovalContainer, borderColor: borderColor}}>
        {screen === 'capturando' ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              mirrored={true}
              width={300}
              height={400}
              videoConstraints={{
                width: 300,
                height: 400,
                facingMode: "user"
              }}
              style={styles.webcamVideo}
            />
            
            <div style={{
               ...styles.feedbackOverlay,
               backgroundColor: isProcessing ? '#28a745' : 'rgba(0, 0, 0, 0.6)' 
            }}>
              {statusMsg}
            </div>
          </>
        ) : (
          <div style={styles.placeholder}>
            <p>Câmera Pronta</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        {screen === 'capturando' ? (
          !isProcessing && (
            <button onClick={() => setScreen('inicio')} style={styles.buttonSecondary}>
              Cancelar
            </button>
          )
        ) : (
          <button onClick={handleStart} style={styles.buttonPrimary}>
            Iniciar Reconhecimento
          </button>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f4f6f8',
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  
  ovalContainer: {
    width: '300px',
    height: '400px',
    borderRadius: '50%',
    transform: 'translateZ(0)', 
    overflow: 'hidden',
    borderWidth: '6px',
    borderStyle: 'solid',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    transition: 'border-color 0.3s ease'
  },

  webcamVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
    position: 'absolute',
    top: 0,
    left: 0
  },

  feedbackOverlay: {
    position: 'absolute',
    bottom: 30,
    color: 'white',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '15px',
    fontWeight: '600',
    backdropFilter: 'blur(4px)',
    transition: 'background-color 0.3s',
    zIndex: 10
  },
  placeholder: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: '18px',
    zIndex: 1
  },
  resultImageContainer: {
    width: '180px',
    height: '240px',
    borderRadius: '15px',
    overflow: 'hidden',
    border: '4px solid #28a745',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.2)'
  },
  capturedImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  buttonPrimary: {
    padding: '15px 35px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 5px 15px rgba(0, 123, 255, 0.3)',
    transition: 'transform 0.1s ease',
  },
  buttonSecondary: {
    padding: '12px 25px',
    fontSize: '15px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '500',
  }
};

export default App;