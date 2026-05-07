class LoadingText {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.error(`Element with id "${elementId}" not found`);
            return;
        }
        this.options = {
            text: options.text || 'Loading...',
            speed: options.speed || 100,
            delay: options.delay || 50,
            cursor: options.cursor || '_',
            ...options
        };
        this.currentIndex = 0;
        this.isAnimating = false;
        this.onCompleteCallback = options.onComplete || null;
        this.initialize();
    }
    initialize() {
        this.element.style.fontFamily = 'monospace';
        this.element.style.color = '#00ff00';
        this.element.style.whiteSpace = 'pre';
        this.element.textContent = '';
    }
    start() {
        if (this.isAnimating) return;   
        this.isAnimating = true;
        this.currentIndex = 0;
        this.element.textContent = '';
        this.animateText();
    }
    stop() {
        this.isAnimating = false;
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }
    }
    animateText() {
        if (!this.isAnimating || this.currentIndex > this.options.text.length) {
            if (this.isAnimating) {
                this.element.textContent = this.options.text + (this.currentIndex % 2 === 0 ? this.options.cursor : ' ');
                if (this.animationTimeout) {
                    clearTimeout(this.animationTimeout);
                }
                this.animationTimeout = setTimeout(() => this.animateText(), 500);                
                if (this.onCompleteCallback && this.currentIndex === this.options.text.length + 1) {
                    this.onCompleteCallback();
                }
            }
            return;
        }
        const displayText = this.options.text.substring(0, this.currentIndex) + 
                          (this.currentIndex % 2 === 0 ? this.options.cursor : ' ');
        this.element.textContent = displayText;
        this.currentIndex++;
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }        
        this.animationTimeout = setTimeout(() => {
            this.animateText();
        }, this.options.delay);
    }
    complete() {
        this.stop();
        this.element.textContent = this.options.text;   
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
        }
    }
    setText(newText) {
        this.options.text = newText;
        this.stop();
        this.start();
    }
}
class AutoFocusController {
    constructor(fileExplorer) {
        this.fileExplorer = fileExplorer;
        this.targetFileName = 'INTRODUCTION.txt';
        this.hasFocused = false;
        this.defaultCameraPosition = new THREE.Vector3(0, 5, 15);
        this.defaultCameraTarget = new THREE.Vector3(0, 0, 0);
        this.isAnimating = false;
        this.cameraOffsetY = 0;
    }
checkAndFocus() {
    if (this.hasFocused || !this.fileExplorer.fileObjects || this.fileExplorer.fileObjects.children.length === 0) return;
    if (this.fileExplorer.depthLevel !== 0) {
        this.hideLoadingScreen();
        return;
    }    
    const files = this.fileExplorer.fileObjects.children;
    let targetFile = null;    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.userData.itemData && 
            !file.userData.itemData.is_dir && 
            file.userData.itemData.name === this.targetFileName) {
            targetFile = file;
            break;
        }
    }
    if (targetFile) {
        this.positionCameraAt180Degrees(targetFile, () => {
            this.focusOnFile(targetFile);
            this.hasFocused = true;            
            this.hideLoadingScreen();
        });
    } else {
        this.animateToDefaultPosition();        
        this.hideLoadingScreen();
    }
}
hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const statusMessage = document.getElementById('status-message');    
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            if (statusMessage) {
                statusMessage.style.display = 'none';
            }
        }, 500);
    } else if (statusMessage) {
        statusMessage.style.display = 'none';
    }
}
animateToDefaultPosition() {
    if (this.isAnimating) return;   
    this.isAnimating = true;
    this.cameraOffsetY = 0;
    const startPosition = this.fileExplorer.camera.position.clone();
    const startTarget = this.fileExplorer.controls.target.clone();
    const endPosition = this.defaultCameraPosition.clone();
    const endTarget = this.defaultCameraTarget.clone();
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = this.easeOutCubic(progress);
        this.fileExplorer.camera.position.lerpVectors(
            startPosition, 
            endPosition, 
            easeProgress
        );
        const lookAtTarget = new THREE.Vector3();
        lookAtTarget.lerpVectors(
            startTarget, 
            endTarget, 
            easeProgress
        );        
        this.fileExplorer.controls.target.copy(lookAtTarget);
        this.fileExplorer.controls.update();
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            this.isAnimating = false;
            this.hideLoadingScreen();
        }
    };    
    animate();
}
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    positionCameraAt180Degrees(fileMesh, onComplete) {
        const filePosition = fileMesh.position.clone();        
        const startPosition = this.fileExplorer.camera.position.clone();
        const startTarget = this.fileExplorer.controls.target.clone();        
        this.fileExplorer.camera.lookAt(filePosition);
        this.fileExplorer.controls.target.copy(filePosition);
        this.fileExplorer.controls.update();
        if (onComplete) {
            setTimeout(onComplete, 0);
        }
    }
    focusOnFile(fileMesh) {
        const filePosition = fileMesh.position.clone();        
        const startPosition = new THREE.Vector3(
            filePosition.x + 50,   
            filePosition.y - 50,   
            filePosition.z - 50  
        );
        const startTarget = this.fileExplorer.controls.target.clone();
        const mediumOrbitPosition = new THREE.Vector3(
            filePosition.x + 10,  
            filePosition.y + 6,    
            filePosition.z + 10    
        );
        const zoomFactor = 1.5;
        const closeViewPosition = new THREE.Vector3(
            filePosition.x * zoomFactor,
            filePosition.y * zoomFactor,
            filePosition.z * zoomFactor
        );
        this.animateCameraPath([
            {position: startPosition, lookAt: startTarget, duration: 2000},
            {position: mediumOrbitPosition, lookAt: filePosition, duration: 1500},
            {position: closeViewPosition, lookAt: filePosition, duration: 1000},
        ], () => {
            setTimeout(() => {
                this.fileExplorer.showHolographicInfo(fileMesh.userData.itemData, fileMesh);                
                const originalHideHologram = this.fileExplorer.hideHologram.bind(this.fileExplorer);
                this.fileExplorer.hideHologram = () => {
                    originalHideHologram();
                    this.animateToDefaultPosition();
                    this.fileExplorer.hideHologram = originalHideHologram;
                };
            }, 500);
        });
    }
    animateCameraPath(pathPoints, onComplete) {
        let currentPointIndex = 0;
        const startTime = Date.now();   
        const animate = () => {
            if (currentPointIndex >= pathPoints.length - 1) {
                if (onComplete) onComplete();
                return;
            }
            const elapsed = Date.now() - startTime;
            const currentPoint = pathPoints[currentPointIndex];
            const nextPoint = pathPoints[currentPointIndex + 1];
            let totalDuration = 0;
            for (let i = 0; i <= currentPointIndex; i++) {
                totalDuration += pathPoints[i].duration;
            }            
            if (elapsed >= totalDuration) {
                currentPointIndex++;
                requestAnimationFrame(animate);
                return;
            }            
            const segmentStartTime = totalDuration - currentPoint.duration;
            const segmentElapsed = elapsed - segmentStartTime;
            const progress = Math.min(segmentElapsed / currentPoint.duration, 1);            
            const easeProgress = 1 - Math.pow(1 - progress, 3);            
            this.fileExplorer.camera.position.lerpVectors(
                currentPoint.position, 
                nextPoint.position, 
                easeProgress
            );            
            const lookAtTarget = new THREE.Vector3();
            lookAtTarget.lerpVectors(
                currentPoint.lookAt, 
                nextPoint.lookAt, 
                easeProgress
            );            
            this.fileExplorer.controls.target.copy(lookAtTarget);
            this.fileExplorer.controls.update();
            requestAnimationFrame(animate);
        };
        animate();
    }
    onDirectoryChange() {
        this.animateToDefaultPosition();
    }
}
window.AutoFocusController = AutoFocusController;