$(document).ready(function () {


  $("textarea").keyup(function () {
    let value = $(this).val();
    let counter = 140 - value.length;
    
    $('#error-msg').slideUp(300).removeClass("show").empty();

    $(this).siblings(".counter").text(counter);

    if (counter < 0) {
      $(this).siblings(".counter").addClass("warning");
    } else {
      $(this).siblings(".counter").removeClass("warning");
    }

  })
    .keyup();

});