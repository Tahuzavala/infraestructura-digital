/**
 * ALEXAVALA - Plataforma de Marketing Educativo B2B
 * Script de interacción dinámico, animaciones e integraciones analíticas
 */

class AlexaValaApp {
  constructor() {
    this.initStickyHeader();
    this.initSmoothScroll();
    this.initTabEcosystem();
    this.initScrollAnimations();
    this.initAnimatedCounters();
    this.initAccordion();
    this.initFormHandler();
    this.initHoverTracking();
  }

  /**
   * 1. Cabecera fija con sombra al hacer scroll
   */
  initStickyHeader() {
    const header = document.getElementById('sticky-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    // Uso de passive para optimizar el rendimiento de scroll en dispositivos móviles
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Disparar una vez al iniciar en caso de recarga de página a mitad de pantalla
    handleScroll();
  }

  /**
   * 2. Navegación suave (Smooth Scroll) para enlaces y CTAs
   */
  initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          // Ajustar offset por la altura de la cabecera fija (aprox 4.5rem = 72px)
          const headerHeight = 72;
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Registro analítico del click hacia sección de contacto u otras
          this.trackGtmEvent('click_contact', {
            target_section: targetId,
            link_text: link.innerText.trim()
          });
        }
      });
    });
  }

  /**
   * 3. Ecosistema interactivo de pestañas en 3 etapas
   */
  initTabEcosystem() {
    const triggers = document.querySelectorAll('.tab-trigger');
    const panels = document.querySelectorAll('.tab-panel');

    if (triggers.length === 0 || panels.length === 0) return;

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const targetPanelId = trigger.getAttribute('aria-controls');

        // Remover clases activas de los triggers
        triggers.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });

        // Ocultar todos los paneles
        panels.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('hidden', 'true');
        });

        // Activar el trigger actual
        trigger.classList.add('active');
        trigger.setAttribute('aria-selected', 'true');
        trigger.setAttribute('tabindex', '0');

        // Mostrar el panel correspondiente con un pequeño delay para la transición de entrada
        const activePanel = document.getElementById(targetPanelId);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.removeAttribute('hidden');
        }

        // Registrar evento analítico para cambio de pestaña
        this.trackGtmEvent('tab_navigation_change', {
          selected_tab: trigger.querySelector('.tab-trigger-text')?.innerText.trim() || 'Desconocido'
        });
      });

      // Accesibilidad por teclado (izquierda / derecha / enter / space)
      trigger.addEventListener('keydown', (e) => {
        let targetIndex = null;
        const triggerArray = Array.from(triggers);
        const currentIndex = triggerArray.indexOf(trigger);

        if (e.key === 'ArrowRight') {
          targetIndex = (currentIndex + 1) % triggerArray.length;
        } else if (e.key === 'ArrowLeft') {
          targetIndex = (currentIndex - 1 + triggerArray.length) % triggerArray.length;
        }

        if (targetIndex !== null) {
          triggerArray[targetIndex].focus();
          triggerArray[targetIndex].click();
        }
      });
    });
  }

  /**
   * 4. Animaciones de scroll mediante la API Intersection Observer
   */
  initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-scroll');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Detener monitoreo una vez animado
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(element => observer.observe(element));
    } else {
      // Fallback para navegadores antiguos
      animatedElements.forEach(element => element.classList.add('is-visible'));
    }
  }

  /**
   * 5. Contadores numéricos animados que se activan al entrar en pantalla
   */
  initAnimatedCounters() {
    const counterElements = document.querySelectorAll('.metric-number');
    if (counterElements.length === 0) return;

    const animateCounter = (element) => {
      const targetStr = element.getAttribute('data-target');
      const hasDecimal = element.getAttribute('data-decimal') === 'true';
      const target = parseFloat(targetStr);
      const isPlus = targetStr.startsWith('+');

      let current = 0;
      const duration = 2000; // 2 segundos
      const stepTime = 30; // ms por frame
      const totalSteps = duration / stepTime;
      const stepValue = target / totalSteps;

      let stepCount = 0;

      const timer = setInterval(() => {
        stepCount++;
        current += stepValue;

        if (stepCount >= totalSteps) {
          clearInterval(timer);
          // Redondear al valor exacto final
          if (hasDecimal) {
            element.innerText = (isPlus ? '+' : '') + target.toFixed(1);
          } else {
            element.innerText = (isPlus ? '+' : '') + Math.round(target);
          }
        } else {
          if (hasDecimal) {
            element.innerText = (isPlus ? '+' : '') + current.toFixed(1);
          } else {
            element.innerText = (isPlus ? '+' : '') + Math.round(current);
          }
        }
      }, stepTime);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target); // Animarse únicamente una vez
          }
        });
      }, {
        threshold: 0.5
      });

      counterElements.forEach(counter => observer.observe(counter));
    } else {
      // Fallback
      counterElements.forEach(counter => {
        const targetStr = counter.getAttribute('data-target');
        counter.innerText = targetStr;
      });
    }
  }

  /**
   * 6. Acordeón de preguntas frecuentes con despliegue individual
   */
  initAccordion() {
    const triggers = document.querySelectorAll('.accordion-trigger');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const contentId = trigger.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Opcional: Cerrar los demás acordeones antes de abrir el actual (despliegue individual)
        const allTriggers = document.querySelectorAll('.accordion-trigger');
        const allContents = document.querySelectorAll('.accordion-content');

        allTriggers.forEach((t, index) => {
          if (t !== trigger) {
            t.setAttribute('aria-expanded', 'false');
            allContents[index].style.maxHeight = '0px';
          }
        });

        // Toggle el acordeón actual
        if (isOpen) {
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = '0px';
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          // Utilizar scrollHeight para una animación CSS fluida de altura
          content.style.maxHeight = content.scrollHeight + 'px';

          // Registro analítico de consulta de FAQ
          this.trackGtmEvent('faq_interaction', {
            faq_title: trigger.querySelector('.accordion-title-text')?.innerText.trim() || 'FAQ'
          });
        }
      });
    });
  }

  /**
   * 7. Manejo del Formulario con Validación Native, Fallback y Captura de HubSpot
   */
  initFormHandler() {
    const form = document.getElementById('lead-form');
    const responseAlert = document.getElementById('form-response');

    if (!form) return;

    // Validación interactiva en tiempo real al perder foco o al escribir
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group').classList.contains('has-error')) {
          this.validateField(input);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      inputs.forEach(input => {
        const isFieldValid = this.validateField(input);
        if (!isFieldValid) isFormValid = false;
      });

      if (!isFormValid) {
        // Enfocar el primer input inválido
        const firstInvalid = form.querySelector('.form-group.has-error .form-input');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Deshabilitar botón de envío para evitar duplicados
      const submitBtn = document.getElementById('form-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Enviando información...';
      }

      // Preparar data corporativa para simular API HubSpot / webhook
      const payload = {
        name: document.getElementById('form-name').value,
        email: document.getElementById('form-email').value,
        phone: document.getElementById('form-phone').value,
        institution: document.getElementById('form-institution').value,
        educational_level: document.getElementById('form-level').value,
        message: document.getElementById('form-message').value,
        submitted_at: new Date().toISOString(),
        lead_demographic: 'C+'
      };

      console.log('[HubSpot Lead Capture System] Capturado exitosamente:', payload);

      // Desparar GTM Lead event
      this.trackGtmEvent('lead_submission_success', {
        colegio_nombre: payload.institution,
        nivel_interes: payload.educational_level,
        demografia: payload.lead_demographic
      });

      // Simular retraso de red (1 segundo) para una UX pulida
      setTimeout(() => {
        if (responseAlert) {
          responseAlert.classList.add('form-response-success');
          responseAlert.innerHTML = `
            <strong>¡Solicitud recibida con éxito!</strong><br/>
            Un consultor experto de AlexaVala en marketing educativo B2B se comunicará con usted en menos de 2 horas.
          `;
          responseAlert.removeAttribute('hidden');
        }

        form.reset();

        if (submitBtn) {
          submitBtn.innerText = '¡Enviado Exitosamente!';
        }
      }, 1000);
    });
  }

  /**
   * Validador interactivo por campo
   */
  validateField(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return true;

    let isValid = true;

    if (input.required && !input.value.trim()) {
      isValid = false;
    } else if (input.type === 'email' && input.value.trim()) {
      // RegEx para validación formal de email corporativo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(input.value.trim());
    } else if (input.id === 'form-phone' && input.value.trim()) {
      // RegEx de 10 dígitos requerido en México
      const phoneRegex = /^[0-9]{10}$/;
      isValid = phoneRegex.test(input.value.trim().replace(/\D/g, ''));
    }

    if (!isValid) {
      formGroup.classList.add('has-error');
    } else {
      formGroup.classList.remove('has-error');
    }

    return isValid;
  }

  /**
   * 8. Registro de micro-interacciones mediante Hovers requeridos en especificación GTM
   */
  initHoverTracking() {
    // Monitorear hovers en secciones clave y empujar dataLayer
    const trackers = [
      { id: 'header-cta-btn', eventName: 'hover_book' },
      { id: 'nav-link-about', eventName: 'hover_about' },
      { id: 'nav-link-services', eventName: 'hover_services' }
    ];

    trackers.forEach(track => {
      const el = document.getElementById(track.id);
      if (el) {
        el.addEventListener('mouseenter', () => {
          this.trackGtmEvent(track.eventName, {
            element_id: track.id,
            timestamp: Date.now()
          });
        }, { passive: true });
      }
    });

    // Carousel interactive tracking (Tabs / preinscripción click prolongado o scroll interactivo)
    const tabNav = document.querySelector('.tab-navigation-container');
    if (tabNav) {
      let touchStartTime = 0;
      tabNav.addEventListener('touchstart', () => {
        touchStartTime = Date.now();
      }, { passive: true });

      tabNav.addEventListener('touchend', () => {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration > 800) { // Click largo en carrusel de pestañas (>800ms)
          this.trackGtmEvent('long_press_carousel', {
            duration_ms: touchDuration
          });
        }
      }, { passive: true });
    }
  }

  /**
   * Helper para empujar eventos a Google Tag Manager de manera segura
   */
  trackGtmEvent(eventName, customParams = {}) {
    window.dataLayer = window.dataLayer || [];
    const eventPayload = {
      event: eventName,
      ...customParams,
      country: 'Mexico',
      demographic_tier: 'C+'
    };
    
    window.dataLayer.push(eventPayload);
    console.log(`[GTM-K5T2MF77 Analytics Push]:`, eventPayload);
  }
}

// Inicializar la aplicación tan pronto como el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new AlexaValaApp();
});
