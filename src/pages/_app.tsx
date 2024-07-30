import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";

// const defaultValues = [
//   ["31", "73", "7"],
//   ["13", "37", "61"],
//   ["67", "1", "43"],
// ];
function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
