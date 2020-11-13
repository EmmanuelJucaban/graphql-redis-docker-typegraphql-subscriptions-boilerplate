import dotenv from 'dotenv';
import supertest from 'supertest';

dotenv.config();
import { createApp } from '../../../testUtils';
import { db } from '../../';
import { createTestAccount } from '../../../database/createTestAccount';

describe('RanchResolver', function () {
  describe('Functional', () => {
    let connection;
    let app;
    let currentViewer;
    let agent;
    let authenticatedAgent;
    let clearTestData;
    let ranch1Test;
    let ranch2Test;
    let field1Test;
    // let ranchCount;

    describe('Create Ranch', () => {
      beforeEach(async (done) => {
        jest.setTimeout(3000000);
        const { httpServer, connection: dbConnection } = await createApp();
        connection = dbConnection;
        const {
          viewer,
          ranch1,
          ranch2,
          field1,
          dropTestData,
        } = await createTestAccount()
        ranch1Test = ranch1;
        ranch2Test = ranch2;
        field1Test = field1;
        const mutation = `mutation {
        signIn(signInInput: { email: "${ viewer.email }", password: "testingPass"}) {
          id
          name
          role
          token
        }
      }`;
        clearTestData = dropTestData;
        app = httpServer;
        currentViewer = viewer;
        agent = supertest.agent(app);
        authenticatedAgent = agent
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: mutation })
        done();
      });

      afterEach(async (done) => {
        await clearTestData();
        connection.disconnect();
        done();
      });

      it('should create a ranch with all of the values given and have an author and accountId', (done) => {
        const createRanch = `mutation  {
        createRanch(createRanchInput: 
        { 
          name: "Ranch 1",
          exportIdentifier: "Ranch 1",
          code: "Ranch 1",
          active: true
        }) {
         name
         exportIdentifier
         code
         active
         authorId
         accountId
         author {
          id
          name
         }
        }
      }`;

        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                console.log(e);
                done(e);
              }

              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: createRanch });

              const barcode = await db.Barcode.findOne({ code: 'Ranch 1', accountId: currentViewer.accountId });
              const ranch = await db.Ranch.findOne({ name: 'Ranch 1', accountId: currentViewer.accountId });
              expect(ranch).toBeDefined();
              expect(barcode).toBeDefined();
              expect(body.data.createRanch.name).toEqual(ranch.name);
              expect(body.data.createRanch.code).toEqual(ranch.code);
              expect(body.data.createRanch.exportIdentifier).toEqual(ranch.exportIdentifier);
              expect(body.data.createRanch.accountId).toEqual(currentViewer.accountId.toString());
              expect(body.data.createRanch.author.name).toEqual(currentViewer.name);
              expect(barcode.modelId.toString()).toEqual(ranch._id.toString());
              expect(barcode.model).toBe('Ranch');
              expect(barcode.code).toBe(ranch.code);
              done();
            });
        } catch (e) {
          done(e);
        }
      });
      //   End of it Create Ranch success
      it('should fail when a name is not provided', async (done) => {
        const createRanch = `mutation  {
        createRanch(createRanchInput: 
          { 
            name: "${ ranch1Test.name }"
            exportIdentifier: "Ranch 1",
            code: "Ranch 1",
            active: true
          }) {
           name
          }
        }`;
        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                console.log(e);
                done(e);
              }
              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: createRanch });
              expect(body.errors[0].message).toEqual('Ranch already exists with given name');
              done();
            });
        } catch (e) {
          done(e);
        }
      });
      //   End of it Create Ranch failure without name

      it('should error when creating a Ranch with a duplicate name', async (done) => {
        const createRanch = `mutation  {
        createRanch(createRanchInput: 
          { 
            name: "${ ranch1Test.name }"
            exportIdentifier: "Ranch 1",
            code: "Ranch 1",
            active: true
          }) {
           name
          }
        }`;
        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                console.log(e);
                done(e);
              }
              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: createRanch });

              expect(body.errors[0].message).toEqual('Ranch already exists with given name');
              done();
            });
        } catch (e) {
          done(e);
        }
      });
      //   End of it should fail with duplicate ranch name
      it('should show proper error message when creating a ranch with a code that a field already has', async (done) => {
        const createRanch = `mutation  {
        createRanch(createRanchInput: 
          { 
            name: "Ranch 1"
            exportIdentifier: "Ranch 1",
            code: "${field1Test.code}",
            active: true
          }) {
           name
          }
        }`;
        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                console.log(e);
                done(e);
              }
              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: createRanch });

              const barcode = await db.Barcode.findOne({ code: field1Test.code });
              expect(body.errors[0].message).toBe(`Error: Barcode is currently being used by the ${barcode.model} with the name of ${field1Test.name}\n    belonging to the Ranch with the name of ${ranch1Test.name}`);
              done();
            });
        } catch (e) {
          done(e);
        }
      });
    //   End for it should handle error properly when creating a ranch with a code that belongs to a field
    });
    // End of Describe Create Ranches

    describe('Fetching Ranch', () => {
      beforeEach(async (done) => {
        jest.setTimeout(3000000);
        const { httpServer, connection: dbConnection } = await createApp();
        connection = dbConnection;
        const {
          viewer,
          ranch1,
          ranch2,
          dropTestData,
        } = await createTestAccount()
        ranch1Test = ranch1;
        ranch2Test = ranch2;
        const mutation = `mutation {
        signIn(signInInput: { email: "${ viewer.email }", password: "testingPass"}) {
          id
          name
          role
          token
        }
      }`;
        clearTestData = dropTestData;
        app = httpServer;
        currentViewer = viewer;
        agent = supertest.agent(app);
        authenticatedAgent = agent
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: mutation })
        done();
      });

      afterEach(async (done) => {
        await clearTestData();
        connection.disconnect();
        done();
      });

      it('should fetch all the ranches of a user', async (done) => {
        const fetchRanches = `query {
        fetchRanches {
          id
          name
          accountId
          active
          code
          createdAt
          deleted
          exportIdentifier
          fieldIds
        }
      }`;

        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                done(e);
              }
              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: fetchRanches });
              const [ ranch1, ranch2 ] = body.data.fetchRanches;
              expect(body.data.fetchRanches.length).toEqual(2);
              expect(ranch1.active).toEqual(ranch1Test.active);
              expect(ranch2.active).toEqual(ranch2Test.active);
              expect(ranch1.name).toEqual(ranch1Test.name);
              expect(ranch2.accountId).toEqual(ranch2Test.accountId.toString());
              expect(ranch1.code).toEqual(ranch1Test.code);
              expect(ranch2.deleted).toEqual(ranch2Test.deleted);
              expect(ranch1.name).toBe(ranch1Test.name);
              expect(ranch2.exportId).toEqual(ranch2Test.exportId);
              done();
            });
        } catch (e) {
          done(e);
        }
      });
      //   End of it Fetch Ranches

      it('should fetch a ranch by id', async (done) => {
        const fetchRanch = `query {
        fetchRanch(fetchRanchInput: {
         id: "${ ranch1Test.id }"
        }){
         id
         name
         code
         exportIdentifier
        }
      }`;

        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                done(e);
              }
              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: fetchRanch });

              expect(body.data.fetchRanch.id).toEqual(ranch1Test.id);
              expect(body.data.fetchRanch.name).toEqual(ranch1Test.name);
              expect(body.data.fetchRanch.code).toEqual(ranch1Test.code);
              expect(body.data.fetchRanch.exportIdentifier).toEqual(ranch1Test.exportIdentifier);
              done();
            });
        } catch (e) {
          done(e);
        }
      });
      //   End of it should fetch a ranch by it's ID
    });
    // End of Describe Fetch Ranches'

    describe('Update Ranch', () => {
      beforeEach(async (done) => {
        jest.setTimeout(3000000);
        const { httpServer, connection: dbConnection } = await createApp();
        connection = dbConnection;
        const {
          viewer,
          ranch1,
          ranch2,
          field1,
          dropTestData,
        } = await createTestAccount()
        ranch1Test = ranch1;
        ranch2Test = ranch2;
        field1Test = field1;
        const mutation = `mutation {
        signIn(signInInput: { email: "${ viewer.email }", password: "testingPass"}) {
          id
          name
          role
          token
        }
      }`;
        clearTestData = dropTestData;
        app = httpServer;
        currentViewer = viewer;
        agent = supertest.agent(app);
        authenticatedAgent = agent
          .post('/graphql')
          .set('Accept', 'application/json')
          .send({ query: mutation })
        done();
      });

      afterEach(async (done) => {
        await clearTestData();
        connection.disconnect();
        done();
      });
      it('should update a ranch properly', async (done) => {
        const updateRanch = `mutation {
        updateRanch(updateRanchInput: {
         id: "${ ranch1Test.id }",
         name: "New Ranch",
         code: "New Ranch",
         exportIdentifier: "New ExportId",
         active: false,
        }){
         id
         name
         code
         exportIdentifier
         active
        }
      }`;
        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                done(e);
              }
              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: updateRanch });

              const updatedRanch = await db.Ranch.findById(ranch1Test.id);
              const updatedBarcode = await db.Barcode.findOne({ modelId: updatedRanch._id });
              expect(body.data.updateRanch.id).toEqual(updatedRanch.id);
              expect(body.data.updateRanch.name).toEqual(updatedRanch.name);
              expect(body.data.updateRanch.code).toEqual(updatedRanch.code);
              expect(body.data.updateRanch.exportIdentifier).toEqual(updatedRanch.exportIdentifier);
              expect(updatedBarcode.code).toEqual(updatedRanch.code);
              done();
            });
        } catch (e) {
          done(e);
        }
      });
      //   End of succesful update ranch
      it('should fail when updating a ranch name to a ranch name that already exists', async (done) => {
        const updateRanch = `mutation {
        updateRanch(updateRanchInput: {
         id: "${ ranch1Test.id }",
         name: "${ranch2Test.name}",
         code: "New Ranch",
         exportIdentifier: "New ExportId",
         active: false,
        }){
         id
         name
         code
         exportIdentifier
         active
        }
      }`;
        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                done(e);
              }
              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: updateRanch });

              expect(body.errors[0].message).toBe('Ranch already exists with that name within your account');
              done();
            });
        } catch (e) {
          done(e);
        }
      });
    // End of updating a ranch with duplicate name

      it('should fail when updating a ranch code to a code that already exists', async (done) => {
        const updateRanch = `mutation {
        updateRanch(updateRanchInput: {
         id: "${ ranch1Test.id }",
         name: "New Name",
         code: "${ ranch2Test.code }",
         exportIdentifier: "New ExportId",
         active: false,
        }){
         id
         name
         code
         exportIdentifier
         active
        }
      }`;
        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                done(e);
              }
              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: updateRanch });

              const barcode = await db.Barcode.findOne({ code: ranch2Test.code });
              expect(body.errors[0].message).toBe(`Error: Barcode is currently being used by the ${barcode.model} with the name of ${barcode.modelName}`);
              done();
            });
        } catch (e) {
          done(e);
        }
      });
    //   End of updating ranch with duplicate code

      it('should show proper error message when creating a ranch with a code that a field already has', async (done) => {
        const updateRanch = `mutation  {
        updateRanch(updateRanchInput: 
          { 
            id: "${ ranch1Test.id }",
            name: "Ranch 1"
            exportIdentifier: "Ranch 1",
            code: "${field1Test.code}",
            active: true
          }) {
           name
          }
        }`;
        try {
          authenticatedAgent
            .end(async (e, res) => {
              if (e) {
                console.log(e);
                done(e);
              }
              const { body } = await agent
                .post('/graphql')
                .set('X-CSRF-TOKEN', res.body.data.signIn.token)
                .set('Accept', 'application/json')
                .send({ query: updateRanch });

              const barcode = await db.Barcode.findOne({ code: field1Test.code });
              expect(body.errors[0].message).toBe(`Error: Barcode is currently being used by the ${barcode.model} with the name of ${field1Test.name}\n    belonging to the Ranch with the name of ${ranch1Test.name}`);
              done();
            });
        } catch (e) {
          done(e);
        }
      });
    });
    //   End of Describe update Ranch
  });
//   End of functional
});


