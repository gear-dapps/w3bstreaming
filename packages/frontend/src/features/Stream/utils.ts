import { MediaTrackSequenceType } from './types';

export class MediaStreamSequence {
  mediaTrackSequence: Map<MediaTrackSequenceType, number> = new Map();

  getSequence() {
    return Array.from(this.mediaTrackSequence);
  }

  getLength() {
    return this.mediaTrackSequence.size;
  }

  add(type: MediaTrackSequenceType) {
    const index = this.getLength();
    this.mediaTrackSequence.set(type, index);
  }

  removeByType(type: MediaTrackSequenceType) {
    this.mediaTrackSequence.delete(type);
    this.reindexAfter(type);
  }

  reindexAfter(removedType: MediaTrackSequenceType) {
    const i = this.mediaTrackSequence.get(removedType) as number;
    this.mediaTrackSequence.forEach((value, key) => {
      if (value > i) {
        this.mediaTrackSequence.set(key, value - 1);
      }
    });
  }

  getIndex(type: MediaTrackSequenceType) {
    return this.mediaTrackSequence.get(type);
  }

  getIndexes(types: MediaTrackSequenceType[]) {
    return types.filter((type) => this.mediaTrackSequence.has(type)).map((type) => this.mediaTrackSequence.get(type));
  }
}
