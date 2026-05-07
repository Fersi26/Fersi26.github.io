// ring.js - Navigation Ring for Spaceship Camera Orientation

class NavigationRing {
    constructor(fileExplorer) {
        this.fileExplorer = fileExplorer;
        this.ringElement = document.getElementById('navigation-ring');
        this.compassDisplay = document.getElementById('compass-display');
        this.centerPinFixed = document.getElementById('center-pin-fixed');
        this.centerPinMoving = document.getElementById('center-pin-moving');
        this.directionWindow = document.getElementById('direction-window');
        this.directionText = document.getElementById('direction-text');
        this.degreeText = document.getElementById('degree-text');
        this.verticalCompass = document.getElementById('vertical-compass');
        this.verticalNeedle = this.verticalCompass?.querySelector('.vertical-needle');
        this.pitchDisplay = document.getElementById('pitch-display');
        this.forwardMovement = document.getElementById('forward-movement');
        this.verticalMovement = document.getElementById('vertical-movement');
        
        // Configuration: -150° is front
        this.FRONT_DEGREE = -150;
        this.currentActualRotation = 0;
        this.currentDisplayRotation = 0;
        this.currentPitchAngle = 0;
        
        // Movement tracking
        this.lastCameraPosition = new THREE.Vector3();
        this.forwardMovementSpeed = 0;
        this.verticalMovementSpeed = 0;
        this.movementHistory = [];
        
        this.init();
    }

 init() {
    // Initialize movement tracking
    this.referencePosition = null;
    this.movementHistory = [];
    
    // Set reference position when camera is available
    if (this.fileExplorer.camera) {
        this.resetReferencePosition();
    }
    
    this.createEdgeLabels();
    this.createDegreeMarks();
    this.updateDisplay();
    
    // Update display on animation frame
    this.animate();
    
    console.log('Navigation Ring initialized - Front at -150°');
}
// Add this method to the NavigationRing class
resetToCurrentPosition() {
    this.resetReferencePosition();
}
updateMovementDisplay() {
    if (!this.forwardMovement || !this.verticalMovement) return;
    
    const movement = this.calculateMovement();
    const smoothedMovement = this.smoothMovementValues(movement);
    
    // Auto-reset reference if camera returns close to origin
    if (this.referencePosition && this.fileExplorer.camera) {
        const distanceToReference = this.fileExplorer.camera.position.distanceTo(this.referencePosition);
        if (distanceToReference < 0.1) { // Threshold for "close enough"
            this.resetReferencePosition();
        }
    }
    
    // Update forward/backward movement display
    const forwardValue = smoothedMovement.forward;
    this.forwardMovement.textContent = Math.abs(forwardValue) > 0.001 ? forwardValue.toFixed(2) : '0.00';
    
    // Color coding for forward/backward
    if (forwardValue > 0.01) {
        this.forwardMovement.style.color = '#88ff88'; // Green for forward
    } else if (forwardValue < -0.01) {
        this.forwardMovement.style.color = '#ff8888'; // Red for backward
    } else {
        this.forwardMovement.style.color = '#888888'; // Gray for stationary
    }
    
    // Update vertical movement display
    const verticalValue = smoothedMovement.vertical;
    this.verticalMovement.textContent = Math.abs(verticalValue) > 0.001 ? verticalValue.toFixed(2) : '0.00';
    
    // Color coding for up/down
    if (verticalValue > 0.01) {
        this.verticalMovement.style.color = '#88ff88'; // Green for up
    } else if (verticalValue < -0.01) {
        this.verticalMovement.style.color = '#ff8888'; // Red for down
    } else {
        this.verticalMovement.style.color = '#888888'; // Gray for stationary
    }
}

    createEdgeLabels() {
        // Create L and R labels at compass edges
        const leftLabel = document.createElement('div');
        leftLabel.className = 'edge-label left';
        leftLabel.textContent = 'L';
        
        const rightLabel = document.createElement('div');
        rightLabel.className = 'edge-label right';
        rightLabel.textContent = 'R';
        
        this.compassDisplay.appendChild(leftLabel);
        this.compassDisplay.appendChild(rightLabel);
    }

