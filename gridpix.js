//(function() {
  window.GridPix = //(function() {

    /*
    TODO: fix commented-out namespace encapsulation logic
    TODO: checkin to github
    */
    function GridPix(el, images, cubePx, mouseOutFlip) {
      cubePx = cubePx != null ? cubePx : 75;
      mouseOutFlip = mouseOutFlip != null ? (function(e) {this.flip();}) : (function(e){});
    
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
      
        // Create divs and cubes
        var hexaFlips = new Array();
        window.hexaFlips = hexaFlips;
        for (var y = 0; y < maxHeight; y+= cubePx) {
          var divY = document.createElement('div');
          divY.className = 'gridpix-parent gridpix-side';
          divY.style.margin = 1;
          document.body.appendChild(divY);
          for (var x = 0; x < maxWidth; x+= cubePx) {
            var divX = document.createElement('div');
            divX.className = 'gridpix-child gridpix-side';
            divX.style.margin = 1;
            divY.appendChild(divX);
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
    
            // TODO: explain
            var faces = ['front', 'back', 'left', 'right', 'top', 'bottom', 'el'];
            for(var i=0; i < faces.length; i++) {
              hf.cubes.set[faces[i]].style.backgroundPosition = "-" + x + "px -" + y + "px";
              hf.cubes.set[faces[i]].style.backgroundSize = "auto";
              hf.cubes.set[faces[i]].style.backgroundRepeat = "no-repeat";
            }
          } // for-x
        } // for-y

        // create picker
        var divY = document.createElement('div');
        divY.className = 'gridpix-parent';
        document.body.appendChild(divY);
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

/*
//@ sourceMappingURL=hexaflip.map
*/
