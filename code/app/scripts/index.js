// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metaCoinArtifact from '../../build/contracts/MetaCoin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const MetaCoin = contract(metaCoinArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let currentAccount
let checkAccout
let accountInit
let accountSend

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      accountSend = accounts[0]
      currentAccount = accounts[0]
      accountInit = accounts[9]
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  refreshBalance: function () {
    const self = this

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.getBalance.call(accountSend, { from: accountSend })
    }).then(function (value) {
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('查询账户出错')
    })
  },

  createNew: function(){
    const self = this
    const addressNew = document.getElementById('addressNew').value
    const goalNew = parseInt(document.getElementById('goalNew').value)
    this.setStatus('发起新众筹')
    currentAccount = addressNew

    let meta
    MetaCoin.deployed().then(function (instance){
      meta = instance
      console.log(addressNew)
      return meta.newNeeder(addressNew, goalNew,{from:accountInit, gas:300000})
    }).then(function(){
      self.setStatus('发起成功')
    }).catch(function (e){
      console.log(e)
      self.setStatus('发起错误')
    })

  },

  checkInfo: function(){
    this.checkAmount()
    this.checkGoal()
    this.checkFunderAccount()
    this.checkIsComplete()
  },

  checkAmount:function(){
    const self = this
      checkAccout = document.getElementById('needer').value

      let meta
      MetaCoin.deployed().then(function (instance){
        meta = instance
        return meta.getAmount.call(checkAccout)
      }).then(function (value){
        const balance2 = document.getElementById('balance2')
        balance2.innerHTML = value.valueOf()
        self.setStatus('查询成功')
      }).catch(function (e){
        console.log(e)
        self.setStatus('查询出错')
      })
  },

  checkGoal:function(){
    const self = this
      checkAccout = document.getElementById('needer').value

      let meta
      MetaCoin.deployed().then(function (instance){
        meta = instance
        return meta.getGoal.call(checkAccout)
      }).then(function (value){
        const balance = document.getElementById('balance1')
        balance.innerHTML = value.valueOf()
        self.setStatus('查询成功')
      }).catch(function (e){
        console.log(e)
        self.setStatus('查询出错')
      })
  },

  checkFunderAccount:function(){
    const self = this
      checkAccout = document.getElementById('needer').value

      let meta
      MetaCoin.deployed().then(function (instance){
        meta = instance
        return meta.getFunderAccount.call(checkAccout)
      }).then(function (value){
        const funderNum = document.getElementById('funderNum')
        funderNum.innerHTML = value.valueOf()
        self.setStatus('查询成功')
      }).catch(function (e){
        console.log(e)
        self.setStatus('查询出错')
      })
  },

  checkIsComplete:function(){
    const self = this
      checkAccout = document.getElementById('needer').value

      let meta
      MetaCoin.deployed().then(function (instance){
        meta = instance
        return meta.getIsComplete.call(checkAccout)
      }).then(function (value){
        const isComplete = document.getElementById('isComplete')
        isComplete.innerHTML = value.valueOf()
        self.setStatus('查询成功')
      }).catch(function (e){
        console.log(e)
        self.setStatus('查询出错')
      })
  },

  sendCoin: function () {
    const self = this

    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value

    this.setStatus('交易正在进行')

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.sendCoin(receiver, amount, { from: accountSend,gas:300000 })
    }).then(function () {
      self.setStatus('交易完成')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('交易出错')
    })
  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start()
})
