import ContactArrayModel from './ContactArrayModel';
import ContactObjectModel from './ContactObjectModel';
const Realm = require('realm');
export default new Realm({schema: [ContactArrayModel, ContactObjectModel]});
