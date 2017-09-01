/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var http = require("https");
//var request = require("request");
//var sleep = require('sleep');
var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  // url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: Conversation.VERSION_DATE_2017_04_21
});

// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    return res.json(updateMessage(payload, data));
  });
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */

var toto;
function getVar(Uni_Var){
console.log(typeof Uni_Var + Uni_Var);
toto = Uni_Var;
return Uni_Var;

}
//**********************************************************
//*              Fonction getIncident
//**********************************************************
function getIncident(Numero, callback, urgency_var_Json, short_desc_http){
   var request = require("request");
   var options = { method: 'POST', url: 'https://dev37615.service-now.com/api/now/table/incident',headers: { 'postman-token': '1688794f-1233-8b00-60fc-be57f33dbd20','cache-control': 'no-cache', authorization: 'Basic YWRtaW46Z1VHcFdwS3pQcEV5','content-type': 'application/json', accept: 'application/json' }, body:{ short_description: short_desc_http, urgency: urgency_var_Json },
  json: true };

  request(options, Numero, function (error, response, body, Numero) {
   try {
	var json=JSON.parse(body);
	Numero = json.result.number;
        console.log(Numero);
	callback(null, "here is the number :" + Numero);
       } catch (e) {
	console.log(JSON.stringify(response));
	console.log(typeof response);
	//var json = JSON.parse(response);
	response = response.body.result.number;
	Numero = JSON.stringify(response);
        console.log(Numero);
	//callback(null, Numero);
	//callback(e, null);
	console.log ("catch");
	//callback(Numero);
	getVar(Numero);
	return Numero;
       }



    //   if (error) throw new Error(error);
      //      console.log(body);
	//    data_to_parse = body;
	  //  return data_to_parse;
    });
}

//**********************************************************
//*              Fonction updateMessage
//**********************************************************

