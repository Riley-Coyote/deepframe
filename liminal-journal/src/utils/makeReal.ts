import { TldrawApp } from 'tldraw';
import { Configuration, OpenAIApi } from 'openai';
import { promptTemplate } from './prompt';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function makeReal(editor: TldrawApp) {
  const pngDataUrl = await editor.exportSelectionAsSvgOrPng('png');
  const base64 = pngDataUrl.split(',')[1];
  const htmlPrompt = promptTemplate(base64);

  const completion = await openai.createChatCompletion({
    model: 'gpt-4-vision-preview',
    messages: [{ role: 'user', content: htmlPrompt }],
  });
  const html = completion.data.choices[0].message?.content || '';
  editor.createShape({
    type: 'iframe',
    props: { html },
  });
}
