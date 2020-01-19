import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  View,
  PermissionsAndroid,
  FlatList,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import Contacts from 'react-native-contacts';
import ListItem from './ListItem';
import Avatar from './Avatar';
import SearchBar from './SearchBar';
import {Strings, vw, DesignWidth, vh} from '../../constants';
//const Realm = require('realm');
import Realm, {Object, UpdateMode} from 'realm';

const emailAddresses = {
  name: 'EmailModel',
  properties: {
    label: 'string?',
    email: 'string?',
  },
};
const pnoneNumber = {
  name: 'NameModel',
  properties: {
    label: 'string?',
    number: 'string?',
  },
};
const urlAddress = {
  name: 'URLAddress',
  properties: {
    label: 'string?',
    url: 'string?',
  },
};
const postalAddress = {
  name: 'PostalAddress',
  properties: {
    street: 'string?',
    city: 'string?',
    state: 'string?',
    region: 'string?',
    postCode: 'string?',
    country: 'string?',
    label: 'string?',
  },
};
const personDate = {
  name: 'PersonDate',
  properties: {
    day: 'int?',
    month: 'int?',
    year: 'int?',
  },
};
const ContactObjectModel = {
  name: 'MyObject',
  properties: {
    recordID: 'string?',
    company: 'string?',
    emailAddresses: 'EmailModel[]',
    familyName: 'string?',
    givenName: 'string?',
    jobTitle: 'string?',
    note: 'string?',
    urlAddresses: 'URLAddress[]',
    middleName: 'string?',
    phoneNumbers: 'NameModel[]',
    hasThumbnail: 'bool?',
    thumbnailPath: 'string?',
    postalAddresses: 'PostalAddress[]',
    birthday: 'PersonDate',
  },
};
const finalContactObject = {
  name: Strings.ContactObject,
  properties: {
    arrayContact: 'MyObject[]',
  },
};
const localContacts = new Realm({
  schema: [
    finalContactObject,
    ContactObjectModel,
    emailAddresses,
    pnoneNumber,
    postalAddress,
    urlAddress,
    personDate,
  ],
});

