const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

function activateTab(nextTab, { focus = true, updateHash = true } = {}) {
  tabs.forEach((tab) => {
    const selected = tab === nextTab;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  panels.forEach((panel) => {
    panel.hidden = panel.id !== nextTab.getAttribute('aria-controls');
  });

  if (focus) nextTab.focus();
  if (updateHash) history.replaceState(null, '', `#${nextTab.id.replace('tab-', '')}`);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab, { focus: false }));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    activateTab(tabs[nextIndex]);
  });
});

const requestedScenario = window.location.hash.slice(1);
const requestedTab = tabs.find((tab) => tab.id === `tab-${requestedScenario}`);
if (requestedTab) activateTab(requestedTab, { focus: false, updateHash: false });

window.addEventListener('hashchange', () => {
  const scenario = window.location.hash.slice(1);
  const tab = tabs.find((candidate) => candidate.id === `tab-${scenario}`);
  if (tab) activateTab(tab, { focus: false, updateHash: false });
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('p');

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.querySelector('img')?.alt ?? '';
    lightboxCaption.textContent = button.dataset.caption ?? '';
    lightbox.showModal();
  });
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
