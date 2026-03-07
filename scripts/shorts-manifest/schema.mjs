import path from 'node:path';
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

function validateRange(range, label, errors) {
  if (!Array.isArray(range) || range.length !== 2) {
    pushError(errors, `${label} must be [start, end]`);
    return;
  }

  const [start, end] = range;
  if (!isFiniteNumber(start) || !isFiniteNumber(end) || end <= start) {
    pushError(errors, `${label} must have numeric end > start`);
  }
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

function validateTemplate(template, errors) {
  if (template == null) {
    return;
  }
  if (!isObject(template)) {
    pushError(errors, 'template must be an object');
    return;
  }

  if (template.id != null && (typeof template.id !== 'string' || !template.id.trim())) {
    pushError(errors, 'template.id must be a non-empty string when provided');
  }

  if (template.tokens != null && !isObject(template.tokens)) {
    pushError(errors, 'template.tokens must be an object when provided');
  }

  if (template.captionStyle != null && !isObject(template.captionStyle)) {
    pushError(errors, 'template.captionStyle must be an object when provided');
  }

  if (template.companionFiles != null) {
    if (!isObject(template.companionFiles)) {
      pushError(errors, 'template.companionFiles must be an object when provided');
    } else {
      for (const [key, value] of Object.entries(template.companionFiles)) {
        if (typeof value !== 'string' || !value.trim()) {
          pushError(errors, `template.companionFiles.${key} must be a non-empty string`);
        }
      }
    }
  }

  if (template.frameMap != null) {
    if (!Array.isArray(template.frameMap)) {
      pushError(errors, 'template.frameMap must be an array when provided');
    } else {
      template.frameMap.forEach((frame, index) => {
        const prefix = `template.frameMap[${index}]`;
        if (!isObject(frame)) {
          pushError(errors, `${prefix} must be an object`);
          return;
        }
        if (typeof frame.id !== 'string' || !frame.id.trim()) {
          pushError(errors, `${prefix}.id must be a non-empty string`);
        }
        if (typeof frame.label !== 'string' || !frame.label.trim()) {
          pushError(errors, `${prefix}.label must be a non-empty string`);
        }
        if (frame.range != null) {
          validateRange(frame.range, `${prefix}.range`, errors);
        }
      });
    }
  }

  if (template.overlays != null) {
    if (!Array.isArray(template.overlays)) {
      pushError(errors, 'template.overlays must be an array when provided');
    } else {
      template.overlays.forEach((overlay, index) => {
        const prefix = `template.overlays[${index}]`;
        if (!isObject(overlay)) {
          pushError(errors, `${prefix} must be an object`);
          return;
        }
        if (typeof overlay.id !== 'string' || !overlay.id.trim()) {
          pushError(errors, `${prefix}.id must be a non-empty string`);
        }
        if (typeof overlay.source !== 'string' || !overlay.source.trim()) {
          pushError(errors, `${prefix}.source must be a non-empty string`);
        }
      });
    }
  }
}

function validateSlots(slots, errors) {
  if (slots == null) {
    return;
  }
  if (!isObject(slots)) {
    pushError(errors, 'slots must be an object when provided');
    return;
  }
}

function validateMetadata(metadata, errors) {
  if (metadata == null) {
    return;
  }
  if (!isObject(metadata)) {
    pushError(errors, 'metadata must be an object when provided');
    return;
  }

  if (metadata.descriptionTemplate != null && typeof metadata.descriptionTemplate !== 'string') {
    pushError(errors, 'metadata.descriptionTemplate must be a string when provided');
  }

  if (metadata.locales == null) {
    return;
  }
  if (!isObject(metadata.locales)) {
    pushError(errors, 'metadata.locales must be an object when provided');
    return;
  }

  for (const [locale, value] of Object.entries(metadata.locales)) {
    const prefix = `metadata.locales.${locale}`;
    if (!isObject(value)) {
      pushError(errors, `${prefix} must be an object`);
      continue;
    }
    if (typeof value.title !== 'string' || !value.title.trim()) {
      pushError(errors, `${prefix}.title must be a non-empty string`);
    }
    if (value.description != null && typeof value.description !== 'string') {
      pushError(errors, `${prefix}.description must be a string when provided`);
    }
    if (value.output != null && (typeof value.output !== 'string' || !value.output.trim())) {
      pushError(errors, `${prefix}.output must be a non-empty string when provided`);
    }
    if (value.hashtags != null) {
      if (!Array.isArray(value.hashtags) || value.hashtags.some((entry) => typeof entry !== 'string' || !entry.trim())) {
        pushError(errors, `${prefix}.hashtags must be an array of non-empty strings`);
      }
    }
    if (value.tags != null) {
      if (!Array.isArray(value.tags) || value.tags.some((entry) => typeof entry !== 'string' || !entry.trim())) {
        pushError(errors, `${prefix}.tags must be an array of non-empty strings`);
      }
    }
  }
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
  validateTemplate(manifest.template, errors);
  validateSlots(manifest.slots, errors);
  validateMetadata(manifest.metadata, errors);

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
  const resolvedManifestPath = path.resolve(manifestPath);
  const raw = await readFile(resolvedManifestPath, 'utf8');
  const manifest = JSON.parse(raw);
  const manifestDir = path.dirname(resolvedManifestPath);

  const companionFiles = manifest.template?.companionFiles;
  if (isObject(companionFiles)) {
    const companionTargets = [
      ['tokens', ['template', 'tokens']],
      ['slots', ['slots']],
      ['metadata', ['metadata']],
    ];

    for (const [key, targetPath] of companionTargets) {
      const relativePath = companionFiles[key];
      if (typeof relativePath !== 'string' || !relativePath.trim()) {
        continue;
      }

      const resolvedCompanionPath = path.resolve(manifestDir, relativePath);
      let parsedValue;
      try {
        parsedValue = JSON.parse(await readFile(resolvedCompanionPath, 'utf8'));
      } catch (error) {
        throw new Error(`Failed to load ${key} companion file: ${resolvedCompanionPath}\n${error.message}`);
      }

      let current = manifest;
      for (let index = 0; index < targetPath.length - 1; index += 1) {
        const segment = targetPath[index];
        current[segment] ||= {};
        current = current[segment];
      }
      current[targetPath[targetPath.length - 1]] = parsedValue;
    }
  }

  assertValidManifest(manifest);
  return manifest;
}
