import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react';
import styles from './TinyMCEEditor.module.css';

function TinyMCEEditor({
  onInit,
  initialValue,
  onEditorChange,
  onLoadContent,
  maxHeight,
}) {
  const [contentIsLoading, setContentIsLoading] = useState(true);

  return (
    <>
      {contentIsLoading && (
        <div className={styles.loadingIconContainer}>
          <l-ring size='30' stroke='3' color='black' speed='1.5'></l-ring>
        </div>
      )}
      <div
        className={`${styles.tinymceEditor} ${!contentIsLoading ? styles.loaded : ''}`}
      >
        <Editor
          tinymceScriptSrc='/tinymce/tinymce.min.js'
          onInit={onInit}
          onLoadContent={() => {
            if (onLoadContent) {
              onLoadContent();
            }
            setContentIsLoading(false);
          }}
          init={{
            selector: 'textarea',
            max_height: maxHeight,
            menubar: false,
            plugins:
              'autoresize advlist autolink lists link image indent paste wordcount contextmenu quickbars',
            contextmenu: false,
            quickbars_selection_toolbar:
              'bold italic underline forecolor backcolor fontsize link image blockquote | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat',
            quickbars_insert_toolbar: false,
            toolbar:
              'undo redo | bold italic underline forecolor backcolor fontsize link image alignleftimage aligncenterimage | \
            alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat |',
            link_assume_external_targets: true,
            relative_urls: false,
            remove_script_host: false,
            convert_urls: false,
            image_caption: true,
            autoresize_overflow_padding: 5,
            autoresize_bottom_margin: 0,
            fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
            object_resizing: false,
            elementpath: false,
            content_css:
              '/src/components/TinyMCEComponents/TinyMCEEditor/tinymce-styles-edit.css',
            mobile: {
              quickbars_selection_toolbar:
                'bold italic underline forecolor backcolor fontsize link image blockquote | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat',
            },
          }}
          value={initialValue}
          onEditorChange={onEditorChange}
        />
      </div>
    </>
  );
}

export default TinyMCEEditor;
