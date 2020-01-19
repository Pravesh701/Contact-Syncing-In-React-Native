import Realm, {Object} from 'realm';
import {GiftedChatMessageModel, Participant} from '../Chat/types';

const repository = new Realm({
  schema: [
    {
      name: 'MyDetails',
      properties: {
        avatar_url: 'string?',
        username: 'string',
        id: 'int',
      },
    },
    {
      name: 'GiftedChatUserModel',
      primaryKey: '_id',
      properties: {
        _id: 'int',
        name: 'string',
        avatar: 'string',
      },
    },
    {
      name: 'PayloadContent',
      properties: {
        name: 'string?',
      },
    },
    {
      name: 'Payload',
      properties: {
        type: 'string?',
        content: 'PayloadContent?',
        url: 'string?',
      },
    },
    {
      name: 'ChatModel',
      primaryKey: '_id',
      properties: {
        _id: 'int',
        text: 'string',
        system: 'bool?',
        payload: 'Payload?',
        createdAt: 'string',
        user: 'GiftedChatUserModel',
        comment_before_id: 'int',
        image: 'string?',
        video: 'string?',
        document: 'string?',
      },
    },
    {
      name: 'ChatDetail',
      primaryKey: 'id',
      properties: {
        id: 'int',
        messages: 'ChatModel[]',
        myDetails: 'MyDetails',
      },
    },
    {
      name: 'MediaDB',
      primaryKey: 'id',
      properties: {
        id: 'int',
        filePath: 'string',
      },
    },
  ],
});

const ChatService = {
  loadMessages(id: number) {
    console.log('read from room: ', id);
    const data = Array.from(
      repository.objects('ChatDetail').filtered(`id = ${id}`),
    );
    if (data.length) {
      const parsedData = [];
      //@ts-ignore
      for (const message of data[0].messages) {
        parsedData.push(JSON.parse(JSON.stringify(message)));
      }
      return {
        messages: parsedData,
        myDetails: JSON.parse(JSON.stringify(data[0].myDetails)),
      };
    }
  },
  saveMessages(
    id: number,
    messages: Array<GiftedChatMessageModel>,
    userDetails: Participant,
  ) {
    console.log('write data: ', id);
    const myDetails = {
      id: userDetails.id,
      username: userDetails.username,
      avatar_url: userDetails.avatar_url,
    };

    repository.write(() => {
      return repository.create('ChatDetail', {id, messages, myDetails}, true);
    });
  },
};

const MediaService = {
  saveMedia(id: number, filePath: string) {
    repository.write(() => {
      return repository.create('MediaDB', {id, filePath});
    });
  },
  readMedia(id: number) {
    const data = repository.objects('MediaDB').filtered(`id = ${id}`);

    if (data.length) {
      return JSON.parse(JSON.stringify(data[0]));
    } else {
      return null;
    }
  },
};

export {ChatService, MediaService};
