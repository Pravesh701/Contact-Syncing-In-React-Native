import Realm from 'realm';
import {Strings} from '../../constants';
export default class ContactArrayModel extends Realm.Object {}

ContactArrayModel.schema = {
  name: Strings.ContactArray,
  properties: {
    id: 'int?',
    data: {type: 'list', objectType: 'Object'},
  },
};
