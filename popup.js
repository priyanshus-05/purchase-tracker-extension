document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.getElementById('close-button');
    closeButton.addEventListener('click', () => {
      window.close();
    });
  
    // Add this code for the notification icon
    const notificationIcon = document.getElementById('notification-icon');
    notificationIcon.addEventListener('click', () => {
      alert('No new notifications');
    });
  
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
  
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tab.id.replace('-tab', '')).classList.add('active');
      });
    });
  
    // Populate the data
    populateData('orders', 'orders-data');
    populateData('wishlists', 'wishlist-data');
    populateData('carts', 'cart-data');
  
    // Analyze user interests after populating data
    setTimeout(analyzeInterests, 1000); // delay to ensure data is populated
  });
  
  function populateData(type, elementId) {
    chrome.storage.local.get({ [type]: [] }, (result) => {
      const data = result[type];
      const container = document.getElementById(elementId);
      container.innerHTML = ''; // Clear any existing data
      data.forEach(item => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = item.image || 'placeholder.png'; // Use item.image if available, otherwise a placeholder
        if (!item.image) {
          console.log(`Missing image for item: ${item.name}`);
        }
        const details = document.createElement('div');
        details.classList.add('item-details');
        const name = document.createElement('h3');
        name.textContent = item.name;
        if (item.availability) {
          const availability = document.createElement('p');
          availability.textContent = `Availability: ${item.availability}`;
          details.appendChild(availability);
        }
        const url = document.createElement('p');
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = "View Item";
        link.target = "_blank";
        url.appendChild(link);
        details.appendChild(name);
        details.appendChild(url);
        li.appendChild(img);
        li.appendChild(details);
        container.appendChild(li);
      });
    });
  }
  
  function analyzeInterests() {
    const interests = new Set();
    const keywords = {
      TIGHTS: ['tights', 'leggings'],
      SWIMWEAR: ['swimwear', 'bikini', 'swimsuit'],
      SWEATSHIRTS: ['sweatshirt', 'hoodie'],
      OTHERS: ['toy', 'pen', 'gadget']
    };
  
    ['orders', 'wishlists', 'carts'].forEach(type => {
      chrome.storage.local.get({ [type]: [] }, (result) => {
        const data = result[type];
        data.forEach(item => {
          const name = item.name.toLowerCase();
          for (const category in keywords) {
            if (keywords[category].some(keyword => name.includes(keyword))) {
              interests.add(category);
            }
          }
        });
  
        // If analyzing the last type, update the UI
        if (type === 'carts') {
          updateInterestsUI(interests);
        }
      });
    });
  }
  
  function updateInterestsUI(interests) {
    const interestsContainer = document.querySelector('.interests');
    interestsContainer.innerHTML = '';
    if (interests.size > 0) {
      interests.forEach(interest => {
        const interestElement = document.createElement('span');
        interestElement.textContent = interest;
        interestsContainer.appendChild(interestElement);
      });
    } else {
      const noInterestsElement = document.createElement('span');
      noInterestsElement.textContent = 'No interests found';
      interestsContainer.appendChild(noInterestsElement);
    }
  }
  