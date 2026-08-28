/**
 * HAVA Global Trade - Contact & Quote Form Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  prefillFromUrl();
  initContactForm();
});

// Prefill form from URL query params (e.g. from Catalog 'Devis' click)
function prefillFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');
  const category = urlParams.get('category');

  const subjectInput = document.getElementById('subject');
  const categorySelect = document.getElementById('category_slug');
  const messageInput = document.getElementById('message');

  if (category && categorySelect) {
    categorySelect.value = category;
  }

  if (product) {
    if (subjectInput) {
      subjectInput.value = `Demande de cotation : ${product}`;
    }
    if (messageInput && !messageInput.value) {
      messageInput.value = `Bonjour, je souhaite obtenir un devis / une cotation pour le produit suivant : "${product}".\n\n- Volume souhaité :\n- Port / Ville de destination :\n- Spécificités ou personnalisation souhaitée :`;
    }
  }
}

function initContactForm() {
  const form = document.getElementById('contact-quote-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerText : 'Envoyer';

    const formData = {
      name: document.getElementById('name')?.value?.trim(),
      email: document.getElementById('email')?.value?.trim(),
      phone: document.getElementById('phone')?.value?.trim(),
      company: document.getElementById('company')?.value?.trim(),
      country: document.getElementById('country')?.value?.trim(),
      category_slug: document.getElementById('category_slug')?.value || null,
      subject: document.getElementById('subject')?.value?.trim() || 'Demande de devis',
      message: document.getElementById('message')?.value?.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
      showToast('Veuillez remplir les champs obligatoires (Nom, Email, Message).', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Envoi en cours...';
    }

    try {
      const response = await Api.submitInquiry(formData);
      showToast(response.message || 'Votre demande a bien été transmise !', 'success');

      // Show success container
      const successBox = document.getElementById('form-success-box');
      if (successBox) {
        successBox.style.display = 'block';
        form.style.display = 'none';
      } else {
        form.reset();
      }
    } catch (err) {
      showToast(err.message || 'Une erreur est survenue lors de l’envoi.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      }
    }
  });
}

// WhatsApp Quick Chat Launcher
function openWhatsAppChat(customMessage) {
  const phone = "905431736173";
  const defaultMsg = "Bonjour HAVA Global Trade, je vous contacte depuis votre site web pour une demande de sourcing / cotation.";
  const text = encodeURIComponent(customMessage || defaultMsg);
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}
