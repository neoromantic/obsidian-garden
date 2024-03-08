import OpenAI from 'openai';
import { put, list } from '@vercel/blob';
import crypto from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 300;

const BASE_URL = 'https://sergeypetrov.ru/';

const fetchAndParseMetaData = async (url) => {
  const cleanUrl = url.trim().replace(/^\/|\/$/g, '');
  const response = await fetch(`${BASE_URL}${cleanUrl}`, { cache: "force-cache" });
  if (!response.ok) return null;
  
  const webHtml = await response.text();
  const extractMeta = (name) => (webHtml.match(new RegExp(`<meta name="${name}" content="([^"]*)"`,'i')) || [])[1];
  
  return {
    url: `${BASE_URL}${cleanUrl}`,
    hash: crypto.createHash('sha256').update(cleanUrl).digest('hex'),
    title: extractMeta('title') || 'Blog Title',
    author: extractMeta('author') || 'Sergey Petrov',
    description: extractMeta('description'),
    updated: extractMeta('article:modified_time'),
  };
};

const generateImage = async (meta) => {
  const prompt = `I have an article titled '${meta.title}'. I want to generate illustration for cover image. It should NEVER include any text, labels, letters or characters. You should first rewrite this prompt extensively and come up with a good idea for illustration. It should be simple, non-abstract, with particular subjects & objects, a little funny, with some kind of scenario going on. It should be colorful. The idea should be interesting and smart, but bold.`;
  const result = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: "1024x1024"
  });
  return result.data[0]?.url;
};

export async function GET(req, res) {
  try {
    const host = req.headers.host;
    const searchParams = new URL(req.url, `https://${host}`).searchParams
    const url = searchParams.get('url') || '/';
    const refresh = searchParams.get('refresh') ? true : false;
    console.log(`Getting OG image for ${url}`);

    const meta = await fetchAndParseMetaData(url);
    if (!meta) return new Response('Page not found', { status: 404 });

    let blobMetadata;
    const blobUrl = `generatedImages/${meta.hash}`;
    if (!refresh) {
      let blobs = await list({ prefix: blobUrl });
      blobMetadata = blobs.blobs.length ? blobs.blobs[blobs.blobs.length -1 ] : null;
    }

    if (!blobMetadata) {
      console.log("No existing image found. Generating...");
      const newImageUrl = await generateImage(meta);
      const response = await fetch(newImageUrl);
      const blob = await response.blob();
      blobMetadata = await put(blobUrl, blob, { access: 'public', contentType: "image/png" });
    }

    console.log("Returning image: ", blobMetadata.url);
    const blobData = await fetch(blobMetadata.url).then(res => res.arrayBuffer());
    return new Response(blobData, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      }
    });
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate the image', { status: 500 });
  }
}
