import type { Conversation } from '@/types/conversation';
import { JSDOM } from 'jsdom';

/**
 * Extracts a ChatGPT share page into a structured Conversation.
 */
export async function parseChatGPT(html: string): Promise<Conversation> {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const sections = document.querySelectorAll('section'); //gets all the messages

  let conversationHtml = '<html><head><meta charset="utf-8"></head><body>';

  sections.forEach((section) => {
    conversationHtml += section.outerHTML;
    console.log(section.style)
  });
  
  conversationHtml += '</body></html>';

  console.log('Found sections:', sections.length);                   //this gets logged in my instance running console
  console.log('Conversation HTML length:', conversationHtml.length);

  return {
    model: 'ChatGPT',
    content: conversationHtml,
    scrapedAt: new Date().toISOString(),
    sourceHtmlBytes: html.length,
  };
}
