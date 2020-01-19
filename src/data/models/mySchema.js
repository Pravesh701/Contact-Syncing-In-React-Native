import {Strings} from '../../constants';

const ContactObjectModel = {
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
    familyName: 'string?',
    givenName: 'string?',
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
    hasThumbnail: 'bool?',
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

const ContactArrayModel = {
  name: Strings.ContactArray,
  properties: {
    id: 'int?',
    data: {type: 'list', objectType: 'Object'},
  },
};

export {ContactObjectModel};
