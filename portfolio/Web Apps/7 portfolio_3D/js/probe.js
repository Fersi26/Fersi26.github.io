class SearchInterface {
    constructor(fileExplorer) {
            this.fileExplorer = fileExplorer;
        this.isVisible = false;
        this.currentResults = [];
        this.init();
    }

    init() {
        // Create search container if it doesn't exist
        if (!document.getElementById('search-container')) {
            this.createSearchInterface();
        }
        
        this.setupEventListeners();
    }

    createSearchInterface() {
        const searchHTML = `
            <div id="search-container">
                <div id="search-box">
                    <input type="text" id="search-input" placeholder="Search files and folders..." />
                    <button id="search-button">🔍</button>
                    <button id="close-search">×</button>
                </div>
                <div id="search-results">
                    <div id="search-results-header">
                        <h4>Search Results</h4>
                        <span id="search-count">0 results</span>
                    </div>
                    <div id="search-results-list"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', searchHTML);
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const closeButton = document.getElementById('close-search');
        const searchContainer = document.getElementById('search-container');

        // Open search with Ctrl+F or F1
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey && e.key === 'f') || e.key === 'F1') {
                e.preventDefault();
                this.show();
            }
            // Close with Escape
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        // Search button click
        searchButton.addEventListener('click', () => {
            this.performSearch();
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Close button
        closeButton.addEventListener('click', () => {
            this.hide();
        });

        // Real-time search as user types (with debounce)
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                this.clearResults();
                return;
            }

            if (query.length >= 2) { // Only search with 2+ characters
                searchTimeout = setTimeout(() => {
                    this.performSearch();
                }, 300);
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isVisible && !searchContainer.contains(e.target)) {
                this.hide();
            }
        });
    }

    show() {
        const searchContainer = document.getElementById('search-container');
        const searchInput = document.getElementById('search-input');
        
        searchContainer.classList.add('active');
        searchInput.focus();
        this.isVisible = true;
        
        // Show controls help
        document.getElementById('controls-help').style.display = 'block';
    }

    hide() {
        const searchContainer = document.getElementById('search-container');
        const searchInput = document.getElementById('search-input');
        
        searchContainer.classList.remove('active');
        searchInput.value = '';
        this.clearResults();
        this.isVisible = false;
    }

 async performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (!query) {
        this.clearResults();
        return;
    }

    this.showLoading();

    try {
        // FIX: Use the correct API base URL
        const apiBase = window.location.origin; // This will get the current origin
        const response = await fetch(`${apiBase}/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            this.displayResults(data.results, query);
        } else {
            this.showError(data.error);
        }
    } catch (error) {
        console.error('Search error:', error);
        this.showError('Search failed: ' + error.message);
    }
}
    showLoading() {
        const resultsList = document.getElementById('search-results-list');
        const countElement = document.getElementById('search-count');
        
        resultsList.innerHTML = '<div class="search-loading">Searching...</div>';
        countElement.textContent = 'Searching...';
        
        // Show results container
        document.getElementById('search-results').style.display = 'block';
    }

    displayResults(results, query) {
        const resultsList = document.getElementById('search-results-list');
        const countElement = document.getElementById('search-count');
        
        this.currentResults = results;
        
        if (results.length === 0) {
            resultsList.innerHTML = `
                <div class="no-results">
                    No results found for "<strong>${query}</strong>"
                </div>
            `;
            countElement.textContent = '0 results';
        } else {
            resultsList.innerHTML = results.map(result => this.createResultItem(result)).join('');
            countElement.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
        }
        
        // Show results container
        document.getElementById('search-results').style.display = 'block';
        
        // Add click handlers to result items
        this.addResultClickHandlers();
    }

