/**
 * Japan Method - Main Application Bundle
 * Handles navigation, quiz functionality, results, and payments
 */

(function() {
  'use strict';

  // Global namespace
  window.JapanMethod = window.JapanMethod || {};

  // ========================================
  // Mobile Navigation Toggle
  // ========================================
  function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');

    if (!navToggle || !nav) return;

    navToggle.addEventListener('click', function() {
      const isOpen = nav.classList.toggle('nav--open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

      // Prevent body scroll when nav is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when clicking a link
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close nav on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        nav.classList.remove('nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // ========================================
  // Quiz Functionality
  // ========================================
  const QuizManager = {
    currentQuestion: 0,
    answers: [],
    methodScores: {},

    init: function() {
      if (!document.getElementById('quizContainer')) return;

      this.bindEvents();
      this.renderQuestion();
    },

    bindEvents: function() {
      const nextBtn = document.getElementById('quizNext');
      const prevBtn = document.getElementById('quizPrev');
      const optionsContainer = document.getElementById('quizOptions');

      if (nextBtn) {
        nextBtn.addEventListener('click', this.handleNext.bind(this));
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', this.handlePrev.bind(this));
      }

      if (optionsContainer) {
        optionsContainer.addEventListener('change', this.handleOptionSelect.bind(this));
      }
    },

    handleOptionSelect: function(e) {
      if (e.target.type === 'radio') {
        // Update visual selection
        const options = document.querySelectorAll('.quiz__option');
        options.forEach(function(opt) {
          opt.classList.remove('quiz__option--selected');
        });
        e.target.closest('.quiz__option').classList.add('quiz__option--selected');
      }
    },

    handleNext: function() {
      const selected = document.querySelector('input[name="q' + (this.currentQuestion + 1) + '"]:checked');

      if (!selected) {
        // Highlight that selection is needed
        const options = document.querySelectorAll('.quiz__option');
        options.forEach(function(opt) {
          opt.style.animation = 'shake 0.3s ease-in-out';
          setTimeout(function() { opt.style.animation = ''; }, 300);
        });
        return;
      }

      // Store the answer
      this.answers[this.currentQuestion] = selected.value;

      // Update method scores
      const questions = window.JapanMethodData?.questions || [];
      if (questions[this.currentQuestion]) {
        const question = questions[this.currentQuestion];
        const selectedOption = question.options.find(function(opt) {
          return opt.value === selected.value;
        });
        if (selectedOption && selectedOption.methods) {
          selectedOption.methods.forEach(function(method) {
            this.methodScores[method] = (this.methodScores[method] || 0) + 1;
          }.bind(this));
        }
      }

      // Move to next question or show results
      if (this.currentQuestion < (questions.length - 1)) {
        this.currentQuestion++;
        this.renderQuestion();
      } else {
        this.showResults();
      }
    },

    handlePrev: function() {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.renderQuestion();
      }
    },

    renderQuestion: function() {
      const questions = window.JapanMethodData?.questions || [];
      if (!questions.length) {
        console.error('No quiz questions found. Make sure methods-content.js is loaded.');
        return;
      }

      const question = questions[this.currentQuestion];
      const questionText = document.getElementById('questionText');
      const currentQ = document.getElementById('currentQuestion');
      const totalQ = document.getElementById('totalQuestions');
      const optionsContainer = document.getElementById('quizOptions');
      const prevBtn = document.getElementById('quizPrev');
      const nextBtn = document.getElementById('quizNext');

      // Update question text
      if (questionText) questionText.textContent = question.text;
      if (currentQ) currentQ.textContent = this.currentQuestion + 1;
      if (totalQ) totalQ.textContent = questions.length;

      // Render options
      if (optionsContainer) {
        optionsContainer.innerHTML = question.options.map(function(option) {
          const checked = this.answers[this.currentQuestion] === option.value ? 'checked' : '';
          const selected = checked ? 'quiz__option--selected' : '';
          return '<label class="quiz__option ' + selected + '">' +
            '<input type="radio" name="q' + (this.currentQuestion + 1) + '" value="' + option.value + '" ' + checked + '>' +
            option.text +
          '</label>';
        }.bind(this)).join('');
      }

      // Update navigation buttons
      if (prevBtn) {
        prevBtn.style.visibility = this.currentQuestion > 0 ? 'visible' : 'hidden';
      }
      if (nextBtn) {
        nextBtn.textContent = this.currentQuestion === questions.length - 1 ? 'See My Results' : 'Next Question';
      }

      // Update progress bar
      this.updateProgress();
    },

    updateProgress: function() {
      const questions = window.JapanMethodData?.questions || [];
      const progressSteps = document.querySelectorAll('.quiz__progress-step');

      progressSteps.forEach(function(step, index) {
        step.classList.remove('quiz__progress-step--active', 'quiz__progress-step--complete');
        if (index < this.currentQuestion) {
          step.classList.add('quiz__progress-step--complete');
        } else if (index === this.currentQuestion) {
          step.classList.add('quiz__progress-step--active');
        }
      }.bind(this));
    },

    showResults: function() {
      // Calculate top methods
      const sortedMethods = Object.entries(this.methodScores)
        .sort(function(a, b) { return b[1] - a[1]; })
        .slice(0, 3);

      // Store results in localStorage
      const results = {
        topMethod: sortedMethods[0]?.[0] || '5s',
        scores: this.methodScores,
        answers: this.answers,
        timestamp: Date.now()
      };

      try {
        localStorage.setItem('japanmethod_results', JSON.stringify(results));
      } catch (e) {
        console.warn('Could not save results to localStorage');
      }

      // Redirect to results page
      window.location.href = '/results';
    }
  };

  // ========================================
  // Results Page Functionality
  // ========================================
  window.JapanMethod.loadResults = function() {
    let results;
    try {
      results = JSON.parse(localStorage.getItem('japanmethod_results'));
    } catch (e) {
      results = null;
    }

    if (!results) {
      // No results found, use defaults
      results = {
        topMethod: '5s',
        scores: { '5s': 5, 'kaizen': 4, 'konmari': 3 }
      };
    }

    const methods = window.JapanMethodData?.methods || {};
    const topMethodKey = results.topMethod;
    const topMethod = methods[topMethodKey];

    if (!topMethod) return;

    // Calculate percentages
    const maxScore = 5; // Maximum possible score
    const primaryScoreValue = Math.min(Math.round((results.scores[topMethodKey] / maxScore) * 100), 98);

    // Update primary result card
    const primaryJp = document.getElementById('primaryJp');
    const primaryTitle = document.getElementById('primaryTitle');
    const primaryScoreEl = document.getElementById('primaryScore');
    const primaryBar = document.getElementById('primaryBar');
    const primaryDescription = document.getElementById('primaryDescription');
    const primarySteps = document.getElementById('primarySteps');

    if (primaryJp) primaryJp.textContent = topMethod.japanese;
    if (primaryTitle) primaryTitle.textContent = topMethod.name;
    if (primaryScoreEl) primaryScoreEl.textContent = primaryScoreValue + '%';
    if (primaryBar) primaryBar.style.width = primaryScoreValue + '%';
    if (primaryDescription) primaryDescription.textContent = topMethod.description;

    if (primarySteps && topMethod.implementationSteps) {
      primarySteps.innerHTML = topMethod.implementationSteps
        .map(function(step) { return '<li>' + step + '</li>'; })
        .join('');
    }

    // Update other methods
    const otherMethodsContainer = document.getElementById('otherMethods');
    if (otherMethodsContainer) {
      const otherMethods = Object.entries(results.scores)
        .filter(function(entry) { return entry[0] !== topMethodKey; })
        .sort(function(a, b) { return b[1] - a[1]; })
        .slice(0, 2);

      otherMethodsContainer.innerHTML = otherMethods.map(function(entry) {
        var methodKey = entry[0];
        var score = entry[1];
        var method = methods[methodKey];
        if (!method) return '';
        var scorePercent = Math.min(Math.round((score / maxScore) * 100), 85);
        return '<div class="other-method-card">' +
          '<div class="other-method-card__jp">' + method.japanese + '</div>' +
          '<div class="other-method-card__info">' +
            '<h4>' + method.name + '</h4>' +
            '<p class="text-small text-muted">' + method.shortDescription + '</p>' +
          '</div>' +
          '<div class="other-method-card__score">' +
            '<span class="match-score">' + scorePercent + '% Match</span>' +
          '</div>' +
        '</div>';
      }).join('');
    }
  };

  // ========================================
  // Email Capture Form
  // ========================================
  function initEmailForm() {
    const emailForm = document.getElementById('emailForm');
    if (!emailForm) return;

    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = document.getElementById('emailInput');
      const email = emailInput?.value;

      if (!email || !isValidEmail(email)) {
        emailInput.style.borderColor = 'var(--color-accent)';
        return;
      }

      // Get the top method from results
      let topMethod = '5s';
      try {
        const results = JSON.parse(localStorage.getItem('japanmethod_results'));
        if (results?.topMethod) {
          topMethod = results.topMethod;
        }
      } catch (e) {}

      // Store email (in production, this would go to a backend)
      try {
        const emails = JSON.parse(localStorage.getItem('japanmethod_emails') || '[]');
        emails.push({
          email: email,
          method: topMethod,
          timestamp: Date.now()
        });
        localStorage.setItem('japanmethod_emails', JSON.stringify(emails));
      } catch (e) {
        console.warn('Could not save email');
      }

      // Show success message
      emailForm.innerHTML = '<div class="text-center">' +
        '<h4 style="color: var(--color-sage); margin-bottom: var(--space-4);">Thank You!</h4>' +
        '<p>Check your inbox for your free guide on the ' +
        (window.JapanMethodData?.methods[topMethod]?.name || '5S System') + '.</p>' +
      '</div>';
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ========================================
  // Payment/Checkout Functionality
  // ========================================
  function initPaymentButtons() {
    const paymentButtons = document.querySelectorAll('[data-plan]');

    paymentButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        const plan = button.dataset.plan;
        const price = button.dataset.price;

        // In production, this would integrate with Stripe
        // For now, show a modal or redirect to checkout
        handleCheckout(plan, price);
      });
    });
  }

  function handleCheckout(plan, price) {
    // Check if we have a checkout API
    // For demo purposes, show an alert
    const confirmMessage = 'You selected the ' + plan.charAt(0).toUpperCase() + plan.slice(1) +
      ' plan for $' + price + '.\n\n' +
      'Payment integration is not yet configured.\n' +
      'Please contact hello@japanmethod.com to complete your purchase.';

    if (confirm(confirmMessage)) {
      // In production: redirect to Stripe checkout
      // window.location.href = '/api/checkout?plan=' + plan;

      // For now, open email
      window.location.href = 'mailto:hello@japanmethod.com?subject=Purchase%20' +
        encodeURIComponent(plan.charAt(0).toUpperCase() + plan.slice(1)) +
        '%20Plan&body=I%20would%20like%20to%20purchase%20the%20' +
        encodeURIComponent(plan) + '%20plan%20for%20$' + price;
    }
  }

  // ========================================
  // Share Functionality
  // ========================================
  function initShareButtons() {
    const twitterBtn = document.getElementById('shareTwitter');
    const copyBtn = document.getElementById('copyLink');

    if (twitterBtn) {
      twitterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        let topMethod = 'Japanese productivity';
        try {
          const results = JSON.parse(localStorage.getItem('japanmethod_results'));
          if (results?.topMethod && window.JapanMethodData?.methods[results.topMethod]) {
            topMethod = window.JapanMethodData.methods[results.topMethod].name;
          }
        } catch (e) {}

        const text = 'I just discovered my ideal productivity method is ' + topMethod + '! Find yours at';
        const url = 'https://japanmethod.com';
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank');
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const url = window.location.href;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function() {
            copyBtn.textContent = 'Copied!';
            setTimeout(function() {
              copyBtn.textContent = 'Copy Link';
            }, 2000);
          });
        } else {
          // Fallback
          const input = document.createElement('input');
          input.value = url;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          copyBtn.textContent = 'Copied!';
          setTimeout(function() {
            copyBtn.textContent = 'Copy Link';
          }, 2000);
        }
      });
    }
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========================================
  // Header Hide/Show on Scroll
  // ========================================
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const currentScroll = window.pageYOffset;

          if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('header--hidden');
          } else {
            header.classList.remove('header--hidden');
          }

          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ========================================
  // Initialize Everything
  // ========================================
  function init() {
    initNavigation();
    QuizManager.init();
    initEmailForm();
    initPaymentButtons();
    initShareButtons();
    initSmoothScroll();
    initHeaderScroll();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
