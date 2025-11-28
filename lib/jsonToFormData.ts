export type FileLike = {
  uri: string;
  name?: string;
  type?: string;
};

export type JsonToFormDataOptions = {
  arrayFormat?: 'brackets' | 'indices';
  includeNull?: boolean;
  detectFile?: (value: any) => FileLike | null;
};

const defaultMimeByExt: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
};

function inferNameFromUri(uri: string) {
  try {
    const path = uri.split('?')[0];
    const last = path.split('/').pop() || 'file';
    return last.includes('.') ? last : `${last}.jpg`;
  } catch {
    return 'file.jpg';
  }
}

function inferMimeFromName(name?: string) {
  if (!name) return 'application/octet-stream';
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return defaultMimeByExt[ext] || 'application/octet-stream';
}

// Default detector supports Expo ImagePicker assets and RN file objects
export function defaultDetectFile(value: any): FileLike | null {
  if (!value || typeof value !== 'object') return null;

  // Expo ImagePicker result asset shape
  if (typeof value.uri === 'string') {
    const uri: string = value.uri;
    const name: string = value.fileName || value.name || inferNameFromUri(uri);
    const type: string = value.mimeType || value.type || inferMimeFromName(name);
    return { uri, name, type };
  }

  return null;
}

export function jsonToFormData(
  obj: Record<string, any>,
  options: JsonToFormDataOptions = {}
): FormData {
  const fd = new FormData();
  const {
    arrayFormat = 'brackets',
    includeNull = false,
    detectFile = defaultDetectFile,
  } = options;

  const append = (key: string, value: any) => {
    // Detect RN/Expo file-like values
    const asFile = detectFile(value);
    if (asFile) {
      // RN needs explicit cast to any
      fd.append(key, asFile as any);
      return;
    }

    if (value instanceof Date) {
      fd.append(key, value.toISOString());
      return;
    }

    const type = typeof value;
    if (value == null) {
      if (includeNull) fd.append(key, '');
      return;
    }
    if (type === 'boolean' || type === 'number' || type === 'bigint') {
      fd.append(key, String(value));
      return;
    }
    if (type === 'string') {
      fd.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        const nextKey = arrayFormat === 'indices' ? `${key}[${i}]` : `${key}[]`;
        append(nextKey, v);
      });
      return;
    }

    if (type === 'object') {
      Object.keys(value).forEach((k) => {
        const v = value[k];
        const nextKey = key ? `${key}[${k}]` : k;
        append(nextKey, v);
      });
      return;
    }

    // Fallback
    fd.append(key, String(value));
  };

  Object.keys(obj || {}).forEach((k) => append(k, obj[k]));
  return fd;
}

export default jsonToFormData;
