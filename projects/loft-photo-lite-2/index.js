import pages from './pages';
import('./styles.css');

const pageNames = ['login', 'main', 'profile'];

document.addEventListener('click', () => {
  const pageNames = model.getRandomElement(pageNames);
  pages.openPage(pageNames);
});
