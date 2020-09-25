class VideoCanvas {
  constructor(videoIndex) {
    this.videoIndex = videoIndex ;
    this.frameOffset = 0;

    var video = document.getElementById('video');
    
    var canvas = document.getElementById('video-canvas');
    var ctx = this.c2.getContext('2d');

    const updateCanvas = (now, metadata) => {
      ctx.drawImage(video, 0, 0, video.width, video.height);
      
      this.videoIndex.getBoxes(this.frameOffset).forEach((box) => {
        // Create rectangule box
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = box.person ? "green" : "red";
        ctx.rect(box.x, box.y, box.width, box.height);
        ctx.stroke();

        // Add person description if needed
        if (box.person) {
          ctx.font = "14px verdana";
          ctx.textAlign = "center";
          ctx.fillText(`${box.person} (${box.probability.toFixed(2)}%)`,
            // x coordinate is the the middle of the box
            box.x + Math.floor(box.width / 2), 
            // y coordinate is 10 pixels below the box
            box.y + box.height + 10, 
            // max width is the box width
            box.width);
        }
      }) 

      this.frameOffset += 1
      video.requestVideoFrameCallback(updateCanvas);
    } 

    video.requestVideoFrameCallback(updateCanvas);
  }

  updateToChunk(chunkId) {
    this.frameOffset = this.videoIndex.getFrameOffset(chunkId);
  }
}