createResultItem(result) {
    const icon = result.is_dir ? '📁' : this.getFileIcon(result.name);
    const type = result.is_dir ? 'Folder' : this.getFileType(result.name);
    const path = result.path || '';
    
    return `
        <div class="search-result-item" data-path="${result.path}" data-is-dir="${result.is_dir}">
            <span class="search-result-icon">${icon}</span>
            <span class="search-result-name">${result.name}</span>
            <span class="search-result-path">${path}</span>
            <span class="search-result-type">${type}</span>
        </div>
    `;
}

addResultClickHandlers() {
    const resultItems = document.querySelectorAll('.search-result-item');
    
    resultItems.forEach(item => {
        item.addEventListener('click', () => {
            const path = item.getAttribute('data-path');
            const isDir = item.getAttribute('data-is-dir') === 'true';
            
            if (isDir) {
                // For folders: navigate directly to the path
                this.navigateToResult(path);
            } else {
                // For files: find the file object and show hologram info
                this.showFileHologram(path);
            }
        });
    });
}

// Add this new method to handle file hologram display
showFileHologram(filePath) {
    if (!filePath) return;
    
    // Hide search interface first
    this.hide();
    
    // Extract directory path and filename
    const lastSlashIndex = filePath.lastIndexOf('/');
    const directoryPath = lastSlashIndex === -1 ? '' : filePath.substring(0, lastSlashIndex);
    const fileName = lastSlashIndex === -1 ? filePath : filePath.substring(lastSlashIndex + 1);
    
    // Navigate to the directory first
    if (directoryPath && this.fileExplorer && typeof this.fileExplorer.navigateToPath === 'function') {
        // Use a small delay to ensure navigation completes
        this.fileExplorer.navigateToPath(directoryPath).then(() => {
            // After navigation, find and select the file
            setTimeout(() => {
                this.findAndSelectFile(fileName);
            }, 500);
        });
    } else {
        // If already in the correct directory or no navigation needed
        setTimeout(() => {
            this.findAndSelectFile(fileName);
        }, 100);
    }
}

// Add this method to find the file object and trigger hologram
findAndSelectFile(fileName) {
    if (!this.fileExplorer || !this.fileExplorer.fileObjects) return;
    
    // Search through current file objects
    const fileObjects = this.fileExplorer.fileObjects.children;
    for (let child of fileObjects) {
        if (child.userData && child.userData.itemData) {
            const itemData = child.userData.itemData;
            if (itemData.name === fileName && !itemData.is_dir) {
                // Found the file - show hologram info
                if (typeof this.fileExplorer.showHolographicInfo === 'function') {
                    this.fileExplorer.showHolographicInfo(itemData, child);
                }
                return;
            }
        }
    }
    
    // If file not found, show error
    console.warn('File not found in current directory:', fileName);
}

navigateToResult(path) {
    if (!path) return;
    
    // Hide search interface
    this.hide();
    
    // Extract directory path from file path
    const directoryPath = this.extractDirectoryPath(path);
    
    // Check if navigateToPath exists and call it
    if (this.fileExplorer && typeof this.fileExplorer.navigateToPath === 'function') {
        this.fileExplorer.navigateToPath(directoryPath);
    } else {
        console.error('navigateToPath method not available on fileExplorer');
        // Enhanced fallback: try multiple ways to find the file explorer
        if (window.fileExplorerInstance && typeof window.fileExplorerInstance.navigateToPath === 'function') {
            window.fileExplorerInstance.navigateToPath(directoryPath);
        } else {
            console.error('No file explorer instance found for navigation');
            // Last resort: try to trigger navigation through the global scope
            this.triggerNavigationFallback(directoryPath);
        }
    }
}

// Add this helper method to extract directory path
extractDirectoryPath(fullPath) {
    if (!fullPath) return '';
    
    // Remove the filename from the path
    const lastSlashIndex = fullPath.lastIndexOf('/');
    if (lastSlashIndex === -1) {
        return ''; // No directory, just a filename
    }
    
    return fullPath.substring(0, lastSlashIndex);
}

