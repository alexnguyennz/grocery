import { useState } from "react";

import {
  MantineProvider,
  ColorSchemeProvider,
  type ColorScheme,
  createEmotionCache,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import { Mulish } from "next/font/google";

const mulish = Mulish({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function CustomMantineProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const emotionCache = createEmotionCache({ key: "mantine", prepend: false });

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={emotionCache}
        theme={{
          colorScheme,
          colors: {
            dark: [
              "#E2E8F0",
              "#A6A7AB",
              "#909296",
              "#5c5f66",
              "#373A40",
              "#2C2E33",
              "rgb(31 41 55)",
              "rgb(17 24 39)",
              "#141517",
              "#101113",
            ],
          },
          fontFamily: mulish.style.fontFamily,
          headings: { fontFamily: mulish.style.fontFamily },
        }}
      >
        <NotificationsProvider position="top-center" limit={5}>
          <ModalsProvider>{children}</ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
