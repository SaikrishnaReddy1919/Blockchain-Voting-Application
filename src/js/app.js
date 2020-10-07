App = {
  web3Provider: null,
  contracts: {},
  account : 0x0,

  init: function() {
    return App.initWeb3();
  },

  initWeb3:async function() {
    if (typeof web3 !== 'undefined') {
      //if web3 instance is already provided bt the metamask.
      window.ethereum.enable()
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider) 
    } else {
      //specify default instance if no web3 instance is provided
      App.web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545')
      web3 = new Web3(App.web3Provider)
    }
    // console.log(App.web3Provider)

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Contest.json', (contest) => {
      //instance a new truffloe contract from the artifact
      App.contracts.Contest = TruffleContract(contest)
      //connect provider to interact with contract
      App.contracts.Contest.setProvider(App.web3Provider)

      App.listenForEvents()
      return App.render();
    })
    
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Contest.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function () {
    var contestInstance;
    var loader = ('#loader')
    var content = ('#content')

    loader.show
    content.hide

    //load account data
    
    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        App.account = account
        $('#accountAddress').html("Your Account: " + account)
      }
    })

    //load contract data
    App.contracts.Contest.deployed().then(instance => {
      contestInstance = instance
      return contestInstance.contestantCount()
    }).then(conCount => {
      var results = $('#results')
      results.empty()
      var constestSelect = $('#constestSelect')
      constestSelect.empty()
      

      for (let i = 1; i <= conCount; i++) {
        contestInstance.contestants(i).then(contestant => {
          let id = contestant[0]
          let name = contestant[1]
          let voteCount = contestant[2]

          //render Contestant result
          let contestantTemplate = "<tr><th>" + id + '</th><td>' + name + "</td><td>" + voteCount + "</td></tr>"
          results.append(contestantTemplate)

          let contestOption = "<option value='" + id + "'>" + name + "</option>"
          constestSelect.append(contestOption)
        })
      }
      loader.hide
      content.show
    }).catch(err => console.log(err))
  },


  castVote: function () {
    var contestId = $('#constestSelect').val()
    App.contracts.Contest.deployed().then(instance => {
      web3.eth.getCoinbase((err, account) => {
        fromAccount = account
        console.log(fromAccount)
      })
      return instance.vote(contestId, {from : fromAccount})
    }).then(result => {
      //wait for the votes to updatr
      $('#content').hide
      $('#loader').show
    }).catch(err => {
      console.log(err)
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
