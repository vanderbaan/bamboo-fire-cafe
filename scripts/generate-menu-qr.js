/**
 * Generates the menu QR code PNG that gets printed for tables/takeout bags.
 *
 * Run:    npm run qr
 * Output: ./public/menu-qr-code.png
 * Public: https://bamboofiredelray.com/menu-qr-code.png
 *
 * Hard-coded constants:
 *  - URL is the production /menu route.
 *  - errorCorrectionLevel "H" recovers from up to 30% damage — useful when printed on
 *    a takeout bag that gets folded, smudged, or beer-soaked.
 *  - Brand colors: dark = ink (#1A1A1A), light = surface-warm (#FAFAF7). Scan-friendly
 *    contrast (well past WCAG 4.5:1) while staying on-brand.
 *
 * If you need to regenerate after a URL or color change, edit the constants and re-run.
 */
const QRCode = require("qrcode");

QRCode.toFile(
  "./public/menu-qr-code.png",
  "https://bamboofiredelray.com/menu",
  {
    width: 1200,
    errorCorrectionLevel: "H",
    color: {
      dark: "#1A1A1A",
      light: "#FAFAF7",
    },
  },
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("QR code generated at ./public/menu-qr-code.png");
  }
);
