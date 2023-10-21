import { Html, Head, Main, NextScript } from "next/document"

const Document = () => {
  return (
    <Html>
      <Head>
        <title>Deranged</title>
        <meta name="title" content="Deranged" />
        <meta name="description" content="If the crypto world went bonkers, Deranged would be its poster child" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app-deranged.vercel.app/" />
        <meta property="og:title" content="Deranged" />
        <meta property="og:description" content="If the crypto world went bonkers, Deranged would be its poster child" />
        <meta property="og:image" content="https://app-deranged.vercel.app/assets/LandingPage.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://app-deranged.vercel.app/" />
        <meta property="twitter:title" content="Deranged" />
        <meta property="twitter:description" content="If the crypto world went bonkers, Deranged would be its poster child" />
        <meta property="twitter:image" content="https://app-deranged.vercel.app/assets/LandingPage.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document;
