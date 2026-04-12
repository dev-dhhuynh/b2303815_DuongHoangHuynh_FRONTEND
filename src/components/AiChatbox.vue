<template>
  <button class="chat-fab" @click="toggleChat">
    <i :class="isOpen ? 'fas fa-times' : 'fas fa-robot'"></i>
    <span v-if="!isOpen" class="fab-label">Tư vấn AI</span>
  </button>

  <Transition name="chat-pop">
    <div v-if="isOpen" class="chat-panel">

      <div class="chat-header">
        <div class="chat-header-left">
          <div class="chat-avatar"><i class="fas fa-robot"></i></div>
          <div>
            <p class="chat-title">LibraTech AI</p>
            <p class="chat-subtitle">Tư vấn sách cho bạn</p>
          </div>
        </div>
        <button class="chat-close" @click="toggleChat"><i class="fas fa-times"></i></button>
      </div>

      <div class="chat-messages" ref="messagesEl">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['chat-bubble', msg.role === 'assistant' ? 'ai' : 'user']"
        >
          <div v-if="msg.role === 'assistant'" class="bubble-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="bubble-text" v-html="formatText(msg.content)"></div>
        </div>

        <div v-if="isLoading" class="chat-bubble ai">
          <div class="bubble-avatar"><i class="fas fa-robot"></i></div>
          <div class="bubble-text typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div v-if="messages.length === 1" class="chat-suggestions">
        <button
          v-for="s in suggestions"
          :key="s"
          class="suggestion-chip"
          @click="sendSuggestion(s)"
        >{{ s }}</button>
      </div>

      <div class="chat-input-row">
        <input
          v-model="inputText"
          type="text"
          class="chat-input"
          placeholder="Hỏi về sách bạn muốn đọc..."
          @keydown.enter="sendMessage"
          :disabled="isLoading"
        />
        <button class="chat-send" @click="sendMessage" :disabled="isLoading || !inputText.trim()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>

    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/ai/chat'

const isOpen     = ref(false)
const isLoading  = ref(false)
const inputText  = ref('')
const messagesEl = ref(null)

const messages = ref([
  { role: 'assistant', content: 'Xin chào! Tôi có thể giúp bạn tìm sách phù hợp. Bạn đang tìm sách về chủ đề gì?' }
])

const suggestions = [
  'Sách lập trình cho người mới',
  'Sách phát triển bản thân',
  'Sách nào còn nhiều nhất?',
]

const toggleChat = () => { isOpen.value = !isOpen.value }

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

const formatText = (text) =>
  text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')

