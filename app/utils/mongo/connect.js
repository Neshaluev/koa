import { MONGO_URI } from '../../config';
import mongooseConnector from '../../connectors/mongoose-connector';

export default () => mongooseConnector(MONGO_URI);
