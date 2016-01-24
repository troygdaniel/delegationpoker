

window.TestCases = function () {
  TestCases.jiddu = new User({username:"krishnamurti_" + Date.now().toString(), fullname: "Jiddu Krishnamurti"});
  TestCases.jiddu_scenario = new Scenario({user: TestCases.jiddu, name: "Firing a employee"});
  TestCases.jiddu_vote = {};
  TestCases.bruce = new User({username:"bruce_" + Date.now().toString(), fullname: "Bruce Lee"});
  TestCases.bruce_vote1 = {};
  TestCases.bruce_vote2 = {};
  TestCases.troy = new User({username:"troygdaniel" + Date.now().toString(), fullname: "Troy Daniel"});
  TestCases.troy_scenario = new Scenario({user: TestCases.troy, name: "Hiring a new employee"});

  setTimeout(this.test1,100);
  setTimeout(this.test1b,1000);
  setTimeout(this.test2,2000);
  setTimeout(this.test3,3000);
  setTimeout(this.test4,4000);
  setTimeout(this.test5,5000);
  setTimeout(this.test6,6000);
  setTimeout(this.test7,7000);
  setTimeout(this.test8,8000);
  setTimeout(this.test9,9000);
  setTimeout(this.test10,10000);
  setTimeout(this.test11,10000);
  setTimeout(this.test12,11000);
  setTimeout(this.cleanup,60000);

};

window.TestCases.prototype.test1 = function () {
  console.log("TEST1: Create Jiddu user, scenario");
  TestCases.jiddu.register("testpass", function (json) {
    TestCases.jiddu_scenario = TestCases.jiddu_scenario.save();
  });
}
window.TestCases.prototype.test1b = function () {
  console.log("TEST1b: Jiddu votes '1' ");
  TestCases.jiddu_vote = TestCases.jiddu.vote(TestCases.jiddu_scenario, 1);  
}

window.TestCases.prototype.test2 = function () {
  console.log("TEST2: Jiddu votes '2' for scenario");
  TestCases.jiddu_vote = TestCases.jiddu.vote(TestCases.jiddu_scenario, 2);
}

window.TestCases.prototype.test3 = function () {
  console.log("TEST3: Bruce registers and votes '3' for Jiddu's scenario.");

  TestCases.bruce.register("testpass", function (json) {    
    TestCases.bruce_vote1 = TestCases.bruce.vote(TestCases.jiddu_scenario, 3);
  });
}

window.TestCases.prototype.test4 = function () {

  console.log("TEST4: Bruce fails to sign on");

  TestCases.bruce.signon("badpassword", function () {    
    console.log(">> FAILED TEST");
  }, function () {
    console.log(">> pass");
  });
}

window.TestCases.prototype.test5 = function () {
  console.log("TEST5: Bruce succeeds to sign on and Bruce votes 3");

  TestCases.bruce.signon("testpass", function (json) {    
    TestCases.bruce_vote1 = TestCases.bruce.vote(TestCases.jiddu_scenario, 3);
    console.log(">> pass");
  }, function () {
    console.log(">> FAILED TEST");
  });
}

window.TestCases.prototype.test6 = function () {
  console.log("TEST6: createTroyAccount");
  TestCases.troy.register("goobers");
}

window.TestCases.prototype.test7 = function () {
  console.log("TEST7: Create Scenario For Troy");
  TestCases.troy_scenario.save();
}

window.TestCases.prototype.test8 = function () {
  console.log("TEST8: Bruce votes '6' for Troy's scenario")
  TestCases.bruce_vote2 = TestCases.bruce.vote(TestCases.troy_scenario, 6);
}

window.TestCases.prototype.test9 = function () {  
  console.log("TEST 9: Troy Signon");
  TestCases.troy.signon("goobers", function (){
    console.log(">> pass");
  }, function () {
    console.log(">> FAILED TEST");
  });
}

window.TestCases.prototype.test10 = function () {
  console.log("TEST 10: Troy failed signon");
  TestCases.troy.signon("badpassword", function () {
    console.log(">> FAILED TEST");
  }, function () {
    console.log(">> pass");
  });
}

window.TestCases.prototype.test11 = function () {
  console.log("TEST 11: Get all votes for Troy");
  TestCases.troy_scenario.allVotes();
}

window.TestCases.prototype.test12 = function () {
  console.log("TEST 12: Get all votes for Jiddu");
  TestCases.jiddu_scenario.allVotes();
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