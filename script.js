document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const powerBtn = document.getElementById('power-btn');
    const monitorScreen = document.getElementById('monitor-screen');
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    const desktopEnv = document.getElementById('desktop-env');
    const wallpaper = document.getElementById('wallpaper');
    const powerLight = document.getElementById('power-light');
    const clock = document.getElementById('clock');
    const pcCase = document.getElementById('pc-case');
    const openCaseBtn = document.getElementById('open-case-btn');
    const sidePanel = document.getElementById('side-panel');
    const hwTooltip = document.getElementById('hw-tooltip');
    const hwTitle = document.getElementById('hw-title');
    const hwDesc = document.getElementById('hw-desc');
    const storyTerminal = document.getElementById('story-terminal');
    const storyImage = document.getElementById('story-image');

    let isPoweredOn = false;
    let isCaseOpen = false;

    // 1. Power Logic & Boot Sequence
    powerBtn.addEventListener('click', () => {
        if (!isPoweredOn) turnOn();
        else turnOff();
    });

    async function turnOn() {
        isPoweredOn = true;
        powerBtn.classList.add('active');
        powerLight.classList.add('on');
        monitorScreen.classList.remove('off');
        monitorScreen.classList.add('on');
        
        bootScreen.classList.remove('hidden');
        
        const sequence = [
            "Initializing CORE OS...",
            "Checking Hardware Integrity...",
            "Loading Kernel Modules...",
            "Starting User Interface...",
            "Welcome, Creator."
        ];

        for (const text of sequence) {
            bootText.style.opacity = 0;
            await sleep(500);
            bootText.textContent = text;
            bootText.style.opacity = 1;
            await sleep(1500);
        }

        bootScreen.classList.add('hidden');
        wallpaper.classList.remove('hidden');
        desktopEnv.classList.remove('hidden');
        updateClock();
    }

    function turnOff() {
        isPoweredOn = false;
        powerBtn.classList.remove('active');
        powerLight.classList.remove('on');
        monitorScreen.classList.remove('on');
        monitorScreen.classList.add('off');
        bootScreen.classList.add('hidden');
        wallpaper.classList.add('hidden');
        desktopEnv.classList.add('hidden');
        closeAllWindows();
    }

    // 2. Window Management (Draggable & Functional)
    const icons = document.querySelectorAll('.icon');
    const windows = document.querySelectorAll('.window');
    
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            const winId = `window-${icon.dataset.window}`;
            const win = document.getElementById(winId);
            if (win) {
                win.classList.remove('hidden');
                bringToFront(win);
                if (icon.dataset.window === 'my-story') startStoryTyping();
            }
        });
    });

    windows.forEach(win => {
        const header = win.querySelector('.window-header');
        const closeBtn = win.querySelector('.close-btn');
        
        // Draggable Logic
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            bringToFront(win);
            offset.x = e.clientX - win.offsetLeft;
            offset.y = e.clientY - win.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            win.style.left = `${e.clientX - offset.x}px`;
            win.style.top = `${e.clientY - offset.y}px`;
        });

        document.addEventListener('mouseup', () => isDragging = false);

        closeBtn.addEventListener('click', () => win.classList.add('hidden'));
    });

    function bringToFront(win) {
        windows.forEach(w => w.style.zIndex = 10);
        win.style.zIndex = 100;
    }

    function closeAllWindows() {
        windows.forEach(win => win.classList.add('hidden'));
    }

    // 3. My Story Terminal Typing Effect
    let typingStarted = false;
    function startStoryTyping() {
        if (typingStarted) return;
        typingStarted = true;
        
        const lines = [
            "> Initializing story...",
            "> Loading memory banks...",
            "> identity_profile: Harryan Rams [KE0258]",
            "",
            "My journey into the world of technology took a transformative turn",
            "on November 25, 2024, when I met Clinton Ochieng.",
            "He introduced me to the art of coding, and together, we embarked",
            "on a collaborative learning adventure.",
            "",
            "We started small, building my very first personal webpage.",
            "From there, we expanded our horizons, developing a cat photo gallery,",
            "a detailed café menu design, and a dynamic color maker application.",
            "",
            "What began as a small, focused group of only 5 learners has since",
            "blossomed into a thriving community of 20 participants.",
            "",
            "Today, I'm proud to showcase my independent project at:",
            "> Compassion-peach.vercel.app",
            "",
            "Currently, I'm engineering a custom PDF file generator.",
            "I am deeply thankful to KidsCodeLab for their partnership with",
            "Companion, making this incredible learning journey possible.",
            "",
            "> End of record."
        ];

        let lineIdx = 0;
        let charIdx = 0;

        function type() {
            if (lineIdx < lines.length) {
                if (charIdx < lines[lineIdx].length) {
                    storyTerminal.innerHTML += lines[lineIdx][charIdx];
                    charIdx++;
                    setTimeout(type, 30);
                } else {
                    storyTerminal.innerHTML += '<br>';
                    lineIdx++;
                    charIdx = 0;
                    if (lineIdx === 5) {
                        storyImage.classList.remove('hidden');
                        storyImage.style.animation = 'fadeIn 1s ease-out forwards';
                    }
                    setTimeout(type, 500);
                }
            }
        }
        type();
    }

    // 4. Case & Hardware Interaction
    openCaseBtn.addEventListener('click', () => {
        isCaseOpen = !isCaseOpen;
        if (isCaseOpen) {
            pcCase.classList.add('case-opened');
            openCaseBtn.textContent = 'Close Computer Case';
        } else {
            pcCase.classList.remove('case-opened');
            openCaseBtn.textContent = 'Open Computer Case';
        }
    });

    const hwComponents = document.querySelectorAll('.hw-component');
    hwComponents.forEach(comp => {
        comp.addEventListener('mouseenter', (e) => {
            hwTitle.textContent = comp.dataset.name;
            hwDesc.textContent = comp.dataset.desc;
            hwTooltip.classList.remove('hidden');
        });

        comp.addEventListener('mousemove', (e) => {
            hwTooltip.style.left = `${e.clientX + 20}px`;
            hwTooltip.style.top = `${e.clientY + 20}px`;
        });

        comp.addEventListener('mouseleave', () => {
            hwTooltip.classList.add('hidden');
        });
    });

    // 5. Clock Logic
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        clock.textContent = timeStr;
    }
    setInterval(updateClock, 1000);

    // 6. Particles Effect
    function createParticles() {
        const container = document.querySelector('.particle-container');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(0, 210, 255, ${Math.random()});
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                border-radius: 50%;
                pointer-events: none;
                animation: float ${5 + Math.random() * 10}s infinite ease-in-out;
            `;
            container.appendChild(particle);
        }
    }
    createParticles();

    // 7. Easter Eggs
    let powerClickCount = 0;
    powerBtn.addEventListener('click', () => {
        powerClickCount++;
        if (powerClickCount === 5) {
            alert("SYSTEM OVERRIDE: You found a secret!");
            powerClickCount = 0;
        }
    });

    // Helper: Sleep
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
