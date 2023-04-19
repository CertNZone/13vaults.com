import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import FontStyles from "@/components/font-styles";
import { useRouter } from "next/router";
import { useEffect } from "react";
import dayjs from "dayjs";
import { defaultLocale } from "@/lib/locales";

async function updateDayjsLocale(locale: string = defaultLocale) {
  await import(`dayjs/locale/${locale}.js`);
  dayjs.locale(locale);
}

function VaultsApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();

  useEffect(() => {
    updateDayjsLocale(locale);
  }, [locale]);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" />
        {process.env.NODE_ENV === "production" ? (
          <link rel="preload" as="script" href="/pa/js/pa.js" />
        ) : undefined}
      </Head>
      {process.env.NODE_ENV === "production" ? (
        <Script
          defer
          data-domain="13vaults.com"
          data-api="/pa/api/event"
          src="/pa/js/pa.js"
        />
      ) : undefined}
      <FontStyles />
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(VaultsApp);
