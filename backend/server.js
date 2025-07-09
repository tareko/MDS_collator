const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'forms.json');

app.use(cors());
app.use(bodyParser.json());

function readForms() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return fs.readJSONSync(DATA_FILE);
}

function writeForms(forms) {
  fs.ensureFileSync(DATA_FILE);
  fs.writeJSONSync(DATA_FILE, forms, { spaces: 2 });
}

app.post('/api/forms', (req, res) => {
  const forms = readForms();
  forms.push(req.body);
  writeForms(forms);
  res.json({ status: 'ok' });
});

app.get('/api/forms', (req, res) => {
  res.json(readForms());
});

app.get('/api/collated', (req, res) => {
  const forms = readForms();
  const { site, date } = req.query;
  const result = {};
  forms.forEach(f => {
    if (site && f.site !== site) return;
    if (date && f.date !== date) return;
    const key = `${f.site}_${f.date}`;
    if (!result[key]) result[key] = [];
    result[key].push(f);
  });
  res.json(result);
});

app.get('/api/export', (req, res) => {
  const { site, date } = req.query;
  if (!site || !date) {
    return res.status(400).json({ error: 'site and date required' });
  }
  const forms = readForms().filter(
    f => f.site === site && f.date === date
  );
  const ws = XLSX.utils.json_to_sheet(forms);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Forms');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsm' });
  const filename = `forms_${site}_${date}.xlsm`;
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.type('application/vnd.ms-excel.sheet.macroEnabled.12');
  res.send(buffer);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

