// A.U.R.O.R.A. Mission 1 - Game Logic

// Game data
const modules = {
    motores: {
        id: "motores",
        name: "Modulo_Motores.js",
        icon: "⚙️",
        corruptCode: `// Protocolo de ignición de motores principales.
// A.U.R.O.R.A. v2.1

function ajustarPotencia() {
  const POTENCIA_MAXIMA = 100;
  let nivelPotencia = POTENCIA_MAXIMA;
  
  // Verificar si el nivel es seguro
  if (nivelPotensia > 50) {
    console.log("Nivel de potencia seguro para ignición.")
  }

  return "Motores listos para la secuencia de arranque.";
}`,
        correctCode: `// Protocolo de ignición de motores principales.
// A.U.R.O.R.A. v2.1

function ajustarPotencia() {
  const POTENCIA_MAXIMA = 100;
  let nivelPotencia = POTENCIA_MAXIMA;
  
  // Verificar si el nivel es seguro
  if (nivelPotencia > 50) {
    console.log("Nivel de potencia seguro para ignición.");
  }

  return "Motores listos para la secuencia de arranque.";
}`,
        completed: false
    },
    giroscopio: {
        id: "giroscopio",
        name: "Modulo_Giroscopio.js",
        icon: "⚖️",
        corruptCode: `// Sistema de estabilización giroscópica.
// A.U.R.O.R.A. v2.1

function verificarEstabilidad(terrenoSeguro) {
  console.log("Iniciando verificación de estabilidad...");
  
  // El giroscopio solo se activa en terreno seguro.
  if (terrenoSeguro == true {
    activarEstabilizador();
    console.log("Estabilizadores activados.");
  
  console.log("Verificación de estabilidad completada.");
}`,
        correctCode: `// Sistema de estabilización giroscópica.
// A.U.R.O.R.A. v2.1

function verificarEstabilidad(terrenoSeguro) {
  console.log("Iniciando verificación de estabilidad...");
  
  // El giroscopio solo se activa en terreno seguro.
  if (terrenoSeguro == true) {
    activarEstabilizador();
    console.log("Estabilizadores activados.");
  }
  console.log("Verificación de estabilidad completada.");
}`,
        completed: false
    },
    herramientas: {
        id: "herramientas",
        name: "Modulo_Herramientas.js",
        icon: "🛠️",
        corruptCode: `// Control del brazo robótico y herramientas.
// A.U.R.O.R.A. v2.1

function operarTaladro() {
  const VELOCIDAD_MAX = 3000; // RPM
  let velocidadActual = "media";
  
  console.log("Activando taladro a velocidad " + velocidadActual)
  
  // Enviar mensaje de estado a la consola principal.
  enviarMensaje("Iniciando perforación de muestra...";
}`,
        correctCode: `// Control del brazo robótico y herramientas.
// A.U.R.O.R.A. v2.1

function operarTaladro() {
  const VELOCIDAD_MAX = 3000; // RPM
  let velocidadActual = "media";
  
  console.log("Activando taladro a velocidad " + velocidadActual);
  
  // Enviar mensaje de estado a la consola principal.
  enviarMensaje("Iniciando perforación de muestra...");
}`,
        completed: false
    },
    comunicaciones: {
        id: "comunicaciones",
        name: "Modulo_Comunicaciones.js",
        icon: "📡",
        corruptCode: `// Antena de comunicaciones de largo alcance.
// A.U.R.O.R.A. v2.1

function enviarReporteDeEstado() {
  let status = "Operacional";
  let mensaje = A.U.R.O.R.A. reportando: todo en orden. Estado: + status;
  
  console.log("Transmitiendo mensaje a la base...");
  transmitir(mensaje);
}

// Ejecutar la función de reporte.
enviarreportedeestado();`,
        correctCode: `// Antena de comunicaciones de largo alcance.
// A.U.R.O.R.A. v2.1

function enviarReporteDeEstado() {
  let status = "Operacional";
  let mensaje = "A.U.R.O.R.A. reportando: todo en orden. Estado: " + status;
  
  console.log("Transmitiendo mensaje a la base...");
  transmitir(mensaje);
}

// Ejecutar la función de reporte.
enviarReporteDeEstado();`,
        completed: false
    }
};

