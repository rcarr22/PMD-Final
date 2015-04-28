/**
// Author: Ryan Carr
// Creation Date: April 28, 2015
// Revised: April 28, 2015
*/
//==============Global Variables=======================
var minPix = 15, maxPix = 40;
var contacts = "";
var recordsArray = [];
var currentRecordIndex = 1;
var ajax = new XMLHttpRequest();
//=================Responsive Size function(s))===========
var setMainPixels = liquidPixelFactory(320,1920);
//===============Event handlers =======================
window.addEventListener("load",init,false);
window.addEventListener("resize",resize,false);
//-----resize helper function----------
function resize(){
    S("content").fontSize = setMainPixels(minPix,maxPix) + "px";
}
//-------------clear the search text window-------------
O('clear').addEventListener("click", function(){
  O('searchText').value = "";
},false);
//-------------------------------------------------------
O("nextBtn").addEventListener("click",function(){
  var upperIndex = recordsArray.length;
  if(currentRecordIndex < upperIndex -1){
    currentRecordIndex++;
    showRecord(currentRecordIndex);
  }
  else{
    currentRecordIndex = 1;
    showRecord(currentRecordIndex);
  }
},false);
//----------------clear local storage-----------
O("clearLocal").addEventListener("click", function(){
    if(!!localStorage){
        localStorage.clear();
    }
}, false);
//----------------telephone the contact--------------------
O("phone").onclick = function(){
    document.location = 'tel:' + O("phone").innerHTML.trim();
}
//======================================================
/*
Store our csv file locally if localStorage
is supported.
*/
function init(){
    resize();
  //check if localStorage is supported:
  //if so, see if our contacts are there ..
    // if they are not there,get them from the server (via ajax request)...
    // and 1.) save 'em to our contacts variable && then 2.)save in localStorage.
    // If they are already saved locally, put 'em into our contacts variable
  //if localStorage is not supported, then get contacts from server, and...
  // ...save them in our contacts variable (you can't save it to localStorage).
  if(!!localStorage){
    if(!localStorage.getItem("contacts")){
      ajax.open("GET","docs/contacts.csv", true);
      ajax.send();
      //=====================================
      ajax.onreadystatechange = function(){        
        if(ajax.readyState === 4){
          if(ajax.status === 200 || ajax.status === 0){
            // stores to our variable              
            contacts = ajax.response;
            //now store to browser
            localStorage.setItem("contacts", contacts);
            // put the response into our program's variable named "contacts".
            //(which also shows the first record )            
            makeRecords(contacts);
          }
          else{
            alert("Error from server: \n" + ajax.status);
          }
        }        
      }
    }
    else{//there was something stored: go get it.
      // put the response into our program's variable named "contacts".
      //(which also shows the first record )
        makeRecords( localStorage.getItem("contacts") );
    }
  }
  else{
    alert("local storage not supported");
    ajax.open("GET", "docs/contacts.csv", true);
    ajax.send();    
    //event to handle ajax request done
    ajax.onload = function(){
      if(ajax.status === 200 || ajax.status === 0){
        //alert("Contacts: " + ajax.response);
        //store the response in our contacts variable
        contacts = ajax.response;
        makeRecords(contacts);
      }
      else{
        alert("Uh, oh! something went wrong.");
      }
    }
  }
  //-------------focus on the search window --------------
  O("searchText").focus();
}//end of init() function
//=============================================================
function makeRecords(csvString){
  contacts = csvString;
  recordsArray = contacts.split("\n");
  //display "first" contact
  showRecord(1);
}
//======================================
function showRecord(index){
  currentRecordIndex = index;
  var oneRecordArray = recordsArray[index].split(",");
  O("lastname").innerHTML = oneRecordArray[0];
  O("firstname").innerHTML = oneRecordArray[1];
  O("phone").innerHTML =  oneRecordArray[2];
}
//=======================================



