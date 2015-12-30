
//var ROOT_URL = 'http://jsonplaceholder.typicode.com/';

var ROOT_URL = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
var data;
/***********************/

$(document).ready(function() {
  $.ajax({
    method: "GET",
    url: ROOT_URL
  })

  .done(function(res) {
    out_Table(res);
  })

  .fail(function(jqXHR, textStatus) {
    alert( "Request failed: " + textStatus );
  });
});

function out_Table(obj) {
    var currencies = {}; 
      obj.forEach(function(el) {
      currencies[el.ccy] = el.ccy;
      currencies[el.base_ccy] = el.base_ccy;
    });
    data = currencies;


    for(var el in currencies){
      $('#from')
         .append($("<option></option>")
         .attr("value",el)
         .text(el));   
      // $('#to')
      //    .append($("<option></option>")
      //    .attr("value",el)
      //    .text(el));   
    }

    obj.forEach(function(el) {
      var temp = "</tr><table><tbody><tr><td><strong>"+el.ccy+":</strong></td><td>"+el.buy+"</td><td>"+el.sale+"</td></tr></tbody></table>";
      var result = $('<div>', {'class': 'result1'}).css({
                   'background': '#E8EDFF',
                   });   
         result.html(temp).fadeIn('slow');
        $('.table_cur').append(result);
    });
    simalar();
}

$( "#from" )
  .change(function () {
    $('#to').empty();
    $( "select option:selected" ).each(function() {
     simalar();
    });
  })
  .change();

function simalar() {     
    var selected_from = $('#from option:selected').val();
    for(var el in data){
      if (selected_from !== el){
      $('#to')
         .append($("<option></option>")
         .attr("value",el)
         .text(el));   
      }
    }
}

$('.button').click(function(e){
  $.ajax({
    method: "GET",
    url: ROOT_URL
  })

  .done(function(res) {
    out_Date(res);
  })

  .fail(function(jqXHR, textStatus) {
    alert( "Request failed: " + textStatus );
  });

});

function out_Date(obj) {
  var selected_from = $('#from option:selected').val();
  var selected_to = $('#to option:selected').val();
  var currency_input = $('.currency_input').val();
  var currency_from = undefined;
  var currency_to = undefined;

  obj.forEach(function(el) {
    if (el.ccy === selected_from){
        currency_from = el;
    }  
     
    if (el.ccy === selected_to){
        currency_to = el;
    }

    });

  
  if (selected_from === selected_to) {
    $('.result').text('you carrency: '+ currency_input);
  }
  else if (currency_from !== undefined && currency_from.base_ccy === selected_to ){
    $('.result').text('you carrency: '+ currency_from.buy * currency_input);

  }
  else if (currency_from === undefined && currency_to !==undefined && currency_to.base_ccy === selected_from ){
    $('.result').text('you carrency: '+ currency_input / currency_to.sale);
    
  }
  else if (currency_from !==undefined && currency_to !==undefined){
    if (currency_from.base_ccy === currency_to.base_ccy){
      var temp = currency_from.buy * currency_input;
      $('.result').text('you carrency: ', temp / currency_to.sale );
    }
    else if (canConv(obj, currency_from.base_ccy ,currency_to.base_ccy) === true){
      var temp = currency_from.buy * currency_input;
          obj.forEach(function(el) {
            if (el.ccy === currency_from.base_ccy){
                currency_from = el;
            }  
          });
          temp =  temp * currency_from.sale;
          $('.result').text('you carrency: '+  temp / currency_to.sale );
    }
    else {
       $('.result').text('I am sorry, The are no any information about currencies');
    }

  } else {
     $('.result').text('I am sorry, The are no any information about currencies');
  }
 
}

function canConv(obj, from, to) {
  var result=false; 
    obj.forEach(function(el) {
      if ((el.base_ccy === from && el.ccy === to) || (el.base_ccy === to && el.ccy === from)){
        result = true;
      }
    }); 
  return result;
}
