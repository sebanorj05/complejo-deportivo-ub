import https from 'node:https';

const req = https.request('https://api.figma.com/v1/files/cnSF65gpDx71Wg2prZIxTS', {
  method: 'GET',
  headers: {
    'X-Figma-Token': 'figd_U_aNOBVRhn1mg8N9KoGIZzKBj0RlcNFsuD8TlN86'
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body);
    const page1 = data.document.children[0];

    function rgbToHex(c) {
      if (!c) return '';
      return '#' + [c.r, c.g, c.b].map(x => Math.round((x || 0) * 255).toString(16).padStart(2, '0')).join('');
    }

    function analyze(node, depth = 0) {
      const indent = '  '.repeat(depth);
      let details = [];
      if (node.cornerRadius !== undefined) details.push(`radius:${node.cornerRadius}px`);
      if (node.fills && node.fills.length > 0 && node.fills[0].color) {
        details.push(`fill:${rgbToHex(node.fills[0].color)}`);
      }
      if (node.strokes && node.strokes.length > 0 && node.strokes[0].color) {
        details.push(`stroke:${rgbToHex(node.strokes[0].color)}`);
      }
      if (node.type === 'TEXT') {
        const font = node.style ? `${node.style.fontFamily} ${node.style.fontWeight}` : '';
        const txt = (node.characters || '').substring(0, 35).replace(/\n/g, ' ');
        details.push(`font:${font}`);
        details.push(`"${txt}"`);
      }
      console.log(`${indent}- ${node.name} (${node.type}) [${details.join(', ')}]`);
      if (node.children && depth < 3) {
        node.children.forEach(child => analyze(child, depth + 1));
      }
    }

    console.log('DOCUMENT: ' + data.name);
    page1.children.forEach(frame => {
      console.log('\n========================================');
      console.log(`FRAME: ${frame.name} (${frame.id})`);
      console.log('========================================');
      if (frame.children) {
        frame.children.forEach(child => analyze(child, 1));
      }
    });
  });
});
req.on('error', e => console.error(e));
req.end();
