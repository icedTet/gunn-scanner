import "../styles/globals.css";
import "../styles/tailwind.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
// import { useLayoutEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps }: AppProps) {
  // useLayoutEffect(() => {
  //   gapi.load("client:auth2", () => {
  //     gapi.client.init({
  //       clientId:
  //         "905267302363-6r9b88mp6cnki1vt10urpr9hdf2p7qt0.apps.googleusercontent.com",
  //       apiKey: "AIzaSyC_iCrF2QJnYQJl6Wti02FCAsMgbY6f_bY",
  //       scope: "profile email",
  //       discoveryDocs: [
  //         "https://people.googleapis.com/$discovery/rest?version=v1",
  //       ],
  //     });
  //   });
  // }, []);
  return (
    <>
      {/* <Head></Head> */}
      <GoogleOAuthProvider clientId="905267302363-6r9b88mp6cnki1vt10urpr9hdf2p7qt0.apps.googleusercontent.com">
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
