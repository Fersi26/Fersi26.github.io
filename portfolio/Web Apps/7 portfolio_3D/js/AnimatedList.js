class AnimatedList {
    constructor(container, options = {}) {
        this.container = container;
        this.items = options.items || [];
        this.onItemSelect = options.onItemSelect || (() => {});
        this.selectedItem = options.selectedItem || null;
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = '';
        
        // Create trigger button
        const trigger = document.createElement('div');
        trigger.className = 'animated-list-trigger';
        trigger.textContent = this.selectedItem || 'Select Model';
        trigger.setAttribute('tabindex', '0');
        this.trigger = trigger;

        // Create dropdown container
        const dropdown = document.createElement('div');
        dropdown.className = 'animated-list-dropdown';
        this.dropdown = dropdown;

        // Create list container
        const list = document.createElement('div');
        list.className = 'animated-list';

        // Create list items
        this.items.forEach((item, index) => {
            const listItem = document.createElement('div');
            listItem.className = `animated-list-item ${this.selectedItem === item ? 'selected' : ''}`;
            listItem.textContent = item;
            listItem.setAttribute('data-index', index);
            listItem.setAttribute('tabindex', '0');

            listItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectItem(item, index);
                this.close();
            });

            listItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectItem(item, index);
                    this.close();
                }
            });

            list.appendChild(listItem);
        });

        dropdown.appendChild(list);
        this.container.appendChild(trigger);
        this.container.appendChild(dropdown);
    }

    setupEventListeners() {
        // Remove any existing event listeners first
        this.cleanupEventListeners();
        
        // Trigger click event
        this.triggerClickHandler = (e) => {
            e.stopPropagation();
            this.toggle();
        };
        this.trigger.addEventListener('click', this.triggerClickHandler);

        // Trigger keyboard events
        this.triggerKeyHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
        this.trigger.addEventListener('keydown', this.triggerKeyHandler);

        // Close dropdown when clicking outside
        this.documentClickHandler = () => {
            if (this.isOpen) {
                this.close();
            }
        };
        document.addEventListener('click', this.documentClickHandler);

        // Hover effects - only apply shiny effect when dropdown is closed
        this.triggerMouseEnterHandler = () => {
            if (!this.isOpen) {
                this.trigger.classList.add('shiny');
            }
        };
        this.trigger.addEventListener('mouseenter', this.triggerMouseEnterHandler);

        this.triggerMouseLeaveHandler = () => {
            if (!this.isOpen) {
                this.trigger.classList.remove('shiny');
            }
        };
        this.trigger.addEventListener('mouseleave', this.triggerMouseLeaveHandler);
    }

    cleanupEventListeners() {
        // Clean up existing event listeners to prevent duplicates
        if (this.triggerClickHandler) {
            this.trigger.removeEventListener('click', this.triggerClickHandler);
        }
        if (this.triggerKeyHandler) {
            this.trigger.removeEventListener('keydown', this.triggerKeyHandler);
        }
        if (this.documentClickHandler) {
            document.removeEventListener('click', this.documentClickHandler);
        }
        if (this.triggerMouseEnterHandler) {
            this.trigger.removeEventListener('mouseenter', this.triggerMouseEnterHandler);
        }
        if (this.triggerMouseLeaveHandler) {
            this.trigger.removeEventListener('mouseleave', this.triggerMouseLeaveHandler);
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.dropdown.classList.add('open');
        this.trigger.classList.remove('shiny'); // Remove shiny when opening
        
        // Focus first item
        const firstItem = this.dropdown.querySelector('.animated-list-item');
        if (firstItem) {
            setTimeout(() => firstItem.focus(), 100);
        }
    }

    close() {
        this.isOpen = false;
        this.dropdown.classList.remove('open');
        
        // Only remove shiny if not hovering (let hover handler manage this)
        if (!this.trigger.matches(':hover')) {
            this.trigger.classList.remove('shiny');
        }
        this.trigger.focus();
    }

    selectItem(item, index) {
        this.selectedItem = item;
        this.trigger.textContent = item;
        
        // Update selected state without full re-render (which was causing the event listener issue)
        const items = this.dropdown.querySelectorAll('.animated-list-item');
        items.forEach((listItem, idx) => {
            if (idx === index) {
                listItem.classList.add('selected');
            } else {
                listItem.classList.remove('selected');
            }
        });
        
        this.onItemSelect(item, index);
    }

    updateItems(newItems) {
        this.items = newItems;
        this.render();
        this.setupEventListeners();
    }

    setSelectedItem(item) {
        this.selectedItem = item;
        this.trigger.textContent = item;
        
        // Update selected state in dropdown if it exists
        if (this.dropdown) {
            const items = this.dropdown.querySelectorAll('.animated-list-item');
            items.forEach((listItem, index) => {
                if (this.items[index] === item) {
                    listItem.classList.add('selected');
                } else {
                    listItem.classList.remove('selected');
                }
            });
        }
    }

    // Cleanup method to prevent memory leaks
    destroy() {
        this.cleanupEventListeners();
    }
}