import multer from 'multer';
import express from 'express';
import { access, constants } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

// idb - images db
const idb = multer.diskStorage({
    destination: (rq, file, cbf) => {
        cbf(null, path.join(__dirname, 'db', 'images'));
    },
    filename: (rq, file, cbf) => {
      cbf(null, rq.body.image_id + path.extname(file.originalname));
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

// app.get('/image', (rq, rs) => {
//   const { image_id } = rq.query;

//   if (!image_id) {
//     return rs.status(400).json({ error: 'Image id is required' });
//   }
//   const file_path = path.join(__dirname, 'db', 'images', image_id + '.png');
//   console.log(file_path);
//   stat(file_path, (stats) => {
//     if (stats) {
//       rs.sendFile(file_path);
//     } else {
//       rs.status(404).json({ error: 'File not found' });
//     }
//   });
// });

app.get('/image', (rq, rs) => {
  const { image_id } = rq.query;

  if (!image_id) {
    return rs.status(400).json({ error: 'Image id is required' });
  }

  const file_path = path.join(__dirname, 'db', 'images', image_id + '.png'); 

  access(file_path, constants.F_OK, (error) => {
    if (error) {
      rs.status(404).json({ error: 'File not found' });
    } else {
      rs.sendFile(file_path);
    }
  });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
