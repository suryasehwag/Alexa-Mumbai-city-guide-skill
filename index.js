'use strict';
var Alexa = require('alexa-sdk');
var http = require('http');
var parseString = require('xml2js').parseString;
var APP_ID = "amzn1.ask.skill.ef945ace-76ab-4e5b-b1d3-7edbf143234c";

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Mumbai";

var dataIntial;

var responseData;

var numberOfResults = 3;

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Mumbai is one of the Historic and fast growing cities in India. It is the financial capital of the country. It has been the standing example of unity and diversity in the country over Years. What else would you like to know?";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your  Alexa app for  more  information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "Gateway of India", content: "The Gateway of India is a historical monument built during the 20th century in Mumbai City of Maharashtra state in Western India. It is located on the waterfront in the Apollo Bunder area in South Mumbai and overlooks the Arabian Sea.", location: "Apollo Bandar, Colaba, Mumbai, Maharashtra - 4 0 0 0 0 1", contact: "not applicable" },
    { name: "EsselWorld", content: "EsselWorld is an amusement park located in Gorai, Mumbai and established in 1989. The park is owned by Pan India Pvt. Ltd.", location: "Global Pagoda Road, Gorai, Borivali West, Mumbai, Maharashtra  - 4 0 0 0 9 1", contact: "022 6528 0305" },
    { name: "Mahalaxmi Temple", content: "Mahalaxmi Temple is one of the most famous temples of Mumbai situated on Bhulabhai Desai Road in Mahalaxmi area. It is dedicated to Mahalakshmi, the central deity. ", location: "Bhulabhai Desai Road, Mumbai, Maharashtra - 4 0 0 0 2 6", contact: "022 2351 4732" },
    { name: "Jehangir Art Gallery", content: "The Jehangir Art Gallery is an art gallery in Mumbai. It was founded by Sir Cowasji Jehangir, at the urging of K. K. Hebbar and Homi Bhabha. It was built in 1952.", location: "161B, Mahatma Gandhi Road, Kala Ghoda, Mumbai, Maharashtra - 4 0 0 0 0 1", contact: "022 2284 3989" },
    { name: "Taraporewala Aquarium", content: "Taraporewala Aquarium is India's oldest aquarium and one of the city's main attractions. it hosts marine and freshwater fishes. The aquarium is located on Marine Drive in Mumbai.. It was re-opened after renovation on March 3, 2015.", location: "Netaji Subhash Chandra Bose Road, Marine Drive, Near Charni Road Railway Station, Mumbai, Maharashtra - 4 0 0 0 0 2", contact: "022 2282 1239" },
];

var topFive = [
    { number: "1", caption: "Visit the Chatrapati Shivaji Terminus.", more: "Imposing, exuberant and overflowing with people, this monumental train station is the city’s most extravagant Gothic building, and an aphorism for colonial-era India. Its one of the must visit places", location: "Chatrapati Shivaji Terminus, Chatrapati Shivaji Terminus Area, Fort, Mumbai, Maharashtra - 4 0 0 0 0 1", contact: "+9 1 2 2 2 2 6 2 2 8 5 9" },
    { number: "2", caption: "Catch a Play at Prithvi Theatre.", more: "Built in 1978, by Shashi Kapoor, in the memory of his father and legendary Bollywood star Prithviraj Kapoor, the Prithvi Theatre is the most renowned theatre for the performing arts in Mumbai.. It is one of the good places to visit", location: "20 Janki Kutir Juhu Church Road, Mumbai, Maharashtra - 4 0 0 0 4 9", contact: "022 2614 9546" },
    { number: "3", caption: "Take the Kids to Imagica.", more: "Touted as South Asia’s largest amusement theme park, Imagica reminds one of Disneyland somewhat. Its a pretty adventurous place and gives a great experience", location: "30/31, Khopoli-Pali Road, SH 92, Off Mumbai-Pune Express Way, Sangdewadi, Taluka Khalapur, District Raigad, Khopoli, Maharashtra - 4 1 0 2 0 3", contact: "022 4213 0405" },
    { number: "4", caption: "Evening Stroll on Marine Drive.", more: "The casual nightlife of Mumbai comes alive at Marine Drive post 6 pm. Sitting on the slabs, gazing at the glittering Mumbai cityscape looming over the sea is a very memorable affair. Come here to witness the twinkling lights of the city after the GCI concert  ends for a stroll. ", location: "Marine drive, Mumbai", contact: "not applicable" },
    { number: "5", caption: "Visit Haji Ali.", more: "Located off the coast of Worli, the Haji Ali Dargah is one of the most visited religious spots in Mumbai. Visitors from all over the world, irrespective of caste, sex and religion come here to pay their respects to the venerable Pir Haji Ali.", location: "Dargah Rd, Haji Ali, Mumbai, Maharashtra", contact: "022 2352 9082" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
	 'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
	'getNewsIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
	'getMoreInfoIntent': function () {
        this.handler.state = states.TOPFIVE;
        this.emitWithState('getMoreInfoIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        output = locationOverview;
        this.emit(':askWithCard', output, location, locationOverview);
    },
    'getAttractionIntent': function () {
        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },
    'getTopFiveIntent': function () {
        output = topFiveIntro;
        var cardTitle = "Top Five Things To See in " + location;

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }
        output += topFiveMoreInfo;
        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
	'getMoreInfoIntent': function () {
        this.handler.state = states.TOPFIVE;
        this.emitWithState('getAttractionIntent');
    },
   'getNewsIntent': function () {
	    httpGet();
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
	'getNewsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
	
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getTopFiveIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = this.event.request.intent.slots.attraction.value;
        var index = parseInt(slotValue) - 1;

        var selectedAttraction = topFive[index];
        if (selectedAttraction) {

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
	alexa.APP_ID = APP_ID;
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};


// Create a web request and handle the response.
function httpGet() {      
	
	var options = {
    host : 'timesofindia.indiatimes.com', 
	path : '/rssfeeds/-2128838597.cms', // the rest of the url with parameters if needed
	method : 'GET' 
    };
	
	var req = http.request(options, function(res) {

    var body = "";

        res.on('data', function(d) {
            body += d;
        });

 res.on('end', function() {
            
			parseString(body, function (err, result) {
            dataIntial = JSON.stringify(result);
			responseData = JSON.parse(dataIntial);
			});			
            
            var cardContent = "Data provided by Times of India\n\n";

            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;
                
				for (var i = 0; i < responseData.rss.channel.length; i++) {
				
				    for(var j=0;j < responseData.rss.channel[i].item.length;j++)   {
                
				        if (j < numberOfResults) {
                          
						  // Get the name and description JSON structure.
                           var headline = responseData.rss.channel[i].item[j].title;
                           var index = j + 1;
                           output += " Headline " + index + ": " + headline + ";";
                           cardContent += " Headline " + index + "\n";
                           cardContent += headline + "\n\n";
						
                    }
                }
				}
                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });	
	});
        
    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
	}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
