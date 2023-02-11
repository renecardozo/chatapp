import { CometChat } from '@cometchat-pro/chat';
import { configChat } from '../config';


export default class CCManager {
  static LISTENER_KEY_MESSAGE = 'msglistener';
  static appId = configChat.appId;
  static apiKey = configChat.apiKey;
  static authKey = configChat.authKey;
  static region = configChat.REGION
  static LISTENER_KEY_GROUP = 'grouplistener';

  static init() {
    const appID = configChat.appId;
    const region = configChat.REGION;
    const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
    CometChat.init(appID, appSetting).then(
      () => {
        console.log('Initialization completed successfully');
      },
      error => {
        console.log('Initialization failed with error:', error);
      }
    );
  }

  static getTextMessage(uid, text, msgType) {
    if (msgType === 'user') {
      return new CometChat.TextMessage(
        uid,
        text,
        CometChat.RECEIVER_TYPE.USER
      );
    } else {
      return new CometChat.TextMessage(
        uid,
        text,
        CometChat.RECEIVER_TYPE.GROUP
      );
    }
  }

  static getLoggedinUser() {
    return CometChat.getLoggedinUser();
  }

  static login(UID) {
    return CometChat.login(UID, CCManager.apiKey);
  }

  static getGroupMessages(GUID, callbacak, limit=30) {
    const messageRequest = new CometChat.MessagesRequestBuilder()
                                .setGUID(GUID)
                                .setLimit(limit)
                                .build();
    callbacak();
    return messageRequest.fetchPrevious();
  }

  static sendGroupMessage(UID, message) {
    const textMessage = this.getTextMessage(UID, message, 'group');
    return CometChat.sendMessage(textMessage);
  }

  static joinGroup(GUID) {
    return CometChat.joinGroup(GUID, CometChat.GROUP_TYPE.PUBLIC, '');
  }

  static addMessageListener(callback) {
    CometChat.addMessageListener(
      this.LISTENER_KEY_MESSAGE,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          callback(textMessage);
        }
      })
    );
  }
}