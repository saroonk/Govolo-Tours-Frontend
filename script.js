document.addEventListener('DOMContentLoaded', () => {

    const bgContainer = document.querySelector('.slider-bg-container');
    const trackIndicator = document.querySelector('.track-indicator');

    // Background images
    const images = [
        'assets/aa6bf5a56bd2c407d13505c5448ac0e37666d40a.jpg',
        'assets/slider_img_2_1773465808651.png',
        'assets/slider_img_3_1773465830830.png'
    ];

    let currentIndex = 0;
    const slides = [];

    // Initialize slides with opacity 0 except the first one
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slider-bg');
        if (index === 0) {
            slide.classList.add('active'); // First slide is visible immediately
            slide.style.opacity = '1';
        }
        slide.style.backgroundImage = `url('${img}')`;
        bgContainer.appendChild(slide);
        slides.push(slide);
    });

    const totalSlides = slides.length;
    if (totalSlides === 0) return;

    // Track indicator calculation logic (for vertical layout)
    function updateIndicator(index) {
        if (!trackIndicator) return;
        trackIndicator.style.top = `${(index / totalSlides) * 100}%`;
    }

    updateIndicator(currentIndex);

    let autoSlideInterval;

    /**
     * Updates classes for 'active' smoothly 
     */
    function updateClasses(activeIndex) {
        slides.forEach((slide, index) => {
            if (index === activeIndex) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            }
        });
        updateIndicator(activeIndex);
    }

    /**
     * Controls the slider direction logic 
     */
    function slideTo(direction) {
        if (direction === 'next') {
            // Move to the next index
            currentIndex = (currentIndex + 1) % totalSlides;
        } else if (direction === 'prev') {
            // Move to previous index
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        }
        updateClasses(currentIndex);
    }

    // Controls Buttons (Top / Bottom Arrows)
    const btnNext = document.querySelector('.slide-next');
    const btnPrev = document.querySelector('.slide-prev');

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            slideTo('next');
            resetAutoSlide();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            slideTo('prev');
            resetAutoSlide();
        });
    }

    /* Auto Sliding */
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            slideTo('next');
        }, 6000); // 6 seconds interval
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Start auto slide initially
    startAutoSlide();


    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.custom-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                // Add stronger blur and background when scrolled
                navbar.style.backgroundColor = 'rgba(217, 217, 217, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
                navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            } else {
                // Return to normal
                navbar.style.backgroundColor = 'var(--navbar-bg)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
            }
        });
    }
    /* --- Custom Filter Dropdown Selection --- */
    const filterDropdownItems = document.querySelectorAll('.custom-filter-dropdown .dropdown-item');
    filterDropdownItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const text = this.innerText;
            const dropdown = this.closest('.custom-filter-dropdown');
            const selectedValue = dropdown.querySelector('.selected-value');
            if (selectedValue) {
                selectedValue.innerText = text;
            }
        });
    });







    // ==========================================
    // Tour Categories Arch Carousel Logic
    // ==========================================
    var archCarousel = $('.custom-arch-carousel');

    // Dynamically generate navigation dots based on the actual number of items
    var dotsContainer = $('.custom-arch-dots');
    var totalItems = archCarousel.children('.item').length;

    dotsContainer.empty();
    for (var i = 0; i < totalItems; i++) {
        var activeClass = i === 0 ? 'active' : '';
        dotsContainer.append('<button class="custom-dot ' + activeClass + '" data-index="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>');
    }

    function updateArchStyles(e) {
        var items = archCarousel.find('.owl-item');
        items.removeClass('item-center item-left-1 item-left-2 item-right-1 item-right-2');

        var centerItem;
        var relativeIndex = 0;

        if (e && e.item && e.item.index != null) {
            centerItem = items.eq(e.item.index);
            // Get relative index (0 to 4) using owl carousel API if available
            if (e.relatedTarget) {
                relativeIndex = e.relatedTarget.relative(e.item.index);
            }
        } else {
            // Fallback for initialization before fully set
            centerItem = archCarousel.find('.owl-item.center');
            if (centerItem.length) {
                // Estimate index
                relativeIndex = centerItem.index() % totalItems;
            }
        }

        if (centerItem.length) {
            centerItem.addClass('item-center');
            centerItem.prev().addClass('item-left-1');
            centerItem.prev().prev().addClass('item-left-2');
            centerItem.next().addClass('item-right-1');
            centerItem.next().next().addClass('item-right-2');
        }

        // Update custom dots visually synchronously
        if (e && e.relatedTarget) {
            $('.custom-dot').removeClass('active');
            $('.custom-dot[data-index="' + relativeIndex + '"]').addClass('active');
        }
    }

    // Bind on translate to start CSS class changes simultaneously with the animation
    archCarousel.on('translate.owl.carousel initialized.owl.carousel', updateArchStyles);

    // Initialize Owl Carousel
    archCarousel.owlCarousel({
        center: true,
        items: 5,
        loop: true,
        margin: 15, // brought items slightly closer for premium effect
        nav: false,
        dots: false, // Using custom dots instead to guarantee precise desktop rendering
        smartSpeed: 800,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1.5,
                center: true,
                margin: 10
            },
            576: {
                items: 3,
                center: true,
                margin: 15
            },
            992: {
                items: 5,
                center: true,
                margin: 15
            },
            1200: {
                items: 5,
                center: true,
                margin: 15
            }
        }
    });

    // Custom dots click event using modern event delegation to support dynamically injected elements
    $('.custom-arch-dots').on('click', '.custom-dot', function () {
        var index = $(this).data('index');
        archCarousel.trigger('to.owl.carousel', [index, 800]);
    });

    // ==========================================
    // Testimonial Carousel Auto Slider
    // ==========================================
    $('.testimonial-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: false,
        dots: false, // Since standard dots weren't shown in the reference exactly, but slider works (we can enable if needed)
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,      /* Mobile: 1 card */
                margin: 10
            },
            768: {
                items: 2,      /* Tablet: 2 cards */
                margin: 15
            },
            992: {
                items: 3,      /* Desktop: 3 cards */
                margin: 20
            }
        }
    });

    // ==========================================
    // Gallery Carousel with Lightbox
    // ==========================================
    $('.gallery-carousel').owlCarousel({
        loop: true,
        margin: 0,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 3      /* Mobile: 2 images */
            },
            768: {
                items: 3      /* Tablet: 3 images */
            },
            1200: {
                items: 5      /* Desktop: 5 images */
            }
        }
    });

    // Initialize Fancybox (v5)
    Fancybox.bind("[data-fancybox]", {
        // Custom options for premium feel
        Hash: false,
    });

});

