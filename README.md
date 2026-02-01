# Process.Card

Eine minimalistische Lernkarten-App für Klausuraufgaben mit Step-by-Step Lösungswegen.

## 🚀 Deployment mit Coolify

### Option 1: Docker Compose (Empfohlen)

1. Repository in Coolify importieren
2. Build Pack: **Docker Compose** auswählen
3. Port: **3000** konfigurieren
4. Volume für Persistenz: `/app/data` 

Die Datenbank und Uploads werden automatisch in `/app/data` gespeichert.

### Option 2: Dockerfile

1. Repository in Coolify importieren
2. Build Pack: **Dockerfile** auswählen
3. Port: **3000** konfigurieren
4. Volume hinzufügen:
   - Source: `processcard-data`
   - Destination: `/app/data`

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────────┐
│                    Browser                               │
│                  (React Frontend)                        │
├─────────────────────────────────────────────────────────┤
│                    Port 3000                             │
├─────────────────────────────────────────────────────────┤
│                 Express.js Server                        │
│         ┌──────────────┬──────────────┐                 │
│         │  Static Files │   REST API   │                 │
│         │   (React)     │   /api/*     │                 │
│         └──────────────┴──────────────┘                 │
├─────────────────────────────────────────────────────────┤
│                    SQLite                                │
│           /app/data/database.sqlite                      │
├─────────────────────────────────────────────────────────┤
│                  File Storage                            │
│              /app/data/uploads/                          │
└─────────────────────────────────────────────────────────┘
```

## 📁 Projekt-Struktur

```
/
├── backend/                 # Express.js Server
│   ├── server.js           # API & Static File Server
│   └── package.json        # Backend Dependencies
│
├── src/                    # React Frontend
│   ├── App.tsx             # Entry Point
│   ├── features/           # Feature Modules
│   │   └── dashboard/      # Hauptansicht
│   ├── lib/                # API Client
│   └── components/         # UI Komponenten
│
├── data/                   # Persistente Daten (Volume)
│   ├── database.sqlite     # SQLite Datenbank
│   └── uploads/            # Hochgeladene Bilder
│
├── Dockerfile              # Multi-Stage Build
├── docker-compose.yml      # Docker Compose Config
└── README.md
```

## 🔌 API Endpoints

### Folders
```
GET    /api/folders          # Alle Ordner
GET    /api/folders?type=exam # Nur Klausuren
POST   /api/folders          # Neuer Ordner
PUT    /api/folders/:id      # Ordner bearbeiten
DELETE /api/folders/:id      # Ordner löschen
```

### Tasks
```
GET    /api/tasks                        # Alle Aufgaben
GET    /api/tasks?folderId=x&folderType=exam  # Nach Ordner
GET    /api/tasks/:id                    # Einzelne Aufgabe
POST   /api/tasks                        # Neue Aufgabe
PUT    /api/tasks/:id                    # Aufgabe bearbeiten
DELETE /api/tasks/:id                    # Aufgabe löschen
POST   /api/tasks/:id/images             # Bilder hochladen
```

### Images
```
DELETE /api/images/:id       # Bild löschen
GET    /uploads/:filename    # Bild abrufen
```

## 💾 Datenbank Schema

```sql
-- Ordner (Klausuren & Themen)
CREATE TABLE folders (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('exam', 'topic')),
  name TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);

-- Aufgaben
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  data TEXT, -- JSON mit Teilaufgaben
  exam_folder_id TEXT REFERENCES folders(id),
  topic_folder_id TEXT REFERENCES folders(id),
  position INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);

-- Bilder
CREATE TABLE images (
  id TEXT PRIMARY KEY,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER,
  created_at TEXT
);
```

## 🛠️ Lokale Entwicklung

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

### Docker Build
```bash
docker-compose up --build
```

## 📝 JSON Format für Aufgaben

```json
{
  "titel": "Aufgabe 4: Chemischer Prozess",
  "description": "Optional",
  "teilaufgaben": [
    {
      "frage": "Druck $p_4$ im Phasentrenner",
      "steps": [
        {
          "title": "Schritt-Titel",
          "origin": "Formel/Ansatz",
          "application": "Anwendung (optional)",
          "explanation": "Erklärung"
        }
      ]
    }
  ]
}
```

## 🎨 Features

- **Ordner-System**: Klausuren und Themen getrennt
- **Drag & Drop**: Aufgaben zwischen Ordnern verschieben
- **Bild-Upload**: Mehrere Bilder pro Aufgabe
- **Step-by-Step**: Lösungswege schrittweise aufdecken
- **JSON Import**: Aufgaben per JSON einfügen
- **Dieter Rams Design**: Minimalistisch & funktional

---

**Keine externen Abhängigkeiten. Alles läuft auf deinem Server.**
