$(document).ready(function() {
  // Initialize turn.js
  $(".flipbook").turn({
    width: 800,
    height: 600,
    autoCenter: true,
    duration: 1000,
    gradients: true,
    acceleration: true
  });
  
  // Calculate total pages
  var totalPages = $(".flipbook").turn("pages");
  const music = document.getElementById("bg-music");
  
  // Button navigation
  $("#prev-btn").click(function() {
    $(".flipbook").turn("previous");
    updateRestartButton();
  });
  
  $("#next-btn").click(function() {
    $(".flipbook").turn("next");
    updateRestartButton();
    
    // Play music when first turning the page
    if ($(".flipbook").turn("page") === 2) {
      try {
        music.play().catch(e => console.log("Music play prevented: ", e));
      } catch (e) {
        console.log("Music error: ", e);
      }
    }
    
    // Show confetti at the end
    if ($(".flipbook").turn("page") === totalPages) {
      launchConfetti();
    }
  });
  
  // Restart button
  $("#restart-btn, #end-restart-btn").click(function() {
    $(".flipbook").turn("page", 1);
    $("#restart-btn").hide();
    $("#end-page").hide();
    $(".flipbook").show();
    $(".controls").show();
    
    // Reset music
    music.pause();
    music.currentTime = 0;
  });
  
  // Keyboard navigation
  $(document).keydown(function(e) {
    switch(e.which) {
      case 37: // left arrow key
        $(".flipbook").turn("previous");
        updateRestartButton();
        e.preventDefault();
        break;
      case 39: // right arrow key
        $(".flipbook").turn("next");
        updateRestartButton();
        e.preventDefault();
        break;
    }
  });
  
  // Function to update restart button visibility
  function updateRestartButton() {
    // Small timeout to ensure the page number is updated
    setTimeout(function() {
      var currentPage = $(".flipbook").turn("page");
      if (currentPage == totalPages) {
        $("#restart-btn").show();
        setTimeout(function() {
          $(".flipbook").hide();
          $(".controls").hide();
          $("#end-page").css("display", "flex");
        }, 1500);
      } else {
        $("#restart-btn").hide();
      }
    }, 50);
  }
  
  // Initial check for the button
  updateRestartButton();
  
  // Also handle the turned event as backup
  $(".flipbook").bind("turned", function(event, page, view) {
    updateRestartButton();
  });
  
  // Handle start event to hide button during turning
  $(".flipbook").bind("start", function(event, pageObject, corner) {
    if (pageObject.next == 1) {
      $("#restart-btn").hide();
    }
  });
});

// Confetti function
function launchConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 100,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 100,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}