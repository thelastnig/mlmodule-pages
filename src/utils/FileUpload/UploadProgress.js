import React, { useState, forwardRef, useImperativeHandle } from "react";

const UploadProgress = forwardRef((props, ref) => {    

  useImperativeHandle(ref, (progress)=>({
    setProgress(progress){
      setProgress(progress)
    }
  }));

  const [progress, setProgress] = useState(0);

  return (
    <div>
      
      <div className="progress">        
        <div
          className="progress-bar"
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

export default UploadProgress;