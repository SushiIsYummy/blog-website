import { Editor } from '@tinymce/tinymce-react';

const TinyMCEInput = ({ content, onChange, placeholder = '' }) => {
  const editorConfig = {
    inline: true,
    menubar: false,
    plugins: `advlist autolink autoresize lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount`,
    toolbar: false,
    height: 'auto',
    content_css: '/src/components/TinyMCE/tinymce-styles-input.css',
    readonly: true,
    placeholder: placeholder,
  };

  return (
    <div id='tinymce-editor-input'>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        init={editorConfig}
        value={content}
        onEditorChange={onChange}
        // disabled={true}
      />
    </div>
  );
};

export default TinyMCEInput;
