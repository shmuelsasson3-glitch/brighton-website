export function initForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const submitBtn = document.getElementById('qSubmitBtn');
  const errorEl = document.getElementById('formError');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    errorEl.classList.remove('active');
    errorEl.textContent = '';

    const name = document.getElementById('qName').value;
    const phone = document.getElementById('qPhone').value;
    const email = document.getElementById('qEmail').value;
    const propertyType = document.querySelector('input[name="ptype"]:checked').nextElementSibling.textContent;
    const service = document.getElementById('qService').value || 'Not specified';
    const details = document.getElementById('qDetails').value || 'None provided';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('/api/contact-submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, phone, email, propertyType, service, details }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }

      form.classList.add('hidden');
      document.getElementById('formSuccess').classList.add('active');
    } catch (err) {
      errorEl.textContent = `${err.message} You can also reach us directly at (848) 226-0090.`;
      errorEl.classList.add('active');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Request';
    }
  });
}
