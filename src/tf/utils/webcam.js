/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import autobind from 'autobind-decorator';
import { cropTo } from './canvas';

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

const defaultVideoOptions = {
    facingMode: 'user',
    frameRate: 24
};
const fillConstraints = (options) => {
    options.facingMode = options.facingMode || defaultVideoOptions.facingMode;
    options.frameRate = options.frameRate || defaultVideoOptions.frameRate;
    options.aspectRatio = options.aspectRatio || defaultVideoOptions.aspectRatio;
    return options;
};
export class Webcam {
    constructor(width = 400, height = 400, flip = false) {
        this.width = width;
        this.height = height;
        this.flip = flip;
    }
    getWebcam(options = {}) {
        if (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
            return Promise.reject('Your browser does not support WebRTC. Please try another one.');
        }
        options.width = 640;
        const videoOptions = fillConstraints(options);
        const video = document.createElement('video');
        return window.navigator.mediaDevices.getUserMedia({ video: videoOptions })
            .then((mediaStream) => {
            video.srcObject = mediaStream;
            video.addEventListener('loadedmetadata', (event) => {
                const { videoWidth: vw, videoHeight: vh } = video;
                video.width = vw;
                video.height = vh;
            });
            return video;
        }, () => {
            return Promise.reject('Could not open your camera. You may have denied access.');
        });
    }
    // setup or setupWebcam
    async setup(options = {}) {
        if (!this.webcam) {
            this.webcam = await this.getWebcam(options);
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.width = this.width;
                this.canvas.height = this.height;
            }
        }
    }
    play() {
        const promise = this.webcam.play();
        return promise;
    }
    pause() {
        this.webcam.pause();
    }
    stop() {
        this.stopStreamedVideo(this.webcam);
    }
    update() {
        this.renderCameraToCanvas();
    }
    stopStreamedVideo(videoEl) {
        const stream = videoEl.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        videoEl.srcObject = null;
    }
    renderCameraToCanvas() {
        if (this.canvas && this.webcam) {
            const ctx = this.canvas.getContext('2d');
            if (this.webcam.videoWidth !== 0) {
                const croppedCanvas = cropTo(this.webcam, this.width, this.flip);
                ctx.drawImage(croppedCanvas, 0, 0);
            }
        }
    }
}
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Webcam.prototype, "getWebcam", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Webcam.prototype, "setup", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Webcam.prototype, "play", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Webcam.prototype, "pause", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Webcam.prototype, "stop", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Webcam.prototype, "update", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HTMLVideoElement]),
    __metadata("design:returntype", void 0)
], Webcam.prototype, "stopStreamedVideo", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Webcam.prototype, "renderCameraToCanvas", null);