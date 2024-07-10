chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'WISHLIST_ITEM') {
      chrome.storage.local.get({ wishlists: [] }, (result) => {
        const wishlists = result.wishlists;
        wishlists.push(message.data);
        chrome.storage.local.set({ wishlists }, () => {
          console.log("Wishlist item saved", message.data);
          sendResponse({ status: 'success', message: 'Wishlist item saved' });
        });
      });
      return true;
    } else if (message.type === 'CART_ITEM') {
      chrome.storage.local.get({ carts: [] }, (result) => {
        const carts = result.carts;
        carts.push(message.data);
        chrome.storage.local.set({ carts }, () => {
          console.log("Cart item saved", message.data);
          sendResponse({ status: 'success', message: 'Cart item saved' });
        });
      });
      return true;
    }
  });
  