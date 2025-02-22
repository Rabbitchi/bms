<!--
	作者：ganshengqu
	时间：2019-12-04
	描述：软电话条(顶部操作条)
-->
<template>
  <div class="soft-phone-bar">
    <div
      class="ukefu-softphone"
      id="ukefu-softphone"
      style="
        width: auto;
        margin: 0 auto;
        left: 0;
        height: auto;
        border-radius: 20px;
      "
    >
      <div class="softphone-stream" style="display: none">
        <audio id="remoteAudio"></audio>
        <audio id="localAudio" muted="muted"></audio>
      </div>
      <div
        class="status disabled"
        style="padding: 3px 0 0 0px; color: #ffffff; width: 180px"
      >
        <div id="ukefu_agent_status_no" style="padding: 15px 0 0 0px">
          <i class="layui-icon">&#xe617;</i>
          分机未登录，连接失败
        </div>
        <div
          id="ukefu_agent_status_offline"
          style="padding: 15px 0 0 0px; display: none"
        >
          <i class="layui-icon">&#xe617;</i>
          语音服务已关闭
        </div>
        <div
          id="ukefu_agent_status_ok"
          style="padding: 15px 0 0 0px; display: none; color: #ffffff"
        >
          <i class="layui-icon">&#xe617;</i>
          分机：
          <span class="number"></span>
          登录成功
        </div>
        <div
          id="ukefu_agent_docallout"
          style="padding: 15px 0 0 0px; display: none; color: #ffffff"
        >
          <i class="layui-icon">&#xe617;</i>
          分机：
          <span class="number"></span>
          <span id="waittingmsg">等待名单</span>
        </div>
        <div id="ukefu_agent_status_call" style="display: none; color: #ffffff">
          <div class="text" id="caller">
            主叫号码：
            <span class="number"></span>
          </div>
          <div class="text" id="called">
            被叫号码：
            <span class="number"></span>
          </div>
        </div>
        <div id="ukefu_agent_timer_call" style="display: none">
          <div class="text" id="discall">
            号码：
            <span class="number"></span>
          </div>
          <div class="text">
            时长：
            <span class="timer">00:00:00</span>
          </div>
        </div>
      </div>
      <div style="float: left">
        <div
          class="soft-function disabled"
          id="softphone-hungup"
          data-toggle="soft-function"
          data-action="hungup"
        >
          <div class="icon">
            <i class="kfont">&#xe60e;</i>
          </div>
          <div class="text">挂断</div>
        </div>
        <div class="soft-function" id="ukefu_account">
          <div
            class="soft-function login"
            data-toggle="soft-function"
            data-action="login"
          >
            <div class="icon">
              <i class="kfont">&#xe61f;</i>
            </div>
            <div class="text">登录</div>
          </div>
          <div
            class="soft-function logout"
            style="display: none"
            data-toggle="soft-function"
            data-action="logout"
          >
            <div class="icon">
              <i class="kfont">&#xe611;</i>
            </div>
            <div class="text">登出</div>
          </div>
        </div>
      </div>
      <script id="ukefu-login-html" type="text/html">
        <div class="ukefu-login-title">请输入登录信息</div>
        <div class="ukefu-login-info">
          <div class="ukefu-login-extno">分机号：</div>
          <div class="ukefu-login-block">
            <input class="ukefu-login-input" type="text" id="extno" value="" />
          </div>
        </div>
        <div class="ukefu-login-info">
          <div class="ukefu-login-password">密码：</div>
          <div class="ukefu-login-block">
            <input
              class="ukefu-login-input"
              type="password"
              id="extpass"
              type="text"
              value=""
            />
          </div>
        </div>
      </script>
      <div class="dialpad" id="dialpad" style="left: 20% !important">
        <div class="dialnum">
          <input class="dialpad-input" type="text" id="dialpad-input" value />
          <i class="kfont ukefu-dial-del" id="ukefu-dial-del">&#xe675;</i>
        </div>
        <button class="number" id="1">1</button>
        <button class="number" id="2">2</button>
        <button class="number" id="3">3</button>
        <button class="number" id="4">4</button>
        <button class="number" id="5">5</button>
        <button class="number" id="6">6</button>
        <button class="number" id="7">7</button>
        <button class="number" id="8">8</button>
        <button class="number" id="9">9</button>
        <button class="number" id="*">*</button>
        <button class="number" id="0">0</button>
        <button class="number" id="#">#</button>
        <button id="makecall" class="call">
          <i class="kfont">&#xe61f;</i>
        </button>
      </div>
    </div>
    <div id="autologin"></div>
    <div
      class="layui-tab"
      lay-filter="ukefutab"
      lay-allowClose="true"
      style="position: absolute; bottom: 0px"
    ></div>
  </div>
</template>

<style lang="scss">
.soft-phone-bar {
  min-width: 310px;
  position: fixed;
  top: 70px;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  right: 40px;
  box-sizing: border-box;
  padding-left: 20px;
  background: #1aa094;
}
</style>

<script>
import eventBus from '@/vendor/event-bus.js'
export default {
  props: {},
  data() {
    return {}
  },
  methods: {
    callStart() {
      console.log(7979898)
      eventBus.$emit('ukfCall', { phoneValue: '13641468692' })
    }
  }
}
</script>
