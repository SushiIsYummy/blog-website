import { Editor } from '@tinymce/tinymce-react';

const TinyMCEView = ({ content, setTinymceIsLoaded }) => {
  const editorConfig = {
    inline: true,
    menubar: false,
    toolbar: false,
    plugins: '',
    height: 'auto',
    content_css: '/src/components/TinyMCE/tinymce-styles-view.css',
    readonly: true,
  };

  return (
    <div id='tinymce-editor'>
      <Editor
        onLoadContent={() => {
          if (setTinymceIsLoaded) {
            setTinymceIsLoaded(true);
          }
        }}
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        initialValue={content}
        init={editorConfig}
        disabled={true}
      />
    </div>
  );
};

export default TinyMCEView;
