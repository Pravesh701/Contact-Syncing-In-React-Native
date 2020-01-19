import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';

import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';

class MyContactSync extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listType: 'FlatList',
      listViewData: Array(20)
        .fill('')
        .map((_, i) => ({key: `${i}`, text: `item #${i}`})),
    };

    this.rowSwipeAnimatedValues = {};
    Array(20)
      .fill('')
      .forEach((_, i) => {
        this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
      });
  }

  closeRow(rowMap, rowKey) {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }

  deleteRow(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey);
    const newData = [...this.state.listViewData];
    const prevIndex = this.state.listViewData.findIndex(
      item => item.key === rowKey,
    );
    newData.splice(prevIndex, 1);
    this.setState({listViewData: newData});
  }

  deleteSectionRow(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey);
    const [section] = rowKey.split('.');
    const newData = [...this.state.sectionListData];
    const prevIndex = this.state.sectionListData[section].data.findIndex(
      item => item.key === rowKey,
    );
    newData[section].data.splice(prevIndex, 1);
    this.setState({sectionListData: newData});
  }

  onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  onSwipeValueChange = swipeData => {
    const {key, value} = swipeData;
    this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  };

  _renderItemCalled = data => {
    return (
      <TouchableHighlight
        onPress={() => console.log('You touched me')}
        style={styles.rowFront}
        underlayColor={'#AAA'}>
        <View style={styles.listContainertTyle}>
          <View style={styles.imageContainerStyle}>
            <Image
              style={styles.profilePicStyle}
              source={require('../../images/prifile_LOGO.png')}
            />
          </View>
          <View style={styles.contactDetailContainer}>
            <Text style={styles.nameStyle}>
              {`${data.givenName} ${data.familyName}`}
            </Text>
            <Text style={styles.mobileNumberStyle}>+91-7906016475</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <SwipeListView
        data={this.props.data}
        renderItem={this._renderItemCalled}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            <Text>Left</Text>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnLeft]}
              onPress={() => this.closeRow(rowMap, data.item.key)}>
              <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={() => this.deleteRow(rowMap, data.item.key)}>
              <Animated.View
                style={[
                  styles.trash,
                  {
                    transform: [
                      {
                        scale: this.rowSwipeAnimatedValues[
                          data.item.key
                        ].interpolate({
                          inputRange: [45, 90],
                          outputRange: [0, 1],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}>
                <Image
                  source={require('../../images/trash.png')}
                  style={styles.trash}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-150}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={this.onRowDidOpen}
        onSwipeValueChange={this.onSwipeValueChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  standalone: {
    marginTop: 30,
    marginBottom: 30,
  },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 50,
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: '#8BC645',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 120,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    width: Dimensions.get('window').width / 4,
  },
  trash: {
    height: 25,
    width: 25,
  },
  nameStyle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  mobileNumberStyle: {
    fontSize: 14,
    marginTop: 10,
  },
  contactDetailContainer: {
    marginStart: 20,
  },

  listContainertTyle: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  imageContainerStyle: {
    width: 60,
    height: 60,
  },
  profilePicStyle: {
    flex: 1,
    width: null,
    height: null,
  },
});

export default MyContactSync;
