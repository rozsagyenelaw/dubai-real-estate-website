const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        if (!data.name || !data.email || !data.phone || !data.message) {
            alert('Please fill in all required fields');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            console.log('Contact form submitted:', data);
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                formSuccess.style.display = 'none';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 5000);
        } catch (error) {
            alert('An error occurred. Please try again or contact us directly.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0 && !value.startsWith('971')) value = '971' + value;
        if (value.length > 12) value = value.slice(0, 12);
        e.target.value = value;
    });
}
