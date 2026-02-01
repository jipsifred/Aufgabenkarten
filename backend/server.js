/**
 * ============================================
 * PROCESS.CARD - Express Backend Server
 * SQLite Database + File Storage
 * ============================================
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================
// Configuration
// ============================================

const PORT = process.env.PORT || 3000;
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../data/database.sqlite');
const UPLOAD_PATH = process.env.UPLOAD_PATH || path.join(__dirname, '../data/uploads');

// Ensure directories exist
fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
fs.mkdirSync(UPLOAD_PATH, { recursive: true });

// ============================================
// Database Setup
// ============================================

const db = new Database(DATABASE_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Folders table (exams and topics)
  CREATE TABLE IF NOT EXISTS folders (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('exam', 'topic')),
    name TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Tasks table
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    data TEXT, -- JSON string
    exam_folder_id TEXT REFERENCES folders(id) ON DELETE SET NULL,
    topic_folder_id TEXT REFERENCES folders(id) ON DELETE SET NULL,
    position INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Images table
  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Indexes
  CREATE INDEX IF NOT EXISTS idx_folders_type ON folders(type);
  CREATE INDEX IF NOT EXISTS idx_tasks_exam ON tasks(exam_folder_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_topic ON tasks(topic_folder_id);
  CREATE INDEX IF NOT EXISTS idx_images_task ON images(task_id);
`);

// Seed data if empty
const folderCount = db.prepare('SELECT COUNT(*) as count FROM folders').get();
if (folderCount.count === 0) {
  console.log('📦 Seeding initial data...');
  
  const insertFolder = db.prepare(`
    INSERT INTO folders (id, type, name, position) VALUES (?, ?, ?, ?)
  `);
  
  const insertTask = db.prepare(`
    INSERT INTO tasks (id, title, data, exam_folder_id, position) VALUES (?, ?, ?, ?, ?)
  `);
  
  // Create demo folders
  insertFolder.run('exam-ws2324', 'exam', 'Klausur WS 23/24', 0);
  insertFolder.run('exam-ss23', 'exam', 'Klausur SS 23', 1);
  insertFolder.run('topic-thermo', 'topic', 'Thermodynamik', 0);
  insertFolder.run('topic-reaktion', 'topic', 'Reaktionstechnik', 1);
  
  // Create demo task
  const demoTaskData = {
    titel: "Aufgabe 4: Chemischer Prozess mit Reaktion und Phasentrennung",
    teilaufgaben: [
      {
        frage: "Druck $p_4$ im Phasentrenner",
        steps: [
          {
            title: "Druck über Siedelinie bestimmen",
            origin: "p = \\\\sum_{i} x_i p_{s0i}(T)",
            application: "p_4 = x_{6A} p_{s0A}(t_4) + x_{6B} p_{s0B}(t_4)",
            explanation: "Wir wollen den Systemdruck im Gleichgewichtszustand 4 berechnen."
          }
        ]
      }
    ]
  };
  
  insertTask.run('task-demo', 'Aufgabe 4: Reaktion & Phasentrennung', JSON.stringify(demoTaskData), 'exam-ws2324', 0);
  
  console.log('✅ Initial data seeded');
}

console.log('✅ Database initialized');

// ============================================
// Express App
// ============================================

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(UPLOAD_PATH));

// Serve frontend in production
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// File Upload Setup
// ============================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

// ============================================
// API Routes - Folders
// ============================================

// Get all folders
app.get('/api/folders', (req, res) => {
  try {
    const { type } = req.query;
    let folders;
    
    if (type) {
      folders = db.prepare('SELECT * FROM folders WHERE type = ? ORDER BY position').all(type);
    } else {
      folders = db.prepare('SELECT * FROM folders ORDER BY type, position').all();
    }
    
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Create folder
app.post('/api/folders', (req, res) => {
  try {
    const { type, name } = req.body;
    const id = `${type}-${uuidv4().slice(0, 8)}`;
    
    // Get max position
    const maxPos = db.prepare('SELECT MAX(position) as max FROM folders WHERE type = ?').get(type);
    const position = (maxPos.max ?? -1) + 1;
    
    db.prepare(`
      INSERT INTO folders (id, type, name, position) VALUES (?, ?, ?, ?)
    `).run(id, type, name, position);
    
    const folder = db.prepare('SELECT * FROM folders WHERE id = ?').get(id);
    res.status(201).json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Update folder
app.put('/api/folders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, position } = req.body;
    
    db.prepare(`
      UPDATE folders SET name = COALESCE(?, name), position = COALESCE(?, position), updated_at = datetime('now')
      WHERE id = ?
    `).run(name, position, id);
    
    const folder = db.prepare('SELECT * FROM folders WHERE id = ?').get(id);
    res.json(folder);
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// Delete folder
app.delete('/api/folders/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM folders WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

// ============================================
// API Routes - Tasks
// ============================================

// Get all tasks (with optional folder filter)
app.get('/api/tasks', (req, res) => {
  try {
    const { examFolderId, topicFolderId, folderId, folderType } = req.query;
    
    let tasks;
    
    if (folderId && folderType) {
      if (folderType === 'exam') {
        tasks = db.prepare('SELECT * FROM tasks WHERE exam_folder_id = ? ORDER BY position').all(folderId);
      } else {
        tasks = db.prepare('SELECT * FROM tasks WHERE topic_folder_id = ? ORDER BY position').all(folderId);
      }
    } else if (examFolderId) {
      tasks = db.prepare('SELECT * FROM tasks WHERE exam_folder_id = ? ORDER BY position').all(examFolderId);
    } else if (topicFolderId) {
      tasks = db.prepare('SELECT * FROM tasks WHERE topic_folder_id = ? ORDER BY position').all(topicFolderId);
    } else {
      tasks = db.prepare('SELECT * FROM tasks ORDER BY position').all();
    }
    
    // Parse JSON data and add image URLs
    const tasksWithImages = tasks.map(task => {
      const images = db.prepare('SELECT * FROM images WHERE task_id = ?').all(task.id);
      return {
        ...task,
        data: task.data ? JSON.parse(task.data) : null,
        images: images.map(img => ({
          id: img.id,
          url: `/uploads/${img.filename}`,
          originalName: img.original_name
        }))
      };
    });
    
    res.json(tasksWithImages);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get single task
app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const images = db.prepare('SELECT * FROM images WHERE task_id = ?').all(id);
    
    res.json({
      ...task,
      data: task.data ? JSON.parse(task.data) : null,
      images: images.map(img => ({
        id: img.id,
        url: `/uploads/${img.filename}`,
        originalName: img.original_name
      }))
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, data, examFolderId, topicFolderId } = req.body;
    const id = `task-${uuidv4().slice(0, 8)}`;
    
    // Get max position
    const maxPos = db.prepare('SELECT MAX(position) as max FROM tasks').get();
    const position = (maxPos.max ?? -1) + 1;
    
    db.prepare(`
      INSERT INTO tasks (id, title, data, exam_folder_id, topic_folder_id, position)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, title, data ? JSON.stringify(data) : null, examFolderId || null, topicFolderId || null, position);
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.status(201).json({
      ...task,
      data: task.data ? JSON.parse(task.data) : null,
      images: []
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, data, examFolderId, topicFolderId, position } = req.body;
    
    // Build dynamic update
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (data !== undefined) {
      updates.push('data = ?');
      values.push(JSON.stringify(data));
    }
    if (examFolderId !== undefined) {
      updates.push('exam_folder_id = ?');
      values.push(examFolderId);
    }
    if (topicFolderId !== undefined) {
      updates.push('topic_folder_id = ?');
      values.push(topicFolderId);
    }
    if (position !== undefined) {
      updates.push('position = ?');
      values.push(position);
    }
    
    updates.push("updated_at = datetime('now')");
    values.push(id);
    
    db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    const images = db.prepare('SELECT * FROM images WHERE task_id = ?').all(id);
    
    res.json({
      ...task,
      data: task.data ? JSON.parse(task.data) : null,
      images: images.map(img => ({
        id: img.id,
        url: `/uploads/${img.filename}`,
        originalName: img.original_name
      }))
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete associated images from disk
    const images = db.prepare('SELECT filename FROM images WHERE task_id = ?').all(id);
    for (const img of images) {
      const filepath = path.join(UPLOAD_PATH, img.filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
    
    // Delete task (cascades to images table)
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ============================================
// API Routes - Images
// ============================================

// Upload images for a task
app.post('/api/tasks/:taskId/images', upload.array('images', 10), (req, res) => {
  try {
    const { taskId } = req.params;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const insertImage = db.prepare(`
      INSERT INTO images (id, task_id, filename, original_name, mime_type, size)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const uploadedImages = files.map(file => {
      const id = uuidv4();
      insertImage.run(id, taskId, file.filename, file.originalname, file.mimetype, file.size);
      return {
        id,
        url: `/uploads/${file.filename}`,
        originalName: file.originalname
      };
    });
    
    res.status(201).json(uploadedImages);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Delete image
app.delete('/api/images/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const image = db.prepare('SELECT filename FROM images WHERE id = ?').get(id);
    if (image) {
      const filepath = path.join(UPLOAD_PATH, image.filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      db.prepare('DELETE FROM images WHERE id = ?').run(id);
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// ============================================
// Fallback to frontend
// ============================================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Process.Card Server                              ║
║                                                       ║
║   Server:    http://localhost:${PORT}                   ║
║   Database:  ${DATABASE_PATH}       ║
║   Uploads:   ${UPLOAD_PATH}         ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});