// Add this fallback method
triggerNavigationFallback(path) {
    console.log('Attempting fallback navigation to:', path);
    
    // Try to find any file explorer instance in the global scope
    for (let key in window) {
        if (window[key] && typeof window[key].navigateToPath === 'function') {
            console.log('Found file explorer instance at:', key);
            window[key].navigateToPath(path);
            return;
        }
    }
    
    // If all else fails, show an error
    alert(`Cannot navigate to: ${path}\nFile explorer not available.`);
}

    findObjectByPath(path) {
        // Search through current file objects
        if (this.fileExplorer.fileObjects) {
            for (let child of this.fileExplorer.fileObjects.children) {
                if (child.userData && child.userData.itemData) {
                    const itemData = child.userData.itemData;
                    if (itemData.path === path || itemData.name === path) {
                        return child;
                    }
                }
            }
        }
        return null;
    }

   getFileIcon(filename) {
    return getFileIcon(filename, false); // false indicates it's not a directory
}

    getFileType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return ext ? ext.toUpperCase() : 'File';
    }

    clearResults() {
        const resultsList = document.getElementById('search-results-list');
        const countElement = document.getElementById('search-count');
        
        resultsList.innerHTML = '';
        countElement.textContent = '0 results';
        document.getElementById('search-results').style.display = 'none';
        this.currentResults = [];
    }

    showError(message) {
        const resultsList = document.getElementById('search-results-list');
        const countElement = document.getElementById('search-count');
        
        resultsList.innerHTML = `<div class="no-results" style="color: #ff6b6b;">${message}</div>`;
        countElement.textContent = 'Error';
        document.getElementById('search-results').style.display = 'block';
    }
}
class AnglerFish {
    constructor(fileExplorer) {
        this.fileExplorer = fileExplorer;
        this.isActive = false;
        this.isAnimating = false;
        this.isLeaving = false;
        this.lightIntensity = 0;
        this.maxLightIntensity = 6.0;
        this.fishElement = null;
        this.lightButton = null;
        this.enterFrames = [];
        this.idleFrames = [];
        this.leaveFrames = [];
        this.currentFrame = 0;
        this.animationInterval = null;
        this.messageElement = null;
        this.speechBubble = null;
        
        // FIX: Pass the actual fileExplorer instance, not 'this'
        this.searchInterface = new SearchInterface(this.fileExplorer);
        
        this.init();
    }
    init() {
        this.preloadFrames();
        this.createLightButton();
        this.createFishElement();
        this.createMessageElement();
        this.setupEventListeners();
    }
activateSearch() {
    // Remove the condition that checks isActive and isAnimating
    // This allows search to work regardless of probe state
    if (this.searchInterface) {
        this.searchInterface.show();
    }
    return true;
}
    preloadFrames() {
        this.enterFrames = ['images/3.png', 'images/2.png', 'images/1.png'];
        this.idleFrames = ['images/1.png'];
        this.leaveFrames = ['images/1.png', 'images/2.png', 'images/3.png'];
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
                <span class="light-icon">🛰️</span>
                <span class="light-text">Request light probe?</span>
            </div>
        `;
        
        
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
        this.fishElement.style.filter = 'drop-shadow(0 0 25px rgba(80, 252, 255, 0.9))';
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
        this.fishLight = new THREE.PointLight(0x4fc3f7, 0, 30, 1.5);
        this.fishLight.position.copy(centerPosition);
        this.fileExplorer.scene.add(this.fishLight);
        const lightSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0, 0, 0),
            new THREE.MeshBasicMaterial({ 
                color: 0x4fc3f7,
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
          // Change this value

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
            this.lightIntensity = startIntensity * (5 - progress);
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
            const pulseIntensity = this.maxLightIntensity + 10 * Math.sin(Date.now() * 0.002);
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
        0% { filter: drop-shadow(0 0 25px rgba(80, 238, 255, 0.8)); }
        50% { filter: drop-shadow(0 0 35px rgba(100, 242, 255, 1)); }
        100% { filter: drop-shadow(0 0 25px rgba(80, 252, 255, 0.8)); }
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