    createDegreeMarks() {
        // Clear any existing marks (except edge labels)
        const existingMarks = this.compassDisplay.querySelectorAll('.degree-mark, .degree-line');
        existingMarks.forEach(mark => {
            if (!mark.classList.contains('edge-label')) {
                mark.remove();
            }
        });
        
        // Create degree marks at key display positions (using display scale)
        const displayDegrees = [
            {displayDeg: -180, label: '180'},
            {displayDeg: -150, label: '150'},
            {displayDeg: -120, label: '120'},
            {displayDeg: -90, label: '90'},
            {displayDeg: -60, label: '60'},
            {displayDeg: -30, label: '30'},
            {displayDeg: 0, label: '0', type: 'front'},
            {displayDeg: 30, label: '30'},
            {displayDeg: 60, label: '60'},
            {displayDeg: 90, label: '90'},
            {displayDeg: 120, label: '120'},
            {displayDeg: 150, label: '150'},
            {displayDeg: 180, label: '180'}
        ];
        
        displayDegrees.forEach(item => {
            const position = this.degreesToPosition(item.displayDeg);
            
            // Create degree line
            const line = document.createElement('div');
            line.className = 'degree-line';
            if (item.type === 'front') {
                line.classList.add('front-line');
            }
            line.style.left = position + '%';
            this.compassDisplay.appendChild(line);
            
            // Create degree mark (text) - only show every 60 degrees for cleaner look
            if (Math.abs(item.displayDeg) % 60 === 0 || item.type === 'front') {
                const mark = document.createElement('div');
                mark.className = 'degree-mark';
                mark.textContent = item.label;
                
                if (item.type === 'front') {
                    mark.classList.add('front-mark');
                }
                
                mark.style.left = position + '%';
                this.compassDisplay.appendChild(mark);
            }
        });
    }

    getCameraPitch() {
        if (!this.fileExplorer.camera) return 0;
        
        // Get camera direction vector
        const direction = new THREE.Vector3();
        this.fileExplorer.camera.getWorldDirection(direction);
        
        // Calculate pitch angle (vertical angle)
        const pitch = Math.asin(direction.y);
        
        // Convert to degrees and normalize to -90 to 90
        let pitchDegrees = THREE.MathUtils.radToDeg(pitch);
        
        // Clamp to reasonable range
        pitchDegrees = Math.max(-90, Math.min(90, pitchDegrees));
        
        return pitchDegrees;
    }

  calculateMovement() {
    if (!this.fileExplorer.camera) {
        return { forward: 0, vertical: 0 };
    }
    
    const currentPosition = this.fileExplorer.camera.position.clone();
    
    // Initialize reference position if not set
    if (!this.referencePosition) {
        this.referencePosition = currentPosition.clone();
        this.lastCameraPosition = currentPosition.clone();
        return { forward: 0, vertical: 0 };
    }
    
    // Get camera forward direction
    const forward = new THREE.Vector3();
    this.fileExplorer.camera.getWorldDirection(forward);
    forward.y = 0; // Project to horizontal plane
    forward.normalize();
    
    // Get camera right direction for lateral movement
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    
    // Calculate position relative to reference
    const relativePosition = new THREE.Vector3();
    relativePosition.subVectors(currentPosition, this.referencePosition);
    
    // Calculate forward/backward movement (dot product with forward vector)
    const forwardMovement = relativePosition.dot(forward);
    
    // Calculate vertical movement (absolute Y difference from reference)
    const verticalMovement = relativePosition.y;
    
    // Store current position for next frame
    this.lastCameraPosition.copy(currentPosition);
    
    return {
        forward: forwardMovement,
        vertical: verticalMovement
    };
}

// Add this method to reset the reference position when needed
resetReferencePosition() {
    if (this.fileExplorer.camera) {
        this.referencePosition = this.fileExplorer.camera.position.clone();
        this.lastCameraPosition = this.fileExplorer.camera.position.clone();
        this.movementHistory = []; // Clear movement history
    }
}

// Update the smoothMovementValues function to handle reference-based movement
smoothMovementValues(currentMovement) {
    // Add current movement to history
    this.movementHistory.push({
        forward: currentMovement.forward,
        vertical: currentMovement.vertical,
        timestamp: Date.now()
    });
    
    // Keep only last 10 frames (for smoothing)
    const maxHistory = 10;
    if (this.movementHistory.length > maxHistory) {
        this.movementHistory.shift();
    }
    
    // Remove old entries (older than 500ms)
    const now = Date.now();
    this.movementHistory = this.movementHistory.filter(entry => 
        now - entry.timestamp < 500
    );
    
    // Calculate average for smoothing
    let totalForward = 0;
    let totalVertical = 0;
    
    this.movementHistory.forEach(entry => {
        totalForward += entry.forward;
        totalVertical += entry.vertical;
    });
    
    const count = Math.max(1, this.movementHistory.length);
    
    return {
        forward: totalForward / count,
        vertical: totalVertical / count
    };
}

