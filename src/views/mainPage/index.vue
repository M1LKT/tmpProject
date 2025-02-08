<template>
    <div>
  
      <div style="display: flex">
        <div style="width: 200px; border-right: 1px solid #ddd; min-height: calc(100vh - 60px)">
          <el-menu
              router
              style="border: none"
              :default-active="$route.path"
              :default-openeds="['/home', '2']"
          >

            <el-menu-item
                v-for="(contact, index) in data.contacter"
                :key="index"
                @click="openChat(contact)"
            >
                <el-avatar :src="contact.avatar" />
                <span>{{ contact.name }}</span>
            </el-menu-item>
            
          </el-menu>
        </div>
  
        <div style="flex: 1; width: 0; background-color: #f8f8ff; padding: 10px">
            <router-view/>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  import router from '@/router';
  import axios from 'axios';
  import {User, UserFilled,Dish,Document,HomeFilled,Plus} from "@element-plus/icons-vue";
  import { reactive } from 'vue';
  import Mock from 'mockjs';
import store from '@/store';

  const $route = useRoute()
  
  const data=reactive({
    contacter:[
        {
            name:'',
            avatar:'',
        }
    ],
    messages: {} as Record<string, { sender: string; content: string; time: string }[]>
  })
  

  const openChat = (contact:any) => {
    router.push(`/mainPage/chat/${contact.name}`);
  }
  
  // mock的取得联系人
  Mock.mock('http://localhost:3030/api/contacters', {
    'contacter|1-3': [ // 随机生成 1 到 3 个联系人
        {
        'name': '@cname',
        'avatar': 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        }
    ]
    });


  Mock.mock(/http:\/\/localhost:3030\/api\/messages/, 'post', (options) => {
  const { contactName } = JSON.parse(options.body);
  return {
    chatMsgs: [
      {
        type: 'receive',
        content: `你好，我是${contactName}`,
        time: '2021-10-10 10:10:10',
      },
      {
        type: 'send',
        content: '你好，很高兴认识你',
        time: '2021-10-10 10:10:10',
      },
      {
        type: 'receive',
        content: '你最近怎么样？',
        time: '2021-10-10 10:12:10',
      },
      {
        type: 'send',
        content: '我很好，谢谢！',
        time: '2021-10-10 10:13:10',
      }
    ]
  };  
});

  const loadContacter=async()=>{
    try {
        const response = await axios.get('http://localhost:3030/api/contacters');
        data.contacter = response.data.contacter; 
    } 
    catch (error) {
        console.error(error);
    }
    //contacter.name
  }



  const getMsg = async () => {
    const messageMap = new Map<string, { sender: string; content: string; time: string }[]>();
    for (const contact of data.contacter) {
      try {
        const response = await axios.post('http://localhost:3030/api/messages', { contactName: contact.name });
        messageMap.set(contact.name, response.data.chatMsgs);
      } catch (error) {
        console.error(error);
      }
    }
    // console.log(messageMap);
    store.commit('setMessageMap', messageMap);
  };

  const init = async () => {
    await loadContacter();
    await getMsg();
    
  };


  init();
  </script>
  
  <style scoped>
  .el-menu-item.is-active {
    background-color: #e0e4ff !important;
  }
  .el-menu-item:hover {
    background-color: #e9eeff !important;
    color: #1450aa;
  }
  :deep(th)  {
    color: #333;
  }
  </style>