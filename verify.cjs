const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const root = __dirname;
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const manifest = JSON.parse(fs.readFileSync(path.join(root,'release-manifest.json')));
for (const [file, expected] of Object.entries(manifest.files)) {
  const content = fs.readFileSync(path.join(root,'public',file));
  assert.equal(hash(content),expected.sha256,file);
  assert.equal(content.length,expected.bytes,file);
  assert(content.length < 25*1024*1024,file);
}
const html = fs.readFileSync(path.join(root,'public/index.html'),'utf8');
const data = {textContent:''};
const context = vm.createContext({document:{getElementById:id=>{assert.equal(id,'arsa-data');return data;}}});
const includes = [...html.matchAll(/<script src="\.\/([^"]+)"><\/script>/g)];
for (const [,file] of includes) vm.runInContext(fs.readFileSync(path.join(root,'public',file),'utf8'),context);
assert.equal(hash(data.textContent),manifest.embedded_data_sha256);
JSON.parse(data.textContent);
const restored = html.replace('<script id="arsa-data" type="application/json"></script>',()=>'<script id="arsa-data" type="application/json">'+data.textContent+'</script>').replace(/\n<script src="\.\/[^"\n]+"><\/script>/g,'');
assert.equal(hash(restored),manifest.source_sha256);
console.log('PASS: all asset hashes, 25 MiB limit, script ordering, complete data and original HTML reconstruction');
