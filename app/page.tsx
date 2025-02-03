import Head from 'next/head';
import Script from 'next/script';
import Form from "./components/form";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fastpriskalkulator</title>
      </Head>
      {/* External script */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-NQ5DFZB80E"
        strategy="afterInteractive"
      />
      {/* Inline script */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-NQ5DFZB80E');
        `}
      </Script>
      <div className="bg-green-50">
        <h1 className="text-[30px] font-bold text-center pt-[30px] text-green-800">
          Fastpriskalkulator
        </h1>
        <h2 className="text-[24px] font-bold text-center mt-[30px] text-green-800">
          Er regjeringens forslag for 40 øre/kwh gunstig for deg?
        </h2>
        <Form />
      </div>
    </>
  );
}