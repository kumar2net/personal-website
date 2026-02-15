function overlaps(range, segment) {
  const [start, end] = range;
  return segment.t1 > start && segment.t0 < end;
}

export function buildRenderPlan(manifest, options = {}) {
  const lang = options.lang || 'en';
  const cuts = Array.isArray(manifest.export?.cuts) ? manifest.export.cuts : [];

  let cut = null;
  if (options.cutName) {
    cut = cuts.find((entry) => entry.name === options.cutName) || null;
    if (!cut) {
      throw new Error(`Cut not found: ${options.cutName}`);
    }
  } else if (cuts.length > 0) {
    cut = cuts[0];
  }

  if (!cut) {
    const videoEnd = Math.max(
      0,
      ...manifest.tracks.video.map((track) => (typeof track.end === 'number' ? track.end : 0)),
      ...manifest.tracks.audio.map((track) => (typeof track.end === 'number' ? track.end : 0)),
    );
    cut = {
      name: 'full',
      range: [0, videoEnd],
      size: `${manifest.project.resolution.w}x${manifest.project.resolution.h}`,
    };
  }

  const range = [cut.range[0], cut.range[1]];

  const captionsById = new Map(
    manifest.tracks.captions
      .filter((caption) => caption.lang === lang)
      .map((caption) => [caption.id, caption]),
  );

  let audioTrack = null;
  if (cut.audio) {
    audioTrack = manifest.tracks.audio.find((track) => track.id === cut.audio) || null;
  }
  if (!audioTrack) {
    audioTrack = manifest.tracks.audio.find((track) => track.lang === lang && track.role === 'narration') || null;
  }
  if (!audioTrack) {
    audioTrack = manifest.tracks.audio.find((track) => track.lang === lang) || null;
  }
  if (!audioTrack) {
    audioTrack = manifest.tracks.audio[0] || null;
  }

  const audioSegments = (audioTrack?.segments || [])
    .filter((segment) => overlaps(range, segment))
    .map((segment) => {
      const caption = captionsById.get(segment.cap_ref);
      return {
        ...segment,
        text: caption?.text || '',
      };
    });

  return {
    manifestVersion: manifest.version,
    project: {
      id: manifest.project.id,
      title: manifest.project.title,
      fps: manifest.project.fps,
      resolution: manifest.project.resolution,
    },
    cut: {
      name: cut.name,
      range,
      size: cut.size,
    },
    lang,
    videoSources: manifest.tracks.video.map((track) => ({
      id: track.id,
      source: track.source,
      in: track.start,
      out: track.end,
      transform: track.transform || null,
      keyframes: track.keyframes || [],
    })),
    audio: audioTrack
      ? {
          id: audioTrack.id,
          lang: audioTrack.lang,
          source: audioTrack.source,
          in: audioTrack.start,
          out: audioTrack.end,
          segments: audioSegments,
        }
      : null,
    captions: manifest.tracks.captions.filter((caption) => caption.lang === lang),
    mix: manifest.mix || null,
  };
}