const sendSuggestion = (text) => {
  inputText.value = text
  sendMessage()
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return
  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  isLoading.value = true
  await scrollToBottom()
  try {
    const history = messages.value.filter((_, i) => i > 0)
    const { data } = await axios.post(API_URL, { messages: history })
    messages.value.push({ role: 'assistant', content: data.reply })
  } catch (err) {
    const errMsg = err.response?.data?.error || err.message || 'Lỗi không xác định'
    messages.value.push({ role: 'assistant', content: `Xin lỗi, có lỗi: ${errMsg}. Vui lòng thử lại.` })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>

<style scoped>
.chat-fab {
  position: fixed; bottom: 2rem; right: 2rem; z-index: 500;
  display: flex; align-items: center; gap: 0.5rem;
  background: #7c3d2d; color: #fff; border: none; border-radius: 50px;
  padding: 0.75rem 1.25rem; font-size: 1rem; font-family: 'DM Sans', sans-serif;
  font-weight: 500; cursor: pointer; box-shadow: 0 4px 18px rgba(124,61,45,0.35);
  transition: background 0.2s, transform 0.15s;
}
.chat-fab:hover { background: #5c2d1f; transform: translateY(-2px); }
.fab-label { font-size: 0.85rem; }

.chat-panel {
  position: fixed; bottom: 5.5rem; right: 2rem; z-index: 499;
  width: 360px; max-height: 520px; display: flex; flex-direction: column;
  background: #faf8f5; border: 1px solid #e8e0d8; border-radius: 12px;
  box-shadow: 0 12px 40px rgba(44,36,32,0.18); overflow: hidden;
  font-family: 'DM Sans', sans-serif;
}

.chat-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.9rem 1.1rem; background: #7c3d2d; color: #fff; flex-shrink: 0;
}
.chat-header-left { display: flex; align-items: center; gap: 0.65rem; }
.chat-avatar {
  width: 34px; height: 34px; background: rgba(255,255,255,0.2); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 0.95rem;
}
.chat-title  { font-size: 0.9rem; font-weight: 500; margin: 0; }
.chat-subtitle { font-size: 0.72rem; opacity: 0.75; margin: 0; }
.chat-close {
  background: none; border: none; color: rgba(255,255,255,0.8);
  font-size: 0.95rem; cursor: pointer; padding: 0.25rem;
}
.chat-close:hover { color: #fff; }

.chat-messages {
  flex: 1; overflow-y: auto; padding: 1rem;
  display: flex; flex-direction: column; gap: 0.75rem; scroll-behavior: smooth;
}
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-thumb { background: #ddd5cd; border-radius: 4px; }

.chat-bubble { display: flex; align-items: flex-end; gap: 0.5rem; max-width: 90%; }
.chat-bubble.user { align-self: flex-end; flex-direction: row-reverse; }
.chat-bubble.ai  { align-self: flex-start; }

.bubble-avatar {
  width: 26px; height: 26px; flex-shrink: 0; background: #f0e8e4; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #7c3d2d;
}
.bubble-text { padding: 0.6rem 0.85rem; border-radius: 12px; font-size: 0.85rem; line-height: 1.55; }
.chat-bubble.ai   .bubble-text { background: #fff; border: 1px solid #e8e0d8; color: #2c2420; border-bottom-left-radius: 4px; }
.chat-bubble.user .bubble-text { background: #7c3d2d; color: #fff; border-bottom-right-radius: 4px; }

.typing-dots { display: flex; gap: 4px; padding: 0.75rem 0.85rem; align-items: center; }
.typing-dots span { width: 7px; height: 7px; background: #c9b5af; border-radius: 50%; animation: bounce 1.2s infinite; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

.chat-suggestions { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0 1rem 0.75rem; flex-shrink: 0; }
.suggestion-chip {
  background: #f5f1ec; border: 1px solid #e0d5cf; color: #4a3530;
  border-radius: 20px; padding: 0.35rem 0.75rem; font-size: 0.75rem;
  font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.suggestion-chip:hover { background: #ede4dc; border-color: #7c3d2d; color: #7c3d2d; }

.chat-input-row {
  display: flex; gap: 0.5rem; padding: 0.75rem 1rem;
  border-top: 1px solid #e8e0d8; flex-shrink: 0; background: #fff;
}
.chat-input {
  flex: 1; border: 1.5px solid #ddd5cd; border-radius: 6px; padding: 0.55rem 0.85rem;
  font-size: 0.85rem; font-family: 'DM Sans', sans-serif; color: #2c2420;
  background: #faf8f5; outline: none; transition: border-color 0.2s;
}
.chat-input:focus { border-color: #7c3d2d; background: #fff; }
.chat-input:disabled { opacity: 0.6; }
.chat-input::placeholder { color: #b0a09a; }
.chat-send {
  background: #7c3d2d; color: #fff; border: none; border-radius: 6px;
  width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; cursor: pointer; transition: background 0.2s; flex-shrink: 0;
}
.chat-send:hover:not(:disabled) { background: #5c2d1f; }
.chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

.chat-pop-enter-active { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.chat-pop-leave-active { transition: all 0.18s ease; }
.chat-pop-enter-from  { opacity: 0; transform: translateY(16px) scale(0.95); }
.chat-pop-leave-to    { opacity: 0; transform: translateY(8px) scale(0.97); }

@media (max-width: 480px) {
  .chat-panel { right: 0.75rem; left: 0.75rem; width: auto; bottom: 5rem; }
  .chat-fab   { right: 1rem; bottom: 1.25rem; }
}
</style>