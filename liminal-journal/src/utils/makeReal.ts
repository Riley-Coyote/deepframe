import type { Editor } from '@tldraw/editor';
import OpenAI from 'openai';
import { promptTemplate } from './prompt';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function makeReal(editor: Editor) {
  const pngDataUrl = await (editor as any).exportSelectionAsSvgOrPng('png');
  const base64 = pngDataUrl.split(',')[1];
  const htmlPrompt = promptTemplate(base64);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [{ role: 'user', content: htmlPrompt }],
  });
  const html = completion.choices[0].message?.content || '';
  (editor as any).createShape({
    type: 'iframe',
    props: { html },
  });
}
