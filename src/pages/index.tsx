import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>jsQRとquagga2のテストアプリ</h1>
      <Link href="/jsqr">QRコード読み取り（jsQR）</Link>
      <br />
      <Link href="/quagga2">バーコード読み取り（quagga2）</Link>
    </div>
  );
}
