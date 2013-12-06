//(function() {
  window.GridPix = //(function() {

    /*
    TODO: fix commented-out namespace encapsulation logic
    TODO: checkin to github
    */
    function GridPix(el, images, cubesPerSide, mouseOutFlip, pickerEl) {
      /*
      Creates a GridPix object to display 'images' array of image URIs on element 'el'. 
      The grid will have 'cubesPerSide' cubes per side (default is 2).
      If 'mouseOutFlip' is true, cubes will flip on mouseout (default is false).
      If 'pickerEl' is set to a document element, the element will display the entire image and
      flip the grid when double-clicked (default is null/no picker).
      */
      cubesPerSide = cubesPerSide != null ? cubesPerSide : 2;
      mouseOutFlip = mouseOutFlip != null ? (function(e){this.flip();}) : (function(e){});
    
      function onImagesLoaded(imageUris, callback) {
        /*
        Calls callback when all images in imageUris have been loaded.
        */
    
        var imagesRemaining = imageUris.length;
        function countDown() {
          /*
          Decrement number of images; if number is zero, invoke callback.
          */
          imagesRemaining--;
          if (imagesRemaining == 0) {
            callback();
          }
        }
    
        // Load images; set countDown function to be called when load is complete.
        for (var i = 0; i < imageUris.length; i++) {
          var image = new Image();
          image.onload = countDown;
          image.src = imageUris[i];
        }
      }
    
      onImagesLoaded(images, function() {
      
        // Get max image dimensions
        var imageDimensions = {};
        var maxWidth = 0;
        var maxHeight = 0;
        for(var i = 0; i < images.length; i++) {
          image = new Image();
          image.src = images[i];
          if (image.height > maxHeight) {
            maxHeight = image.height;
          }
          if (image.width > maxWidth) {
            maxWidth = image.width;
          } 
        }

        // Calculate dimensions of HexaFlip cubes
        var cubePx = Math.max(maxHeight, maxWidth) / Math.floor(cubesPerSide);
        console.log(Math.max(maxHeight, maxWidth),  Math.floor(cubesPerSide));
      
        // Create grid of hexaflips (contained in divs, respectively)
        var hexaFlips = new Array();
        window.hexaFlips = hexaFlips;

        // This iterates over rows (of cubePx height)
        for (var y = 0; y < maxHeight; y+= cubePx) {

          // Create a div that will contain a row of HexaFlips 
          var divY = document.createElement('div');
          divY.className = 'gridpix-parent gridpix-side';
          divY.style.margin = 1;
          el.appendChild(divY);

          // This iterates over elements within each row (of cubePx width)
          for (var x = 0; x < maxWidth; x+= cubePx) {

            // Create a div for that will contain a HexaFlip
            var divX = document.createElement('div');
            divX.className = 'gridpix-child gridpix-side';
            divX.style.margin = 1;
            divY.appendChild(divX);

            // Create a HexaFlip. See HexaFlip docs for details on argument semantics.
            // In our case, we make the cubes flip on mouseover and "seek" on double-click
            var hf = new HexaFlip(divX, 
              {set:images}, 
              {
                size:cubePx,
                domEvents: {
                  mouseover: function(e, face, cube) {
                  },
                  mouseout: mouseOutFlip, 
                  dblclick: function(e, face, cube) {
                      var targetAngle = this.cubes.set.last; 
                      for(var i = 0; i < window.hexaFlips.length; i++) {
                        var hf_i = window.hexaFlips[i];
                        // TODO: make the conditional below < or > to avoid edge-case infinite loop 
                        while(hf_i.cubes.set.last != this.cubes.set.last) {
                          if (hf_i.cubes.set.last > this.cubes.set.last) {
                            hf_i.flipBack();
                          } else {
                            hf_i.flip();
                          }
                        }
                      }
                  }
                }
              }
            );
            divX.hexaFlip = hf;
    
            hexaFlips.push(hf);
    
            // Adjust the image on this HexaFlip so that it lines up with the others 
            // Note that we adjust the image on all faces of the cube; this might be overkill
            var faces = ['front', 'back', 'left', 'right', 'top', 'bottom', 'el'];
            var style = null;
            for(var i=0; i < faces.length; i++) {
              style = hf.cubes.set[faces[i]].style;
              style.backgroundPosition = "-" + x + "px -" + y + "px";
              style.backgroundSize = "auto";
	      style.backgroundRepeat = "no-repeat";
            }
          } // for-x
        } // for-y

        // create picker TODO: make this optional, and position it better (or make that optional too), pass in the picker element!
        if (pickerEl == null) {
          return;
        }
        var divY = document.createElement('div');
        divY.className = 'gridpix-parent';
        pickerEl.appendChild(divY);
        var divX = document.createElement('div');
        divX.className = 'gridpix-child';
        divX.style.margin = 0.5;
        divY.appendChild(divX);
        var hf = new HexaFlip(divX, 
            {set:images}, 
            {
              size:cubePx,
              domEvents: {
                  dblclick: function(e, face, cube) {
                      var targetAngle = this.cubes.set.last; 
                      for(var i = 0; i < window.hexaFlips.length; i++) {
                        var hf_i = window.hexaFlips[i];
                        while(hf_i.cubes.set.last != this.cubes.set.last) {
                          if (hf_i.cubes.set.last > this.cubes.set.last) {
                            hf_i.flipBack();
                          } else {
                            hf_i.flip();
                          }
                        }
                      }
                  }
                }
              }
            );
            var faces = ['front', 'back', 'left', 'right', 'top', 'bottom', 'el'];
            for(var i=0; i < faces.length; i++) {
              hf.cubes.set[faces[i]].style.backgroundSize = "contain"; 
              hf.cubes.set[faces[i]].style.backgroundRepeat = "no-repeat"; 
            }
    
            divX.hexaFlip = hf;
    
      });
    }



  //})();

//}).call(this);
