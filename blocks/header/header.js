import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Add primary navigation list class
    const navList = navSections.querySelector('.default-content-wrapper > ul');
    if (navList) {
      navList.classList.add('primary-nav-list');
    }

    // Create secondary navigation container
    const secondaryNav = document.createElement('div');
    secondaryNav.className = 'secondary-navigation';
    secondaryNav.style.display = 'none';
    navSections.appendChild(secondaryNav);

    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');
        // Add nav item class
        navSection.classList.add('nav-item');
      } else {
        // Add nav item class for non-dropdown items
        navSection.classList.add('nav-item');
      }
      
      // Convert p tags to a tags for proper navigation styling
      const pTag = navSection.querySelector('p');
      if (pTag && !navSection.querySelector('a')) {
        const link = document.createElement('a');
        link.href = '#'; // Default href, can be updated with data attributes
        link.textContent = pTag.textContent;
        link.className = 'nav-link';
        
        // Replace p tag with a tag
        pTag.replaceWith(link);
      }
      
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          
          // Show/hide secondary navigation based on dropdown state
          if (navSection.classList.contains('nav-drop')) {
            if (!expanded) {
              // Show secondary navigation
              showSecondaryNavigation(secondaryNav, navSection);
            } else {
              // Hide secondary navigation
              hideSecondaryNavigation(secondaryNav);
            }
          }
        }
      });
    });
  }

  // Create default navigation tools if none exist
  const navTools = nav.querySelector('.nav-tools');
  
  if (!navTools || navTools.children.length === 0) {
    const toolsSection = nav.querySelector('.nav-tools') || document.createElement('div');
    toolsSection.className = 'nav-tools';
    
    // Search icon
    const searchButton = document.createElement('button');
    searchButton.className = 'search-button';
    searchButton.setAttribute('aria-label', 'Search');
    searchButton.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    `;
    
    // Notification bell icon
    const notificationButton = document.createElement('button');
    notificationButton.className = 'notification-button';
    notificationButton.setAttribute('aria-label', 'Notifications');
    notificationButton.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 8a6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
      </svg>
    `;
    
    // My Sky dropdown
    const mySkyLink = document.createElement('a');
    mySkyLink.href = '/my-sky';
    mySkyLink.textContent = 'My Sky';
    mySkyLink.innerHTML = `
      My Sky
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    `;
    
    // Help dropdown
    const helpLink = document.createElement('a');
    helpLink.href = '/help';
    helpLink.textContent = 'Help';
    helpLink.innerHTML = `
      Help
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    `;
    
    // Sign in button
    const signInButton = document.createElement('a');
    signInButton.href = '/signin';
    signInButton.className = 'primary';
    signInButton.textContent = 'Sign in';
    
    // Add all tools to the tools section
    toolsSection.append(searchButton, notificationButton, mySkyLink, helpLink, signInButton);
    
    // If nav-tools didn't exist, add it to the nav
    if (!nav.querySelector('.nav-tools')) {
      nav.appendChild(toolsSection);
    }
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}

/**
 * shows the secondary navigation menu
 * @param {Element} secondaryNav The secondary navigation container
 * @param {Element} navSection The primary navigation section that was clicked
 */
function showSecondaryNavigation(secondaryNav, navSection) {
  // Get the dropdown content
  const dropdownContent = navSection.querySelector('ul');
  if (!dropdownContent) return;
  
  // Clear existing content
  secondaryNav.innerHTML = '';
  
  // Create secondary navigation items
  const secondaryList = document.createElement('ul');
  secondaryList.className = 'secondary-nav-list';
  
  // Try different selectors to find the dropdown items
  let dropdownItems = dropdownContent.querySelectorAll('li > a');
  
  // If no items found with li > a, try just li elements
  if (dropdownItems.length === 0) {
    const liElements = dropdownContent.querySelectorAll('li');
    
    liElements.forEach((li) => {
      // Check if li has an a tag or just text
      const linkElement = li.querySelector('a') || li;
      const textContent = linkElement.textContent.trim();
      
      if (textContent) {
        const secondaryItem = document.createElement('li');
        const secondaryLink = document.createElement('a');
        secondaryLink.href = linkElement.href || '#';
        secondaryLink.textContent = textContent;
        secondaryLink.className = 'secondary-nav-link';
        
        secondaryItem.appendChild(secondaryLink);
        secondaryList.appendChild(secondaryItem);
      }
    });
  } else {
    // Use the original a tag approach
    dropdownItems.forEach((item) => {
      const secondaryItem = document.createElement('li');
      const secondaryLink = document.createElement('a');
      secondaryLink.href = item.href || '#';
      secondaryLink.textContent = item.textContent;
      secondaryLink.className = 'secondary-nav-link';
      
      secondaryItem.appendChild(secondaryLink);
      secondaryList.appendChild(secondaryItem);
    });
  }
  
  secondaryNav.appendChild(secondaryList);
  secondaryNav.style.display = 'block';
}

/**
 * hides the secondary navigation menu
 * @param {Element} secondaryNav The secondary navigation container
 */
function hideSecondaryNavigation(secondaryNav) {
  secondaryNav.style.display = 'none';
  secondaryNav.innerHTML = '';
}