class ContactSync extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.state = {
      contacts: [],
      localContactsData: [],
      searchPlaceholder: 'Search',
      realm: null,
      contLength: null,
    };
  }

  storeContactToRealm = async () => {
    let length = localContacts.objects('MyObject').length;

    if (length === 0) {
      localContacts.write(() => {
        let CustomContact = localContacts.create(Strings.ContactObject, {
          arrayContact: this.statstoreContactToRealme.localContactsData,
        });
        this.copyContactToDB();
      });
    } else if (length !== this.state.contLength) {
      console.log('Path ', localContacts.path);
      let sortedContact = localContacts.objects('MyObject').sorted('givenName');
      let initialArray = [];
      for (let i = 0; i < length; i++) {
        initialArray.push(sortedContact[i]);
      }

      let myLocalArray = this.state.localContactsData;
      let count = 0;
      if (length > this.state.contLength) {
        //deleted contact
        let DeletedArr = [];
        for (let i = 0; i < length; i++) {
          let data = null;
          data = myLocalArray.find(
            element => initialArray[i].recordID === element.recordID,
          );
          if (data == null) {
            DeletedArr.push(initialArray[i]);
          }
        }
        console.log('deleted contact ', DeletedArr);
      } else {
        //updated contact
        let updatedData = [];
        for (let i = 0; i < this.state.contLength; i++) {
          let data = null;
          data = initialArray.find(
            element => myLocalArray[i].recordID === element.recordID,
          );
          if (data == null) {
            updatedData.push(myLocalArray[i]);
          }
        }
        console.log('updated contact', updatedData);
      }
      localContacts.write(() => {
        localContacts.deleteAll();
        let CustomContact = localContacts.create(Strings.ContactObject, {
          arrayContact: this.state.localContactsData,
        });
        this.copyContactToDB();
      });
    } else {
      this.copyContactToDB();
    }
  };

  closeRealm() {
    localContacts.close();
  }

  copyContactToDB() {
    let length = localContacts.objects('MyObject').length;
    let sortedContact = localContacts.objects('MyObject').sorted('givenName');
    let myArr = [];
    for (let i = 0; i < length; i++) {
      myArr.push(sortedContact[i]);
    }
    this.setState({
      contacts: myArr,
      searchPlaceholder: `Search ${length} contacts`,
    });
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        this.loadContacts();
        // if (localContacts.objects('MyObject').length !== 0) {
        //   this.copyContactToDB();
        // }
      });
    } else {
      this.loadContacts();
      // if (localContacts.objects('MyObject').length !== 0) {
      //   this.copyContactToDB();
      // }
    }
  }

  loadContacts() {
    Contacts.getAll((err, contactsall) => {
      if (err === 'denied') {
        console.warn('Permission to access contacts was denied');
      } else {
        //let myContact = contactsall.sort();
        this.setState({contacts: contactsall}, () => {
          // Contacts.getCount(count => {
          //   this.setState({contLength: count}, () => {
          //     this.storeContactToRealm();
          //   });
          // });
        });
      }
    });
  }

  search(text) {
    const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    const emailAddressRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (text === '' || text === null) {
      this.loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text, (err, contacts) => {
        this.setState({contacts});
      });
    } else if (emailAddressRegex.test(text)) {
      Contacts.getContactsByEmailAddress(text, (err, contacts) => {
        this.setState({contacts});
      });
    } else {
      Contacts.getContactsMatchingString(text, (err, contacts) => {
        this.setState({contacts});
      });
    }
  }

  renderFlatListItem = rowData => {
    const {item, index} = rowData;
    let contact = item;
    return (
      <View style={styles.flatListContainerStyle}>
        <Avatar
          img={item.hasThumbnail ? {uri: item.thumbnailPath} : undefined}
          placeholder={getAvatarInitials(
            `${item.givenName} ${item.familyName}`,
          )}
          width={40}
          height={40}
        />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginStart: 20,
          }}>
          <Text style={styles.contact_details}>
            {`${item.givenName} `} {item.familyName}
          </Text>
          {item.phoneNumbers.map(phone => (
            <Text style={styles.phones}>
              {phone.label} : {phone.number}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          style={styles.container}
          source={require('../../images/backMe.jpeg')}>
          <View
            style={{
              paddingLeft: 100,
              paddingRight: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../images/logo.png')}
              style={{
                aspectRatio: 6,
                resizeMode: 'contain',
              }}
            />
          </View>
          <SearchBar
            searchPlaceholder={this.state.searchPlaceholder}
            onChangeText={this.search}
          />

          <FlatList
            data={this.state.contacts}
            keyExtractor={(item, index) => (index + item).toString()}
            renderItem={this.renderFlatListItem}
          />

          {/* <ScrollView style={{flex: 1, width: '100%'}}>
          {this.state.contacts.map(contact => {
            return (
              <ListItem
                leftElement={
                  <Avatar
                    img={
                      contact.hasThumbnail
                        ? {uri: contact.thumbnailPath}
                        : undefined
                    }
                    placeholder={getAvatarInitials(
                      `${contact.givenName} ${contact.familyName}`,
                    )}
                    width={40}
                    height={40}
                  />
                }
                key={contact.recordID}
                title={`${contact.givenName} ${contact.familyName}`}
                description={`${contact.company}`}
                onPress={() => Contacts.openExistingContact(contact, () => {})}
                onDelete={() =>
                  Contacts.deleteContact(contact, () => {
                    this.loadContacts();
                  })
                }
              />
            );
          })}
        </ScrollView> */}

          {/* <TouchableOpacity
          onPress={() => this.storeContactToRealm()}
          style={styles.btnStyle}>
          <Text>Check Realm</Text>
        </TouchableOpacity> */}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  btnStyle: {
    position: 'absolute',
    bottom: 0,
    width: vw(100),
    height: vh(50),
    borderRadius: 62.5,
    left: 0,
    backgroundColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phones: {
    fontSize: vw(20),
    //textAlign: 'center',
    marginTop: vh(2),
  },
  contact_details: {
    fontSize: vw(20),
    // textAlign: 'center',
    marginTop: vh(4),
    color: 'red',
  },
  flatListContainerStyle: {
    flex: 1,
    width: vw(DesignWidth),
    flexDirection: 'row',
    backgroundColor: 'lightblue',
    marginTop: vh(8),
    borderRadius: vw(20),
    //justifyContent: 'center',
    alignItems: 'center',
    paddingStart: vw(10),
  },
});

const getAvatarInitials = textString => {
  if (!textString) return '';

  const text = textString.trim();

  const textSplit = text.split(' ');

  if (textSplit.length <= 1) return text.charAt(0);

  const initials =
    textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);

  return initials;
};

export default ContactSync;
