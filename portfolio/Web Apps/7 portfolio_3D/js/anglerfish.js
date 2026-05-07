class AnglerFish {
    constructor(fileExplorer) {
        this.fileExplorer = fileExplorer;
        this.isActive = false;
        this.isAnimating = false;
        this.isLeaving = false;
        this.lightIntensity = 0;
        this.maxLightIntensity = 3.0;
        this.fishElement = null;
        this.lightButton = null;
        this.enterFrames = [];
        this.idleFrames = [];
        this.leaveFrames = [];
        this.currentFrame = 0;
        this.animationInterval = null;
        this.messageElement = null;
        this.speechBubble = null;
        this.init();
    }
    init() {
        this.preloadFrames();
        this.createLightButton();
        this.createFishElement();
        this.createMessageElement();
        this.setupEventListeners();
    }
    preloadFrames() {
        this.enterFrames = ['images/6.png', 'images/5.png', 'images/4.png'];
        this.idleFrames = ['images/4.png'];
        this.leaveFrames = ['images/4.png', 'images/5.png', 'images/6.png'];
        const allFrames = [...this.enterFrames, ...this.idleFrames, ...this.leaveFrames];
        let loadedCount = 0;
        allFrames.forEach((frame) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === allFrames.length) {
                    this.completePreloadAnimation();
                }
            };
            img.onerror = () => {
                loadedCount++;
                console.error(`Failed to load frame: ${frame}`);
                if (loadedCount === allFrames.length) {
                    this.completePreloadAnimation();
                }
            };
            img.src = frame;
        });
        this.completePreloadAnimation();
    }
    createLightButton() {
        this.lightButton = document.createElement('div');
        this.lightButton.id = 'light-fish-button';
        this.lightButton.innerHTML = `
            <div class="light-button-content">
                <span class="light-icon">💡</span>
                <span class="light-text">Accessing a deeper directory will get the screen darker, Request light fish?</span>
            </div>
        `;
        
        this.lightButton.style.position = 'fixed';
        this.lightButton.style.bottom = '20px';
        this.lightButton.style.right = '20px';
        this.lightButton.style.padding = '15px 20px';
        this.lightButton.style.background = 'rgba(0, 40, 80, 0.8)';
        this.lightButton.style.border = '2px solid #00b7ff';
        this.lightButton.style.borderRadius = '10px';
        this.lightButton.style.color = 'white';
        this.lightButton.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        this.lightButton.style.fontSize = '14px';
        this.lightButton.style.cursor = 'pointer';
        this.lightButton.style.zIndex = '1000';
        this.lightButton.style.boxShadow = '0 0 15px rgba(0, 183, 255, 0.5)';
        this.lightButton.style.display = 'none';
        this.lightButton.style.transition = 'all 0.3s ease';
        this.lightButton.style.backdropFilter = 'blur(5px)';
        
        this.lightButton.addEventListener('mouseenter', () => {
            this.lightButton.style.background = 'rgba(0, 60, 120, 0.9)';
            this.lightButton.style.boxShadow = '0 0 20px rgba(0, 183, 255, 0.8)';
            this.lightButton.style.transform = 'scale(1.05)';
        });
        
        this.lightButton.addEventListener('mouseleave', () => {
            this.lightButton.style.background = 'rgba(0, 40, 80, 0.8)';
            this.lightButton.style.boxShadow = '0 0 15px rgba(0, 183, 255, 0.5)';
            this.lightButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(this.lightButton);
    }
    createFishElement() {
        this.fishElement = document.createElement('div');
        this.fishElement.id = 'angler-fish';
        this.fishElement.style.position = 'fixed';
        this.fishElement.style.width = '120px';
        this.fishElement.style.height = '80px';
        this.fishElement.style.backgroundSize = 'contain';
        this.fishElement.style.backgroundRepeat = 'no-repeat';
        this.fishElement.style.backgroundPosition = 'center';
        this.fishElement.style.zIndex = '500';
        this.fishElement.style.right = '-150px';
        this.fishElement.style.top = '80px';
        this.fishElement.style.transition = 'right 2s ease-in-out, transform 0.5s ease';
        this.fishElement.style.filter = 'drop-shadow(0 0 25px rgba(255, 220, 80, 0.9))';
        this.fishElement.style.display = 'none';
        this.fishElement.style.cursor = 'pointer';
        document.body.appendChild(this.fishElement);
    }
    completePreloadAnimation() {
    }
    createMessageElement() {
        this.speechBubble = document.createElement('div');
        this.speechBubble.id = 'fish-speech-bubble';
        this.speechBubble.style.position = 'fixed';
        this.speechBubble.style.zIndex = '501';
        this.speechBubble.style.display = 'none';
        this.speechBubble.style.opacity = '0';
        this.speechBubble.style.transition = 'opacity 0.5s ease';
        this.messageElement = document.createElement('div');
        this.messageElement.id = 'fish-message';
        this.messageElement.textContent = 'leave?';
        this.messageElement.style.color = 'white';
        this.messageElement.style.background = 'rgba(0, 30, 60, 0.9)';
        this.messageElement.style.padding = '8px 12px';
        this.messageElement.style.borderRadius = '12px';
        this.messageElement.style.border = '2px solid #00b7ff';
        this.messageElement.style.fontSize = '14px';
        this.messageElement.style.fontWeight = 'bold';
        this.messageElement.style.boxShadow = '0 0 15px rgba(0, 183, 255, 0.7)';
        this.messageElement.style.cursor = 'pointer';
        const pointer = document.createElement('div');
        pointer.style.width = '0';
        pointer.style.height = '0';
        pointer.style.borderLeft = '8px solid transparent';
        pointer.style.borderRight = '8px solid transparent';
        pointer.style.borderTop = '10px solid #00b7ff';
        pointer.style.position = 'absolute';
        pointer.style.bottom = '-8px';
        pointer.style.left = '50%';
        pointer.style.transform = 'translateX(-50%)';
        this.speechBubble.appendChild(this.messageElement);
        this.speechBubble.appendChild(pointer);
        document.body.appendChild(this.speechBubble);
    }
    setupEventListeners() {
        this.lightButton.addEventListener('click', () => {
            this.activateFish();
        });
        
        this.fishElement.addEventListener('click', () => {
            if (this.isActive && !this.isAnimating) {
                this.deactivate();
            }
        });
        
        this.messageElement.addEventListener('click', () => {
            if (this.isActive && !this.isAnimating) {
                this.deactivate();
            }
        });
        
        this.fishElement.addEventListener('mouseenter', () => {
            if (this.isActive && !this.isAnimating) {
                this.showMessage();
            }
        });
        
        this.fishElement.addEventListener('mouseleave', () => {
            this.hideMessage();
        });
        
        this.monitorDepth();
    }
    monitorDepth() {
        setInterval(() => {
            const depthLevel = this.fileExplorer.depthLevel;
            if (depthLevel >= 2 && !this.isActive && !this.isAnimating) {
                this.showButton();
            } else if (depthLevel < 2 && this.lightButton.style.display !== 'none') {
                this.hideButton();
            }
            if (depthLevel >= 3) {
                const intensity = 0.5 + (depthLevel - 3) * 0.2;
                this.lightButton.style.boxShadow = `0 0 ${15 + intensity * 10}px rgba(0, 183, 255, ${0.5 + intensity * 0.3})`;
            }
        }, 1000);
    }
    showButton() {
        this.lightButton.style.display = 'block';
        setTimeout(() => {
            this.lightButton.style.opacity = '1';
            this.lightButton.style.transform = 'translateY(0)';
        }, 10);
    }
    hideButton() {
        this.lightButton.style.opacity = '0';
        this.lightButton.style.transform = 'translateY(20px)';
        setTimeout(() => {
            this.lightButton.style.display = 'none';
        }, 300);
    }
    showMessage() {
        if (!this.isActive || this.isAnimating) return;
        const fishRect = this.fishElement.getBoundingClientRect();
        this.speechBubble.style.left = `${fishRect.left - 50}px`;
        this.speechBubble.style.top = `${fishRect.top - 40}px`;
        this.speechBubble.style.display = 'block';
        setTimeout(() => {
            this.speechBubble.style.opacity = '1';
        }, 10);
    }
    hideMessage() {
        this.speechBubble.style.opacity = '0';
        setTimeout(() => {
            this.speechBubble.style.display = 'none';
        }, 500);
    }
    activateFish() {
        if (this.isAnimating) return;   
        this.isAnimating = true;
        this.hideButton();
        this.fishElement.style.display = 'block';
        this.playEnterAnimation();
    }
    playEnterAnimation() {
        let frameIndex = 0;
        this.fishElement.style.right = '20px';
        const enterInterval = setInterval(() => {
            if (frameIndex < this.enterFrames.length) {
                this.fishElement.style.backgroundImage = `url('${this.enterFrames[frameIndex]}')`;
                frameIndex++;
            } else {
                clearInterval(enterInterval);
                this.fishElement.style.backgroundImage = `url('${this.idleFrames[0]}')`;
                this.addFishLight();
                setTimeout(() => {
                    this.isActive = true;
                    this.isAnimating = false;
                    this.startIdleAnimation();
                    this.makeAllFilesShimmer();
                }, 500);
            }
        }, 200);
    }
    startIdleAnimation() {
        this.animationInterval = setInterval(() => {
            const floatOffset = Math.sin(Date.now() * 0.002) * 5;
            this.fishElement.style.transform = `translateY(${floatOffset}px)`;
        }, 200);
    }
    playLeaveAnimation() {
        let frameIndex = 0;
        clearInterval(this.animationInterval);
        const leaveInterval = setInterval(() => {
            if (frameIndex < this.leaveFrames.length) {
                this.fishElement.style.backgroundImage = `url('${this.leaveFrames[frameIndex]}')`;
                frameIndex++;
            } else {
                clearInterval(leaveInterval);
                this.fishElement.style.display = 'none';
                this.isLeaving = false;
                this.isAnimating = false;
                this.isActive = false;
            }
        }, 200);
        this.fishElement.style.right = '-150px';
    }
    addFishLight() {
        const centerPosition = this.calculateDirectoryCenter();
        this.fishLight = new THREE.PointLight(0xffcc00, 0, 30, 1.5);
        this.fishLight.position.copy(centerPosition);
        this.fileExplorer.scene.add(this.fishLight);
        const lightSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0, 0, 0),
            new THREE.MeshBasicMaterial({ 
                color: 0xffcc00,
                transparent: true, 
                opacity: 0.6
            })
        );
        lightSphere.position.copy(centerPosition);
        this.fileExplorer.scene.add(lightSphere);
        this.lightSphere = lightSphere;
        this.lightPosition = centerPosition.clone();
        this.setupDirectoryChangeListener();
        const startTime = Date.now();
        const animateLight = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / 1500, 1);
            this.lightIntensity = progress * this.maxLightIntensity;
            this.fishLight.intensity = this.lightIntensity;
            if (this.lightSphere) {
                this.lightSphere.material.opacity = 0.6 * progress;
                this.lightSphere.scale.set(1 + progress * 0.5, 1 + progress * 0.5, 1 + progress * 0.5);
            }
            if (progress < 1) {
                requestAnimationFrame(animateLight);
            }
        };
        animateLight();
    }
    calculateDirectoryCenter() {
        const fileObjects = this.fileExplorer.fileObjects.children;
        if (fileObjects.length === 0) {
            return new THREE.Vector3(0, 0, 0);
        }
        const center = new THREE.Vector3();
        let count = 0;
        fileObjects.forEach(obj => {
            center.add(obj.position);
            count++;
        });
        center.divideScalar(count);
        center.y += 2;
        return center;
    }
    setupDirectoryChangeListener() {
        const originalCreateFileObjects = this.fileExplorer.createFileObjects.bind(this.fileExplorer);
        const originalNavigateToPath = this.fileExplorer.navigateToPath.bind(this.fileExplorer);
        const originalGoBack = this.fileExplorer.goBack.bind(this.fileExplorer);
        this.fileExplorer.createFileObjects = (items) => {
            const result = originalCreateFileObjects(items);
            setTimeout(() => {
                this.updateLightPosition();
            }, 100);
            return result;
        };
        this.fileExplorer.navigateToPath = async (path) => {
            await originalNavigateToPath(path);
            setTimeout(() => {
                this.updateLightPosition();
            }, 100);
        };
        this.fileExplorer.goBack = async () => {
            await originalGoBack();
            setTimeout(() => {
                this.updateLightPosition();
            }, 100);
        };
    }
    updateLightPosition() {
        if (!this.isActive || !this.fishLight || !this.lightSphere) return;
        const newCenter = this.calculateDirectoryCenter();
        const startPosition = this.lightPosition.clone();
        const endPosition = newCenter;
        const startTime = Date.now();
        const duration = 1000;
        const animateMovement = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInOutCubic(progress);
            this.lightPosition.lerpVectors(startPosition, endPosition, easeProgress);
            this.fishLight.position.copy(this.lightPosition);
            this.lightSphere.position.copy(this.lightPosition);
            if (progress < 1) {
                requestAnimationFrame(animateMovement);
            }
        };
        animateMovement();
    }
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    deactivate() {
        if (!this.isActive || this.isAnimating) return;
        this.isAnimating = true;
        this.isLeaving = true;
        this.hideMessage();
        clearInterval(this.animationInterval);
        this.removeDirectoryChangeListeners();
        this.playLeaveAnimation();
        const startIntensity = this.lightIntensity;
        const startTime = Date.now();
        const animateLightOut = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / 1000, 1);
            this.lightIntensity = startIntensity * (1 - progress);
            this.fishLight.intensity = this.lightIntensity;
            if (this.lightSphere) {
                this.lightSphere.material.opacity = 0.6 * (1 - progress);
            }
            if (progress < 1) {
                requestAnimationFrame(animateLightOut);
            } else {
                this.fileExplorer.scene.remove(this.fishLight);
                if (this.lightSphere) {
                    this.fileExplorer.scene.remove(this.lightSphere);
                    this.lightSphere = null;
                }
                this.restoreAllFilesMaterials();
            }
        };
        animateLightOut();
    }
    removeDirectoryChangeListeners() {
        if (this.fileExplorer.originalCreateFileObjects) {
            this.fileExplorer.createFileObjects = this.fileExplorer.originalCreateFileObjects;
        }
        if (this.fileExplorer.originalNavigateToPath) {
            this.fileExplorer.navigateToPath = this.fileExplorer.originalNavigateToPath;
        }
        if (this.fileExplorer.originalGoBack) {
            this.fileExplorer.goBack = this.fileExplorer.originalGoBack;
        }
    }
    makeAllFilesShimmer() {
        const findAllFileObjects = (object, result = []) => {
            if (object.userData && object.userData.itemData) {
                result.push(object);
            }
            if (object.children) {
                for (let i = 0; i < object.children.length; i++) {
                    findAllFileObjects(object.children[i], result);
                }
            }
            return result;
        };
        const allFileObjects = findAllFileObjects(this.fileExplorer.scene);
        allFileObjects.forEach(obj => {
            const originalMaterial = obj.material;
            const shimmerMaterial = originalMaterial.clone();
            shimmerMaterial.emissive = new THREE.Color(0xffff00);
            shimmerMaterial.emissiveIntensity = 0.7;
            shimmerMaterial.color.r *= 1.5;
            shimmerMaterial.color.g *= 1.5;
            shimmerMaterial.color.b *= 1.5;
            obj.userData.originalMaterial = originalMaterial;
            obj.material = shimmerMaterial;
            let shimmerPhase = 0;
            const shimmer = () => {
                if (!this.isActive) {
                    obj.material = obj.userData.originalMaterial;
                    return;
                }
                shimmerPhase += 0.05;
                const intensity = 0.4 + 0.3 * Math.sin(shimmerPhase);
                shimmerMaterial.emissiveIntensity = intensity;
                requestAnimationFrame(shimmer);
            };
            shimmer();
        });
    }
    restoreAllFilesMaterials() {
        const findAllFileObjects = (object, result = []) => {
            if (object.userData && object.userData.itemData) {
                result.push(object);
            }
            if (object.children) {
                for (let i = 0; i < object.children.length; i++) {
                    findAllFileObjects(object.children[i], result);
                }
            }
            return result;
        };
        const allFileObjects = findAllFileObjects(this.fileExplorer.scene);
        allFileObjects.forEach(obj => {
            if (obj.userData.originalMaterial) {
                obj.material = obj.userData.originalMaterial;
            }
        });
    }
    update() {
        if (this.isActive && this.fishLight) {
            const pulseIntensity = this.maxLightIntensity + 0.3 * Math.sin(Date.now() * 0.002);
            this.fishLight.intensity = pulseIntensity;
            if (this.lightSphere) {
                this.lightSphere.scale.set(
                    1 + 0.1 * Math.sin(Date.now() * 0.002),
                    1 + 0.1 * Math.sin(Date.now() * 0.002),
                    1 + 0.1 * Math.sin(Date.now() * 0.002)
                );
            }
        }
    }
}
const anglerfishStyles = `
    #angler-fish {
        animation: fish-glow 2s infinite ease-in-out;
        transition: all 0.5s ease;
    }
    @keyframes fish-glow {
        0% { filter: drop-shadow(0 0 25px rgba(255, 220, 80, 0.8)); }
        50% { filter: drop-shadow(0 0 35px rgba(255, 240, 100, 1)); }
        100% { filter: drop-shadow(0 0 25px rgba(255, 220, 80, 0.8)); }
    }
    #fish-speech-bubble {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    #fish-message {
        font-weight: bold;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = anglerfishStyles;
document.head.appendChild(styleSheet);