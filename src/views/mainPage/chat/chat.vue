<template>
    <div>
        <div class="contactorName">
            <span>{{ $route.params.name }}</span>
        </div>
    </div>
    <div class="chatBox">
        <div v-for="(msg, index) in data.chatMsgs" :key="index">
            <div v-if="msg.type === 'send'" class="sendMsgBox">
                <div>{{ msg.time }}</div>
                <div>{{ msg.content }}</div>

            </div>
            <div v-else class="receiveMsgBox">
                <div>{{ msg.time }}</div>
                <div>{{ msg.content }}</div>
            </div>
        </div>
    </div>

    <div class="msgBox">
        <el-input v-model="data.msg" placeholder="请输入内容" style="width: 80%"></el-input>
        <el-button @click="sendMsg" type="primary" style="width: 20%">发送</el-button>

    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import router from '@/router';
import { reactive ,watch} from 'vue';
import { useStore } from 'vuex';

interface ChatMsg{
    type:string, //send:我发的消息 receive:我收到的消息
    content:string,
    time:string,
    // avatar:string
}

const store = useStore();
const route = useRoute()

const data=reactive({
    chatMsgs: [
        { 
            type: '',
            content: '',
            time: '',
        }
    ],
    msg:''
})

const sendMsg = () => {

    // 前端更新消息，同时向后端发送消息请求
    const newMsg = {
        type: 'send',
        content: data.msg,
        time: new Date().toLocaleString()
    };
    data.msg = '';
    const messageMap = store.getters.getMessageMap;
    const contactName = route.params.name;
    const msgs = messageMap.get(contactName) || [];
    msgs.push(newMsg);
    store.commit('addMessages', { contactName, messages: msgs });
}


const loadMsg=()=>{
    const MsgMap=store.getters.getMessageMap;
    const contactName=route.params.name;
    console.log(MsgMap)
    const msgs=MsgMap.get(contactName);
    console.log(msgs)
    if(msgs){
        data.chatMsgs=msgs;
    }
}


watch(() => route.params.name, () => {
    loadMsg();
});

</script>

<style scoped>
.chatBox{
    overflow: scroll;
    height: 800px;
    width: 100%;
}
.contactorName {
    padding: 10px;
    background-color: #f8f8ff;
    border-bottom: 1px solid #e0e0e0;
}
.receiveMsgBox {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 10px;
    background-color: #f8f8ff;
    border-bottom: 1px solid #e0e0e0;
    width: fit-content;
    margin-left: auto;
}
.sendMsgBox {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    background-color: greenyellow;
    border-bottom: 1px solid #e0e0e0;
    width: fit-content;
    margin-right: auto;
}
.msgBox {
    display: flex;
    padding: 10px;
    background-color: #f8f8ff;
    border-top: 1px solid #e0e0e0;

}
</style>