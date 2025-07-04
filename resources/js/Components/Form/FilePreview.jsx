import React, { useEffect, useState } from 'react'

const FilePreview = ({ file }) => {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  if (thumbnail) {
    return (
      thumbnail && <img src={thumbnail} alt={file.name} />
    );
  } else {
    return null;
  }
};

export default FilePreview;