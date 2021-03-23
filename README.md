# Dual Range Slider

This is simple JavaScript Class for Dual Range Slider. Easy to use, easy to install, easy setup.

# How it works?

`npm install dual-range-slider`

Create an HTML Markup

    <div class="dual-range" data-min="20" data-max="70">
		<span class="handle left"></span>
		<span class="highlight"></span>
		<span class="handle right"></span>
	</div>

then add CSS (SCSS) code to your styles

    .dual-range {
        --range-size:20px;
        --range-width:150px;
        --handle-size:1.3;
        height:var(--range-size);
        width:var(--range-width);
        background:var(--clr-box-dark);
        border-radius:50px;
        position:relative;
        user-select:none;
        
        .highlight {
            position:absolute;
            height:var(--range-size);
            width:calc(calc(var(--x-2) - var(--x-1)) + calc(var(--range-size) * var(--handle-size)));
            left:var(--x-1);
            background:var(--clr-prim);
            z-index:1;
            border-radius:50px;
        }
        
        .handle {
            width:calc(var(--range-size) * var(--handle-size));
            height:calc(var(--range-size) * var(--handle-size));
            background:#fff;
            position:absolute;
            box-shadow:var(--shadow);
            border-radius:50%;
            top:50%;
            transform:translateY(-50%);
            z-index:2;
            cursor:grab;
            &:active {
                cursor:grabbing;
            }
            
            &.left {
                left:var(--x-1);
            }
            
            &.right {
                left:var(--x-2);
            }
            
            &::after {
                content:'$'attr(data-value);
                position:absolute;
                top:100%;
                left:50%;
                transform:translateX(-50%);
            }
        }
        
	}
	
