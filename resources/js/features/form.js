export function initForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('qName').value;
    const phone   = document.getElementById('qPhone').value;
    const email   = document.getElementById('qEmail').value;
    const ptype   = document.querySelector('input[name="ptype"]:checked').nextElementSibling.textContent;
    const service = document.getElementById('qService').value || 'Not specified';
    const details = document.getElementById('qDetails').value || 'None provided';

    const subject = encodeURIComponent('New Quote Request | Brighton Lawn & Landscape');
    const body = encodeURIComponent(
      'New quote request from the website:\n\n' +
      'Name: ' + name + '\n' +
      'Phone: ' + phone + '\n' +
      'Email: ' + email + '\n' +
      'Property Type: ' + ptype + '\n' +
      'Service Needed: ' + service + '\n\n' +
      'Project Details:\n' + details
    );

    window.location.href = 'mailto:info@BrightonLawn.com?subject=' + subject + '&body=' + body;

    form.classList.add('hidden');
    document.getElementById('formSuccess').classList.add('active');
  });
}
