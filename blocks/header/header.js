import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

// Sky.com navigation configuration
const SKY_NAV_CONFIG = {
  brand: {
    name: 'Sky',
    logo: '/icons/sky-logo.svg', // This would be stored in AEM
    url: '/'
  },
  // Default menu structure - this would typically come from AEM
  defaultMenu: {
    sections: [
      {
        title: 'TV',
        url: '/tv',
        children: [
          { title: 'Sky Q', url: '/tv/sky-q' },
          { title: 'Sky Glass', url: '/tv/sky-glass' },
          { title: 'Sky Stream', url: '/tv/sky-stream' },
          { title: 'Channels', url: '/tv/channels' }
        ]
      },
      {
        title: 'Mobile',
        url: '/mobile',
        children: [
          { title: 'Plans', url: '/mobile/plans' },
          { title: '5G Network', url: '/mobile/5g-network' },
          { title: 'International', url: '/mobile/international' }
        ]
      },
      {
        title: 'Broadband',
        url: '/broadband',
        children: [
          { title: 'Fibre', url: '/broadband/fibre' },
          { title: 'Ultrafast', url: '/broadband/ultrafast' },
          { title: 'Deals', url: '/broadband/deals' }
        ]
      },
      {
        title: 'Sports',
        url: '/sports',
        children: [
          { title: 'Premier League', url: '/sports/premier-league' },
          { title: 'F1', url: '/sports/f1' },
          { title: 'Golf', url: '/sports/golf' },
          { title: 'Boxing', url: '/sports/boxing' }
        ]
      },
      {
        title: 'Entertainment',
        url: '/entertainment',
        children: [
          { title: 'Movies', url: '/entertainment/movies' },
          { title: 'Box Sets', url: '/entertainment/box-sets' },
          { title: 'Kids', url: '/entertainment/kids' }
        ]
      }
    ]
  }
};

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
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
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
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
  
  // Enable nav dropdown keyboard accessibility
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

  // Enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Creates the Sky.com brand/logo section
 * @param {Element} nav The navigation element
 */
function createBrandSection(nav) {
  const navBrand = document.createElement('div');
  navBrand.classList.add('nav-brand');
  
  // Try to load logo from AEM first, fallback to text
  if (SKY_NAV_CONFIG.brand.logo) {
    const logoImg = document.createElement('img');
    logoImg.src = SKY_NAV_CONFIG.brand.logo;
    logoImg.alt = SKY_NAV_CONFIG.brand.name;
    logoImg.onerror = () => {
      // Fallback to text if image fails to load
      logoImg.style.display = 'none';
      const textLogo = document.createElement('a');
      textLogo.href = SKY_NAV_CONFIG.brand.url;
      textLogo.className = 'sky-logo';
      textLogo.textContent = SKY_NAV_CONFIG.brand.name;
      navBrand.appendChild(textLogo);
    };
    navBrand.appendChild(logoImg);
  } else {
    const textLogo = document.createElement('a');
    textLogo.href = SKY_NAV_CONFIG.brand.url;
    textLogo.className = 'sky-logo';
    textLogo.textContent = SKY_NAV_CONFIG.brand.name;
    navBrand.appendChild(textLogo);
  }
  
  return navBrand;
}

/**
 * Creates the navigation sections menu
 * @param {Element} nav The navigation element
 * @param {Object} menuData The menu data from AEM or default
 */
function createNavSections(nav, menuData) {
  const navSections = document.createElement('div');
  navSections.classList.add('nav-sections');
  
  const defaultContentWrapper = document.createElement('div');
  defaultContentWrapper.classList.add('default-content-wrapper');
  
  const ul = document.createElement('ul');
  
  menuData.sections.forEach((section) => {
    const li = document.createElement('li');
    
    if (section.children && section.children.length > 0) {
      li.classList.add('nav-drop');
      li.setAttribute('aria-expanded', 'false');
      
      const sectionLink = document.createElement('a');
      sectionLink.href = section.url;
      sectionLink.textContent = section.title;
      li.appendChild(sectionLink);
      
      const subUl = document.createElement('ul');
      section.children.forEach((child) => {
        const childLi = document.createElement('li');
        const childLink = document.createElement('a');
        childLink.href = child.url;
        childLink.textContent = child.title;
        childLi.appendChild(childLink);
        subUl.appendChild(childLi);
      });
      
      li.appendChild(subUl);
    } else {
      const sectionLink = document.createElement('a');
      sectionLink.href = section.url;
      sectionLink.textContent = section.title;
      li.appendChild(sectionLink);
    }
    
    ul.appendChild(li);
  });
  
  defaultContentWrapper.appendChild(ul);
  navSections.appendChild(defaultContentWrapper);
  
  return navSections;
}

/**
 * Creates the navigation tools section
 * @param {Element} nav The navigation element
 */
function createNavTools(nav) {
  const navTools = document.createElement('div');
  navTools.classList.add('nav-tools');
  
  // Search button
  const searchButton = document.createElement('button');
  searchButton.type = 'button';
  searchButton.className = 'search-button';
  searchButton.setAttribute('aria-label', 'Search');
  searchButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  `;
  searchButton.addEventListener('click', () => {
    // Handle search functionality
    console.log('Search clicked');
  });
  
  // Sign in button
  const signInButton = document.createElement('a');
  signInButton.href = '/signin';
  signInButton.className = 'nav-button';
  signInButton.textContent = 'Sign in';
  
  // Get Sky button
  const getSkyButton = document.createElement('a');
  getSkyButton.href = '/get-sky';
  getSkyButton.className = 'nav-button primary';
  getSkyButton.textContent = 'Get Sky';
  
  navTools.appendChild(searchButton);
  navTools.appendChild(signInButton);
  navTools.appendChild(getSkyButton);
  
  return navTools;
}

/**
 * Loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Try to load navigation data from AEM first
  let menuData = SKY_NAV_CONFIG.defaultMenu;
  
  try {
    const navMeta = getMetadata('nav');
    if (navMeta) {
      const navPath = new URL(navMeta, window.location).pathname;
      const fragment = await loadFragment(navPath);
      
      // Parse the fragment to extract menu data
      // This would need to be implemented based on your AEM content structure
      if (fragment) {
        // For now, we'll use the default menu
        // In a real implementation, you'd parse the AEM content here
        console.log('Navigation fragment loaded from AEM:', navPath);
      }
    }
  } catch (error) {
    console.warn('Failed to load navigation from AEM, using default:', error);
  }
  
  // Clear the block and create new navigation
  block.textContent = '';
  
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');
  
  // Create hamburger menu for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  
  // Create navigation sections
  const navSections = createNavSections(nav, menuData);
  
  // Add event listeners for dropdown functionality
  navSections.querySelectorAll('.nav-drop').forEach((navSection) => {
    navSection.addEventListener('click', () => {
      if (isDesktop.matches) {
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);
        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      }
    });
  });
  
  // Create brand section
  const navBrand = createBrandSection(nav);
  
  // Create tools section
  const navTools = createNavTools(nav);
  
  // Assemble the navigation
  nav.appendChild(hamburger);
  nav.appendChild(navBrand);
  nav.appendChild(navSections);
  nav.appendChild(navTools);
  
  // Add hamburger click handler
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  
  // Prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  
  // Create wrapper and append
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
  
  // Add body padding to account for fixed header
  document.body.style.paddingTop = `${isDesktop.matches ? 80 : 70}px`;
}
