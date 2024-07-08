const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

// idb - images db
const idb = multer.diskStorage({
    destination: (rq, file, cbf) => {
        cbf(null, path.join(__dirname, 'db', 'images'));
    },
    filename: (rq, file, cbf) => {
        cbf(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: idb });

app.use('/db/images', express.static(path.join(__dirname, 'db', 'images')));

app.get('/', (rq, rs) => {
    rs.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/upload', upload.single('image'), (rq, rs) => {
    rs.send('Image uploaded successfully!');
});

// app.get('/download/:filename', (rq, rs) => {
//     const fname = rq.params.filename;
//     const fpath = path.join(__dirname, 'db/images', fname);
  
//     if (fs.existsSync(fpath)) {
//       rs.download(fpath);
//     } else {
//       rs.status(404).send('File not found');
//     }
//   });

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
