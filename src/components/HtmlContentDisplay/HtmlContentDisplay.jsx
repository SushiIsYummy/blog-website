import parse from 'html-react-parser';
import defaultStyles from './DefaultDisplayStyles.module.css';

const HtmlContentDisplay = ({ content, className }) => {
  return (
    <div className={className ? className : defaultStyles.htmlContentDisplay}>
      {parse(content)}
    </div>
  );
};

export default HtmlContentDisplay;
