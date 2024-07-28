const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../app'); 

// Mock database
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

const db = require('../config/db');

describe('File Management API', () => {
  const testFilePath = path.join(__dirname, '../files/test.txt');

  beforeAll(() => {
    if (!fs.existsSync(path.dirname(testFilePath))) {
      fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up the test file if it exists
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  describe('Create File', () => {
    it('should create a new file and save its info in the database', async () => {
      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      const response = await request(app)
        .post('/files')
        .send({ filename: 'test.txt', content: 'Hello, world!' });

      expect(response.status).toBe(200);
      expect(response.text).toBe('File created successfully');
      expect(fs.existsSync(testFilePath)).toBe(true);
    });
  });

  describe('Read File', () => {
    it('should read the content of an existing file', async () => {
      fs.writeFileSync(testFilePath, 'Hello, world!');

      const response = await request(app).get('/files/test.txt');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, world!');
    });

    it('should return 404 for a non-existent file', async () => {
      const response = await request(app).get('/files/nonexistent.txt');

      expect(response.status).toBe(404);
      expect(response.text).toBe('File not found');
    });
  });

  describe('Update File', () => {
    it('should rename an existing file and update its info in the database', async () => {
      fs.writeFileSync(testFilePath, 'Hello, world!');

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const response = await request(app)
        .put('/files/test.txt')
        .send({ newFilename: 'newTest.txt' });

      expect(response.status).toBe(200);
      expect(response.text).toBe('File renamed successfully');
      expect(fs.existsSync(path.join(__dirname, '../files/newTest.txt'))).toBe(true);

      // Clean up renamed file
      fs.unlinkSync(path.join(__dirname, '../files/newTest.txt'));
    });
  });

  describe('Delete File', () => {
    it('should delete an existing file and remove its info from the database', async () => {
      fs.writeFileSync(testFilePath, 'Hello, world!');

      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const response = await request(app).delete('/files/test.txt');

      expect(response.status).toBe(200);
      expect(response.text).toBe('File deleted successfully');
      expect(fs.existsSync(testFilePath)).toBe(false);
    });
  });

  describe('Upload File', () => {
    it('should upload a file and queue it for processing', async () => {
      db.query.mockImplementationOnce((query, values, callback) => {
        callback(null, { insertId: 1 });
      });

      const response = await request(app)
        .post('/upload')
        .attach('file', Buffer.from('Hello, world!'), 'test.txt');

      expect(response.status).toBe(200);
      expect(response.text).toBe('File uploaded and queued for processing');
    });
  });

  describe('Fetch File List', () => {
    it('should fetch the list of files', async () => {
      fs.writeFileSync(testFilePath, 'Hello, world!');

      const response = await request(app).get('/files');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ filename: 'test.txt', path: testFilePath }]);
    });
  });
});
