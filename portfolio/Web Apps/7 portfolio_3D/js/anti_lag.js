
class AntiLagSystem {
    constructor(fileExplorer) {
        this.fileExplorer = fileExplorer;
        this.maxFilesPerPage = 10;
        this.currentPage = 0;
        this.paginationData = {
            allItems: [],
            totalPages: 0,
            currentPage: 0
        };
        this.paginationButton = null;
        
        
        this.overrideFileCreation();
    }

    overrideFileCreation() {
        
        const originalCreateFileObjects = this.fileExplorer.createFileObjects.bind(this.fileExplorer);
        
        
        this.fileExplorer.createFileObjects = (items) => {
            this.createPaginatedFileObjects(items);
        };
    }

    createPaginatedFileObjects(items) {
        
        this.fileExplorer.clearFileObjects();
        
        if (!items || items.length === 0) {
            this.fileExplorer.showError("No files found in the directory.");
            this.paginationData = {
                allItems: [],
                totalPages: 0,
                currentPage: 0
            };
            this.cleanupPaginationButton();
            return;
        }

        
        this.paginationData = {
            allItems: items || [],
            totalPages: Math.ceil((items?.length || 0) / this.maxFilesPerPage),
            currentPage: 0
        };

        
        this.showPage(0);
        
        
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.style.display = (this.fileExplorer.currentPath !== '' || this.fileExplorer.pathHistory.length > 0) ? 'flex' : 'none';
        }
        
        
        const depthText = this.getDepthText(this.fileExplorer.depthLevel);
        const depthIndicator = document.getElementById('depth-indicator');
        if (depthIndicator) {
            depthIndicator.textContent = `Depth: ${depthText}`;
        }
    }

    showPage(pageIndex) {
        
        if (!this.paginationData || !this.paginationData.allItems) {
            console.warn('No pagination data available');
            return;
        }

        if (pageIndex < 0 || pageIndex >= (this.paginationData.totalPages || 0)) {
            console.warn('Invalid page index:', pageIndex);
            return;
        }

        this.currentPage = pageIndex;
        this.paginationData.currentPage = pageIndex;

        
        const startIndex = pageIndex * this.maxFilesPerPage;
        const endIndex = Math.min(startIndex + this.maxFilesPerPage, this.paginationData.allItems.length);
        const pageItems = this.paginationData.allItems.slice(startIndex, endIndex);

        
        this.fileExplorer.clearFileObjects();

        
        this.createFileObjectsForPage(pageItems);

        
        this.updatePaginationButton();

        
        this.updatePathDisplay();
    }

    createFileObjectsForPage(items) {
        if (!items || items.length === 0) {
            console.warn('No items to display for page');
            return;
        }

        const radius = 10;
        const angleStep = (Math.PI * 2) / items.length;
        
        items.forEach((item, index) => {
            if (!item) return;
            
            const angle = index * angleStep;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = Math.random() * 8 - 4;
            this.createFileObject(item, x, y, z);
        });
    }

    createFileObject(item, x, y, z) {
        if (!item || !this.fileExplorer.fileObjects) {
            console.warn('Invalid item or fileObjects group');
            return;
        }

        
        let geometry, material;
        
        try {
            if (item.is_dir) {
                
                geometry = new THREE.SphereGeometry(1, 32, 32);
                
                let folderColor = 0xC0C0C0;
                const startingNumberMatch = item.name?.match(/^(\d+)/);
                if (startingNumberMatch) {
                    const numberValue = parseInt(startingNumberMatch[1]);            
                    if (numberValue >= 10) {
                        folderColor = 0x990000;
                    } else if (numberValue >= 1) {
                        const intensity = numberValue / 9;
                        folderColor = this.interpolateColor(0xffa500, 0xff0000, intensity);
                    }
                }
                
                material = new THREE.MeshStandardMaterial({ 
                    color: folderColor,
                    roughness: 0.3,
                    metalness: 0.7,
                    transparent: false,
                    opacity: 1.0
                });
                
                const folderSphere = new THREE.Mesh(geometry, material);
                folderSphere.position.set(x, y, z);
                
                
                this.createSaturnRing(folderSphere, folderColor);
                
                folderSphere.castShadow = true;
                folderSphere.receiveShadow = true;
                folderSphere.userData = {
                    itemData: item,
                    clickable: true,
                    isFolder: true
                };
                
                this.fileExplorer.fileObjects.add(folderSphere);
                this.setupFloatingAnimation(folderSphere, x, y, z);
                this.createNameLabel(folderSphere, item);
                
            } else {
                
                geometry = new THREE.IcosahedronGeometry(0.6, 0);
                const fileColor = window.getColorForExtension ? 
                    window.getColorForExtension(item.name) : 0x888888;
                
                material = new THREE.MeshStandardMaterial({ 
                    color: fileColor,
                    roughness: 0.4,
                    metalness: 0.6,
                    transparent: false,
                    opacity: 1.0
                });
                
                const fileSphere = new THREE.Mesh(geometry, material);
                fileSphere.position.set(x, y, z);
                
                fileSphere.castShadow = true;
                fileSphere.receiveShadow = true;
                fileSphere.userData = {
                    itemData: item,
                    clickable: true,
                    isFolder: false
                };
                
                this.fileExplorer.fileObjects.add(fileSphere);
                this.setupFloatingAnimation(fileSphere, x, y, z);
                this.createNameLabel(fileSphere, item);
            }
        } catch (error) {
            console.error('Error creating file object:', error);
        }
    }

    createSaturnRing(parentSphere, baseColor) {
        if (!parentSphere) return;
        
        try {
            const ringGeometry = new THREE.TorusGeometry(1.8, 0.15, 16, 100);
            const ringMaterial = new THREE.MeshStandardMaterial({
                color: baseColor,
                roughness: 0.5,
                metalness: 0.8,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            
            const innerRingGeometry = new THREE.TorusGeometry(1.5, 0.08, 12, 100);
            const innerRingMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.3,
                metalness: 0.9,
                transparent: true,
                opacity: 0.5
            });
            
            const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
            innerRing.rotation.x = Math.PI / 2;
            
            const ringGroup = new THREE.Group();
            ringGroup.add(ring);
            ringGroup.add(innerRing);
            
            this.addRingParticles(ringGroup, baseColor);
            
            parentSphere.add(ringGroup);
            parentSphere.userData.ringGroup = ringGroup;
        } catch (error) {
            console.error('Error creating Saturn ring:', error);
        }
    }

    addRingParticles(ringGroup, baseColor) {
        if (!ringGroup) return;
        
        try {
            const particleCount = 50;
            const particles = new THREE.Group();
            
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const radius = 1.1 + Math.random() * 0.2;
                
                const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
                const particleMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.6 + Math.random() * 0.4
                });
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                particle.position.set(
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius
                );
                
                particle.userData = {
                    originalAngle: angle,
                    orbitSpeed: 0.002 + Math.random() * 0.003,
                    pulseSpeed: 2 + Math.random() * 3,
                    pulseOffset: Math.random() * Math.PI * 2
                };
                
                particles.add(particle);
            }
            
            ringGroup.add(particles);
            ringGroup.userData.particles = particles;
        } catch (error) {
            console.error('Error adding ring particles:', error);
        }
    }

    setupFloatingAnimation(mesh, originalX, originalY, originalZ) {
        if (!mesh) return;
        
        try {
            mesh.userData.originalPosition = new THREE.Vector3(originalX, originalY, originalZ);
            mesh.userData.floatPhase = Math.random() * Math.PI * 2;
            mesh.userData.floatSpeed = 0.002 + Math.random() * 0.003;
            mesh.userData.floatAmplitude = 0.5 + Math.random() * 0.6;
            mesh.userData.rotationSpeed = new THREE.Vector3(
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.008,
                (Math.random() - 0.5) * 0.004
            );
            
            if (mesh.userData.isFolder) {
                mesh.userData.orbitRadius = 0.8 + Math.random() * 0.4;
                mesh.userData.orbitSpeed = 0.001 + Math.random() * 0.002;
            } else {
                mesh.userData.bobHeight = 0.3 + Math.random() * 0.4;
                mesh.userData.bobSpeed = 0.003 + Math.random() * 0.004;
            }
        } catch (error) {
            console.error('Error setting up floating animation:', error);
        }
    }

    createNameLabel(mesh, item) {
        if (!mesh || !item || !this.fileExplorer) return;
        
        try {
            const label = document.createElement('div');
            label.className = 'name-label';
            
            const icon = document.createElement('span');
            icon.className = 'file-icon';
            icon.textContent = window.getFileIcon ? 
                window.getFileIcon(item.name, item.is_dir) : 
                (item.is_dir ? '📁' : '📄');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = item.name || 'Unknown';
            
            label.appendChild(icon);
            label.appendChild(nameSpan);
            document.body.appendChild(label);
            
            this.fileExplorer.nameLabels.push({
                element: label,
                mesh: mesh
            });
        } catch (error) {
            console.error('Error creating name label:', error);
        }
    }

    updatePaginationButton() {
        
        if (!this.paginationData) {
            console.warn('No pagination data available for button update');
            return;
        }

        
        this.cleanupPaginationButton();

        
        if (this.paginationData.totalPages > 1) {
            try {
                this.paginationButton = document.createElement('div');
                this.paginationButton.id = 'pagination-button';
                this.paginationButton.className = 'pagination-control';
                this.paginationButton.innerHTML = `
                    <div class="pagination-info">
                        Page ${this.currentPage + 1} of ${this.paginationData.totalPages}
                    </div>
                    <button id="next-page-btn" class="page-btn">Next Page</button>
                `;
                
                
                this.paginationButton.style.position = 'fixed';
                this.paginationButton.style.bottom = '70px';
                this.paginationButton.style.left = '50%';
                this.paginationButton.style.transform = 'translateX(-50%)';
                this.paginationButton.style.zIndex = '1000';
                this.paginationButton.style.backgroundColor = 'rgba(0, 30, 60, 0.8)';
                this.paginationButton.style.border = '1px solid rgba(0, 119, 190, 0.7)';
                this.paginationButton.style.borderRadius = '10px';
                this.paginationButton.style.padding = '10px 20px';
                this.paginationButton.style.color = 'white';
                this.paginationButton.style.textAlign = 'center';
                this.paginationButton.style.backdropFilter = 'blur(10px)';
                
                
                const nextBtn = this.paginationButton.querySelector('#next-page-btn');
                if (nextBtn) {
                    nextBtn.style.backgroundColor = 'rgba(0, 119, 190, 0.3)';
                    nextBtn.style.color = 'white';
                    nextBtn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    nextBtn.style.borderRadius = '5px';
                    nextBtn.style.padding = '5px 15px';
                    nextBtn.style.cursor = 'pointer';
                    nextBtn.style.marginLeft = '10px';
                    
                    
                    nextBtn.addEventListener('click', () => {
                        const nextPage = (this.currentPage + 1) % this.paginationData.totalPages;
                        this.showPage(nextPage);
                    });
                }
                
                document.body.appendChild(this.paginationButton);
            } catch (error) {
                console.error('Error creating pagination button:', error);
            }
        }
    }

    cleanupPaginationButton() {
        if (this.paginationButton) {
            try {
                this.paginationButton.remove();
            } catch (error) {
                console.warn('Error removing pagination button:', error);
            }
            this.paginationButton = null;
        }
    }

  // In your connected JS file, update the function:
