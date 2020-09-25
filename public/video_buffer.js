class VideoBuffer {
  constructor(sourceBuffer, videoIndex) {
    this.sourceBuffer = sourceBuffer;
    this.sourceBuffer.mode = 'sequence';

    this.videoIndex = videoIndex;

    this.timeAppended = 0;
    this.preBuffering = 0;
    this.lastTimestamp = 0;
    this.lastChunk = 0;

    this.queue = new PriorityQueue(function (a, b) {
      return a.timestamp > b.timestamp;
    })

    this.sourceBuffer.addEventListener('updateend', function (e) {
      if (!this.needsToPreBuffer()) {
        this.appendToBuffer(chunk);
      }
    })

    this.sourceBuffer.addEventListener('error', function (e) {
      console.log(e);
    })
  }

  // Needs to prebuffer if time in queue is less than 5 seconds
  needsToPreBuffer() {
    return this.preBuffering < 5.0;
  }

  timeAppended() {
    return this.timeAppended;
  }

  lastChunk() {
    return this.lastChunk;
  }

  appendToBuffer() {
    var chunk;

    do {
      chunk = this.queue.pop();
      this.preBuffering -= chunk.duration;
    } while (chunk.timestamp < this.lastTimestamp and !this.queue.isEmpty())

    this.lastTimestamp = chunk.timestamp;
    this.timeAppended += chunk.duration;
    this.lastChunk = chunk;
    this.videoIndex.addVideoChunk(chunk);
    this.sourceBuffer.appendBuffer(chunk.payload);
  }

  appendChunk(chunk) {
    var appended = false;

    this.preBuffering += chunk.duration;
    this.queue.push(chunk);
    
    if (!this.sourceBuffer.updating && !this.needsToPreBuffer()) {
      this.appendToBuffer();
      appended = true;
    }

    return appended;
  }
}