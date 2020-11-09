import { VideoAnalysis } from './video_analysis'

export class VideoIndex {
  constructor () {
    this.chunkIndex = {}
    this.analysisIndex = {}

    this.frameOffset = 0
    this.chunkBST = []

    this.pointer = 0
  }

  addVideoChunk (chunk) {
    this.chunkIndex[chunk.id] = { frameOffset: this.frameOffset, frameCount: chunk.frameCount }
    this.chunkBST = this.chunkBST.push([this.frameOffset, chunk.id])
    this.frameOffset += chunk.frameCount
  }

  addAnalysis (analysis) {
    this.analysisIndex[analysis.chunkId] = new VideoAnalysis(analysis)
  }

  getFrameOffset (chunkId) {
    return this.chunkIndex[chunkId].frameOffset
  }

  getBoxes (frameOffset) {
    // Use estimated pointer to avoid BST if possible
    const result = this.getBoxesFromChunkBST(frameOffset, this.pointer)

    if (result != null) {
      return result
    }

    // Binary search in BST for frameOffset. Should only be used when reloading or a forced transition
    let min = 0
    let max = this.chunkBST.length

    while (min <= max) {
      const mid = Math.floor((max + min) / 2)

      const [midFrameOffset, chunkId] = this.chunkBST[mid]

      if (midFrameOffset < frameOffset) {
        min = midFrameOffset + 1
      } else if (midFrameOffset > frameOffset) {
        max = midFrameOffset - 1
      } else {
        this.pointer = midFrameOffset
        return this.analysisIndex[chunkId].getBoxes(0)
      }
    }

    // Use max because we want the closest smallest possible
    return this.getBoxesFromChunkBST(frameOffset, max)
  }

  getBoxesFromChunkBST (frameOffset, index) {
    const [chunkOffset, chunkId] = this.chunkBST[index]

    const frameCount = this.chunkIndex[chunkId].frameCount
    // Subtract chunkOffset to normalize offset for chunk
    const offset = frameOffset - chunkOffset
    this.pointer = index

    if (offset >= 0 && offset < frameCount) {
      if (offset === frameCount - 1) {
        this.pointer += 1
      }

      return this.analysisIndex[chunkId].getBoxes(offset)
    } else {
      return null
    }
  }
}
