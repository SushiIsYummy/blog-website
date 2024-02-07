import { Editor } from '@tinymce/tinymce-react';

function TinyMCEEdit({ initialValue, onChange }) {
  return (
    <div id='tinymce-editor'>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        init={{
          selector: 'textarea',
          height: 'auto',
          autoresize_min_height: 200,
          menubar: false,
          plugins: `advlist autolink autoresize lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount`,
          toolbar:
            'undo redo | formatselect | bold italic forecolor backcolor link | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat |',
          link_assume_external_targets: true,
          relative_urls: false,
          remove_script_host: false,
          convert_urls: false,
          branding: false,
          // statusbar: false,
          autoresize_overflow_padding: 5,
          autoresize_bottom_margin: '25s',
          object_resizing: false,
          resize: 'vertical',
          content_css: '/src/components/TinyMCE/tinymce-styles-edit.css',
        }}
        value={initialValue}
        onEditorChange={onChange}
      />
    </div>
  );
}

export default TinyMCEEdit;
