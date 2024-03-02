import styles from './ExpandableContent.module.css';
import { useEffect, useRef, useState } from 'react';
import hasContentOverflow from '../../utils/hasContentOverflow';
import PropTypes from 'prop-types';

function ExpandableContent({ children, maxLines = 4 }) {
  const [contentWidth, setContentWidth] = useState(0);
  const [contentIsExpandable, setContentIsExpandable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const observedElement = contentRef.current;
    if (!observedElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setContentWidth(entries[0].contentRect.width);
    });

    resizeObserver.observe(observedElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [contentRef]);

  useEffect(() => {
    if (!contentRef.current) return;

    function requiresExpansion(element) {
      applyLineClamp(element);
      let result = hasContentOverflow(element);
      removeLineClamp(element);
      return result;
    }

    const requiresExpansionConst = requiresExpansion(contentRef.current);
    if (requiresExpansionConst && !isExpanded) {
      applyLineClamp(contentRef.current);
      setContentIsExpandable(true);
    } else if (requiresExpansionConst && !contentIsExpandable && isExpanded) {
      applyLineClamp(contentRef.current);
      setContentIsExpandable(true);
    } else if (!requiresExpansionConst) {
      removeLineClamp(contentRef.current);
      setContentIsExpandable(false);
    }
  }, [contentWidth, contentIsExpandable, isExpanded]);

  function applyLineClamp(element) {
    element.classList.add(styles.lineClamp);
  }
  function removeLineClamp(element) {
    element.classList.remove(styles.lineClamp);
  }

  function onReadMoreClick() {
    removeLineClamp(contentRef.current);
    setIsExpanded(true);
  }
  function onShowLessClick() {
    applyLineClamp(contentRef.current);
    setIsExpanded(false);
  }

  return (
    <div className={styles.expandableContent}>
      <div
        ref={contentRef}
        className={`${styles.content}`}
        style={{ WebkitLineClamp: maxLines }}
      >
        {children}
      </div>
      {contentIsExpandable && !isExpanded ? (
        <button className={styles.readMoreButton} onClick={onReadMoreClick}>
          Read more
        </button>
      ) : null}
      {contentIsExpandable && isExpanded ? (
        <button className={styles.showLessButton} onClick={onShowLessClick}>
          Show less
        </button>
      ) : null}
    </div>
  );
}

ExpandableContent.propTypes = {
  children: PropTypes.node,
  maxLines: PropTypes.number,
};
export default ExpandableContent;
