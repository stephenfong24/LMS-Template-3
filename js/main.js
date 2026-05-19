/**
 * Global Interactions & Premium Polish
 */

$(function() {
    // Smooth Scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = this.hash;
        const $target = $(target);
        
        if ($target.length) {
            $('html, body').animate({
                scrollTop: $target.offset().top - 100
            }, 800);
        }
    });

    // Form interaction polish
    $('.form-control').on('focus', function() {
        $(this).parent().find('.form-label').addClass('text-primary-color');
    }).on('blur', function() {
        $(this).parent().find('.form-label').removeClass('text-primary-color');
    });

    // Tooltip initialization (standard Bootstrap)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Popover initialization
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    console.log('Elevate Academy Interaction Engine Ready');

    // Highlight active link in mobile nav
    const currentPath = window.location.pathname;
    $('.mobile-nav-link').each(function() {
        if ($(this).attr('href') === currentPath) {
            $(this).addClass('active');
        } else if (currentPath === '/' && $(this).attr('href') === '/index.html') {
            $(this).addClass('active');
        }
    });

    // Mobile Navigation Toggle
    const $mobileNav = $('#mobileNav');
    const $navOverlay = $('#navOverlay');

    $('#mobileNavToggle').on('click', function() {
        $mobileNav.addClass('active');
        $navOverlay.addClass('active');
        $('body').css('overflow', 'hidden');
    });

    $('#mobileNavClose, #navOverlay').on('click', function() {
        $mobileNav.removeClass('active');
        $navOverlay.removeClass('active');
        $('body').css('overflow', '');
    });

    // Swiper Initializations
    if ($('.coursesSwiper').length) {
        new Swiper(".coursesSwiper", {
            slidesPerView: 1,
            spaceBetween: 24,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }

    if ($('.testimonialsSwiper').length) {
        new Swiper(".testimonialsSwiper", {
            slidesPerView: 1,
            spaceBetween: 24,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }

    // Hero Carousel Custom logic
    const $heroCarousel = $('#heroCarousel');
    if ($heroCarousel.length) {
        const carousel = new bootstrap.Carousel($heroCarousel[0], {
            interval: 5000,
            touch: true,
            pause: 'hover'
        });

        // Optional: Add parallax or extra effects on slide
        $heroCarousel.on('slide.bs.carousel', function (e) {
            const $nextSlide = $(e.relatedTarget);
            $nextSlide.find('.hero-img').css('transform', 'scale(0.9) translateX(20px)');
        });

        $heroCarousel.on('slid.bs.carousel', function (e) {
            const $activeSlide = $(e.relatedTarget);
            $activeSlide.find('.hero-img').css('transform', '');
        });
    }

    // Global Purchase Button Handler
    $(document).on('click', '.purchase-btn', function(e) {
        e.preventDefault();
        const $btn = $(this);
        const courseData = {
            id: $btn.data('id'),
            title: $btn.data('title'),
            price: $btn.data('price'),
            instructor: $btn.data('instructor'),
            img: $btn.data('img'),
            rating: $btn.closest('.card').find('.rating-score').text() || '4.8'
        };
        
        // Store in localStorage
        localStorage.setItem('selectedCourse', JSON.stringify(courseData));
        
        // Redirect to checkout
        // Check if we are in /pages/ or root to adjust path
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            window.location.href = 'checkout.html';
        } else {
            window.location.href = '/pages/checkout.html';
        }
    });

    // Scroll to Top Implementation
    const scrollTopHTML = `
        <button id="scrollTop" title="Go to top">
            <i class="bi bi-arrow-up"></i>
        </button>
    `;
    $('body').append(scrollTopHTML);

    const $scrollBtn = $('#scrollTop');

    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 300) {
            $scrollBtn.addClass('visible');
        } else {
            $scrollBtn.removeClass('visible');
        }
    });

    $scrollBtn.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });
});
