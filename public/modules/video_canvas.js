export class VideoCanvas {
  constructor (videoIndex) {
    this.videoIndex = videoIndex
    this.frameOffset = 0

    const video = document.getElementById('auxiliary-video')

    this.canvas = document.getElementById('video-canvas')
    const ctx = this.canvas.getContext('2d')

    const updateCanvas = (now, metadata) => {
      ctx.drawImage(video, 0, 0, video.width, video.height)

      this.videoIndex.getBoxes(this.frameOffset).forEach((box) => {
        // Create rectangle box
        ctx.beginPath()
        ctx.lineWidth = 4
        ctx.strokeStyle = box.isMatch ? 'green' : 'red'
        ctx.rect(box.x, box.y, box.width, box.height)
        ctx.stroke()

        // Add person description if needed
        if (box.isMatch) {
          ctx.font = '14px verdana'
          ctx.textAlign = 'center'
          ctx.fillText(`${box.name} (${box.probability.toFixed(2)}%)`,
            // x coordinate is the the middle of the box
            box.x + Math.floor(box.width / 2),
            // y coordinate is 10 pixels below the box
            box.y + box.height + 10,
            // max width is the box width
            box.width)
        }
      })

      this.frameOffset += 1
      video.requestVideoFrameCallback(updateCanvas)
    }

    video.requestVideoFrameCallback(updateCanvas)
  }

  updateToChunk (chunkId) {
    this.frameOffset = this.videoIndex.getFrameOffset(chunkId)
  }
}
