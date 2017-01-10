$(document).ready(function(){
  var $searchIcon = $("#user-search-icon");
  var $searchText = $("#text-search");
  var $searchField = $("#user-search-field");
  var $clearBtn = $("#clear-btn");
  var $randomBtn = $("#random-search");
  var $searchBtn = $("#search-btn");
  var $resultList = $("#search-results");
  // var resultLimit = 5;
  var randomUrl = "https://en.wikipedia.org/wiki/Special:Random";


  //default hides searh field upon fresh load
  $searchField.hide();
  $clearBtn.hide();
  $searchBtn.hide();

  //click on icon hides icon and shows searchfield
  $searchIcon.click(function(){
    $searchField.toggle();
    $searchField.focus();
    $clearBtn.toggle();
    $searchBtn.toggle();
    $searchIcon.toggle();
    $searchText.toggle();
  });

  //click on close button hides search field and shows icon
  $clearBtn.click(function(){
    $searchField.toggle();
    $searchField.val('')
    $clearBtn.toggle();
    $searchBtn.toggle();
    $searchIcon.toggle();
    $searchText.toggle();
  });

  //click on surprise me button opens random article in new tab
  $randomBtn.click(function(){
    window.open(randomUrl, '_blank');
  });

  //autocomplete, http://w3lessons.info/2015/03/01/autocomplete-search-using-wikipedia-api-and-jquery-ui/
  $searchField.autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "http://en.wikipedia.org/w/api.php",
        dataType: "jsonp",
        data: {
          "action": "opensearch",
          "format": "json",
          "search": request.term
        },
        success: function(data) {
          response(data[1]);
        },
        error: function(e) {
          console.log("Error loading autocomplete");
        }

      });
    }
  });


  //mimicks click on search button when user presses ENTER key
  $searchField.keypress(function(e){
    var key = e.which;
    if (key === 13) { $searchBtn.trigger("click"); }
  });

  //click on search button returns results list
 $searchBtn.on("click",function(){
   var searchTerm = $("#user-search-field").val();
   var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm + "&format=json&callback=?";
   // var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm + "&limit=" + resultLimit + "&format=json&callback=?";
   //makes request if search not null
   if ($searchField.val().length>0) {
     $.ajax({
       url : url,
       dataType : "json",
       type:"POST",
       headers: { 'Api-User-Agent': 'Example/1.0' },
       success : function(data){
         //first clears old results list if any
         $resultList.empty();
         //alerts user if no results returned
         if (data[1].length===0) {
          alert("No results");
          $searchField.val('');
         } else {
           for (var i=0; i<data[1].length; i++) {
             var li = document.createElement("li");
             //title with link part
             var a = document.createElement("a");
             var title = document.createTextNode(data[1][i]);
             a.setAttribute("href", data[3][i]);
             a.setAttribute("target", "_blank");
             a.appendChild(title);
             //preview part
             var preview = document.createTextNode(data[2][i] + "..");
             //putting it all together
             li.appendChild(a);
             li.appendChild(document.createElement("br"));
             li.appendChild(preview);
             $resultList[0].appendChild(li);
           }
           $searchField.val('');

           //scrolls to result, http://stackoverflow.com/a/19012631
           $('html, body').animate({
              scrollTop: $resultList.offset().top
           },
           2000);
         }
       },
       //alerts user if request fails
       error : function(e){
         alert("Error making request");
       }
     });
   } else {
     //alerts user if search null
     alert("Enter search key");
   }
 });

});
