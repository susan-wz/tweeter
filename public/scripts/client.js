/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// function used to prevent cross site scripting attacks via tweets
const escape = (string) => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
};

// function to create individual tweets ready for rendering to the page
const createTweetElement = function (tweet) {
  const $tweet = $("<article>").addClass("tweet");
  let date = new Date(); let today = date.getTime();
  let daysSince = Math.round((today - tweet.created_at) / 86400000); // milliseconds to days conversion
  const tweetContent = `<header>
          <img class="name" src="${tweet.user.avatars}">
          <span class="name">${tweet.user.name}</span>
          <span class="handle">${tweet.user.handle}</span>
        </header>
        <p class="tweet">${escape(tweet.content.text)}</p>
        <footer>
          <span>${daysSince} days ago</span>
          <div>
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>`;
  $tweet.append(tweetContent);
  return $tweet;
};

// function to render all tweets on the page and put them in the tweet container
const renderTweets = function (tweetArray) {
  tweetArray.forEach(function (tweet) {
    $('#tweets-container').prepend(createTweetElement(tweet));
  });
};

// function to run renderTweets upon page load and new tweet submission
const loadTweets = function () {
  $.get('/tweets', function (data) {
    renderTweets(data);
  });
};

// function to create and render error message when user submits empty or too long tweet
const showError = function (errorType) {
  let $errorMsg = "";
  if (errorType === "noText") {
    $errorMsg = $("<span>").text("Tweet empty - type away!");
  } else {
    $errorMsg = $("<span>").text("Too many characters in your tweet - brevity is key here.");
  }
  $('#error-msg').addClass("show")
    .empty()
    .append($(`<i class="fas fa-exclamation-circle"></i>`))
    .append($errorMsg)
    .append($(`<i class="fas fa-exclamation-circle"></i>`))
    .slideDown(300);
};

$(document).ready(function () {

  // to load tweets upon initial page load
  loadTweets();

  // functionality behind tweet submit button
  $("form").submit(function (event) {
    event.preventDefault();
    let tweetText = $('form').serialize();
    if (tweetText.length === 5) {
      showError("noText");
    } else if (tweetText.length > 145) {
      showError("tooMuchText");
    } else {
      $('#error-msg').slideUp(300).removeClass("show").empty(); // removes previous error message upon valid tweet submittion
      $.ajax({ // makes ajax post request
        url: '/tweets',
        method: 'POST',
        data: tweetText,
      })
        .then(function () { // reloads tweets and empties textarea
          $('#tweets-container').empty();
          $("#new-tweet-textarea").val('');
          loadTweets();
        });
    }
  });

  //functionality behind "write a new tweet" button in nav
  $(function () {
    const $button = $('#write-button');
    $button.on('click', function () {
      if ($("#new-tweet").css("display") === "none") {
        $("#new-tweet").slideDown(300);
        $("#new-tweet-textarea").focus();
      } else {
        $("#new-tweet").slideUp(300);
        $('#error-msg').slideUp(300).removeClass("show").empty();
      }
    });
  });
});