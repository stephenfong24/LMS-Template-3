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

    // Universal robust dropdown event handler on the document level to guarantee
    // clean toggling of dynamically loaded bootstrap navbar fragments.
    $(document).on('click', '[data-bs-toggle="dropdown"]', function(e) {
        // If Bootstrap is loaded, let it handle the dropdown natively to prevent double-toggling conflicts
        if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        
        const $toggle = $(this);
        const $menu = $toggle.next('.dropdown-menu');
        const $parent = $toggle.parent();
        const isOpen = $menu.hasClass('show');
        
        // Close all other open dropdowns first to keep clean UX
        $('.dropdown-menu.show').not($menu).removeClass('show');
        $('[data-bs-toggle="dropdown"]').not($toggle).attr('aria-expanded', 'false');
        $('.dropdown.show').not($parent).removeClass('show');
        
        if (isOpen) {
            $menu.removeClass('show');
            $toggle.attr('aria-expanded', 'false');
            $parent.removeClass('show');
        } else {
            $menu.addClass('show');
            $toggle.attr('aria-expanded', 'true');
            $parent.addClass('show');
        }
    });

    // Handle clicks outside active dropdowns to collapse them cleanly
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown-menu.show').removeClass('show');
            $('[data-bs-toggle="dropdown"]').attr('aria-expanded', 'false');
            $('.dropdown.show').removeClass('show');
        }
    });

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

        // Simulating the user details & premium login header states
        let userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (!userProfile) {
            userProfile = {
                fullName: "Guest Student",
                email: "verylongemailaddress@exampledomain.com",
                phone: "+60 12-345 6789",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
                status: "Active Student",
                joinedDate: "2026-01-15",
                role: "Premium Learner"
            };
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            $('#navbar-login-item, #navbar-register-item').addClass('d-none');
            $('#mobileAuthButtons').addClass('d-none');
            $('#userProfileDropdown, #mobileUserProfileSection').removeClass('d-none');
            
            // Toggle navigation menu visibility based on login status
            $('.guest-nav-item').addClass('d-none');
            $('.auth-nav-item').removeClass('d-none');
            
            // Render user details dynamically
            $('#nav-full-name, #mobile-nav-full-name').text(userProfile.fullName);
            $('#nav-email, #mobile-nav-email').text(userProfile.email);
            $('#userProfileDropdown img, #mobileUserProfileSection img, .nav-item.dropdown img').attr('src', userProfile.avatar);
        } else {
            $('#navbar-login-item, #navbar-register-item').removeClass('d-none');
            $('#mobileAuthButtons').removeClass('d-none');
            $('#userProfileDropdown, #mobileUserProfileSection').addClass('d-none');
            
            // Toggle navigation menu visibility based on login status
            $('.guest-nav-item').removeClass('d-none');
            $('.auth-nav-item').addClass('d-none');
        }


        // Logout action flows
        $('#navbar-logout-btn, #mobile-navbar-logout-btn').on('click', function(e) {
            e.preventDefault();
            
            // Overlay transition
            const $overlay = $('<div id="logout-transition-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; bg-color:#0f172a; background:rgba(15,23,42,0.95); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:9999; opacity:0; transition:opacity 0.4s ease;"><div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"><span class="visually-hidden">Loading...</span></div><h4 class="text-white fw-bold">Signing out safely...</h4><p class="text-white-50 x-small">Clearing virtual session credentials.</p></div>');
            $('body').append($overlay);
            
            // Trigger reflow & fade in
            setTimeout(() => {
                $overlay.css('opacity', '1');
            }, 10);
            
            localStorage.setItem('isLoggedIn', 'false');
            
            setTimeout(function() {
                // Ensure navbar state refreshes immediately or after redirect
                $('#userProfileDropdown, #mobileUserProfileSection').addClass('d-none');
                $('#navbar-login-item, #navbar-register-item').removeClass('d-none');
                $('#mobileAuthButtons').removeClass('d-none');
                $('.guest-nav-item').removeClass('d-none');
                $('.auth-nav-item').addClass('d-none');
                
                window.location.href = '/pages/login.html?logout=success';
            }, 1200);
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