// Game state
let gameState = {
    currentModule: null,
    completedModules: 0,
    tutorialActive: true,
    currentTutorialStep: 1,
    timerInterval: null,
    timeElapsed: 0 // Inicia en 0 y cuenta hacia arriba
};

// DOM elements
const elements = {
    tutorialModal: null,
    mainInterface: null,
    completionScreen: null,
    codeEditor: null,
    lineNumbers: null,
    verifyButton: null,
    feedback: null,
    moduleButtons: null,
    progressText: null,
    timerDisplay: null
};

// Sound effects using Web Audio API
class SoundManager {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.initAudio();
    }

    initAudio() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playSound(type) {
        if (!this.context) return;

        const frequencies = {
            'ui-click': [800, 0.1],
            'typing': [400, 0.05],
            'success': [800, 0.2, [800, 1000, 1200]],
            'error': [200, 0.3]
        };

        const [freq, duration, chord] = frequencies[type] || [400, 0.1];

        if (chord) {
            // Play chord for success sound
            chord.forEach((f, i) => {
                setTimeout(() => this.playTone(f, duration / chord.length), i * 50);
            });
        } else {
            this.playTone(freq, duration);
        }
    }

    playTone(frequency, duration) {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.context.currentTime + duration);
    }
}

const soundManager = new SoundManager();

// Initialize game
function initGame() {
    // Get DOM elements
    elements.tutorialModal = document.getElementById('tutorial-modal');
    elements.mainInterface = document.getElementById('main-interface');
    elements.completionScreen = document.getElementById('completion-screen');
    elements.codeEditor = document.getElementById('code-editor');
    elements.lineNumbers = document.getElementById('line-numbers');
    elements.verifyButton = document.getElementById('verify-button');
    elements.feedback = document.getElementById('feedback');
    elements.moduleButtons = document.querySelectorAll('.module-btn');
    elements.progressText = document.getElementById('mission-progress');
    elements.timerDisplay = document.getElementById('mission-timer');

    // Setup tutorial
    setupTutorial();

    // Setup module buttons
    setupModuleButtons();

    // Setup code editor
    setupCodeEditor();

    // Setup verify button
    setupVerifyButton();

    // Setup completion screen
    setupCompletionScreen();

    // Set initial timer display
    updateTimerDisplay();

    // Start tutorial
    showTutorial();
}

// Timer functionality
function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    
    // El cronómetro cuenta hacia arriba cada segundo
    gameState.timerInterval = setInterval(() => {
        gameState.timeElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
}

function updateTimerDisplay() {
    if (!elements.timerDisplay) return;
    const minutes = Math.floor(gameState.timeElapsed / 60);
    const seconds = gameState.timeElapsed % 60;
    
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    elements.timerDisplay.textContent = formattedTime;
}


// Tutorial functionality
function setupTutorial() {
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const startBtn = document.getElementById('start-mission');
    const dots = document.querySelectorAll('.dot');

    prevBtn.addEventListener('click', () => {
        soundManager.playSound('ui-click');
        if (gameState.currentTutorialStep > 1) {
            gameState.currentTutorialStep--;
            updateTutorialStep();
        }
    });

    nextBtn.addEventListener('click', () => {
        soundManager.playSound('ui-click');
        if (gameState.currentTutorialStep < 6) {
            gameState.currentTutorialStep++;
            updateTutorialStep();
        }
    });

    startBtn.addEventListener('click', () => {
        soundManager.playSound('ui-click');
        closeTutorial();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            soundManager.playSound('ui-click');
            const stepNumber = parseInt(dot.dataset.step);
            gameState.currentTutorialStep = stepNumber;
            updateTutorialStep();
        });
    });

    // Allow ESC key to close tutorial
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameState.tutorialActive) {
            e.preventDefault();
            closeTutorial();
        }
    });
}

