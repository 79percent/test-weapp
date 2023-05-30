// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: 'hhahahahha',
    city: '',
    weather: '',
    location: {
      latitude: '',
      longitude: '',
    },
    scanCodeResult: '',
    userInfo: {},
    code: '',
    loginData: {},
  },

  // 获取地理位置
  handleGetLocation() {
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        var latitude = res.latitude // 纬度
        var longitude = res.longitude // 经度
        that.setData({
          location: {
            latitude,
            longitude
          }
        })
        console.log(`${latitude}, ${longitude}`);
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=Y2HBZ-SM4EZ-7DAX3-ZW2QP-5FCZ5-YBBEC&get_poi=0`,
          success(res){
            console.log(999, res);
            if(res.statusCode === 200){
              that.setData({
                city: res.data.result.address_component.city
              })
              wx.request({
                url: `https://restapi.amap.com/v3/weather/weatherInfo?city=${res.data.result.ad_info.adcode}&key=bb9894bbc928ab31fec42b98fae5b082&extensions=base`,
                success(res){
                  console.log(666, res);
                  if(res.statusCode === 200){
                    that.setData({
                      weather: res.data.lives[0].weather
                    })
                  }
                },
              })
            }
          },
        })
      }
    })
  },

  // 扫一扫
  handleScanCode() {
    const that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        that.setData({
          scanCodeResult: res.result
        })
      }
    })
  },

  // 获取用户信息
  handleGetUserInfoProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },

  // 获取用户信息 
  handleGetUserInfo() {
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
      }
    })
  },

  // 登录
  handleLogin() {
    const that = this;
    wx.login({
      success(res) {
        if (res.code) {
          console.log('login', res);
          that.setData({
            code: res.code
          })
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            method: 'GET',
            data: {
              appid: 'wxe26d548cea74098b',
              secret: '8293f1d180a81f696d002370d84b31cc',
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success(res) {
              console.log(res);
              console.log(that);
              if (res.statusCode === 200) {
                that.setData({
                  loginData: res.data
                });
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.handleLogin();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})