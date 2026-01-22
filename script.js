if('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
AOS.init({
    duration: 800,
    once: true
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href'))
            .scrollIntoView({ behavior: 'smooth' });
    });
});
