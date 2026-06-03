/**
 * Ajila Oluwatosin — Portfolio JS
 * Production-grade, modular, zero-dependency
 */

'use strict';

/* ── Utilities ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Navbar: scroll state & active link ────────────────────── */
function initNavbar() {
    const navbar  = $('#navbar');
    const links   = $$('.nav-link');
    const sections = $$('section[id], div[id="top"]');

    if (!navbar) return;

    // Scroll state
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        // Active section highlight
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.id;
            }
        });

        links.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === current);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Smooth scroll for all anchor links
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = $(id);
            if (!target) return;
            e.preventDefault();
            const offset = navbar.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });

            // Close mobile menu on click
            closeMenu();
        });
    });
}

/* ── Mobile hamburger ──────────────────────────────────────── */
function initHamburger() {
    const btn   = $('#hamburger');
    const links = $('.nav-links', $('#navbar'));
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!e.target.closest('#navbar')) closeMenu();
    });
}

function closeMenu() {
    const btn   = $('#hamburger');
    const links = $('.nav-links');
    if (!btn || !links) return;
    links.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
}

/* ── Back to top ───────────────────────────────────────────── */
function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
}

/* ── Scroll reveal ─────────────────────────────────────────── */
function initReveal() {
    const targets = $$('[data-reveal], [data-reveal-delay]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
        // Fallback: show everything immediately
        targets.forEach(el => el.classList.add('revealed'));
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
    });

    targets.forEach(el => io.observe(el));
}

/* ── Project cards stagger reveal ─────────────────────────── */
function initProjectReveal() {
    const cards = $$('.project-card');
    if (!cards.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, i * 80);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(card => {
        card.setAttribute('data-reveal', '');
        io.observe(card);
    });
}

/* ── Skill cards stagger ───────────────────────────────────── */
function initSkillReveal() {
    const cards = $$('.skill-card');
    if (!cards.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, i * 60);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    cards.forEach(card => {
        card.setAttribute('data-reveal', '');
        io.observe(card);
    });
}

/* ── Contact form ──────────────────────────────────────────── */
function initContactForm() {
    const form = $('.contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        const btn = form.querySelector('.form-submit');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = 'Sending… <i class="fas fa-circle-notch fa-spin"></i>';
        }
        // FormSubmit handles actual submission; re-enable on error (safety)
        setTimeout(() => {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            }
        }, 8000);
    });
}

/* ── Highlight active nav on page load from hash ──────────── */
function initHashHighlight() {
    if (!window.location.hash) return;
    const target = $(window.location.hash);
    if (target) {
        setTimeout(() => {
            const offset = document.getElementById('navbar')?.offsetHeight || 68;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }, 200);
    }
}

/* ── Init all ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHamburger();
    initBackToTop();
    initReveal();
    initProjectReveal();
    initSkillReveal();
    initContactForm();
    initHashHighlight();
});
