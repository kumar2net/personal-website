import { readFile } from 'node:fs/promises';

export const SUPPORTED_MANIFEST_VERSION = 'sora-manifest.v1';

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function pushError(errors, message) {
  errors.push(message);
}

function validateProject(project, errors) {
  if (!isObject(project)) {
    pushError(errors, 'project must be an object');
    return;
  }
  if (typeof project.id !== 'string' || !project.id.trim()) {
    pushError(errors, 'project.id must be a non-empty string');
  }
  if (typeof project.title !== 'string' || !project.title.trim()) {
    pushError(errors, 'project.title must be a non-empty string');
  }
  if (!isFiniteNumber(project.fps) || project.fps <= 0) {
    pushError(errors, 'project.fps must be a positive number');
  }
  if (!isObject(project.resolution)) {
    pushError(errors, 'project.resolution must be an object');
    return;
  }
  if (!Number.isInteger(project.resolution.w) || project.resolution.w <= 0) {
    pushError(errors, 'project.resolution.w must be a positive integer');
  }
  if (!Number.isInteger(project.resolution.h) || project.resolution.h <= 0) {
    pushError(errors, 'project.resolution.h must be a positive integer');
  }
}

function validateVideoTracks(videoTracks, errors) {
  if (!Array.isArray(videoTracks)) {
    pushError(errors, 'tracks.video must be an array');
    return;
  }
  videoTracks.forEach((track, index) => {
    const prefix = `tracks.video[${index}]`;
    if (!isObject(track)) {
      pushError(errors, `${prefix} must be an object`);
      return;
    }
    if (typeof track.id !== 'string' || !track.id.trim()) {
      pushError(errors, `${prefix}.id must be a non-empty string`);
    }
    if (typeof track.source !== 'string' || !track.source.trim()) {
      pushError(errors, `${prefix}.source must be a non-empty string`);
    }
    if (!isFiniteNumber(track.start)) {
      pushError(errors, `${prefix}.start must be a number`);
    }
    if (!isFiniteNumber(track.end)) {
      pushError(errors, `${prefix}.end must be a number`);
    }
    if (isFiniteNumber(track.start) && isFiniteNumber(track.end) && track.end <= track.start) {
      pushError(errors, `${prefix}.end must be greater than .start`);
    }
  });
}

function validateCaptions(captions, errors) {
  if (!Array.isArray(captions)) {
    pushError(errors, 'tracks.captions must be an array');
    return new Set();
  }
  const ids = new Set();
  captions.forEach((caption, index) => {
    const prefix = `tracks.captions[${index}]`;
    if (!isObject(caption)) {
      pushError(errors, `${prefix} must be an object`);
      return;
    }
    if (typeof caption.id !== 'string' || !caption.id.trim()) {
      pushError(errors, `${prefix}.id must be a non-empty string`);
    } else if (ids.has(caption.id)) {
      pushError(errors, `${prefix}.id must be unique (${caption.id})`);
    } else {
      ids.add(caption.id);
    }
    if (typeof caption.lang !== 'string' || !caption.lang.trim()) {
      pushError(errors, `${prefix}.lang must be a non-empty string`);
    }
    if (typeof caption.text !== 'string') {
      pushError(errors, `${prefix}.text must be a string`);
    }
  });
  return ids;
}

