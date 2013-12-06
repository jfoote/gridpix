//(function() {
  window.GridPix = //(function() {

    /*
    TODO: fix commented-out namespace encapsulation logic
    TODO: checkin to github
    */
    function GridPix(el, imageUris, cubesPerSide, mouseOutFlip, pickerEl) {
      /*
      Creates a GridPix object to display 'imageUris' array of image URIs on element 'el'. 
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
    
      onImagesLoaded(imageUris, function() {
      
        // Get max image dimensions
        var maxWidth = 0;
        var maxHeight = 0;
        var images = [];
        for(var i = 0; i < imageUris.length; i++) {
          var image = new Image();
          images.push(image);
          image.src = imageUris[i];
          if (image.height > maxHeight) {
            maxHeight = image.height;
          }
          if (image.width > maxWidth) {
            maxWidth = image.width;
          } 
        }

        // Calculate dimensions of HexaFlip cubes
        var cubePx = Math.max(maxHeight, maxWidth) / Math.floor(cubesPerSide);

        // Create grid of hexaflips (contained in divs, respectively)
        var hexaFlips = new Array();
        window.hexaFlips = hexaFlips;

        // This iterates over rows (of cubePx height)
        for (var y = 0; y < maxHeight; y+= cubePx) {

          // Create a div that will contain a row of HexaFlips 
          var divY = document.createElement('div');
          divY.style.margin = 1;
          el.appendChild(divY);

          // This iterates over elements within each row (of cubePx width)
          for (var x = 0; x < maxWidth; x+= cubePx) {

            // Create a div for that will contain a HexaFlip
            var divX = document.createElement('div');
            divX.className = 'gridpix-child gridpix-side';
            divX.style.margin = 1;
            divY.appendChild(divX);

            // Here we create an array of Objects that will cause the HexaFlip code 
            // to display our images with the proper offsets on each face of the cube (giving
            // the appearance of a centered image
            var positionedImages = [];
            for(var i = 0; i < imageUris.length; i++) {
              var posImage = new Object();
              posImage.value = imageUris[i]; // HexaFlip will read this as a URI
              posImage.style = new Object();
              xPos = -(x - (maxWidth - images[i].width)/2)
              yPos = -(y - (maxHeight - images[i].height)/2)
              posImage.style.backgroundPosition = xPos + "px " + yPos + "px";
              posImage.style.backgroundSize = "auto";
              posImage.style.backgroundRepeat = "no-repeat";
              positionedImages.push(posImage);
            }

            // Create a HexaFlip. See HexaFlip docs for details on argument semantics.
            // In our case, we make the cubes flip on mouseover and "seek" on double-click
            var hf = new HexaFlip(divX, 
              {set:positionedImages}, 
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
    
          } // for-x
        } // for-y

        // If the user didn't specify a picker element, we're done
        if (pickerEl == null) {
          return;
        }

       // As above, here we create an array of Objects that will cause the HexaFlip code 
       // to display our images with the proper style (which is slightly different that what 
       // was used for the the tiles above).
        var positionedImages = [];
        for(var i = 0; i < imageUris.length; i++) {
          var posImage = new Object();
          posImage.value = imageUris[i]; // HexaFlip will read this as a URI
          posImage.style = new Object();
          posImage.style.backgroundPosition = "center"
          posImage.style.backgroundSize = "contain"; 
          posImage.style.backgroundRepeat = "no-repeat"; 
          positionedImages.push(posImage);
        }

        // 
        var divY = document.createElement('div');
        divY.className = 'gridpix-parent';
        pickerEl.appendChild(divY);
        var divX = document.createElement('div');
        divX.className = 'gridpix-child';
        divX.style.margin = 0.5;
        divY.appendChild(divX);
        var hf = new HexaFlip(pickerEl, 
            {set:positionedImages}, 
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
