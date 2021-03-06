/*
GridPix: Displays images in a grid of HexaFlips. See README for more info.
Author: jmfoote@andrew.cmu.edu
License: MIT License
*/

// TODO: use anonymous-function style namespace for encapsulation
window.GridPix = function GridPix(el, imageUris, cubePx, mouseOutFlip, pickerEl, pickerPx) {
  /*
  Creates a GridPix object to display 'imageUris' array of image URIs on element 'el'. 
  The cubes that make up the grid will have sides of length 'cubePx' (default is 100).
  If 'mouseOutFlip' is true, cubes will flip on mouseout (default is false).
  If 'pickerEl' is set to a document element, the element will display the entire image and
  flip the grid when double-clicked (default is null/no picker).
  If 'pickerEl' is defined, the picker will be a cube with a side length of 'pickerPx' 
  (default is 'cubePx').
  */
  cubePx = cubePx != null ? cubePx : 100;
  mouseOutFlip = mouseOutFlip == true ? (function(e){this.flip();}) : (function(e){});
  pickerPx = pickerPx != null ? pickerPx : cubePx;

  function onImagesLoaded(imageUrisToLoad, callback) {
    /*
    Calls callback when all images in imageUris have been loaded.
    */

    var imagesRemaining = imageUrisToLoad.length;
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
    for (var i = 0; i < imageUrisToLoad.length; i++) {
      var image = new Image();
      image.onload = countDown;
      image.src = imageUrisToLoad[i];
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

    // Calculate grid dimensions
    var gridWidth = Math.ceil(maxWidth/cubePx) * cubePx;
    var gridHeight = Math.ceil(maxHeight/cubePx) * cubePx;

    // Create grid of hexaflips (contained in divs, respectively)
    var hexaFlips = new Array();

    // This iterates over rows (of cubePx height)
    for (var y = 0; y < maxHeight; y+= cubePx) {

      // Create a div that will contain a row of HexaFlips 
      var divY = document.createElement('div');
      divY.style.margin = "0px";
      el.appendChild(divY);

      // This iterates over elements within each row (of cubePx width)
      for (var x = 0; x < maxWidth; x+= cubePx) {

        // Create a div for that will contain a HexaFlip
        var divX = document.createElement('div');
        divX.style.margin = "0px";
        divX.style.display = "inline-block";
        divY.appendChild(divX);

        // Here we create an array of Objects that will cause the HexaFlip code 
        // to display our images with the proper offsets on each face of the cube (giving
        // the appearance of a centered image
        var positionedImages = [];
        for(var i = 0; i < imageUris.length; i++) {
          var posImage = new Object();
          posImage.value = imageUris[i]; // HexaFlip will read this as a URI
          posImage.style = new Object();
          xPos = -(x - (gridWidth - images[i].width)/2)
          yPos = -(y - (gridHeight - images[i].height)/2)
          posImage.style.backgroundPosition = xPos + "px " + yPos + "px";
          posImage.style.backgroundSize = "auto";
          posImage.style.backgroundRepeat = "no-repeat";
          positionedImages.push(posImage);
        }

        // Define a seek callback function to use with HexaFlip instances.
        function flipSeek(e, face, cube) {
          /*
          Flips all of this.hexaFlips to the position of this cube.
          Designed to be used as a DOM event callback for a HexaFlip instance.
          */
          for(var i = 0; i < this.hexaFlips.length; i++) {
            var hf_i = this.hexaFlips[i];
            while(hf_i.cubes.set.last != this.cubes.set.last) {
              if (hf_i.cubes.set.last > this.cubes.set.last) {
                hf_i.flipBack();
              } else {
                hf_i.flip();
              }
            }
          }
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
              dblclick: flipSeek
            }
          }
        );
        divX.hexaFlip = hf;

        hexaFlips.push(hf);

      } // for-x
    } // for-y

    // Attach a reference to the HexaFlip set to each HexaFlip 
    // so that each HexaFlip can flip the whole set
    for (var i = 0; i < hexaFlips.length; i++) {
      hexaFlips[i].hexaFlips = hexaFlips;
    }

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

    // Create a "picker" HexaFlip
    var hf = new HexaFlip(pickerEl, 
        {set:positionedImages}, 
        {
          size:pickerPx,
          domEvents: {
              dblclick: flipSeek
          }
        }
    );
    hf.hexaFlips = hexaFlips;
  });
}



