var path = require("path");
require('dotenv').config({ path: __dirname + '/.env' });
const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");
const testAccount = { email: process.env.TEST_ACCOUNT_EMAIL, password: process.env.TEST_ACCOUNT_PASSWORD };
let token;

/* Connecting to the database before each test and logging user */
beforeEach(async () => {
    await mongoose.connect(process.env.ATLAS_URI);
    const response = await request(app).post('/api/user/signin').send(testAccount);
    token = response.body.data.token;
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
});


describe("Test application", () => {
    test("Not found for site 404", async () => {
        const res = await request(app).get('/wrongPath');
        expect(res.statusCode).toEqual(404);
    });

    test("Health check", async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("Ok")
    });
});

describe("testing task routes", () => {

    /* 
        testing /task/read 
    */
    test("get tasks without auth", async () => {
        let perPage = 5;
        let page = 1;
        const res = await request(app).get(`/api/task/read?perPage=${perPage}&page=${page}`)
        expect(res.body.success).toEqual(false);
    });

    test("not passing correct query parameters", async () => {
        const res = await request(app).get('/api/task/read').set('authorization', `Bearer ${token}`);
        expect(res.body.success).toEqual(false);
    });

    test("getting all tasks correctly", async () => {
        let perPage = 5;
        let page = 1;
        const res = await request(app).get(`/api/task/read?perPage=${perPage}&page=${page}`).set('authorization', `Bearer ${token}`);
        expect(res.body.success).toEqual(true);
    });

    /* 
        testing /task/update
    */
    var task_id = "";
    test("creating task without auth", async () => {
        const payload = {
            task: "sample task",
            date: new Date(),
            status: false
        };

        const res = await request(app).post('/api/task/create').send(payload);
        expect(res.body.success).toEqual(false);
    });

    test("wrong payload in task creation", async () => {
        const payload = {
            task: "sample task",
            status: false
        };

        const res = await request(app).post('/api/task/create').send(payload).set('authorization', `Bearer ${token}`);
        expect(res.body.success).toEqual(false);
    });

    test("creating task correctly", async () => {
        const payload = {
            task: "sample task",
            date: new Date(),
            status: false
        };

        const res = await request(app).post('/api/task/create').send(payload).set('authorization', `Bearer ${token}`);
        expect(res.body.success).toEqual(true);
        task_id = res.body.data._id ? res.body.data._id : '';
    });

    /* 
        testing /task/update
    */
    test("updating task without auth", async () => {
        const payload = {
            _id: new ObjectId(task_id)
        };

        const res = await request(app).patch('/api/task/update').send(payload);
        expect(res.body.success).toEqual(false);
    });

    test("wrong payload in task update", async () => {
        const payload = {};
        const res = await request(app).patch('/api/task/update').send(payload).set('authorization', `Bearer ${token}`);
        expect(res.body.success).toEqual(false);
    });

    test("updating task correctly", async () => {
        const payload = {
            _id: new ObjectId(task_id)
        };

        const res = await request(app).patch('/api/task/update').send(payload).set('authorization', `Bearer ${token}`);
        expect(res.body.success).toEqual(true);
    });

    /* 
        testing /task/delete
    */
    test("delete task without auth", async () => {
        const payload = {
            _id: new ObjectId(task_id)
        };

        const res = await request(app).delete('/api/task/delete').send(payload);
        expect(res.body.success).toEqual(false);
    });

    test("wrong payload in task delete", async () => {
        const payload = {};
        const res = await request(app).delete('/api/task/delete').send(payload).set('authorization', `Bearer ${token}`);
        expect(res.body.success).toEqual(false);
    });

    test("deleting task correctly", async () => {
        const payload = {
            _id: new ObjectId(task_id)
        };

        const res = await request(app).delete('/api/task/delete').send(payload).set('authorization', `Bearer ${token}`);
        expect(res.body.success).toEqual(true);
    });

    /* 
        testing /task/sort
    */
        test("sort tasks without auth", async () => {
            const payload = {
                perPage: 5,
                page: 1,
                order: "desc"
            };
    
            const res = await request(app).post('/api/task/sort').send(payload);
            expect(res.body.success).toEqual(false);
        });
    
        test("wrong payload in tasks sorting", async () => {
            const payload = {};
            const res = await request(app).post('/api/task/sort').send(payload).set('authorization', `Bearer ${token}`);
            expect(res.body.success).toEqual(false);
        });
    
        test("sorting task correctly", async () => {
            const payload = {
                perPage: 5,
                page: 1,
                order: "desc"
            };
    
            const res = await request(app).post('/api/task/sort').send(payload).set('authorization', `Bearer ${token}`);
            expect(res.body.success).toEqual(true);
        });
})

