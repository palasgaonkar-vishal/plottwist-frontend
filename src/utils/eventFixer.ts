// Event fixer utility for Docker environments
// This ensures all interactive elements work properly

export const fixDockerEvents = () => {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyEventFixes);
  } else {
    applyEventFixes();
  }
};

const applyEventFixes = () => {
  // Fix for Material-UI buttons
  const buttons = document.querySelectorAll('.MuiButton-root, button, [role="button"]');
  buttons.forEach((button: Element) => {
    const htmlButton = button as HTMLElement;
    htmlButton.style.pointerEvents = 'auto';
    htmlButton.style.cursor = 'pointer';
    htmlButton.style.position = 'relative';
    htmlButton.style.zIndex = '1';
  });

  // Fix for Material-UI text fields
  const textFields = document.querySelectorAll('.MuiTextField-root, .MuiInputBase-root, input, textarea');
  textFields.forEach((field: Element) => {
    const htmlField = field as HTMLElement;
    htmlField.style.pointerEvents = 'auto';
    htmlField.style.position = 'relative';
    htmlField.style.zIndex = '1';
  });

  // Fix for input elements specifically
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach((input: Element) => {
    const htmlInput = input as HTMLInputElement;
    htmlInput.style.pointerEvents = 'auto';
    htmlInput.style.cursor = 'text';
  });

  // Fix for icon buttons
  const iconButtons = document.querySelectorAll('.MuiIconButton-root');
  iconButtons.forEach((iconButton: Element) => {
    const htmlIconButton = iconButton as HTMLElement;
    htmlIconButton.style.pointerEvents = 'auto';
    htmlIconButton.style.cursor = 'pointer';
    htmlIconButton.style.position = 'relative';
    htmlIconButton.style.zIndex = '1';
  });

  // Fix for menu items
  const menuItems = document.querySelectorAll('.MuiMenuItem-root');
  menuItems.forEach((menuItem: Element) => {
    const htmlMenuItem = menuItem as HTMLElement;
    htmlMenuItem.style.pointerEvents = 'auto';
    htmlMenuItem.style.cursor = 'pointer';
  });

  // Fix for clickable typography (like brand logo)
  const clickableTypography = document.querySelectorAll('.MuiTypography-root[onclick], .MuiTypography-root[data-clickable]');
  clickableTypography.forEach((typography: Element) => {
    const htmlTypography = typography as HTMLElement;
    htmlTypography.style.pointerEvents = 'auto';
    htmlTypography.style.cursor = 'pointer';
    htmlTypography.style.position = 'relative';
    htmlTypography.style.zIndex = '1';
  });

  // Ensure forms are interactive
  const forms = document.querySelectorAll('form');
  forms.forEach((form: Element) => {
    const htmlForm = form as HTMLElement;
    htmlForm.style.pointerEvents = 'auto';
    
    // Fix all children of forms
    const formElements = form.querySelectorAll('*');
    formElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.pointerEvents = 'auto';
    });
  });

  // Ensure AppBar doesn't block interactions
  const appBars = document.querySelectorAll('.MuiAppBar-root');
  appBars.forEach((appBar: Element) => {
    const htmlAppBar = appBar as HTMLElement;
    htmlAppBar.style.position = 'relative';
    
    const appBarElements = appBar.querySelectorAll('*');
    appBarElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.pointerEvents = 'auto';
    });
  });
};

// Enhanced click handler that works around event blocking
export const forceClick = (element: HTMLElement, callback: () => void) => {
  // Ensure the element is clickable
  element.style.pointerEvents = 'auto';
  element.style.cursor = 'pointer';
  element.style.position = 'relative';
  element.style.zIndex = '1';

  // Add multiple event listeners to ensure the click works
  element.addEventListener('click', callback);
  element.addEventListener('mousedown', callback);
  element.addEventListener('touchstart', callback);
};

// Observe DOM changes and reapply fixes
export const startEventFixObserver = () => {
  const observer = new MutationObserver(() => {
    applyEventFixes();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
};

export default {
  fixDockerEvents,
  forceClick,
  startEventFixObserver,
}; 