function updateTutorialStep() {
    // Hide all tutorial steps
    const allSteps = document.querySelectorAll('.tutorial-step');
    allSteps.forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });

    // Show current step
    const currentStep = document.querySelector(`.tutorial-step[data-step="${gameState.currentTutorialStep}"]`);
    if (currentStep) {
        currentStep.classList.add('active');
        currentStep.style.display = 'block';
    }

    // Update progress dots
    const allDots = document.querySelectorAll('.dot');
    allDots.forEach(dot => {
        dot.classList.remove('active');
    });
    const currentDot = document.querySelector(`.dot[data-step="${gameState.currentTutorialStep}"]`);
    if (currentDot) {
        currentDot.classList.add('active');
    }

    // Update navigation buttons
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const startBtn = document.getElementById('start-mission');

    if (prevBtn && nextBtn && startBtn) {
        prevBtn.style.display = gameState.currentTutorialStep === 1 ? 'none' : 'inline-block';
        nextBtn.style.display = gameState.currentTutorialStep === 6 ? 'none' : 'inline-block';
        startBtn.style.display = gameState.currentTutorialStep === 6 ? 'inline-block' : 'none';
    }
}

function showTutorial() {
    if (elements.tutorialModal && elements.mainInterface) {
        elements.tutorialModal.style.display = 'flex';
        elements.mainInterface.style.display = 'none';
        gameState.tutorialActive = true;
        gameState.currentTutorialStep = 1;
        updateTutorialStep();
    }
}

function closeTutorial() {
    if (elements.tutorialModal && elements.mainInterface) {
        elements.tutorialModal.style.display = 'none';
        elements.mainInterface.style.display = 'block';
        gameState.tutorialActive = false;
        startTimer();
    }
}

// Module button functionality
function setupModuleButtons() {
    elements.moduleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            soundManager.playSound('ui-click');
            selectModule(btn.dataset.module);
        });
    });
}

function selectModule(moduleId) {
    if (!modules[moduleId]) return;

    gameState.currentModule = moduleId;
    
    // Update button states
    elements.moduleButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.module === moduleId) {
            btn.classList.add('active');
        }
    });

    // Load module code
    loadModuleCode(moduleId);
    
    // Enable verify button
    if (elements.verifyButton) {
        elements.verifyButton.disabled = false;
    }
    
    // Clear feedback
    if (elements.feedback) {
        elements.feedback.innerHTML = '';
        elements.feedback.className = 'feedback';
    }
}

function loadModuleCode(moduleId) {
    const module = modules[moduleId];
    if (elements.codeEditor && module) {
        elements.codeEditor.value = module.corruptCode;
        updateLineNumbers();
    }
}

// Code editor functionality
function setupCodeEditor() {
    if (!elements.codeEditor) return;

    elements.codeEditor.addEventListener('input', (e) => {
        soundManager.playSound('typing');
        updateLineNumbers();
    });

    elements.codeEditor.addEventListener('keydown', (e) => {
        // Handle tab key for proper indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = e.target.value;
            
            e.target.value = value.substring(0, start) + '  ' + value.substring(end);
            e.target.selectionStart = e.target.selectionEnd = start + 2;
            
            updateLineNumbers();
        }
    });

    elements.codeEditor.addEventListener('focus', () => {
        soundManager.playSound('ui-click');
    });

    // Initial line numbers
    updateLineNumbers();
}

function updateLineNumbers() {
    if (!elements.codeEditor || !elements.lineNumbers) return;

    const lines = elements.codeEditor.value.split('\n');
    const lineNumbersHTML = lines.map((_, index) => `<div>${index + 1}</div>`).join('');
    elements.lineNumbers.innerHTML = lineNumbersHTML;

    // Sync scroll position
    elements.lineNumbers.scrollTop = elements.codeEditor.scrollTop;
}

// Verify button functionality
function setupVerifyButton() {
    if (!elements.verifyButton) return;

    elements.verifyButton.addEventListener('click', () => {
        soundManager.playSound('ui-click');
        verifyCode();
    });
}

function verifyCode() {
    if (!gameState.currentModule || !elements.codeEditor) return;

    const module = modules[gameState.currentModule];
    const userCode = elements.codeEditor.value.trim();
    const correctCode = module.correctCode.trim();

    // Normalize whitespace for comparison
    const normalizeCode = (code) => {
        return code.replace(/\s+/g, ' ').trim();
    };

    const normalizedUser = normalizeCode(userCode);
    const normalizedCorrect = normalizeCode(correctCode);

    const isCorrect = normalizedUser === normalizedCorrect;

    if (isCorrect) {
        // Correct code
        soundManager.playSound('success');
        showFeedback('¡Excelente! Módulo reparado correctamente. ✅', 'success');
        
        // Mark module as completed
        if (!module.completed) {
            module.completed = true;
            gameState.completedModules++;
            updateModuleStatus(gameState.currentModule);
            updateProgress();
            
            // Check if all modules completed
            if (gameState.completedModules === Object.keys(modules).length) {
                stopTimer();
                setTimeout(showCompletionScreen, 1500);
            }
        }
    } else {
        // Incorrect code
        soundManager.playSound('error');
        showFeedback(`ERROR DE COMPILACIÓN. Protocolo rechazado. Revisa la sintaxis. ❌`, 'error');
    }
}

