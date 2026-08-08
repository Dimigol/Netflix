import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo;

export async function setupTestDb() {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
}

export async function teardownTestDb() {
  await mongoose.disconnect();
  if (mongo) {
    await mongo.stop();
  }
}

export async function clearTestDb() {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map(collection => collection.deleteMany({})));
}
