import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
const Realm = require('realm');

// Define your models and their properties
const CarSchema = {
  name: 'Car',
  properties: {
    make: 'string',
    model: 'string',
    miles: {type: 'int', default: 0},
  },
};

const PersonSchema = {
  name: 'Person',
  properties: {
    name: 'string',
    cars: {type: 'list', objectType: 'Car'},
  },
};

export default class RealStoreData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      realm: null,
    };
  }
  componentDidMount() {
    this.storeDataOnRealm();
  }
  componentWillUnmount() {
    // Close the realm if there is one open.
    this.closeRealm();
  }
  closeRealm() {
    const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }

  storeDataOnRealm() {
    // Initialize a Realm with Car and Person models
    Realm.open({schema: [CarSchema, PersonSchema]}).then(realm => {
      // Add persons and their cars
      realm.write(() => {
        let john = realm.create('Person', {
          name: 'John',
          cars: [],
        });
        john.cars.push({
          make: 'Honda',
          model: 'Accord',
          miles: 1500,
        });
        john.cars.push({
          make: 'Toyota',
          model: 'Prius',
          miles: 2780,
        });

        let joan = realm.create('Person', {
          name: 'Joan',
          cars: [],
        });
        joan.cars.push({
          make: 'Skoda',
          model: 'Octavia',
          miles: 1120,
        });
        joan.cars.push({
          make: 'Ford',
          model: 'Fiesta',
          miles: 95,
        });
        joan.cars.push({
          make: 'VW',
          model: 'Golf',
          miles: 1270,
        });

        let jill = realm.create('Person', {
          name: 'Jill',
          cars: [],
        });

        let jack = realm.create('Person', {
          name: 'Jack',
          cars: [],
        });
        jack.cars.push({
          make: 'Porche',
          model: '911',
          miles: 965,
        });
      });

      // Find car owners
      let carOwners = realm.objects('Person').filtered('cars.@size > 0');
      console.log('Car owners');
      for (let p of carOwners) {
        console.log(`  ${p.name}`);
      }

      // Find who has been driver longer than average
      let average = realm.objects('Car').avg('miles');
      let longerThanAverage = realm
        .objects('Person')
        .filtered('cars.@sum.miles > $0', average);
      console.log(`Longer than average (${average})`);
      for (let p of longerThanAverage) {
        console.log(`  ${p.name}: ${p.cars.sum('miles')}`);
      }

      this.closeRealm();
    });
  }

  render() {
    const info = this.state.realm
      ? 'Number of dogs in this Realm: ' +
        this.state.realm.objects('Dog').length
      : 'Loading...';
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btnStyle}>
          <Text>Store Data</Text>
        </TouchableOpacity>
        <Text style={styles.welcome}>{info}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
