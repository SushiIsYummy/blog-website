import { Editor } from '@tinymce/tinymce-react';
import './tinymce-styles-view.css';

const TinyMCEViewer = ({ content, setTinymceIsLoaded }) => {
  const editorConfig = {
    inline: true,
    menubar: false,
    toolbar: false,
    plugins: '',
    height: 'auto',
    readonly: true,
  };

  return (
    <div id='tinymce-editor'>
      <Editor
        tinymceScriptSrc='/tinymce/tinymce.min.js'
        onLoadContent={() => {
          if (setTinymceIsLoaded) {
            setTinymceIsLoaded(true);
          }
        }}
        initialValue={content}
        init={editorConfig}
        disabled={true}
      />
    </div>
  );
};

export default TinyMCEViewer;
