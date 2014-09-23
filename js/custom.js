$(document).ready(function(){
	/*--------------------------------------------------------*/
	/* # JAVASCRIPT CHECK */
	/*--------------------------------------------------------*/
	$("html").removeClass("no-js").addClass("js");

	/*--------------------------------------------------------*/
	/* # NAVIGATION */
	/*--------------------------------------------------------*/

	$(function(){
		$(window).scroll(function () {
			if ($(this).scrollTop() > 600) {
				$('#back-top').removeClass('downscaled');
			} else {
				$('#back-top').addClass('downscaled');
			}
		});
		$('#back-top').click(function(){
				$('body,html').animate({ scrollTop: 0 }, 800);
				return false;
		});
	});

	/*--------------------------------------------------------*/
	/* # CONTACT FORM */
	/*--------------------------------------------------------*/
	$(function(){

		var contactForm = $(".contact-form"),
			triggerForm = $(".contact-bar .btn");

		contactForm.hide();
		triggerForm.click(function(){
			contactForm.slideDown(300);
			triggerForm.fadeOut(500);

		});

	});

	$(function() {
	  $("#cform").on("submit",function(e){

	    if($("#cform")[0].checkValidity()) {
	      $.post("mailer.php", $("#cform").serialize(),  function(response) {
	        $('#success').fadeIn(500).html(response);
	        $("#cform").fadeOut(300);
			e.preventDefault();
	      });
	    } else console.log("invalid form");
		e.preventDefault(); // stop actual submission
	  });
	});

	$(function(){
		$('input, textarea').placeholder();
	});

});
