/* Author: Yi Suo
 * This script loads a slideshow JSON from a file and manipulates the DOM
 * to create a slide show.
 */

// The SlideShow class. Each SlideShow object represents an individual slideshow
// component generated from JSON. Each slideshow component has a unique numeric
// id
function SlideShow(slideshow){
    // Instance variables
    this.data = slideshow;
    this.slideTimer = 0;
    this.currentSlide = 0;
    this.id = slideshow.id;

    // Dynamically sets the HTML content for the caption, and loads the
    // image of a slide.
    this.renderSlide = function renderSlide() {
        var slide = this.data.slides[this.currentSlide];
        var caption = slide.caption;
        var filename = slide.image_file_name;
        var path = slide.image_path;
        var innerHTML = '<img class="slideshow image" src="' + path + filename + '">';
        $('#' + this.data.id + ' .slideshow.caption').text(caption);
        $('#' + this.data.id + ' .slideshow.wrapper').html(innerHTML);
    };
    
    // Iterates to the next slide and renders the display.
    // If it reaches the end of the slide show, start from first slide.
    this.nextSlide = function nextSlide(){
        if (this.currentSlide === this.data.slides.length - 1) {
            this.currentSlide = 0;
        }
        else {
            this.currentSlide++;
        }
        this.renderSlide();
    };
    
    // Iterates to the previous slide and renders the display.
    // If it reaches the beginning of the slide show, go to the last slide.    
    this.prevSlide = function prevSlide() {
        if (this.currentSlide === 0) {
            this.currentSlide = this.data.slides.length - 1;
        }
        else {
            this.currentSlide--;
        }
        this.renderSlide();
    };
    
    // Starts a timer that flips the slides forward every 3 seconds.
    this.playSlides = function playSlides() {
        var obj = this;
        this.nextSlide();
        this.slideTimer = setInterval(function () {
            obj.nextSlide();
        }, 3000);
    };
    
    // Stops the timer.
    this.pausePlay = function pausePlay() {
        clearInterval(this.slideTimer);
    };
    
    // Initialize the slides view with the first slide displaying
    this.initSlides = function initSlides() {
        $('#' + this.data.id + ' .title').text(this.data.title);
        this.renderSlide();
    };
 
    // Sets the on click event handlers for the previous, play, and next
    // glyphicons. The play glyphicon toggles between play and pause.
    this.initEventHandlers = function initEventHandlers() {
        var obj = this;
        $('#' + this.data.id + ' .slideshow.buttons .prev').on("click", function () {
            obj.prevSlide();
        });

        $('#' + this.data.id + ' .slideshow.buttons .next').on("click", function () {
            obj.nextSlide();
        });

        $('#' + this.data.id + ' .toggle').on("click", function () {
            if ($(this).hasClass('play')) {
                $(this).attr('class', 'toggle pause');
                    obj.playSlides();
                }
            else if ($(this).hasClass('pause')) {
                $(this).attr('class', 'toggle play');
                obj.pausePlay();
            }
        });
    };
}

// Creates an instance of a SlideShow Javascript object and renders its view
// as well as creates its event handlers.
function initSlideshow(slideshow){
    slideShowObj = new SlideShow(slideshow);
    slideShowObj.initSlides();
    slideShowObj.initEventHandlers();
}