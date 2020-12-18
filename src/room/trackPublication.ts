import { EventEmitter } from 'events';
import { Track } from '..';
import { TrackInfo, TrackInfo_Type } from '../proto/model';
import { TrackInvalidError } from './errors';
import {
  LocalAudioTrack,
  LocalTrack,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteTrack,
  RemoteVideoTrack,
} from './track';

export type AudioTrackPublication =
  | LocalAudioTrackPublication
  | RemoteAudioTrackPublication;
export type VideoTrackPublication =
  | LocalVideoTrackPublication
  | RemoteVideoTrackPublication;
export type DataTrackPublication = RemoteDataTrackPublication;

export class TrackPublication extends EventEmitter {
  kind: Track.Kind;
  trackName: string;
  trackSid: Track.SID;

  constructor(kind: Track.Kind, id: string, name: string) {
    super();
    this.kind = kind;
    this.trackSid = id;
    this.trackName = name;
  }
}

export class RemoteTrackPublication extends TrackPublication {
  track?: RemoteTrack;

  constructor(kind: Track.Kind, id: string, name: string) {
    super(kind, id, name);
  }

  get isSubscribed(): boolean {
    return !!this.track;
  }

  updateMetadata(info: TrackInfo) {
    this.trackSid = info.sid;
    this.trackName = info.name;
  }
}

export class RemoteAudioTrackPublication extends RemoteTrackPublication {
  track?: RemoteAudioTrack;

  constructor(info: TrackInfo, track?: RemoteAudioTrack) {
    super(Track.Kind.Audio, info.sid, info.name);
    this.track = track;
  }
}

export class RemoteVideoTrackPublication extends RemoteTrackPublication {
  track?: RemoteVideoTrack;

  constructor(info: TrackInfo, track?: RemoteVideoTrack) {
    super(Track.Kind.Video, info.sid, info.name);
    this.track = track;
  }
}

export class RemoteDataTrackPublication extends RemoteTrackPublication {
  constructor(info: TrackInfo) {
    super(Track.Kind.Data, info.sid, info.name);
  }
}

export namespace RemoteTrackPublication {
  export function createTrackFromInfo(info: TrackInfo): RemoteTrackPublication {
    let tp: RemoteTrackPublication;
    switch (info.type) {
      case TrackInfo_Type.AUDIO:
        tp = new RemoteAudioTrackPublication(info);
        break;
      case TrackInfo_Type.VIDEO:
        tp = new RemoteVideoTrackPublication(info);
        break;
      case TrackInfo_Type.DATA:
        tp = new RemoteDataTrackPublication(info);
        break;
      default:
        throw new TrackInvalidError('unsupported trackinfo type');
    }

    return tp;
  }
}

export class LocalTrackPublication extends TrackPublication {
  track: LocalTrack;
  priority?: Track.Priority;

  constructor(kind: Track.Kind, track: LocalTrack) {
    super(kind, track.id, track.name);
    this.track = track;
  }

  get isTrackEnabled(): boolean {
    return false;
  }
}

export class LocalAudioTrackPublication extends LocalTrackPublication {
  constructor(track: LocalAudioTrack) {
    super(Track.Kind.Audio, track);
  }
}

export class LocalVideoTrackPublication extends LocalTrackPublication {
  constructor(track: LocalVideoTrack) {
    super(Track.Kind.Video, track);
  }
}