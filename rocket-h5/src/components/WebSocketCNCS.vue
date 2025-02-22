<template>
  <div class="websocket"></div>
</template>

// 1. 判断 userid 在白名单, 在的话发起连接 // 2. 接受后端推送的 taskid // 3.
跳转 task process 页面,推送 taskId/userId/loginName 的序列化字符串给后台 // 4.
没了

<script>
const BASE_CNCS_WEBSOCKET_URL = process.env.VUE_APP_CNCS_WEBSOCKET_API

export default {
  name: 'CNCSWebsocket',
  data() {
    return {
      timeout: 60000,
      timeoutObj: null,
      serverTimeoutObj: null,
      currSocket: ''
    }
  },
  computed: {
    getcurrRoleId() {
      return this.$store.state.user.currRoleId
    }
  },
  watch: {
    getcurrRoleId: function (val) {
      console.log('currRoleId changed')
      console.log(val)
      this.close()
      if (val) {
        this.checkIfConnect()
      }
    }
    // $route: {
    //   handler: function (val, oldVal) {
    //     console.log("route changed");
    //     console.log(val);
    //     if (val.path === "/task/process" && this.currSocket) {
    //       console.log("begin send login info");
    //       let data = {
    //         taskId: this.$route.query.taskId,
    //         userId: this.$store.state.user.userInfo.userId,
    //         loginName: this.$store.state.user.userInfo.loginName
    //       };
    //       this.websocketsend(JSON.stringify(data));
    //     }
    //   },
    //   immediate: true
    // }
  },
  created() {
    //this.checkIfConnect();
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    checkIfConnect() {
      let whiteListUserID = ['1']
      let userId = this.$store.state.user.userInfo.userId

      // let whiteListRoleID = ["120078240084656128"]; // 测试id
      let whiteListRoleID = [
        '304642058516168704',
        '304642111012081664',
        '304642153944973312'
      ] // 生产id
      let roleID = this.getcurrRoleId

      console.log(`roleID is ${roleID}`)
      console.log(`userId is ${userId}`)
      console.log(
        whiteListRoleID.includes(roleID),
        whiteListUserID.includes(userId)
      )
      if (
        whiteListRoleID.includes(roleID) ||
        whiteListUserID.includes(userId)
      ) {
        console.log('role id in whitelist')
        this.initWebSocket()
      }
      return
    },
    initWebSocket() {
      console.log('== initWebsocket ==' + new Date())

      let loginName = this.$store.state.user.userInfo.loginName
      let userId = this.$store.state.user.userInfo.userId

      if (loginName && userId) {
        // this.startHeartBeat();

        this.currSocket = new WebSocket(
          BASE_CNCS_WEBSOCKET_URL +
            '/websocket/case/' +
            userId +
            '/' +
            loginName
        )
        console.log(
          '地址：' +
            BASE_CNCS_WEBSOCKET_URL +
            '/websocket/case/' +
            userId +
            '/' +
            loginName
        )
        // this.currSocket.addEventListener("open", function (event) {
        //   this.currSocket.send("Hello Server!");
        // });

        this.currSocket.onopen = this.websocketonopen
        this.currSocket.onerror = this.websocketonerror
        this.currSocket.onmessage = this.websocketonmessage
        this.currSocket.onclose = this.websocketclose
      } else {
        this.close()
      }
    },
    websocketonopen(e) {
      console.log('== open Websocket ==' + new Date())
      this.$message({
        message: 'Connected with CNCS system...',
        type: 'success'
      })
      this.startHeartBeat()
      //this.websocketsend(JSON.stringify("1"));
    },
    websocketonerror(e) {
      this.$message({
        message: 'Lost connection with CNCS system, please wait or reload page',
        type: 'error'
      })

      console.error('== WebSocket 连接错误 error observed')
      this.close()
    },
    websocketonmessage(e) {
      console.log('服务器接收到的数据：')
      console.log(e)
      let res = JSON.parse(e.data)
      console.log('JSON.parse之后的data数据：')
      console.log(res)
      if (res.type === 'pong') {
        this.resetHeartBeat()
      }
      if (res.type === 'connect') {
        this.resetHeartBeat()
        this.$message({
          message: 'The call is connected',
          type: 'success'
        })
        const { phone = '' } = res.data
        console.log('== taskId query ==' + new Date())
        this.$store.dispatch('cncs/commitCallStatus', false)
        this.$store.dispatch('cncs/commitConnectStatus', true)
        this.$store.dispatch('cncs/setDialPhone', phone)
        console.log('开始****push' + new Date())
        console.log('结束****push' + new Date())
      }
      if (res.type === 'hungUp') {
        this.$message({
          message: 'The Call has ended',
          type: 'warning'
        })
        //  展示toast
        this.resetHeartBeat()
        this.$store.dispatch('cncs/commitCallStatus', false)
        this.$store.dispatch('cncs/commitConnectStatus', false)
      }
    },
    websocketsend(e) {
      if (this.currSocket.readyState === 1) {
        console.log(
          '== websocket 发送了: ' + JSON.stringify(e) + ' ==' + new Date()
        )
        this.currSocket.send(JSON.stringify(e))
      }
    },
    websocketclose(e) {
      let _this = this
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = null
      this.serverTimeoutObj = null
      console.log(
        '== Socket is closed. Reconnect will be attempted in 10 second. ==',
        e.reason
      )
      _this.$message({
        message: `Socket is closed. Reconnect will be attempted in 10 second. ${e.reason}`,
        type: 'warning'
      })
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
      this.reconnectTimer = setTimeout(function () {
        _this.reconncet()
      }, 10000)
    },
    reconncet() {
      console.log('== Socket reconnceting' + new Date())
      this.initWebSocket()
    },
    beforeunloadFn(e) {
      console.log('== Socket close before unload' + new Date())
      this.close()
    },
    resetHeartBeat() {
      console.log('== resetHeartBeat ==' + new Date())
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      this.startHeartBeat()
    },
    startHeartBeat() {
      let _this = this
      console.log('== startHeartBeat ==' + new Date())
      _this.timeoutObj = setTimeout(function () {
        _this.websocketsend({ type: 'ping' })
        _this.serverTimeoutObj = setTimeout(function () {
          console.log('== Lose Socket HeartBeat, reconnecting' + new Date())
          _this.reconncet()
        }, _this.timeout)
      }, 20000)
    },
    close() {
      console.log('== websocket closed ==' + new Date())
      this.timeout = 60000
      this.currSocket && this.currSocket.close()
    }
  },
  destoryed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  }
}
</script>
<style></style>