function showFeedback(message, type) {
    if (!elements.feedback) return;

    elements.feedback.innerHTML = message;
    elements.feedback.className = `feedback ${type}`;
    
    // Auto-clear success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (elements.feedback) {
                elements.feedback.innerHTML = '';
                elements.feedback.className = 'feedback';
            }
        }, 3000);
    }
}

function updateModuleStatus(moduleId) {
    const button = document.querySelector(`[data-module="${moduleId}"]`);
    if (button) {
        const statusSpan = button.querySelector('.module-status');
        if (statusSpan) {
            statusSpan.textContent = '🟢';
        }
        button.classList.add('completed');
    }
}

function updateProgress() {
    if (elements.progressText) {
        elements.progressText.textContent = `${gameState.completedModules}/4 Módulos Reparados`;
    }
}

// Completion screen functionality
function setupCompletionScreen() {
    const copyBtn = document.getElementById('copy-password');
    const returnBtn = document.getElementById('return-button');

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            soundManager.playSound('ui-click');
            copyPassword();
        });
    }

    if (returnBtn) {
        returnBtn.addEventListener('click', () => {
            soundManager.playSound('ui-click');
            window.open('https://gnius-club.github.io/AURORA', '_blank');
        });
    }
}

function showCompletionScreen() {
    if (elements.mainInterface && elements.completionScreen) {
        elements.mainInterface.style.display = 'none';
        elements.completionScreen.style.display = 'flex';
        
        // Generate and display password
        const password = generatePassword();
        const passwordDisplay = document.getElementById('password-display');
        if (passwordDisplay) {
            passwordDisplay.textContent = password;
        }
    }
}

function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-/';
    const getRandomChar = () => chars.charAt(Math.floor(Math.random() * chars.length));
    
    return `AURORA${getRandomChar()}M${getRandomChar()}I${getRandomChar()}S${getRandomChar()}I${getRandomChar()}O${getRandomChar()}N${getRandomChar()}2`;
}

function copyPassword() {
    const passwordDisplay = document.getElementById('password-display');
    if (!passwordDisplay) return;

    const password = passwordDisplay.textContent;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(password).then(() => {
            showCopyFeedback('¡Contraseña copiada al portapapeles! ✅');
        }).catch(() => {
            fallbackCopyTextToClipboard(password);
        });
    } else {
        fallbackCopyTextToClipboard(password);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyFeedback('¡Contraseña copiada al portapapeles! ✅');
        } else {
            showCopyFeedback('Error al copiar. Selecciona y copia manualmente.');
        }
    } catch (err) {
        showCopyFeedback('Error al copiar. Selecciona y copia manualmente.');
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback(message) {
    const feedback = document.getElementById('copy-feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.classList.add('show');
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 3000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are properly rendered
    setTimeout(() => {
        initGame();
    }, 100);
});

// Handle audio context activation (required by some browsers)
document.addEventListener('click', () => {
    if (soundManager.context && soundManager.context.state === 'suspended') {
        soundManager.context.resume();
    }
}, { once: true });

// Additional keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to verify code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !gameState.tutorialActive) {
        e.preventDefault();
        if (gameState.currentModule && elements.verifyButton && !elements.verifyButton.disabled) {
            verifyCode();
        }
    }
});

// Sync line numbers scroll with editor
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const codeEditor = document.getElementById('code-editor');
        const lineNumbers = document.getElementById('line-numbers');
        
        if (codeEditor && lineNumbers) {
            codeEditor.addEventListener('scroll', () => {
                lineNumbers.scrollTop = codeEditor.scrollTop;
            });
        }
    }, 200);
});

// Handle orientation change on mobile
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        updateLineNumbers();
    }, 100);
});
