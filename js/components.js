/**
 * Reusable Components Loader
 * Handles dynamic insertion of navbar, footer, sidebar etc.
 */

$(function() {
    // Load Navbar
    if ($('#navbar-placeholder').length) {
        $('#navbar-placeholder').load('/components/navbar.html', function() {
            initNavbarLogic();
        });
    }

    // Load Footer
    if ($('#footer-placeholder').length) {
        $('#footer-placeholder').load('/components/footer.html');
    }

    // Load Sidebar
    if ($('#sidebar-placeholder').length) {
        $('#sidebar-placeholder').load('/components/sidebar.html');
    }

    function initNavbarLogic() {
        const $mobileNav = $('#mobileNav');
        const $navOverlay = $('#navOverlay');

        $('#mobileNavToggle').on('click', function() {
            $mobileNav.addClass('active');
            $navOverlay.fadeIn(300);
            $('body').css('overflow', 'hidden');
        });

        $('#mobileNavClose, #navOverlay').on('click', function() {
            $mobileNav.removeClass('active');
            $navOverlay.fadeOut(300);
            $('body').css('overflow', 'auto');
        });

        // Set active nav link based on current path
        const currentPath = window.location.pathname;
        
        // Helper to normalize paths for comparison
        const normalizePath = (p) => {
            if (!p) return '';
            let normalized = p.replace(/\/$/, ''); // remove trailing slash
            if (normalized === '') normalized = '/index.html'; // root is index
            return normalized;
        };

        const normalizedCurrent = normalizePath(currentPath);

        $('.navbar-nav .nav-link, .mobile-nav-link').each(function() {
            const href = $(this).attr('href');
            if (normalizePath(href) === normalizedCurrent) {
                $(this).addClass('active');
            }
        });

        // Language Selector Sync and Interactive UI
        const $langDropdown = $('#langDropdown');
        const $currentLangLabel = $('#currentLangLabel');
        const $langOptEn = $('#langOptEn');
        const $langOptBm = $('#langOptBm');
        const $dropdownCheckEn = $('#dropdownCheckEn');
        const $dropdownCheckBm = $('#dropdownCheckBm');

        const $mobileLangBtnEn = $('#mobileLangBtnEn');
        const $mobileLangBtnBm = $('#mobileLangBtnBm');
        const $mobileCheckEnIcon = $('#mobileCheckEnIcon');
        const $mobileCheckBmIcon = $('#mobileCheckBmIcon');

        function setLanguage(lang) {
            if (lang === 'EN') {
                // Update Desktop Dropdown
                $currentLangLabel.text('English');
                $langOptEn.addClass('active');
                $langOptBm.removeClass('active');
                $dropdownCheckEn.removeClass('d-none');
                $dropdownCheckBm.addClass('d-none');

                // Update Mobile Pills
                $mobileLangBtnEn.addClass('active-lang-btn text-dark').removeClass('text-muted');
                $mobileLangBtnBm.removeClass('active-lang-btn text-dark').addClass('text-muted');
                $mobileCheckEnIcon.removeClass('d-none');
                $mobileCheckBmIcon.addClass('d-none');
            } else if (lang === 'BM') {
                // Update Desktop Dropdown
                $currentLangLabel.text('Bahasa Malaysia');
                $langOptEn.removeClass('active');
                $langOptBm.addClass('active');
                $dropdownCheckEn.addClass('d-none');
                $dropdownCheckBm.removeClass('d-none');

                // Update Mobile Pills
                $mobileLangBtnBm.addClass('active-lang-btn text-dark').removeClass('text-muted');
                $mobileLangBtnEn.removeClass('active-lang-btn text-dark').addClass('text-muted');
                $mobileCheckBmIcon.removeClass('d-none');
                $mobileCheckEnIcon.addClass('d-none');
            }
        }

        $langOptEn.on('click', function(e) {
            e.preventDefault();
            setLanguage('EN');
        });

        $langOptBm.on('click', function(e) {
            e.preventDefault();
            setLanguage('BM');
        });

        $mobileLangBtnEn.on('click', function(e) {
            e.preventDefault();
            setLanguage('EN');
        });

        $mobileLangBtnBm.on('click', function(e) {
            e.preventDefault();
            setLanguage('BM');
        });
    }

    // Reveal animations on scroll
    $(window).on('scroll', function() {
        $('.reveal').each(function() {
            const windowHeight = $(window).height();
            const revealTop = $(this).get(0).getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                $(this).addClass('active');
            }
        });
    });

    // Run once on load
    $(window).trigger('scroll');
});
