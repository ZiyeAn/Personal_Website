document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.gallery-track');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const progressBar = document.querySelector('.scroll-progress .progress-bar');
    const tagFilter = document.getElementById('tag-filter');

    let currentIndex = 0;
    let cards;
    let allTags = new Set();
    let isScrolling = false;
    let scrollTimeout;

    // Load project data and initialize gallery
    fetch('works.json')
        .then(response => response.json())
        .then(data => {
            initializeGallery(data.projects);
            populateTagFilter(data.projects);
            initializeEventListeners();
        })
        .catch(error => console.error('Error loading project data:', error));

    function initializeGallery(projects) {
        track.innerHTML = ''; // Clear existing cards
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.dataset.tags = project.tags.join(',');

            projectCard.innerHTML = `
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <hr class="dashed">
                    <img src="${project.thumbnail}" alt="${project.title}" class="project-image grit">
                    <p class="project-description">${project.intro}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<button class="tag" data-tag="${tag}">${tag}</button>`).join('<br>')}
                    </div>
                </div>
            `;
            projectCard.addEventListener('click', () => {
                window.location.href = `${project.id}`;
            });

            track.appendChild(projectCard);
        });

        // Reinitialize cards and set the first one as active
        cards = document.querySelectorAll('.project-card');
        if (cards.length > 0) {
            cards[0].classList.add('active');
            scrollToCard(0);
        }
    }

    function populateTagFilter(projects) {
        allTags.clear();
        projects.forEach(project => {
            project.tags.forEach(tag => allTags.add(tag));
        });

        tagFilter.innerHTML = '<li><button class="filter-tag" data-tag="all">View All</button></li>';
        allTags.forEach(tag => {
            const tagItem = document.createElement('li');
            tagItem.innerHTML = `<button class="filter-tag" data-tag="${tag}">${tag}</button>`;
            tagFilter.appendChild(tagItem);
        });

        // Add event listeners for tag filtering
        document.querySelectorAll('.filter-tag').forEach(button => {
            button.addEventListener('click', () => {
                const tag = button.dataset.tag;
                filterProjectsByTag(tag);
            });
        });
    }

    function filterProjectsByTag(tag) {
        fetch('works.json')
            .then(response => response.json())
            .then(data => {
                const filteredProjects = data.projects.filter(project => tag === 'all' || project.tags.includes(tag));
                initializeGallery(filteredProjects);
            })
            .catch(error => console.error('Error filtering projects:', error));
    }

    function updateActiveCard() {
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });

        const progress = (currentIndex / (cards.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function scrollToCard(index) {
        if (!cards || cards.length === 0) return;
    
        const card = cards[index];
        const containerWidth = track.parentElement.offsetWidth;
        const cardWidth = card.offsetWidth;
        const trackPadding = (track.parentElement.offsetWidth * 0.2); // 20% padding from `.gallery-track`
    
        const gap = 32; // Your defined gap (2rem)
    
        const offset = (index * (cardWidth + gap)) - ((containerWidth - cardWidth) / 2) + trackPadding;
    
        track.style.transform = `translateX(${-offset}px)`;
        currentIndex = index;
        updateActiveCard();
    }

    function initializeEventListeners() {
        // Navigation buttons
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                scrollToCard(currentIndex - 1);
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) {
                scrollToCard(currentIndex + 1);
            }
        });

        // Add wheel event listener for scroll navigation
        track.addEventListener('wheel', handleWheel, { passive: false });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                scrollToCard(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
                scrollToCard(currentIndex + 1);
            }
        });

        // Add touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0 && currentIndex > 0) {
                    scrollToCard(currentIndex - 1);
                } else if (swipeDistance < 0 && currentIndex < cards.length - 1) {
                    scrollToCard(currentIndex + 1);
                }
            }
        }
    }

    function handleWheel(e) {
        e.preventDefault();

        if (isScrolling) return;
        isScrolling = true;

        if (e.deltaY > 0 && currentIndex < cards.length - 1) {
            scrollToCard(currentIndex + 1);
        } else if (e.deltaY < 0 && currentIndex > 0) {
            scrollToCard(currentIndex - 1);
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 500);
    }
}); 