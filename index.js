
"use strict";
(function(){
    class dualRangeSlider {
        constructor(rangeElement, callback) {
            this.range = rangeElement;
            this.callback = callback;
            this.min = Number(rangeElement.dataset.min)
            this.max = Number(rangeElement.dataset.max)
            this.startPos = 0;
            this.range.innerHTML = `<outputs><min></min><max></max></outputs><controls><handle class="left"></handle><highlight></highlight><handle class="right"></handle></controls>`
            this.handles = [...this.range.querySelectorAll('handle')]
            this.min_label = this.range.querySelector('min')
            this.max_label = this.range.querySelector('max')

            this.handles.forEach(handle => {
                handle.addEventListener('mousedown', this.startMove.bind(this))
                handle.addEventListener('touchstart', this.startMoveTouch.bind(this))
            })

            window.addEventListener('mouseup', this.stopMove.bind(this))
            window.addEventListener("touchend", this.stopMove.bind(this))
            window.addEventListener("touchcancel", this.stopMove.bind(this))
            window.addEventListener("touchleave", this.stopMove.bind(this))

            const rangeRect = this.range.getBoundingClientRect()
            const handleRect = this.handles[0].getBoundingClientRect()
            this.range.style.setProperty("--x-1", - handleRect.width/2 + "px")
            this.range.style.setProperty("--x-2", rangeRect.width - handleRect.width/2 + "px")
            this.handles[0].dataset.value = this.range.dataset.min
            this.handles[1].dataset.value = this.range.dataset.max
            this.updateLabels()
        }

        startMoveTouch(e) {
            const handleRect = e.target.getBoundingClientRect()
            this.startPos = e.touches[0].clientX - handleRect.x;
            this.activeHandle = e.target;
            this.moveTouchListener = this.moveTouch.bind(this)
            window.addEventListener("touchmove", this.moveTouchListener);
        }

        startMove(e) {
            this.startPos = e.offsetX;
            this.activeHandle = e.target;
            this.moveListener = this.move.bind(this)
            window.addEventListener("mousemove", this.moveListener);
        }

        moveTouch(e) {
            this.move({clientX: e.touches[0].clientX})
        }

        move(e) {
            const isLeft = this.activeHandle.classList.contains("left")
            const property = isLeft ? "--x-1" : "--x-2";
            const parentRect = this.range.getBoundingClientRect();
            const handleRect = this.activeHandle.getBoundingClientRect();
            let newX = e.clientX - parentRect.x - this.startPos;
            if(isLeft) {
                const otherX = parseInt(this.range.style.getPropertyValue("--x-2"));
                newX = Math.min(newX, otherX - handleRect.width)
                newX = Math.max(newX, 0 - handleRect.width/2)
            } else {
                const otherX = parseInt(this.range.style.getPropertyValue("--x-1"));
                newX = Math.max(newX, otherX + handleRect.width)
                newX = Math.min(newX, parentRect.width - handleRect.width/2)
            }
            this.activeHandle.dataset.value = this.calcHandleValue((newX + handleRect.width/2) / parentRect.width)
            this.range.style.setProperty(property, newX + "px");
            this.updateLabels(e)
        }

        updateLabels(e) {
            this.min_label.innerHTML = this.range.dataset.minLabel + this.handles[0].dataset.value
            this.max_label.innerHTML = this.range.dataset.maxLabel + this.handles[1].dataset.value
            
            const event = new CustomEvent('dualRangeChanged', {
                detail: {
                    min: this.handles[0].dataset.value,
                    max: this.handles[1].dataset.value,
                    callback: this.callback,
                }
            })
            document.dispatchEvent(event)
        }

        calcHandleValue(percentage) {
            return Math.round(percentage * (this.max - this.min) + this.min)
        }

        stopMove(evt) {
            window.removeEventListener("mousemove", this.moveListener);
            window.removeEventListener("touchmove", this.moveTouchListener);
            this.updateLabels(evt)
        }
    }
    document.addEventListener('dualRangeChanged', (evt) => {
        const { detail: { callback, min, max } } = evt;
        callback(min, max);
    });
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = dualRangeSlider;
    } else {
        window.dualRangeSlider = dualRangeSlider;
    }
})();
