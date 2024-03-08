// api/og.mjs
import fs from 'fs'
import path from 'path'
import { unstable_createNodejsStream } from '@vercel/og'

const loadFont = (fontFilename) => {
  return fs.readFileSync(path.resolve(`./assets/${fontFilename}.ttf`))
  // return await fetch(
  //     new URL(`../assets/${fontFilename}.ttf`, import.meta.url)
  //   ).arrayBuffer();
}

export default async function handler(req, res) {
  try {
    const searchParams = new URL(req.url, `https://${req.headers.host}`).searchParams

    // this will look for the title query param as such ?title=<title>
    const url = searchParams.get('url') || '/';
    const response = await fetch(`https://sergeypetrov.ru/${url}`);
    if (!response.ok) {
      res.status(404).send('Page not found');
      return;
    }
    const webHtml = await response.text();
    const titleMatch = webHtml.match(/<meta name="title" content="([^"]*)"/i);
    const authorMatch = webHtml.match(/<meta name="author" content="([^"]*)"/i);
    const descriptionMatch = webHtml.match(/<meta name="description" content="([^"]*)"/i);
    const updatedMatch = webHtml.match(/<meta property="article:modified_time" content="([^"]*)"/i);
    const title = titleMatch ? titleMatch[1] : 'Blog Title';
    const author = authorMatch ? authorMatch[1] : 'Sergey Petrov';
    const description = descriptionMatch ? descriptionMatch[1] : null;
    const updated = updatedMatch ? updatedMatch[1] : null;
    function formatViews(views) {
  if (views > 1000) {
    return `${Math.round(views / 1000)}K`;
  }
  return views.toString();
}

const titleFontSize = title.length > 10 ? '5rem' : '8rem'; // Adjust font size based on title length

const html = {
  type: 'div',
  props: {
    children: [
      // Article Title
      {
        type: 'div',
        props: {
          style: { paddingLeft: '2.5rem', paddingTop: '2.5rem', display: 'flex' },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontFamily: 'Alice Regular',
                  color: '#efefefff', // Antiflash white
                  fontSize: titleFontSize, // Dynamic font size
                },
                children: title,
              },
            },
          ],
        },
      },
      // Avatar Styling
      {
        type: 'img',
        props: {
          style: {
            position: 'absolute',
            left: '0',
            bottom: '0',
            width: '10rem',
            height: '10rem',
            borderRadius: '0 4rem 0 0',
            filter: 'grayscale(100%) opacity(70%)', // Blend with background
          },
          src: 'https://pbs.twimg.com/profile_images/1748686124527329280/XA3zKATV_400x400.jpg',
        },
      },
      // Site Address
      {
        type: 'div',
        props: {
          style: { position: 'absolute', left: '12rem', bottom: '1rem', display: 'flex' },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontFamily: 'Recoleta Alt Light',
                  color: '#efefef', // Simplified color for better readability
                  fontSize: '3rem',
                  textDecoration: 'underline solid rgba(255,255,255,.3)'
                },
                children: 'sergeypetrov.ru',
              },
            },
          ],
        },
      },
      // Date of Publication
      ...(updated ? [{
        type: 'div',
        props: {
          style: { position: 'absolute', right: '3rem', bottom: '1rem', display: 'flex' },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontFamily: 'Recoleta Alt Light',
                  color: '#a8a8a8', // More neutral color
                  fontSize: '3rem',
                },
                children: new Date(updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              },
            },
          ],
        },
      }] : [])
    ],
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      padding: '3rem',
      borderRadius: '0.75rem',
      background: 'linear-gradient(230deg, #084b83ff 0%, #5e503fff 100%)',
      fontFamily: 'Recoleta Regular',
    },
  },
};

    // setup the stream. the `html` variable will be undefined so far
    const stream = await unstable_createNodejsStream(html, {
      width: 1200,
      height: 630,
      emoji: 'twemoji',
      fonts: [
        {
          data: loadFont("RecoletaAlt-Regular"),
          name: 'Recoleta Alt Regular',
          style: 'normal',
        },
        {
          data: loadFont("Alice-Regular"),
          name: 'Alice Regular',
          style: 'normal',
        },
      ],
    })
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.statusCode = 200
    res.statusMessage = 'OK'
    stream.pipe(res)
  } catch (e) {
    console.error(e)
    console.log(`${e.message}`)
    return new Response('Failed to generate the image', {
      status: 500,
    })
  }
}