updatePathDisplay() {
    const pathElement = document.getElementById('current-path');
    if (!pathElement) return;
    
    // Use the same formatting as formatPathForDisplay
    const basePath = this.fileExplorer.formatPathForDisplay(this.fileExplorer.currentPath);
    
    if (this.paginationData && this.paginationData.totalPages > 1) {
        pathElement.textContent = `${basePath} (Page ${this.currentPage + 1}/${this.paginationData.totalPages})`;
    } else {
        pathElement.textContent = basePath;
    }
}

    getDepthText(level) {
        const depthLevel = level || 0;
        return depthLevel === 0 ? "Meteor Veil" :
               depthLevel === 1 ? "Ignition Bloom" :
               depthLevel === 2 ? "Emerald Drift" :
               depthLevel === 3 ? "Milkyway Threshold" :
               depthLevel === 4 ? "Chromatic Surge" :
               depthLevel === 5 ? "Fading Echo" :
               depthLevel === 6 ? "Halo Formation" :
               depthLevel === 7 ? "Golden Pulse" :
               depthLevel === 8 ? "Tornado Crown" :
               depthLevel === 9 ? "Black Hole Choir" :
               depthLevel === 10 ? "White Dwarf Passage" : "Beyond the Rift";
    }

    interpolateColor(color1, color2, factor) {
        const safeFactor = Math.max(0, Math.min(1, factor || 0));
        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;   
        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;
        const r = Math.round(r1 + (r2 - r1) * safeFactor);
        const g = Math.round(g1 + (g2 - g1) * safeFactor);
        const b = Math.round(b1 + (b2 - b1) * safeFactor);
        return (r << 16) | (g << 8) | b;
    }

    
    cleanup() {
        this.cleanupPaginationButton();
        this.paginationData = {
            allItems: [],
            totalPages: 0,
            currentPage: 0
        };
        this.currentPage = 0;
    }
}


function initAntiLagSystem(fileExplorer) {
    if (!window.antiLagSystem) {
        window.antiLagSystem = new AntiLagSystem(fileExplorer);
    }
    return window.antiLagSystem;
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AntiLagSystem, initAntiLagSystem };
}