$(document).ready(function () {


  $("textarea").keyup(function () {
    let value = $(this).val();
    let counter = 140 - value.length;
    
    $(this).siblings(".counter").text(counter);

    if (counter < 0) {
      $(this).siblings(".counter").addClass("warning");
    } else {
      $(this).siblings(".counter").removeClass("warning");
    }

  })
    .keyup();

});

/* use jquery to change the text*/