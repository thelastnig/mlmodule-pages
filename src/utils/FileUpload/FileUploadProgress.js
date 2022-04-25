import React, { useState, forwardRef, useImperativeHandle } from "react";

const UploadFiles = forwardRef((props, ref) => {    

  useImperativeHandle(ref, (progress)=>({
    setProgress(progress){
      setProgress(progress)
    }
  }));

  const [progress, setProgress] = useState(0);

  return (
    <div>
      
      <div className="progress">
        progress
        <div
          className="progress-bar progress-bar-info progress-bar-striped"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: progress + "%" }}
        >
          {progress}%
        </div>
      </div>
      
    </div>
  );
});

export default UploadFiles;