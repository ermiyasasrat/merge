/**
 * Enhanced Product Menu Animations
 * Adds promo-style animations to product lists in mega menu
 */

document.addEventListener("DOMContentLoaded", function () {
  const productMenuItems = document.querySelectorAll(".menu__item--products");
  const productListsContainer = document.querySelector(
    ".col-lg-8.d-none.d-lg-block.mb-lg-30.ml-lg-auto"
  );

  if (productListsContainer) {
    const productLists =
      productListsContainer.querySelectorAll(".product__list");
    let currentActiveList = null;
    let hoverTimeout;
    let firstProductList = null;
    let isInitialized = false;

    // Find the first product list to show by default
    if (productLists.length > 0) {
      firstProductList = productLists[0];
    }

    // Function to hide all product lists
    function hideAllProductLists() {
      productLists.forEach(function (list) {
        list.classList.remove("active", "show-animation");
        list.style.display = "none";
        // Reset height properties to ensure consistent state
        list.style.height = "auto";
        list.style.minHeight = "0";
        list.style.maxHeight = "none";
      });
      currentActiveList = null;
    }

    // Function to show a specific product list
    function showProductList(list) {
      hideAllProductLists();
      if (list) {
        list.classList.add("active");
        list.style.display = "flex";
        // Ensure height is stable during transitions
        list.style.height = "auto";
        list.style.minHeight = "0";
        list.style.maxHeight = "none";
        currentActiveList = list;
        setTimeout(function () {
          list.classList.add("show-animation");
        }, 50);
      }
    }

    // Initialize: hide all product lists initially
    function initializeProductLists() {
      if (!isInitialized) {
        hideAllProductLists();
        isInitialized = true;
      }
    }

    // Initial setup - ensure all product lists are hidden on page load
    setTimeout(function () {
      initializeProductLists();
    }, 100);

    // Enhanced hover functionality for product menu items
    productMenuItems.forEach(function (menuItem) {
      const menuHandle = menuItem.getAttribute("data-product-menu");
      const correspondingList = productListsContainer.querySelector(
        `[data-product-list="${menuHandle}"]`
      );

      if (correspondingList) {
        // Add hover event listeners
        menuItem.addEventListener("mouseenter", function () {
          clearTimeout(hoverTimeout);
          initializeProductLists();
          showProductList(correspondingList);
        });

        menuItem.addEventListener("mouseleave", function () {
          // Keep the list visible but remove animation class
          hoverTimeout = setTimeout(function () {
            if (correspondingList && correspondingList === currentActiveList) {
              correspondingList.classList.remove("show-animation");
            }
          }, 150);
        });
      }
    });

    // Enhanced functionality for the first menu link (mega menu entry)
    const megaMenus = document.querySelectorAll(".menu__megamenu");
    megaMenus.forEach(function (megaMenu) {
      const hasProductLists = megaMenu.querySelector(
        ".col-lg-8.d-none.d-lg-block.mb-lg-30.ml-lg-auto"
      );

      if (hasProductLists) {
        // Get the first menu item link that opens this megamenu
        const parentMenuItem = megaMenu.closest(".menu__item");
        const firstMenuLink = parentMenuItem
          ? parentMenuItem.querySelector("a")
          : null;

        if (firstMenuLink) {
          firstMenuLink.addEventListener("mouseenter", function () {
            clearTimeout(hoverTimeout);
            initializeProductLists();

            // Show first product list when hovering over the main menu link
            if (firstProductList) {
              showProductList(firstProductList);
            }
          });
        }

        // Also handle hover on other menu titles within the megamenu
        const menuTitles = megaMenu.querySelectorAll(".menu__title");
        menuTitles.forEach(function (menuTitle) {
          menuTitle.addEventListener("mouseenter", function () {
            clearTimeout(hoverTimeout);

            // Check if we're not hovering over a product menu item
            let isHoveringProductMenu = false;
            productMenuItems.forEach(function (item) {
              if (item.matches(":hover")) {
                isHoveringProductMenu = true;
              }
            });

            // Only show first product list if not hovering over specific product menu
            if (!isHoveringProductMenu && firstProductList) {
              initializeProductLists();
              showProductList(firstProductList);
            }
          });
        });

        // Hide all product lists when leaving the mega menu
        megaMenu.addEventListener("mouseleave", function () {
          clearTimeout(hoverTimeout);
          hideAllProductLists();
        });
      }
    });
  }

  // Function to stabilize megamenu height during hover states
  function stabilizeMegamenuHeight() {
    const megamenus = document.querySelectorAll(
      ".menu__megamenu.d-lg-none.position-lg-absolute"
    );

    megamenus.forEach(function (megamenu) {
      // Prevent height conflicts on hover by enforcing stable styles
      megamenu.addEventListener("mouseenter", function () {
        this.style.height = "auto";
        this.style.maxHeight = "none";
        this.style.minHeight = "0";
        this.style.overflow = "visible";
      });

      megamenu.addEventListener("mouseleave", function () {
        this.style.height = "auto";
        this.style.maxHeight = "none";
        this.style.minHeight = "0";
        this.style.overflow = "visible";
      });

      // Also stabilize containers within megamenus
      const containers = megamenu.querySelectorAll(".container");
      containers.forEach(function (container) {
        container.addEventListener("mouseenter", function () {
          this.style.height = "auto";
          this.style.maxHeight = "none";
          this.style.minHeight = "0";
        });

        container.addEventListener("mouseleave", function () {
          this.style.height = "auto";
          this.style.maxHeight = "none";
          this.style.minHeight = "0";
        });
      });
    });
  }

  // Initialize stabilization
  stabilizeMegamenuHeight();

  // Add smooth scroll behavior for mobile menu
  const productItems = document.querySelectorAll(".product__item");

  productItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      // Add a subtle click animation
      item.style.transform = "scale(0.98)";
      setTimeout(function () {
        item.style.transform = "";
      }, 150);
    });
  });
});

// Add CSS custom properties for dynamic theming
function updateProductMenuTheme() {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  // Get theme colors if available
  const themeColor = computedStyle.getPropertyValue("--theme") || "#007bff";
  const theme2Color = computedStyle.getPropertyValue("--theme2") || "#f8f9fa";

  // Apply to product menu elements
  const productLists = document.querySelectorAll(".product__list");
  productLists.forEach(function (list) {
    list.style.setProperty("--product-theme-color", themeColor);
    list.style.setProperty("--product-bg-color", theme2Color);
  });
}

// Initialize theme on load and when theme changes
document.addEventListener("DOMContentLoaded", updateProductMenuTheme);
window.addEventListener("themechange", updateProductMenuTheme);
