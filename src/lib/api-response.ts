export type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export const successResponse = <T>(data: T, meta?: Record<string, unknown>): ApiSuccess<T> => ({
  ok: true,
  data,
  meta,
});

export const errorResponse = (error: ApiFailure["error"]): ApiFailure => ({
  ok: false,
  error,
});