    smoothMovementValues(currentMovement) {
        // Add current movement to history
        this.movementHistory.push({
            forward: currentMovement.forward,
            vertical: currentMovement.vertical,
            timestamp: Date.now()
        });
        
        // Keep only last 5 frames (for smoothing)
        const maxHistory = 5;
        if (this.movementHistory.length > maxHistory) {
            this.movementHistory.shift();
        }
        
        // Remove old entries (older than 200ms)
        const now = Date.now();
        this.movementHistory = this.movementHistory.filter(entry => 
            now - entry.timestamp < 200
        );
        
        // Calculate average for smoothing
        let totalForward = 0;
        let totalVertical = 0;
        
        this.movementHistory.forEach(entry => {
            totalForward += entry.forward;
            totalVertical += entry.vertical;
        });
        
        return {
            forward: totalForward / this.movementHistory.length,
            vertical: totalVertical / this.movementHistory.length
        };
    }

    updateVerticalDisplay() {
        if (!this.verticalNeedle || !this.pitchDisplay) return;
        
        const pitch = this.currentPitchAngle;
        
        // Update needle rotation (0° = level, 90° = straight up, -90° = straight down)
        const maxRotation = 80; // Maximum visual rotation in degrees
        const rotation = Math.max(-maxRotation, Math.min(maxRotation, pitch));
        this.verticalNeedle.style.transform = `translateX(-50%) translateY(-50%) rotate(${rotation}deg)`;
        
        // Update pitch display
        this.pitchDisplay.textContent = `${pitch.toFixed(1)}°`;
        
        // Visual feedback for extreme angles
        if (Math.abs(pitch) > 60) {
            this.verticalNeedle.classList.add('extreme');
            this.verticalNeedle.style.background = '#ff4444';
        } else if (Math.abs(pitch) > 30) {
            this.verticalNeedle.classList.remove('extreme');
            this.verticalNeedle.style.background = '#ff8844';
        } else {
            this.verticalNeedle.classList.remove('extreme');
            this.verticalNeedle.style.background = '#44ff44';
        }
    }

    updateMovementDisplay() {
        if (!this.forwardMovement || !this.verticalMovement) return;
        
        const movement = this.calculateMovement();
        const smoothedMovement = this.smoothMovementValues(movement);
        
        // Update forward/backward movement display
        const forwardValue = smoothedMovement.forward;
        this.forwardMovement.textContent = forwardValue.toFixed(2);
        
        // Color coding for forward/backward
        if (forwardValue > 0.01) {
            this.forwardMovement.style.color = '#88ff88'; // Green for forward
        } else if (forwardValue < -0.01) {
            this.forwardMovement.style.color = '#ff8888'; // Red for backward
        } else {
            this.forwardMovement.style.color = '#888888'; // Gray for stationary
        }
        
        // Update vertical movement display
        const verticalValue = smoothedMovement.vertical;
        this.verticalMovement.textContent = verticalValue.toFixed(2);
        
        // Color coding for up/down
        if (verticalValue > 0.01) {
            this.verticalMovement.style.color = '#88ff88'; // Green for up
        } else if (verticalValue < -0.01) {
            this.verticalMovement.style.color = '#ff8888'; // Red for down
        } else {
            this.verticalMovement.style.color = '#888888'; // Gray for stationary
        }
    }

    actualToDisplay(actualDegree) {
        // Convert actual degree to display degree where -150° becomes 0° for display
        let displayDegree = actualDegree - this.FRONT_DEGREE;
        
        // Normalize to -180 to 180 range
        while (displayDegree > 180) displayDegree -= 360;
        while (displayDegree < -180) displayDegree += 360;
        
        return displayDegree;
    }

    displayToActual(displayDegree) {
        // Convert display degree back to actual degree
        let actualDegree = displayDegree + this.FRONT_DEGREE;
        
        // Normalize to -180 to 180 range
        while (actualDegree > 180) actualDegree -= 360;
        while (actualDegree < -180) actualDegree += 360;
        
        return actualDegree;
    }

    degreesToPosition(degrees) {
        // Convert degrees (-180 to 180) to percentage (0% to 100%)
        return ((degrees + 180) / 360) * 100;
    }

