import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from '../helpers/test-helpers';
import { DataSource } from 'typeorm';
import { seedChains } from '../fixtures/chains.fixtures';

//  Define E2E test suite for ChainController
describe('ChainController (e2e)', () => {
  let app: INestApplication; // Define variable to store NestJS app instance
  let dataSource: DataSource; // Define variable to store database connection

  // Set up test environment before running tests
  beforeAll(async () => {
    app = await createTestingApp(); // Create a new instance of the test application

    // Get database connection from the NestJS app
    dataSource = app.get(DataSource);

    // seed the database with test data before running tests
    await seedChains(dataSource);
  });

  // Clean up after tests are completed
  afterAll(async () => {
    await app.close(); // Close the NestJS app instance
  });

  // Test GET /chains endpoint
  it('GET /chains', async () => {
    return request(app.getHttpServer()) // Use Supertest to make an HTTP GET request
      .get('/chains') // Request the /chains endpoint
      .expect(200) // Expect HTTP status 200 (OK)
      .expect((res) => {
        expect(res.body).toHaveLength(2); // Verify the response contains exactly 2 records
      });
  });
});
