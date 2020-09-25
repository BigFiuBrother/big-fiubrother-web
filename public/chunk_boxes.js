class ChunkBoxes {
    constructor(chunkBoxes) {
      this.chunkId = chunkBoxes.chunkId;
      this.boxesOffsetByFrame = [];
      this.boxesByOffset = {};

      var prev, cur;

      for (var i = 0; i < chunkBoxes.boxes.length; i++) {
        cur = chunkBoxes.boxes[i];

        this.boxesByOffset[cur.offset] = cur.frameBoxes; 

        if (i > 0) {
          for (var j = prev.offset; j < cur.offset; j++) {
            this.boxesOffsetByFrame.push(prev.offset);
          }
        }

        prev = cur;
      }

      this.boxesOffsetByFrame.push(prev.offset);
    }

    getBoxes(frameOffset) {
      var offset = this.boxesByFrame.length - 1;
      
      if (frameOffset < this.boxesMetadata.length) {
        offset = frameOffset;
      }

      return this.boxesByOffset[this.boxesOffsetByFrame[offset]];
    }
}