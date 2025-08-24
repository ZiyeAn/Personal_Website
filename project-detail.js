document.addEventListener('DOMContentLoaded', () => {
    const projectId = window.location.pathname;
    console.log(projectId)
    // Load project data
    fetch('../works.json')
        .then(response => response.json())
        .then(data => {
            const project = data.projects.find(p => p.id === projectId);
            if (!project) {
                console.error('Project not found');
                return;
            }
            
            // Update page title
            document.title = `${project.title} - Project Details`;
            
            // Create image track container
            const imagesSection = document.querySelector('.images-section');
            
            // Add video if it exists
            if (project.details.video && Array.isArray(project.details.video)) {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'video-container';
                project.details.video.forEach(videoSrc => {
                    const video = document.createElement('video');
                    video.controls = true;
                    video.autoplay = true;
                    video.muted = true;
                    video.src = videoSrc;
                    videoContainer.appendChild(video);
                });
                imagesSection.appendChild(videoContainer);
            }
            
            // Load images
            project.details.images.forEach(imgSrc => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = project.title;
                imagesSection.appendChild(img);
            });

            // gsap.from(".images-section", { 
            //     opacity: 0, // Start fully transparent
            //     y: 100, // Start 100px below its original position
            //     duration: 1.2, // Animation duration
            //     ease: "power3.out" // Smooth easing
            // });
            
            // Load project info
            const infoSection = document.querySelector('.info-section');
            const processContent = document.querySelector('.process-content');
            
            infoSection.insertAdjacentHTML('afterbegin', `
                <h1>${project.title}</h1>
                <p class="project-description">${project.details.description}</p>
                
                <div class="tech-stack">
                    ${project.details.techStack.map(tech => 
                        `<span class="tech-item">${tech}</span>`
                    ).join('')}
                </div>
                
                <p class="project-time">
                    <strong>Timeline:</strong> ${project.details.timeline}
                </p>
                
                <a href="${project.details.demoLink}" class="project-link" target="_blank">
                    Visit Site →
                </a>
            `);
            
            // Load process content
            processContent.innerHTML = `
                <h2>Process & Development</h2>
                <ol>
                    <li>Inspirations
                        <ul>
                            ${project.details.process.inspiration.map(item => 
                                `<li>${item}</li>`
                            ).join('')}
                        </ul>
                    </li>
                    <li>Development
                        <ul>
                            ${project.details.process.development.map(item => 
                                `<li>${item}</li>`
                            ).join('')}
                        </ul>
                    </li>
                    <li>Testing & Refinement
                        <ul>
                            ${project.details.process.images.map(item => 
                                `<li>${item}</li>`
                            ).join('')}
                        </ul>
                    </li>
                </ol>
            `;
        })
        .catch(error => console.error('Error loading project data:', error));

    // Process tab functionality
    const processTab = document.querySelector('.process-tab');
    const processContent = document.querySelector('.process-content');

    processTab.addEventListener('click', function() {
        processContent.classList.toggle('active');
        this.classList.toggle('active');
        this.textContent = this.textContent === 'Process' ? 'Images' : 'Process';
    });

    // Smooth scrolling for images section
    const imagesSection = document.querySelector('.images-section');
    let isScrolling = false;
    let scrollTimeout;

    imagesSection.addEventListener('wheel', (e) => {
        if (!isScrolling) {
            isScrolling = true;
            imagesSection.style.scrollBehavior = 'smooth';
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            imagesSection.style.scrollBehavior = 'auto';
        }, 150);
    });
}); 