import type { Config } from "tailwindcss";
import { colors, fonts, radius } from "./src/shared/theme/tokens";

// No hex codes here — everything is imported from the one theme file.
// Edit src/shared/theme/tokens.ts to change the brand palette.

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: fonts,
      borderRadius: radius,
    },
  },
  plugins: [],
};

export default config;
