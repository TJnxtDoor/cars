export default {
    testEnviroment: 'node',
    Transform: {}
};

import request from 'supertest';
import app from './server.js';
import { Transform } from 'supertest/lib/test';

descripe ("Car Collection App", ()  => {
    test('GET /dev returns HTML with Ferrari', async () => {
        const res = await request(app).get('/dev');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Ferrari 488 GTB');
        expect(res.text).toContain('$250,000');
    });

    test('GET /dev returns HTML with Bugatti', async () => {
        const res = await request(app).get('/dev');
        expect(res.text).toContain('Bugatti Chiron');
        expect(res.text).toContain('$3,000,000');
    });

    test('GET /dev returns HTML with Aston Martin', async () => {
        const res = await request(app).get('/dev');
        expect(res.text).toContain('Aston Martin DB5');
        expect(res.text).toMatch(/\$1,?200,?000/);
    });

    test('Static CSS is served', async () => {
        const res = await request(app).get('/back.css');
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toMatch(/css/);
    });

    test('Unknown route returns 404', async () => {
        const res = await request(app).get('/not-a-real-page');
        expect(res.statusCode).toBe(404);
    });
}
)