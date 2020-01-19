import React, { Component } from 'react';
import ContactSync from './src/components/contactSync/contactSync';
import DocumentScanner from './src/components/DocumentScanner';
//import MyContactSync from './src/components/MyContactSync/MyContactSync';
//import RealStoreData from './src/components/RealmDatabaseTest/RealStoreData';
//import MyAppContainer from './src/components/officialSample/components/todo-app';

export default class App extends Component {
  render() {
    return <ContactSync />;
  }
}
