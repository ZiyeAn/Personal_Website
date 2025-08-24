document.addEventListener("DOMContentLoaded", function() {
    const title = document.querySelector(".title");
    const subtitle = document.querySelector(".subtitle");
    const hands = document.querySelectorAll(".hands");
    const menuContainer = document.querySelector(".menu-container");
    const stickyMenu = document.querySelector(".sticky-menu");
    const plate = document.querySelector(".plate");
    const fork = document.querySelector(".fork");
    const knife = document.querySelector(".knife");
    const workDisplay = document.querySelector(".work-display");
    const menu = document.querySelector('.menu');
    const topMenuBar = document.querySelector('.top-menu-bar');
    const plateSection = document.querySelector('.plate-section');
    const leftHand = document.querySelector(".left-hand");
    const rightHand = document.querySelector(".right-hand");
    const tl = gsap.timeline();
    gsap.registerPlugin(ScrollTrigger);

    // Typewriter effect for subtitle
    function typeWriter(text, n) {
        if (n < text.length) {
            $('.subtitle').html(text.substring(0, n + 1));
            n++;
            setTimeout(function() {
                typeWriter(text, n);
            }, 100); 
        }
    }
    var text = $('.subtitle').data('text');
   setTimeout(function() {
    typeWriter(text, 0);
   }, 1000);

    // Animate hands and menu on load
    tl.from
    tl.from(".left-hand", {
        opacity: 0,
        duration: 1,
        x: "-50%",
        ease: "circ.inOut",
        delay: 1.5
    },0);
    tl.from(".right-hand", {
        opacity: 0,
        duration: 1,
        x: "50%",
        ease: "circ.inOut",
        delay: 1.5
    },0);
    tl.from(".menu-container", {
        opacity: 0,
        width: "10px",
        borderRadius: "5px",
        duration: 1,
        ease: "circ.inOut",
        delay: 1.5,
        toggleActions: "play none none none"

    },0);

    gsap.to(".left-hand", {
        scrollTrigger: {
            trigger: ".left-hand",
            start: "top 40%",
            end: "top 10%",
            scrub: true,
        },
        rotation: 30,
        duration: 2,
        ease: "power3.inOut",
    },0);

    gsap.to(".right-hand", {
        scrollTrigger: {
            trigger: ".right-hand",
            start: "top 40%",
            end: "top 10%",
            scrub: true
        },
        rotation: -30,
        duration: 2,
        ease: "power3.inOut",
    },0);

    tl.to(".menu-container", {
        scrollTrigger: {
            trigger: ".right-hand",
            start: "top 40%",
            end: "top 0%",
            scrub: true,
            snap: {
                snapTo: (progress) => Math.round(progress), // Snap to 0 or 1
                duration: 0.3, // Smooth snap duration
                ease: "power2.inOut"
            }
        },
        height: "100vh", 
        duration: 2,
        ease: "power4.inOut",
        borderRadius: "10px",
        backgroundColor: "#353534",
        y: "-=15%"
    },1);


    gsap.to(".menu-content", {
        scrollTrigger: {
            trigger: ".right-hand",
            start: "top 40%",
            scrub:  true
        },
        opacity: 1, // Fade in text
        duration: 1
    });

    gsap.from(".catalog-container", {
        scrollTrigger: {
            trigger: ".catalog-container",
            start: "top center",
            end: "30% center",
            snap: {
                snapTo: "start", // Snaps the container to the start of the viewport
                duration: 0.5,   // Smooth snap duration
                ease: "power2.inOut"
            }
        },
        xPercent: -100,
        duration: 1.5,
        ease: "power3.inOut"
    });


    fetch('works.json')
    .then(response => response.json())
    .then(data => {
        const worksList = document.getElementById('works-list');
        data.projects.forEach(work => {
            const workElement = document.createElement('div');
            workElement.className = 'work-item';
            workElement.innerHTML = `
                <a href="${work.id}">${work.title}</a>
            `;
            worksList.appendChild(workElement);
        });
    })
    .catch(error => console.error('Error loading works:', error));
    

        // Show plate section and animate fork and knife
        if (scrollY > 1000) {
            plateSection.style.opacity = 1;
            fork.style.transform = 'translate(0, -50%)';
            knife.style.transform = 'translate(0, -50%)';
        } else {
            plateSection.style.opacity = 0;
            fork.style.transform = 'translateX(-100%) translateY(-50%)';
            knife.style.transform = 'translateX(100%) translateY(-50%)';
        }
        // Work navigation with fork and knife
        const works = [
            { title: "Project 1", description: "Description of project 1." },
            { title: "Project 2", description: "Description of project 2." },
            { title: "Project 3", description: "Description of project 3." }
        ];

        let currentWorkIndex = 0;

        function updateWorkDisplay() {
            document.getElementById("work-title").textContent = works[currentWorkIndex].title;
            document.getElementById("work-description").textContent = works[currentWorkIndex].description;
        }
        
        updateWorkDisplay();
        
        fork.addEventListener("click", () => {
            currentWorkIndex = (currentWorkIndex - 1 + works.length) % works.length;
            updateWorkDisplay();
        });
        
        knife.addEventListener("click", () => {
            currentWorkIndex = (currentWorkIndex + 1) % works.length;
            updateWorkDisplay();
        });
    });

    