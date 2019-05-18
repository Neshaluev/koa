import mongoose from 'mongoose';

export default () => mongoose.connection.db.dropDatabase();