function updateMessage(input, response, callback,Numero) {
   console.log("Test");
   var responseText = null;
   if (!response.output) {
      response.output = {};
      console.log("Test if");
      callback(response);
   } else {
      console.log("Test esle");
      if (response.entities.length > 0){
         console.log("test-moi");
         console.log(response.entities[0].entity);
      }
      if (response.context.short_desc_Json !== "" ){
         var short_desc_http = response.context.short_desc_Json;
      }

//---------------------
//    ouvre un ticket
//---------------------
	// numéro
	if (response.context.incident_ticket_number === true){
	response.output.text[0] = "Voila le numéro : " + getVar(toto) + ". <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.incident_ticket_number = false;
	return response;
	
	}    
	
	if (response.context.lien_incident === true){
	var string_lien =getVar(toto);
	var str_rplace = string_lien.replace(/\"/g, ""); 
	console.log(typeof str_rplace + str_rplace);
	response.output.text[0] = "Votre incident a été posté, vous pouvez le retrouver dans ce <a href=\"https://dev37615.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number="+str_rplace+"\" target=\"_blank\" >lien</a>. <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.lien_incident = false;
	return response;

	} 
 



 
      if ( response.context.incident_var === true ){
         var num_incident ;
         var data_to_parse;
         var parsed_data;
//------------------------------------------------
         console.log("Création du ticket");
	 var urgency_var_Json = response.context.urgency_var ;
         getIncident(callback,null,urgency_var_Json, short_desc_http ,function (e,  Numero){
	    //response.output.text = Numero;
	    //callback(response);
	    console.log(" Voila le numéro ! : " + Numero);
	    return Numero;
         });
		
console.log("voila la ligne ---------------");

console.log("Entrée dans la zone commentaire");

     var urgency_var_Json = response.context.urgency_var ;

      console.log("test11");	
      response.context.incident_var = false;
      return response;
   }






	  // Description + Email outlook 2007 non utile 

   if(response.context.desc_first_msg_incident !== "" ){
      var desc_var_bis_Json = response.context.desc_first_msg_incident;
   }

   if(response.context.incident_var_bis === true){
	
      var body_to_parse;
      var options = {
 "method": "POST",
 "hostname": "dev37615.service-now.com",
 "port": null,
 "path": "/api/now/table/incident",
 "headers": {
   "accept": "application/json",
   "content-type": "application/json",
   "authorization": "Basic YWRtaW46Z1VHcFdwS3pQcEV5",
   "cache-control": "no-cache",
   "postman-token": "9a16c542-1154-e7a1-efba-995554f65aa8"
           }
      };
      var http = require("https");
      var req = http.request(options, function (res) {
         var chunks = [];
         res.on("data", function (chunk) {
            chunks.push(chunk);
         });
         res.on("end", function () {
            var body = Buffer.concat(chunks);
	    console.log(typeof body + body);
	    body_to_parse = JSON.parse(body);
	    body_to_parse = body_to_parse.result.number;
	    body_to_parse = JSON.stringify(body_to_parse);
	    getVar(body_to_parse);
         });
      });

// var desc_var_bis_Json = response.context.short_desc_Json_bis ;

/* var short_desc_http = response.context.short_desc_Json ; */
 


      req.write(JSON.stringify({short_description : desc_var_bis_Json, subcategory : 'Email Outlook 2007' }));

/* req.write(JSON.stringify(data_to_send_json)); */
      req.end();

	/* response.output.text = "Incident créé"; */

      response.context.incident_var_bis = false;
      desc_var_bis_Json = "";
	
      return response;
   }

    if( response.context.numero_outlook_2007 === true){
	response.output.text[0] = "Voila le numéro : " + getVar(toto) + ". <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.numero_outlook_2007 = false;
	return response;

}

     if (response.context.lien_outlook_2007 === true){
	var strg_lien =getVar(toto);
	var str_replace = strg_lien.replace(/\"/g, ""); 
	console.log(typeof str_replace + str_replace);
	response.output.text[0] = "Votre incident a été posté, vous pouvez le retrouver dans ce <a href=\"https://dev37615.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number="+str_replace+"\" target=\"_blank\" >lien</a>. <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.lien_outlook_2007 = false;
	return response;

	} 
 

	  
	  
	  // incident outlook 2010
	  
	  
	  
   if(response.context.incident_var_quat === true){
      var options = {
 "method": "POST",
 "hostname": "dev37615.service-now.com",
 "port": null,
 "path": "/api/now/table/incident",
 "headers": {
   "accept": "application/json",
   "content-type": "application/json",
   "authorization": "Basic YWRtaW46Z1VHcFdwS3pQcEV5",
   "cache-control": "no-cache",
   "postman-token": "9a16c542-1154-e7a1-efba-995554f65aa8"
            }
   };
   var http = require("https");
   var req = http.request(options, function (res) {
   var chunks = [];

   res.on("data", function (chunk) {
      chunks.push(chunk);
    });

   res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
      var body_to_parse = JSON.parse(body);
      body_to_parse = body_to_parse.result.number;
      body_to_parse = JSON.stringify(body_to_parse);
      getVar(body_to_parse);
   });
});



 // var short_desc_http2 = response.context.incident_desc_quat ;
 


   req.write(JSON.stringify({ short_description : desc_var_bis_Json  , subcategory : 'Email Outlook 2010' }));



/* req.write(JSON.stringify(data_to_send_json)); */
   req.end();

	/* response.output.text = "Incident créé"; */

   response.context.incident_var_quat = false;
   desc_var_bis_Json = "";
   return response;
   }
	  	  
	  
	if( response.context.numero_outlook_2010 === true){
	response.output.text[0] = "Voila le numéro : " + getVar(toto) + ". <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.numero_outlook_2010 = false;
	return response;

}

     if (response.context.lien_outlook_2010 === true){
	var str_lien =getVar(toto);
	var strg_replace = str_lien.replace(/\"/g, ""); 
	console.log(typeof strg_replace + strg_replace);
	response.output.text[0] = "Votre incident a été posté, vous pouvez le retrouver dans ce <a href=\"https://dev37615.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number="+strg_replace+"\" target=\"_blank\" >lien</a>. <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.lien_outlook_2010 = false;
	return response;

	}	  
	  	  
	  
// -----------------------------------------------------------------------------------------------------------	  
// incident partage réseau



if( response.context.$net_share !== ""){

var path_net_share =  response.context.$net_share ;
response.context.$net_share= '';

}

//------------------------------------------------

	if( response.context.net_shar_num === true){
	response.output.text[0] = "Voila le numéro : " + getVar(toto) + ". <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.net_shar_num = false;
	return response;

}

     if (response.context.net_shar_lien === true){
	var str_lien =getVar(toto);
	var strg_replace = str_lien.replace(/\"/g, ""); 
	console.log(typeof strg_replace + strg_replace);
	response.output.text[0] = "Votre incident a été posté sous le numéro " + strg_replace + ", vous pouvez le retrouver dans ce <a href=\"https://dev37615.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number="+strg_replace+"\" target=\"_blank\" >lien</a>. <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.net_shar_lien = false;
	return response;

	}






//----------------------------------------------------

if( response.context.incident_var_net_share === true){

var http = require("https");

var options = {
  "method": "POST",
  "hostname": "dev37615.service-now.com",
  "port": null,
  "path": "/api/now/table/incident",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "Basic YWRtaW46Z1VHcFdwS3pQcEV5",
    "cache-control": "no-cache",
    "postman-token": "1687c9b2-499e-567c-83f7-f8a505de09b5"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
    var body_to_parse = JSON.parse(body);
      body_to_parse = body_to_parse.result.number;
      body_to_parse = JSON.stringify(body_to_parse);
      getVar(body_to_parse);
  });
});

req.write(JSON.stringify({ short_description: ' :  ' + path_net_share,
  subcategory: 'net_share' }));
req.end();

response.context.incident_var_net_share = "";
path_net_share = "";
response.context.$OS_ver ="";

return response;
}

// Visio

if( response.context.$post_number !== ""){

var number_of_post = response.context.$post_number;
} 

if( response.context.request_var === true ){



var options = {
  "method": "POST",
  "hostname": "dev37615.service-now.com",
  "port": null,
  "path": "/api/now/table/incident",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "Basic YWRtaW46Z1VHcFdwS3pQcEV5",
    "cache-control": "no-cache",
    "postman-token": "433ad096-50b1-b2c4-6fac-d5f414aead24"
  }
};
var http = require("https");
var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
    var body_to_parse = JSON.parse(body);
    body_to_parse = body_to_parse.result.number;
    body_to_parse = JSON.stringify(body_to_parse);
    getVar(body_to_parse);
  });
});

