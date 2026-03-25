import type { Conversation } from '@/types/conversation';
import { JSDOM } from 'jsdom';


function getInlineStyles(element: Element, window: any): string {
  const computedStyles = window.getComputedStyle(element);
  const importantStyles = [
    'display', 'margin', 'padding', 'border', 'background', 'color',
    'font-family', 'font-size', 'font-weight', 'line-height',
    'width', 'max-width', 'text-align', 'white-space'
  ];
  
  let styleString = '';
  importantStyles.forEach(prop => {
    const value = computedStyles.getPropertyValue(prop);
    if (value) {
      styleString += `${prop}: ${value}; `;
    }
  });
  
  return styleString;
}

function addInlineStylesToTree(element: Element, window: any) {
  const style = getInlineStyles(element, window);
  if (style) {
    element.setAttribute('style', style);
  }
  
  // Recursively apply to children
  Array.from(element.children).forEach(child => {
    addInlineStylesToTree(child, window);
  });
}

/**
 * Extracts a ChatGPT share page into a structured Conversation.
 */
export async function parseChatGPT(html: string): Promise<Conversation> {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const sections = document.querySelectorAll('section'); //gets all the messages

  //external style sheets
  //const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');

  let conversationHtml = '<html><head><meta charset="utf-8"></head><body>';

  // styleLinks.forEach((link) => {
  //   conversationHtml += link.outerHTML;
  // });
  
  conversationHtml += '</head><body>';

  sections.forEach((section) => {
    addInlineStylesToTree(section, dom.window);
    conversationHtml += section.outerHTML;
    console.log(section.style)
  });
  
  conversationHtml += '</body></html>';

  console.log('Found sections:', sections.length);                   //this gets logged in my instance running console
  // console.log('Found stylesheet links:', styleLinks.length);
  console.log('Conversation HTML length:', conversationHtml.length);

  console.log(html);

  return {
    model: 'ChatGPT',
    content: conversationHtml,
    scrapedAt: new Date().toISOString(),
    sourceHtmlBytes: html.length,
  };
}
