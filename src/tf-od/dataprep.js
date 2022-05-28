import * as tf from '@tensorflow/tfjs';


function loadingOneImage(file){
 
    const annotation = file.annotation[0];
    const classType = 0;
    const minX = annotation.mark.x.toFixed();
    const minY = annotation.mark.y.toFixed();
    const maxX = minX + annotation.mark.width.toFixed();
    const maxY = minY + annotation.mark.height.toFixed();

    const targetTensor = tf.tensor1d([Number(minX), Number(minY), Number(maxX), Number(maxY), classType]);

    let canvas = document.createElement("canvas");
    let img = new Image();
    img.src = file.base64;
    canvas.width = 224;
    canvas.height = 224;
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    const imageTensor = tf.browser.fromPixels(canvas);

    // img = undefined;
    // canvas = undefined;
    // ctxs = undefined;
    // global.gc();
    
    let promise = new Promise((resolve, reject) => {
        resolve("done!")
    })

    return tf.tidy(() => {
       return {image: imageTensor, target: targetTensor};
    });  
}

function generateDataset(dataList){
    console.log("Prepare dataset");
    const imageTensors = [];
    const targetTensors = [];

    dataList.map((file) => {
        const imageData = loadingOneImage(file);
        imageTensors.push(imageData.image);
        targetTensors.push(imageData.target);      
    })
    
    const images = tf.stack(imageTensors);
    const targets = tf.stack(targetTensors);
    tf.dispose([imageTensors, targetTensors]);
    return {images, targets};
}
export { generateDataset, loadingOneImage }