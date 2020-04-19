import React from 'react';

import { registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

import FilepondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

import FilePondPluginImageResize from 'filepond-plugin-image-resize';

import FilePondPluginImageCrop from 'filepond-plugin-image-crop';

import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';

import { BrowserRouter as Router } from 'react-router-dom';
import BaseRoute from './routes'
import './assets/style/main.scss';

registerPlugin(FilepondPluginImagePreview, FilePondPluginFileEncode, FilePondPluginImageResize, FilePondPluginImageCrop, FilePondPluginImageValidateSize)


function App() {
  return (
    <Router>
      <BaseRoute />
    </Router>
  );
}

export default App;
