import jsQR from "jsqr";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Page = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: "environment",
        width: { ideal: 1200 },
        height: { ideal: 1200 },
      },
    };

    // デバイスのカメラにアクセスする
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        // デバイスのカメラにアクセスすることに成功したら、video要素にストリームをセットする
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          scanQrCode();
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));

    const currentVideoRef = videoRef.current;

    // コンポーネントがアンマウントされたら、カメラのストリームを停止する
    return () => {
      if (currentVideoRef && currentVideoRef.srcObject) {
        const stream = currentVideoRef.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const scanQrCode = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // カメラの映像をcanvasに描画する
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // QRコードをスキャンする
        const qrCodeData = jsQR(
          imageData.data,
          imageData.width,
          imageData.height
        );
        if (qrCodeData) {
          // スキャンされた内容を確認する
          //   if (qrCodeData.data !== "http://localhost:3000/result") {
          //     setError(`対応していないQRコードです${qrCodeData.data}`);
          //     setTimeout(scanQrCode, 100); // スキャンの頻度を制限
          //     return;
          //   }
          setResult(qrCodeData.data);
          setTimeout(scanQrCode, 100);
          return;
        }
        setTimeout(scanQrCode, 100);
      }
    }
  };
  return (
    <div>
      <Link href="/">トップページに戻る</Link>
      <h1>QRコード読み取り（jsQR）</h1>
      <div>
        <div
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100dvw",
              height: "100dvw",
              maxHeight: "600px",
              maxWidth: "600px",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                zIndex: "50",
                width: "100%",
                height: "100%",
              }}
            />
            <canvas
              ref={canvasRef}
              width="1200"
              height="1200"
              style={{
                position: "absolute",
                display: "none",
                top: "0",
                left: "0",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
        </div>

        <h4>結果：{result}</h4>
      </div>
    </div>
  );
};
export default Page;