    getCameraRotation() {
        if (!this.fileExplorer.camera) return 0;
        
        // Get camera direction vector
        const direction = new THREE.Vector3();
        this.fileExplorer.camera.getWorldDirection(direction);
        
        // Calculate angle in radians around Y axis
        let angle = Math.atan2(direction.x, direction.z);
        
        // Convert to degrees and normalize to -180 to 180
        let degrees = THREE.MathUtils.radToDeg(angle);
        
        // Normalize to -180 to 180 range
        while (degrees > 180) degrees -= 360;
        while (degrees < -180) degrees += 360;
        
        return degrees;
    }

    getDirectionText(displayDegree) {
        const absDeg = Math.abs(displayDegree);
        
        if (absDeg <= 22.5) return 'FRONT';
        if (absDeg >= 157.5) return 'REAR';
        if (displayDegree > 22.5 && displayDegree < 67.5) return 'F-RIGHT';
        if (displayDegree >= 67.5 && displayDegree <= 112.5) return 'RIGHT';
        if (displayDegree > 112.5 && displayDegree < 157.5) return 'R-RIGHT';
        if (displayDegree < -22.5 && displayDegree > -67.5) return 'F-LEFT';
        if (displayDegree <= -67.5 && displayDegree >= -112.5) return 'LEFT';
        if (displayDegree < -112.5 && displayDegree > -157.5) return 'R-LEFT';
        return 'UNKNOWN';
    }

    updateDisplay() {
        try {
            // Get actual camera rotation
            const actualRotation = this.getCameraRotation();
            this.currentActualRotation = actualRotation;
            
            // Convert to display rotation (where -150° actual = 0° display)
            const displayRotation = this.actualToDisplay(actualRotation);
            this.currentDisplayRotation = displayRotation;
            
            // Get camera pitch (vertical angle)
            const pitch = this.getCameraPitch();
            this.currentPitchAngle = pitch;
            
            // Get direction text based on display rotation
            const direction = this.getDirectionText(displayRotation);
            
            // Update direction window
            this.directionText.textContent = direction;
            this.degreeText.textContent = `${displayRotation.toFixed(1)}°`;
            
            // Update moving pin position based on DISPLAY rotation (not actual)
            const displayPosition = this.degreesToPosition(displayRotation);
            this.centerPinMoving.style.left = displayPosition + '%';
            
            // Update vertical display
            this.updateVerticalDisplay();
            
            // Update movement display
            this.updateMovementDisplay();
            
            // Update tooltip with comprehensive information
            this.ringElement.title = 
                `Direction: ${direction} | ` +
                `Display: ${displayRotation.toFixed(1)}° | ` +
                `Actual: ${actualRotation.toFixed(1)}° | ` +
                `Pitch: ${pitch.toFixed(1)}°`;
            
            // Add visual feedback
            this.updateVisualFeedback(displayRotation);
            
        } catch (error) {
            console.warn('Error updating navigation ring:', error);
        }
    }

    updateVisualFeedback(displayRotation) {
        // Pulse the direction window
        const pulseIntensity = 0.7 + Math.sin(Date.now() * 0.005) * 0.2;
        this.directionWindow.style.boxShadow = `0 0 25px rgba(0, 255, 255, ${pulseIntensity})`;
        
        // Update moving pin color based on display position
        const absDisplay = Math.abs(displayRotation);
        if (absDisplay <= 30) {
            this.centerPinMoving.style.background = '#44ff44'; // Green near front
            this.centerPinMoving.style.boxShadow = '0 0 15px #44ff44';
        } else {
            this.centerPinMoving.style.background = '#ff8844'; // Orange elsewhere
            this.centerPinMoving.style.boxShadow = '0 0 12px #ff8844';
        }
    }

    animate() {
        this.updateDisplay();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when the file explorer is ready
let navigationRing = null;

function initNavigationRing(fileExplorer) {
    if (!navigationRing && fileExplorer && fileExplorer.camera) {
        navigationRing = new NavigationRing(fileExplorer);
        console.log('Navigation Ring created successfully');
    }
    return navigationRing;
}

// Auto-initialize when FileExplorer is available
let initAttempts = 0;
const maxInitAttempts = 50;

function attemptInit() {
    if (window.fileExplorerInstance && window.fileExplorerInstance.camera) {
        initNavigationRing(window.fileExplorerInstance);
    } else if (initAttempts < maxInitAttempts) {
        initAttempts++;
        setTimeout(attemptInit, 100);
    } else {
        console.warn('Failed to initialize Navigation Ring: FileExplorer not available');
    }
}

// Start initialization attempt
setTimeout(attemptInit, 1000);

// Export for use in other files
window.NavigationRing = NavigationRing;
window.initNavigationRing = initNavigationRing;