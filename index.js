document.addEventListener("DOMContentLoaded", function() {
    const hands = document.querySelectorAll(".hands");
    const menuContainer = document.querySelector(".menu-container");
    const stickyMenu = document.querySelector(".sticky-menu");
    const plate = document.querySelector(".plate");
    const fork = document.querySelector(".fork");
    const knife = document.querySelector(".knife");
    const workDisplay = document.querySelector(".work-display");

    // Animate hands and menu on load
    setTimeout(() => {
        hands.forEach(hand => hand.style.opacity = "1");
        hands[0].style.transform = "translateX(0)";
        hands[1].style.transform = "translateX(0)";
        menuContainer.classList.add("fade-in");
    }, 500);

    // Scroll event listener
    window.addEventListener("scroll", function() {
        let scrollY = window.scrollY;
        let menuOffset = menuContainer.offsetTop + menuContainer.clientHeight;

        // Sticky menu logic
        if (scrollY > menuOffset) {
            stickyMenu.style.transform = "translateY(0)";
        } else {
            stickyMenu.style.transform = "translateY(-100%)";
        }

        // Plate and utensils animation
        let plateOffset = plate.offsetTop - window.innerHeight / 1.5;
        if (scrollY > plateOffset) {
            plate.classList.add("scale-in");
            fork.classList.add("fly-in-left");
            knife.classList.add("fly-in-right");
            workDisplay.classList.add("fade-in");
        }
    });

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
