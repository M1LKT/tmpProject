import { createStore } from 'vuex'
import axios from 'axios';

// Map { "郑军" → (4) […] }
// ​
// ​​
// 0: "郑军" → Array(4) [ {…}, {…}, {…}, … ]
// ​​​
// <key>: "郑军"
// ​​​
// <value>: Array(4) [ {…}, {…}, {…}, … ]
// ​​​​
// 0: Object { type: "receive", content: "你好，我是郑军", time: "2021-10-10 10:10:10" }
// ​​​​
// 1: Object { type: "send", content: "你好，很高兴认识你", time: "2021-10-10 10:10:10" }
// ​​​​
// 2: Object { type: "receive", content: "你最近怎么样？", time: "2021-10-10 10:12:10" }
// ​​​​
// 3: Object { type: "send", content: "我很好，谢谢！", time: "2021-10-10 10:13:10" }
interface Message {
  type: string;
  content: string;
  time: string;
}

interface State {
  messageMap: Map<string, Message[]>;
}

export default createStore<State>({
  state: {
    messageMap: new Map<string, Message[]>()
  },
  getters: {
    getMessageMap: state => state.messageMap
  },
  mutations: {
    setMessageMap(state, messageMap: Map<string, Message[]>) {
      state.messageMap = messageMap;
    },
    addMessages(state, { contactName, messages }: { contactName: string; messages: Message[] }) {
      state.messageMap.set(contactName, messages);
    }
  },
  actions: {
    async fetchMessages({ commit }, contactName: string) {
      try {
        const response = await axios.post('http://localhost:3030/api/messages', { contactName });
        commit('addMessages', { contactName, messages: response.data.chatMsgs });
      } catch (error) {
        console.error(error);
      }
    }
  },
  modules: {
  }
})