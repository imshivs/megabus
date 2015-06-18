// var express = require('express');
// var fs = require('fs');
// var request = require('request');
// var app     = express();
// var phantom = require('phantomjs');

// app.get('/scrape', function(req, res){
//     // The URL we will scrape from - in our example Anchorman 2.

//     // url = "https://us.megabus.com/";

//     // The structure of our request call
//     // The first parameter is our URL
//     // The callback function takes 3 parameters, an error, response status code and the html

//     request(url, function(error, response, html){

//         // First we'll check to make sure no errors occurred when making the request

//         if(!error){
//             // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

//       //       var $ = cheerio.load(html);
//       //       var state, origin, dest, departing, returning, passengers;
//       //       var json = {origin: "", departing: "", returning: "". passenger: ""};
//       //       // $('#JourneyPlanner_StateorProvinceDiv').filter(function(){
//       //       // 	var data= $
//       //       // })
//     		// // var formStruct = fScraper.fetchForm('#searchandbuy', 'http://http://us.megabus.com/', pRequest);
//     		// // var Details = {JourneyPlanner_ddLeavingFromState: "5", }

//       //       // Finally, we'll define the variables we're going to capture

//       //       var title, release, rating;
//       //       var json = { title : "", release : "", rating : ""};
//         }
//     })
// })

// app.listen('8081')
// console.log('Magic happens on port 8081');
// exports = module.exports = app;

// var httpAgent = require('http-agent');
// var jsdom = require('jsdom');
// var request = require('request');

// var form   = $('#searchandbuy');
// var data   = form.serialize();
// var url    = form.attr('action') || 'get';
// var type   = form.attr('enctype') || 'application/x-www-form-urlencoded';
// var method = form.attr('method');

// function(error, response, body) {
// 	request({
//   url    : "http://us.megabus.com",
//   method : method.toUpperCase(),
//   body   : data,
//   headers : {
//     'Content-type' : type
//   }
// };
//   // this assumes no error for brevity.
//   var newDoc =  jsdom.env({
//     html: body,
//       scripts : [
//         'http://code.jquery.com/jquery-1.5.min.js'
//       ]
//     }, function(err, window) {
//           var $ = window.jQuery;

//           $('#JourneyPlanner_ddlLeavingFromState').val('5');
//           $('#JourneyPlanner_ddlOrigin').val('420');
//           $('#JourneyPlanner_ddlDest').val('413');
//           $('#airDestination').val('08/15/2015');

//    		});
// 	});

var phantom = require('phantomjs');
var webPage = require('webpage');

var page = new webPage(), testindex = 0, loadInProgress = false;

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onLoadStarted = function() {
  loadInProgress = true;
  console.log("load started");
};

page.onLoadFinished = function() {
  loadInProgress = false;
  console.log("load finished");
};

var steps = [
  function() {
    //Load Login Page
    page.open("http://us.megabus.com");
  },
  function() {
    //Enter Credentials
    page.evaluate(function() {

      var arr = document.getElementsByClassName("searchbuy");
      var i;

      for (i=0; i < arr.length; i++) { 
        if (arr[i].getAttribute('method') == "POST") {

          arr[i].elements["JourneyPlanner_ddlLeavingFromState"].value="5";
          arr[i].elements["JourneyPlanner_ddlOrigin"].value="420";
          arr[i].elements["JourneyPlanner_ddlDest"].value="";
          arr[i].elements["JourneyPlanner_txtOutboundDate"].value="08/15/2015";
          return;
        }
      }
    });
  }, 
  function() {
    //Login
    page.evaluate(function() {
      var arr = document.getElementsByClassName("searchbuy");
      var i;

      for (i=0; i < arr.length; i++) {
        if (arr[i].getAttribute('method') == "POST") {
          arr[i].submit();
          return;
        }
      }

    });
  }, 
  function() {
    // Output content of page to stdout after form has been submitted
    page.evaluate(function() {
      console.log(document.querySelectorAll('html')[0].outerHTML);
    });
  }
];


interval = setInterval(function() {
  if (!loadInProgress && typeof steps[testindex] == "function") {
    console.log("step " + (testindex + 1));
    steps[testindex]();
    testindex++;
  }
  if (typeof steps[testindex] != "function") {
    console.log("test complete!");
    phantom.exit();
  }
}, 50);
// Also, CasperJS provides a nice high-level interface for navigation in PhantomJS, including clicking on links and filling out forms.
// CasperJS
// Sending raw POST requests can be sometimes more convenient. Below you can see post.js original example from PhantomJS
// Example using HTTP POST operation

// var page = require('webpage').create(),
//     server = 'http://posttestserver.com/post.php?dump',
//     data = 'universe=expanding&answer=42';

// page.open(server, 'post', data, function (status) {
//     if (status !== 'success') {
//         console.log('Unable to post!');
//     } else {
//         console.log(page.content);
//     }
//     phantom.exit();
// });