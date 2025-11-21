document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscribeForm');
    const result = document.getElementById('result');
    const confettiRoot = document.getElementById('confetti-root');
    const card = document.getElementById('card');

    function random(min, max) { return Math.random() * (max - min) + min }

    function launchConfetti(amount = 30) {
        const colors = ['#ff6b6b', '#ffd166', '#06d6a0', '#3a86ff', '#9b5de5'];
        for (let i = 0; i < amount; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            el.style.left = (random(0, 100)) + 'vw';
            el.style.background = colors[Math.floor(random(0, colors.length))];
            el.style.width = Math.floor(random(7, 12)) + 'px';
            el.style.height = Math.floor(random(10, 16)) + 'px';
            el.style.transform = `rotate(${Math.floor(random(0, 360))}deg)`;
            el.style.top = '-10vh';
            el.style.opacity = String(random(0.8, 1));
            el.style.animationDelay = (random(0, 0.4)) + 's';
            confettiRoot.appendChild(el);
            setTimeout(() => { el.remove(); }, 2200);
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email')?.trim();
        const name = formData.get('name')?.trim();
        const privacy = formData.get('privacy');
        const interests = formData.getAll('interests');

        if (!privacy) {
            const privacyInput = document.getElementById('privacy');
            privacyInput.focus();
            privacyInput.parentElement.animate([
                { transform: 'translateX(0px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0px)' }
            ], { duration: 360, iterations: 1 });
            return;
        }

        // Build the result display
        const interestList = interests.length ? interests.map(i => `<li>${escapeHtml(i)}</li>`).join('') : '<li>—</li>';
        result.innerHTML = `
      <div class="title">¡Gracias por suscribirte, ${escapeHtml(name || 'Amigo')}!</div>
      <div class="item"><strong>Email:</strong> ${escapeHtml(email)}</div>
      <div class="item"><strong>Intereses:</strong></div>
      <ul>${interestList}</ul>
    `.trim();

        // Hide form and show result with animation
        form.classList.add('hidden');
        result.classList.remove('hidden');
        result.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'cubic-bezier(.2,.9,.3,1)' });

        // Card subtle pop
        card.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'ease-out' });

        // Launch confetti
        launchConfetti(40);
    });

    // small helper to avoid XSS in injected HTML
    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, (s) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'
        }[s]));
    }
});
