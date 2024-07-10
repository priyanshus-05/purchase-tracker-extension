// Function to extract product details for wishlist
function extractWishlistDetails() {
    const itemElement = document.querySelector('#huc-atwl-asin-section');
    if (!itemElement) {
    //   console.log("Wishlist item section not found");
      return null;
    }
  
    const nameElement = itemElement.querySelector('#huc-item-link > span.huc-atwl-header-small');
    const linkElement = itemElement.querySelector('#huc-item-link');
    const imageElement = itemElement.querySelector('#huc-atwl-asin-image-wrapper img');
    const availabilityElement = document.querySelector('#availability .a-size-medium.a-color-success') || 
                               document.querySelector('#availability span.a-color-state') || 
                               document.querySelector('#availability span.a-color-success');
  
    if (nameElement && linkElement && imageElement) {
      const item = {
        name: nameElement.innerText.trim(),
        url: linkElement.href,
        image: imageElement.src,
        availability: availabilityElement ? availabilityElement.innerText.trim() : 'Unknown',
        dateAdded: new Date().toISOString()
      };
    //   console.log("Extracted wishlist item:", item);
      return item;
    }
    // console.log("Failed to extract wishlist item details");
    return null;
  }
  
  // Function to extract product details for cart
  function extractCartDetails() {
    const itemElement = document.querySelector('.sw-atc-productimage-large');
    if (!itemElement) {
    //   console.log("Cart item section not found");
      return null;
    }
  
    const nameElement = itemElement.querySelector('img.sc-product-image');
    const linkElement = itemElement.querySelector('a.sc-product-link');
  
    if (nameElement && linkElement) {
      const item = {
        name: nameElement.alt.trim(),
        url: linkElement.href,
        image: nameElement.src,
        dateAdded: new Date().toISOString()
      };
    //   console.log("Extracted cart item:", item);
      return item;
    }
    // console.log("Failed to extract cart item details");
    return null;
  }
  
  // Function to safely send a message using chrome.runtime
  function sendMessageSafely(message, callback) {
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(message, callback);
    } else {
      console.error("chrome.runtime.sendMessage is not available");
    }
  }
  
  // Wait for the DOM to fully load before adding event listeners
  window.addEventListener('load', () => {
    // Add event listener for wishlist button
    const wishlistButton = document.querySelector('#add-to-wishlist-button-submit');
    if (wishlistButton) {
      wishlistButton.addEventListener('click', () => {
        setTimeout(() => {
          const item = extractWishlistDetails();
          if (item) {
            sendMessageSafely({ type: 'WISHLIST_ITEM', data: item }, (response) => {
              if (chrome.runtime.lastError) {
                console.error("Runtime error:", chrome.runtime.lastError);
              } else {
                // console.log("Wishlist item added:", response);
              }
            });
          }
        }, 2000); // Delay to ensure the DOM is updated
      });
    } else {
    //   console.log("Wishlist button not found");
    }
  
    // Add event listener for add to cart button
    const cartButton = document.querySelector('#add-to-cart-button');
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        setTimeout(() => {
          const item = extractCartDetails();
          if (item) {
            sendMessageSafely({ type: 'CART_ITEM', data: item }, (response) => {
              if (chrome.runtime.lastError) {
                console.error("Runtime error:", chrome.runtime.lastError);
              } else {
                // console.log("Cart item added:", response);
              }
            });
          }
        }, 2000); // Delay to ensure the DOM is updated
      });
    } else {
    //   console.log("Add to cart button not found");
    }
  
    // Fallback to extract and send items on page load for cart page
    if (window.location.href.includes('cart')) {
      setTimeout(() => {
        const items = extractCartDetails();
        // console.log("Cart items extracted on page load:", items);
        if (items) {
          sendMessageSafely({ type: 'CART_ITEM', data: items }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
            } else {
            //   console.log("Cart item added on page load:", response);
            }
          });
        }
      }, 2000); // Delay to ensure the DOM is updated
    }
  });
  