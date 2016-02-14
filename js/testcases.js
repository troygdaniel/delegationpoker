

window.TestCases = function () {
  TestCases.jiddu = new User({username:"krishnamurti_" + Date.now().toString(), fullname: "Jiddu Krishnamurti"});
  TestCases.jiddu_scenario = new Scenario({user: TestCases.jiddu, name: "Firing a employee"});
  TestCases.jiddu_vote = {};
  TestCases.bruce = new User({username:"bruce_" + Date.now().toString(), fullname: "Bruce Lee"});
  TestCases.bruce_vote1 = {};
  TestCases.bruce_vote2 = {};
  TestCases.troy = new User({username:"troygdaniel" + Date.now().toString(), fullname: "Troy George Daniel"});
  TestCases.troy_scenario = new Scenario({user: TestCases.troy, name: "Hiring a new employee"});

  setTimeout(this.test1,100);
  setTimeout(this.test2,500);
  setTimeout(this.test3,1000);
  setTimeout(this.test4,1500);
  setTimeout(this.test5,2000);
  setTimeout(this.test6,2500);
  setTimeout(this.test7,3000);
  setTimeout(this.test8,3500);
  setTimeout(this.test9,4000);
  setTimeout(this.test10,4500);
  setTimeout(this.test11,5000);
  setTimeout(this.test12,5500);
  setTimeout(this.test13,6000);
  setTimeout(this.test14,6500);
  setTimeout(this.finalMssg,7000);
  // setTimeout(this.cleanup,60000);

};

window.TestCases.prototype.test1 = function () {
  // console.log("TEST1: Create Jiddu user, scenario");
  TestCases.jiddu.register("testpass", function (json) {
    TestCases.jiddu_scenario = TestCases.jiddu_scenario.save(function () {
      TestCases.jiddu_vote = TestCases.jiddu.vote(TestCases.jiddu_scenario, 1);      
    });
  });
}

window.TestCases.prototype.test2 = function () {
  // console.log("TEST2: Jiddu votes '2' for scenario");
    TestCases.jiddu_vote = TestCases.jiddu.vote(TestCases.jiddu_scenario, 2);
}

window.TestCases.prototype.test3 = function () {
  // console.log("TEST3: Bruce registers and votes '3' for Jiddu's scenario.");

  TestCases.bruce.register("testpass", function (json) {    
    TestCases.bruce_vote1 = TestCases.bruce.vote(TestCases.jiddu_scenario, 3);
  });
}

window.TestCases.prototype.test4 = function () {

  TestCases.bruce.signon("badpassword", function () {    
    if (TestCases.bruce.hasAuthenticated() === true) {
      console.log(">> FAILED TEST4: Bruce fails to sign on");
    }
  });
}

window.TestCases.prototype.test5 = function () {

  TestCases.bruce.signon("testpass", function (json) {    
    if (TestCases.bruce.hasAuthenticated() === false) {
      console.log(">> FAILED TEST5: Bruce succeeds to sign on and Bruce votes 3");
    }

    TestCases.bruce_vote1 = TestCases.bruce.vote(TestCases.jiddu_scenario, 3);    
  });
}

window.TestCases.prototype.test6 = function () {
  // console.log("TEST6: createTroyAccount");
  TestCases.troy.register("goobers");
}

window.TestCases.prototype.test7 = function () {
  // console.log("TEST7: Create Scenario For Troy");
  TestCases.troy_scenario.save();
}

window.TestCases.prototype.test8 = function () {
  // console.log("TEST8: Bruce votes '6' for Troy's scenario")
  TestCases.bruce_vote2 = TestCases.bruce.vote(TestCases.troy_scenario, 6);
}

window.TestCases.prototype.test9 = function () {  
  TestCases.troy.signon("goobers", function (){
    // console.log(">> pass TEST 9: Troy Signon");
  }, function () {
    console.log(">> FAILED TEST: TEST 9: Troy Signon");
  });
}

window.TestCases.prototype.test10 = function () {
  TestCases.troy.signon("badpassword", function () {
    if (TestCases.troy.hasAuthenticated() === true) {
      console.log(">> FAILED TEST 10: Troy failed signon");
    } 
  });
}

window.TestCases.prototype.test11 = function () {
  // console.log("TEST 11: Get all votes for Troy");
  console.log(TestCases.troy_scenario.votes;
}

window.TestCases.prototype.test12 = function () {
  // console.log("TEST 12: Get all votes for Jiddu");
  console.log(TestCases.jiddu_scenario.votes;
}

window.TestCases.prototype.test13 = function () {
  var x = new Scenario();
  x.get(TestCases.troy_scenario.id, function(doc) {
    debugger
    if (doc && doc.error) {
      console.log(">> FAIL TEST 13: Fetch troy scenario");
    } else { 
       // console.log(">> pass TEST 13: Fetch troy scenario");
    } 
  });  
}

window.TestCases.prototype.test14 = function () {
  var x = new Scenario();
  x.get("boobar", function(doc) {
    if (doc.error) {
      // console.log(">> pass TEST 14: Fetch invalid scenario");
    } else {
      console.log(">> FAIL TEST 14: Fetch invalid scenario");
    }
  });
}

window.TestCases.prototype.finalMssg = function () {
  console.log("Tests complete... waiting 1 min before cleanup.");
}

window.TestCases.prototype.cleanup = function () {
  console.log("Cleaning up after tests.");
  TestCases.jiddu_scenario.remove();
  TestCases.jiddu.remove();
  TestCases.jiddu_vote.remove();
  TestCases.bruce.remove();
  TestCases.bruce_vote1.remove();
  TestCases.bruce_vote2.remove();
  TestCases.troy.remove();
  TestCases.troy_scenario.remove();
}