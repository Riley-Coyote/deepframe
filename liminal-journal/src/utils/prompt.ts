export const promptTemplate = (selectionImage: string) => `
You are DeepFrame\u2019s UI assistant.
Convert the following drawn UI into interactive HTML/CSS/JS:
- Primary color: ${process.env.NEXT_PUBLIC_BRAND_PRIMARY}
- Accent color: ${process.env.NEXT_PUBLIC_BRAND_ACCENT}
- Font family: ${process.env.NEXT_PUBLIC_BRAND_FONT}
- Buttons: rounded corners, subtle shadow
Embed minimal inline styles/scripts; return full <html>...</html> document.
Image data (base64): ${selectionImage}
`;
