'use strict';

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const filepath = process.argv[2];
const dir = path.dirname(filepath);
const OUTFILE = 'for-pocket.html';

const htmlTemplate = (listData) => {
  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>list</TITLE>
<H1>list</H1>
<DL><p>
${listData}
</DL><p>
`;
};

const readHtml = (filepath) => {
  return new Promise((done, reject) => {
    fs.open(filepath, 'r', (err, fd) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.error('file does not exist', filepath);
          reject(err);
          return;
        } else {
          reject(err);
          return;
        }
      }

      const file = fs.readFileSync(filepath);
      const data = xml2js.parseString(file, (err, result) => {
        if (err) {
          reject(err);
        }
        done(result);
      });
    });
  });
};

const extract = (data) => {
  const entries = data.feed.entry;
  return entries.map(e => {
    return {
      title: e.title[0],
      href: e.link[0]['$']['href'],
      time_added: new Date(e.issued).getTime() / 1000,
      tags: [...new Set(e['dc:subject'])].join(','),
      comment: e.summary[0]
    };
  });
}

const writeHtml = (file, data, cb) => {
  fs.writeFileSync(file, data);
  cb();
};

(async () => {
  const src = await readHtml(filepath);
  const list = extract(src);
  const listHtml = list.map(item => {
    const {title, href, time_added, tags, comment} = item;
    return `<DT><A HREF="${href}" ADD_DATE="${time_added}" PRIVATE="0" LAST_VISIT="${time_added}" TAGS="${tags}">${title}</A>
<DD>${comment}`;
  }).join('\n');

  const output = htmlTemplate(listHtml);
  const outputPath = path.join(dir, OUTFILE);

  writeHtml(outputPath, output, () => console.log(outputPath));
})();