function validateAudioTracks(audioTracks, captionIds, errors) {
  if (!Array.isArray(audioTracks)) {
    pushError(errors, 'tracks.audio must be an array');
    return;
  }
  audioTracks.forEach((track, index) => {
    const prefix = `tracks.audio[${index}]`;
    if (!isObject(track)) {
      pushError(errors, `${prefix} must be an object`);
      return;
    }
    if (typeof track.id !== 'string' || !track.id.trim()) {
      pushError(errors, `${prefix}.id must be a non-empty string`);
    }
    if (typeof track.lang !== 'string' || !track.lang.trim()) {
      pushError(errors, `${prefix}.lang must be a non-empty string`);
    }
    if (typeof track.source !== 'string' || !track.source.trim()) {
      pushError(errors, `${prefix}.source must be a non-empty string`);
    }
    if (!isFiniteNumber(track.start) || !isFiniteNumber(track.end)) {
      pushError(errors, `${prefix}.start and .end must be numbers`);
    } else if (track.end <= track.start) {
      pushError(errors, `${prefix}.end must be greater than .start`);
    }

    if (!Array.isArray(track.segments)) {
      pushError(errors, `${prefix}.segments must be an array`);
      return;
    }

    track.segments.forEach((segment, segIndex) => {
      const segPrefix = `${prefix}.segments[${segIndex}]`;
      if (!isObject(segment)) {
        pushError(errors, `${segPrefix} must be an object`);
        return;
      }
      if (!isFiniteNumber(segment.t0) || !isFiniteNumber(segment.t1)) {
        pushError(errors, `${segPrefix}.t0 and .t1 must be numbers`);
      } else if (segment.t1 <= segment.t0) {
        pushError(errors, `${segPrefix}.t1 must be greater than .t0`);
      }
      if (typeof segment.cap_ref !== 'string' || !segment.cap_ref.trim()) {
        pushError(errors, `${segPrefix}.cap_ref must be a non-empty string`);
      } else if (!captionIds.has(segment.cap_ref)) {
        pushError(errors, `${segPrefix}.cap_ref does not exist in tracks.captions (${segment.cap_ref})`);
      }
    });
  });
}

function validateExports(exportConfig, project, errors) {
  if (exportConfig == null) {
    return;
  }
  if (!isObject(exportConfig)) {
    pushError(errors, 'export must be an object');
    return;
  }
  if (!Array.isArray(exportConfig.cuts)) {
    return;
  }
  exportConfig.cuts.forEach((cut, index) => {
    const prefix = `export.cuts[${index}]`;
    if (!isObject(cut)) {
      pushError(errors, `${prefix} must be an object`);
      return;
    }
    if (typeof cut.name !== 'string' || !cut.name.trim()) {
      pushError(errors, `${prefix}.name must be a non-empty string`);
    }
    if (!Array.isArray(cut.range) || cut.range.length !== 2) {
      pushError(errors, `${prefix}.range must be [start, end]`);
    } else {
      const [start, end] = cut.range;
      if (!isFiniteNumber(start) || !isFiniteNumber(end) || end <= start) {
        pushError(errors, `${prefix}.range must have numeric end > start`);
      }
    }
    if (typeof cut.size !== 'string' || !/^\d+x\d+$/u.test(cut.size)) {
      const fallback = `${project?.resolution?.w ?? '?'}x${project?.resolution?.h ?? '?'}`;
      pushError(errors, `${prefix}.size must be a string like "${fallback}"`);
    }
  });
}

export function validateManifest(manifest) {
  const errors = [];

  if (!isObject(manifest)) {
    return { ok: false, errors: ['manifest must be a JSON object'] };
  }

  if (manifest.version !== SUPPORTED_MANIFEST_VERSION) {
    pushError(errors, `version must be "${SUPPORTED_MANIFEST_VERSION}"`);
  }

  validateProject(manifest.project, errors);

  if (!isObject(manifest.tracks)) {
    pushError(errors, 'tracks must be an object with video/audio/captions arrays');
    return { ok: errors.length === 0, errors };
  }

  validateVideoTracks(manifest.tracks.video, errors);
  const captionIds = validateCaptions(manifest.tracks.captions, errors);
  validateAudioTracks(manifest.tracks.audio, captionIds, errors);
  validateExports(manifest.export, manifest.project, errors);

  return { ok: errors.length === 0, errors };
}

export function assertValidManifest(manifest) {
  const result = validateManifest(manifest);
  if (!result.ok) {
    throw new Error(result.errors.join('\n'));
  }
  return manifest;
}

export async function loadManifest(manifestPath) {
  const raw = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);
  assertValidManifest(manifest);
  return manifest;
}
