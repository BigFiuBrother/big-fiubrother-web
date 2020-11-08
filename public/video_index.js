class VideoIndex {
  constructor() {
    this.videoChunkIndex = {};
    this.chunkBoxesIndex = {};

    this.frameOffset = 0;
    this.frameBST = [];

    this.estimatedFrameBSTPointer = 0;
  }

  addVideoChunk(chunk) {
    this.videoChunkIndex[chunk.id] = {frameOffset: this.frameOffset, frameCount: chunk.frameCount};
    this.frameBST = this.frameBST.push([this.frameOffset, chunk.id]);
    this.frameOffset += chunk.frameCount;
  }

  addChunkBoxes(chunkBoxes) {
    this.chunkBoxesIndex[chunkBoxes.chunkId] = new ChunkBoxes(chunkBoxes);
  }

  getFrameOffset(chunkId) {
    return this.videoChunkIndex[chunkId].frameOffset;
  }

  getBoxes(frameOffset) {
    // Use estimated pointer to avoid BST if possible
    [chunkOffset, chunkId] = this.frameBST[this.estimatedFrameBSTPointer];
    var offset = frameOffset - chunkOffset;
    var frameCount = this.videoChunkIndex[chunkId].frameCount;

    if (offset >= 0 && offset < frameCount) {
      // If last frame of chunk, increase estimatedFrameBSTPointer
      if (offset == frameCount - 1) {
        this.estimatedFrameBSTPointer += 1;
      }

      return this.chunkBoxesIndex[chunkId].getBoxes(offset);
    }

    // Binary search in BST for frameOffset. Should only be used when reloading or forced transition
    let min = 0;
    let max = this.frameBST.length;

    while (min <= max) {
      let mid = Math.floor((max + min) / 2);
      
      let [midFrameOffset, chunkId] = frameBST[mid];

      if (midFrameOffset < frameOffset) {
        min = midFrameOffset + 1;
      } else if (midFrameOffset > frameOffset) {
        max = midFrameOffset - 1;
      } else {
        this.estimatedFrameBSTPointer = midFrameOffset;
        return this.chunkBoxesIndex[chunkId].getBoxes(0);
      }
    }

    [chunkOffset, chunkId] = frameBST[max];

    frameCount = this.videoChunkIndex[chunkId].frameCount;
    this.estimatedFrameBSTPointer = max;
    
    if (offset == frameCount - 1) {
      this.estimatedFrameBSTPointer += 1;
    }

    // Substract chunkOffset to normalize offset for chunk
    offset = frameOffset - chunkOffset;
    return this.chunkBoxesIndex[chunkId].getBoxes(offset);
  }

}