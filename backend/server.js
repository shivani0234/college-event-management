require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// File upload handling
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Initialize Firebase Admin SDK (for database only)
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'college-event-system-b712f'
});

const db = admin.firestore();

// Initialize GCP Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID || 'college-event-system-b712f',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || './firebase-service-account.json'
});

const bucketName = process.env.GCP_BUCKET_NAME || 'shivam-18968';
const bucket = storage.bucket(bucketName);

// ============== HEALTH CHECK ==============
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running!', timestamp: new Date() });
});

// ============== FILE UPLOAD ENDPOINT (GCP Cloud Storage) ==============
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const ext = path.extname(req.file.originalname);
    const filename = `uploads/${timestamp}-${req.file.originalname}`;

    // Upload to GCP Cloud Storage
    const file = bucket.file(filename);
    
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          uploadedAt: new Date().toISOString(),
          originalName: req.file.originalname
        }
      }
    });

    // Generate public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

    res.status(200).json({
      success: true,
      url: publicUrl,
      filename: filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      message: 'File uploaded successfully to GCP Cloud Storage'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'File upload failed: ' + error.message });
  }
});

// ============== EVENTS ENDPOINTS ==============

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    const snapshot = await db.collection('events').get();
    const events = [];
    snapshot.forEach(doc => {
      events.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const doc = await db.collection('events').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, time, location, capacity, organizer } = req.body;
    
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const newEvent = {
      title,
      description,
      date,
      time,
      location,
      capacity: capacity || 100,
      registered: 0,
      organizer: organizer || 'Admin',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('events').add(newEvent);
    res.status(201).json({
      id: docRef.id,
      ...newEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE event
app.put('/api/events/:id', async (req, res) => {
  try {
    const eventRef = db.collection('events').doc(req.params.id);
    const doc = await eventRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await eventRef.update({
      ...req.body,
      updatedAt: new Date().toISOString()
    });

    const updated = await eventRef.get();
    res.status(200).json({
      id: updated.id,
      ...updated.data()
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  try {
    await db.collection('events').doc(req.params.id).delete();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============== REGISTRATIONS ENDPOINTS ==============

// GET all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const snapshot = await db.collection('registrations').get();
    const registrations = [];
    snapshot.forEach(doc => {
      registrations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET registrations for event
app.get('/api/events/:eventId/registrations', async (req, res) => {
  try {
    const snapshot = await db.collection('registrations')
      .where('eventId', '==', req.params.eventId)
      .get();
    
    const registrations = [];
    snapshot.forEach(doc => {
      registrations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE registration
app.post('/api/registrations', async (req, res) => {
  try {
    const { eventId, studentName, studentId, email, phone, department, year } = req.body;
    
    if (!eventId || !studentName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if already registered
    const existing = await db.collection('registrations')
      .where('eventId', '==', eventId)
      .where('email', '==', email)
      .get();
    
    if (!existing.empty) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    const newRegistration = {
      eventId,
      studentName,
      studentId,
      email,
      phone,
      department,
      year,
      registeredAt: new Date().toISOString()
    };

    // Add registration
    const docRef = await db.collection('registrations').add(newRegistration);

    // Update event registered count
    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();
    if (eventDoc.exists) {
      const currentRegistered = eventDoc.data().registered || 0;
      await eventRef.update({ registered: currentRegistered + 1 });
    }

    res.status(201).json({
      id: docRef.id,
      ...newRegistration
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ error: error.message });
  }
});

// CANCEL registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const regDoc = await db.collection('registrations').doc(req.params.id).get();
    
    if (!regDoc.exists) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    const { eventId } = regDoc.data();
    
    // Delete registration
    await db.collection('registrations').doc(req.params.id).delete();

    // Update event registered count
    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();
    if (eventDoc.exists) {
      const currentRegistered = eventDoc.data().registered || 0;
      await eventRef.update({ registered: Math.max(0, currentRegistered - 1) });
    }

    res.status(200).json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============== ERROR HANDLING ==============

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============== START SERVER ==============

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Local: http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
});

module.exports = app;
