import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import Link from "next/link";

const Page = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (videoRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current,
            constraints: {
              width: 1200,
              height: 1200,
              facingMode: "environment",
            },
          },
          decoder: {
            readers: [
              //"code_128_reader",
              //"ean_reader",
              //"upc_reader",
              "code_39_vin_reader",
              "code_39_reader",
            ], // 読み取りたいバーコード形式を指定
          },
          locator: {
            halfSample: true,
            patchSize: "large",
          },
        },
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Quagga initialized");
          Quagga.start();
        }
      );
    }
    Quagga.onDetected((result) => {
      console.log("Barcode detected: ", result.codeResult.code);
      setResult(result.codeResult.code ?? "");
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div
      style={{
        overflow: "auto",
        width: "100dvw",
      }}
    >
      <Link href="/">トップページに戻る</Link>
      <h1>バーコード読み取り（quagga2）</h1>
      <p>code_39（VIN）専用</p>
      <div
        ref={videoRef}
        style={{
          position: "relative",
          width: "100dvw",
          height: "100dvw",
          maxHeight: "600px",
          maxWidth: "600px",
        }}
      >
        <video
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
          className="drawingBuffer"
        />
      </div>
      <h4>結果：{result}</h4>
    </div>
  );
};
export default Page;
