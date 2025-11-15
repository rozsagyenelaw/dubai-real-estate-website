// Download Modal Handler for Netlify
class DownloadModal {
    constructor() {
        this.modal = document.getElementById('downloadModal');
        this.form = document.getElementById('downloadForm');
        this.successMessage = document.getElementById('downloadSuccess');
        this.formContent = document.getElementById('downloadFormContent');
        this.closeBtn = document.querySelector('.download-modal-close');
        this.downloadUrl = '';
        this.downloadName = '';
        this.hiddenPropertyField = null;

        this.init();
    }

    init() {
        // Attach event listeners to all download buttons
        const downloadButtons = document.querySelectorAll('.download-btn');
        downloadButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadUrl = btn.getAttribute('href');
                this.downloadName = btn.querySelector('span')?.textContent || 'Property Materials';
                this.show();
            });
        });

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }

        // Click outside to close
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });
        }

        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.hide();
            }
        });
    }

    show() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Update modal title if needed
            const modalTitle = this.modal.querySelector('.download-modal-header p');
            if (modalTitle) {
                modalTitle.textContent = `Please provide your information to download ${this.downloadName}`;
            }

            // Add/update hidden field for property name
            if (!this.hiddenPropertyField) {
                this.hiddenPropertyField = document.createElement('input');
                this.hiddenPropertyField.type = 'hidden';
                this.hiddenPropertyField.name = 'property';
                this.form.insertBefore(this.hiddenPropertyField, this.form.firstChild);
            }
            this.hiddenPropertyField.value = this.downloadName;
        }
    }

    hide() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';

            // Reset form after a delay
            setTimeout(() => {
                if (this.form) this.form.reset();
                if (this.formContent) this.formContent.style.display = 'block';
                if (this.successMessage) this.successMessage.classList.remove('active');
            }, 300);
        }
    }

    async handleSubmit() {
        const submitBtn = this.form.querySelector('.download-submit-btn');

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'SUBMITTING...';

        try {
            // Submit to Netlify Function
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            // Add property and download URL
            data.property = this.downloadName;
            data.downloadUrl = this.downloadUrl;

            const response = await fetch('/api/download-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Show success message
                this.showSuccess();

                // Trigger download after showing success
                setTimeout(() => {
                    this.triggerDownload();
                    // Auto-close modal after 3 seconds
                    setTimeout(() => this.hide(), 3000);
                }, 1500);
            } else {
                throw new Error('Failed to submit request');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting your request. Please try again or contact us at info@premierdubairealty.com');
            submitBtn.disabled = false;
            submitBtn.textContent = 'SUBMIT';
        }
    }

    showSuccess() {
        if (this.formContent) this.formContent.style.display = 'none';
        if (this.successMessage) this.successMessage.classList.add('active');
    }

    triggerDownload() {
        if (this.downloadUrl) {
            const link = document.createElement('a');
            link.href = this.downloadUrl;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DownloadModal();
});