req.write(JSON.stringify({ short_description: number_of_post +'  MS Visio' }));
req.end();

//response.context.os_v = "";
response.context.$postnumber = "";
 response.context.request_var = false ; 
return response;
}


   if (response.context.visio_lien === true){
	var str_lien =getVar(toto);
	var strg_replace = str_lien.replace(/\"/g, ""); 
	console.log(typeof strg_replace + strg_replace);
	response.output.text[0] = "Votre incident a été posté, vous pouvez le retrouver dans ce <a href=\"https://dev37615.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number="+strg_replace+"\" target=\"_blank\" >lien</a>. <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.visio_lien = false;
	return response;

	}



	  // aucune detection, autre que archivage 
	  var parsed_var;
		var var_to_parse;
		var numero;
		var version_out;
	if(response.context.version_out_context !== ''){
	version_out = response.context.version_out_context;
	response.context.version_out_context ='';
}

	if( response.context.numero_not_spec === true){
	response.output.text[0] = "Voila le numéro : " + getVar(toto) + ". <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.numero_not_spec = false;
	return response;

}

     if (response.context.lien_not_spec === true){
	var str_lien =getVar(toto);
	var strg_replace = str_lien.replace(/\"/g, ""); 
	console.log(typeof strg_replace + strg_replace);
	response.output.text[0] = "Votre incident a été posté, vous pouvez le retrouver dans ce <a href=\"https://dev37615.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number="+strg_replace+"\" target=\"_blank\" >lien</a>. <br>N'hésitez pas si vous avez d'autres questions.";
	response.context.lien_not_spec = false;
	return response;

	}
	  
	   if(response.context.incident_var_quin === true){
		  		
	  
var options = {
 "method": "POST",
 "hostname": "dev37615.service-now.com",
 "port": null,
 "path": "/api/now/table/incident",
 "headers": {
   "accept": "application/json",
   "content-type": "application/json",
   "authorization": "Basic YWRtaW46Z1VHcFdwS3pQcEV5",
   "cache-control": "no-cache",
   "postman-token": "9a16c542-1154-e7a1-efba-995554f65aa8"
 }
};
var http = require("https");
var req = http.request(options, function (res) {
 var chunks = [];

 res.on("data", function (chunk) {
   chunks.push(chunk);
 });

 res.on("end", function () {


	console.log("Test function hello");
	var body = Buffer.concat(chunks);	
	console.log(body.toString());
   	var body_to_parse = JSON.parse(body);
        body_to_parse = body_to_parse.result.number;
        body_to_parse = JSON.stringify(body_to_parse);
        getVar(body_to_parse);


 ;});
});




req.write(JSON.stringify({ short_description: desc_var_bis_Json, subcategory : version_out }));




req.end();


response.context.incident_var_quin = false;
desc_var_bis_Json = "";


  	
	  }
	  	  
	  
}


  return response;
}
module.exports = app;
