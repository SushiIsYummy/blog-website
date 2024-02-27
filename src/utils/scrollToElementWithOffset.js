function scrollToElementWithOffset(element, offset) {
  if (element) {
    const topPosition =
      element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: topPosition, behavior: 'smooth' });
  }
}

export default scrollToElementWithOffset;
