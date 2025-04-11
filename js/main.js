(function($){
    "use strict";

    // (1) Pode remover se não quiser mais re-calcular alturas de subpáginas
    function subpages_resize(){
      // vazio
    }

    // (2) Esconde menu mobile se a largura < 992px
    function mobileMenuHide() {
        var windowWidth = $(window).width();
        if (windowWidth < 992) {
            $('#site_header').addClass('mobile-menu-hide');
        }
    }

    // (3) Ao carregar a página
    $(window).on('load', function() {
        // Sumir com o preloader
        $(".preloader").fadeOut(800);

        // Inicialização do Owl Carousel para o texto rotativo
        $('.text-rotation').owlCarousel({
            loop: true,
            dots: false,
            nav: false,
            margin: 0,
            items: 1,
            autoplay: true,
            autoplayHoverPause: false,
            autoplayTimeout: 3800,
            animateOut: 'zoomOut',
            animateIn: 'zoomIn'
        });

        // Inicialização de cada carrossel de imagem de portfólio
        $('.portfolio-image-carousel').each(function() {
            $(this).owlCarousel({
                items: 1,
                loop: true,
                margin: 10,
                nav: true, // setas
                dots: true,
                navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
                responsive : {
                    0 : {
                        dots: true,
                        nav: false
                    },
                    768 : {
                        dots: true,
                        nav: true
                    }
                }
            });
        });

        // Chama função de animação de scroll
        handleScrollAnimation();

    }).on('resize', function() {
        mobileMenuHide();
        // subpages_resize() se ainda for preciso
        // setTimeout(() => { subpages_resize(); }, 500);
    }).scroll(function() {
        // Adiciona/Remove classe sticked do header
        if ($(window).scrollTop() < 20) {
            $('.header').removeClass('sticked');
        } else {
            $('.header').addClass('sticked');
        }
        // Roda checagem de animação ao scroll
        handleScrollAnimation();
    });

    // Força scrollTop = 0 no carregamento
    $(window).scrollTop(0);

    // (4) Ao iniciar o DOM
    $(document).on('ready', function() {
        // Toggle do menu mobile
        $('.menu-toggle').on("click", function () {
            $('#site_header').toggleClass('mobile-menu-hide');
        });

        // Esconder menu mobile ao clicar
        $('.site-main-menu').on("click", "a", function(e) {
            mobileMenuHide();
            // A parte de scroll suave foi substituída pela nova lógica mais abaixo
        });

        // Magnific Popup de imagens ou AJAX
        $('.lightbox').magnificPopup({
             type: 'image',
             removalDelay: 300,
             mainClass: 'mfp-fade',
             image: {
                 titleSrc: 'title',
                 gallery: { enabled: true },
             },
        });
        $('.ajax-page-load-link').magnificPopup({
            type: 'ajax',
            removalDelay: 300,
            mainClass: 'mfp-fade',
            gallery:{ enabled:true },
        });

        // Foco em formulários (estético)
        $('.form-control').val('').on("focusin", function(){
            $(this).parent('.form-group').addClass('form-group-focus');
        }).on("focusout", function(){
            if($(this).val().length === 0) {
                $(this).parent('.form-group').removeClass('form-group-focus');
            }
        });

        // Atualizar ano no footer
        $('#current-year').text(new Date().getFullYear());

        // ---- ANIMAÇÃO DE ENTRADA NAS SEÇÕES ----
        const sections = document.querySelectorAll('.section');
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

        function handleScrollAnimation() {
            sections.forEach(section => {
              const sectionTop = section.getBoundingClientRect().top;
              const windowHeight = window.innerHeight;
              if (sectionTop < windowHeight * 0.9) {
                if (!section.classList.contains('visible')) {
                  section.classList.add('visible');
                }
              } else {
                if (section.classList.contains('visible')) {
                  section.classList.remove('visible');
                }
              }
            });
        }
        window.handleScrollAnimation = handleScrollAnimation; // Disponível global
        handleScrollAnimation();

        // Efeito parallax leve no título do bloco (opcional)
        document.querySelectorAll('.block-title h1, .block-title h3').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - (rect.left + rect.width / 2);
                const relY = e.clientY - (rect.top + rect.height / 2);
                const moveX = relX * 0.1;
                const moveY = relY * 0.2;
                el.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
                el.style.transition = 'transform 0.1s ease-out';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0) scale(1)';
                el.style.transition = 'transform 0.3s ease-out';
            });
        });
    });
})(jQuery);

/* 
  Lógica FINAL: Sempre voltar ao topo (#home) 
  antes de rolar para a seção destino.
*/
window.addEventListener('DOMContentLoaded', () => {

    function goHomeThenSection(targetSelector) {
        // 1) Rola até #home
        const homeOffset = document.querySelector('#home').offsetTop || 0;
        $('html, body').animate({ scrollTop: homeOffset }, 600, function() {
            // 2) Depois, se o destino NÃO for "#home", rola até a seção alvo
            if (targetSelector !== '#home') {
                const headerHeight = -30; 
                const pos = $(targetSelector).offset().top - headerHeight;
                // Pequeno delay para não parecer “brusco”
                setTimeout(function(){
                    $('html, body').animate({ scrollTop: pos }, 600);
                }, 150);
            }
        });
    }

    // Remove qualquer outro click de 'a.header-link' que já estivesse definido
    $('a.header-link').off('click');

    // Aplica a nova dinâmica
    $('a.header-link').on('click', function(e) {
        e.preventDefault();
        const alvo = $(this).attr('href'); // ex. "#portfolio"
        if (alvo && $(alvo).length) {
            goHomeThenSection(alvo);
        }
    });

});
