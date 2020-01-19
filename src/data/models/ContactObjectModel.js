import Realm from 'realm';
export default class ContactObjectModel extends Realm.Object {}
import {Strings} from '../../constants';

ContactObjectModel.schema = {
  name: Strings.ContactObject,
  properties: {
    recordID: 'string?',
    company: 'string?',
    emailAddresses: [
      {
        label: 'string?',
        email: 'string?',
      },
    ],
    familyName: {type: 'string', optional: true},
    givenName: {type: 'string', optional: true},
    jobTitle: 'string?',
    note: 'string?',
    urlAddresses: [
      {
        label: 'string?',
        url: 'string?',
      },
    ],
    middleName: 'string?',
    phoneNumbers: [
      {
        label: 'string?',
        number: 'string?',
      },
    ],
    hasThumbnail: 'boolean?',
    thumbnailPath: 'string?',
    postalAddresses: [
      {
        street: 'string?',
        city: 'string?',
        state: 'string?',
        region: 'string?',
        postCode: 'string?',
        country: 'string?',
        label: 'string?',
      },
    ],
    birthday: 'date?',
  },
};
