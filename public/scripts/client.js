/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const escape = (string) => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
};

const createTweetElement = function (tweet) {
  const $tweet = $("<article>").addClass("tweet");
  let date = new Date(); let today = date.getTime();
  let daysSince = Math.round((today - tweet.created_at) / 86400000);
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
        </footer>`
  $tweet.append(tweetContent);
  return $tweet;
}

const renderTweets = function (tweetArray) {
  tweetArray.forEach(function (tweet) {
    $('#tweets-container').prepend(createTweetElement(tweet));
  })
}

const loadTweets = function () {
  $.get('/tweets', function (data) {
    renderTweets(data);
  })
}

const showError = function (errorType) {
  let $errorMsg = "";
  if (errorType == "noText") {
    $errorMsg = $("<span>").text("Tweet empty - planning on saying something there pal?");
  } else {
    $errorMsg = $("<span>").text("Too many characters in your tweet - brevity is key here.");
  }
  $('#error-msg').addClass("show")
    .empty()
    .append($(`<i class="fas fa-exclamation-circle"></i>`))
    .append($errorMsg)
    .append($(`<i class="fas fa-exclamation-circle"></i>`))
    .slideDown(300)
}

$(document).ready(function () {

  loadTweets();

  $("form").submit(function (event) {
    event.preventDefault();
    let tweetText = $('form').serialize();
    if (tweetText.length === 5) {
      showError("noText");
    } else if (tweetText.length > 145) {
      showError("tooMuchText");
    } else {
      $('#error-msg').slideUp(300).removeClass("show").empty()
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: tweetText,
      })
        .then(function (data) {
          $('#tweets-container').empty();
          $("#new-tweet-textarea").val('')
          loadTweets();
        })
    }
  });

  $(function () {
    const $button = $('#write-button');
    $button.on('click', function () {
        if($("#new-tweet").css("display") === "none") {
          $("#new-tweet").slideDown(300)
          $("#new-tweet-textarea").focus();
        } else {
          $("#new-tweet").slideUp(300);
        }
    })
  })
});