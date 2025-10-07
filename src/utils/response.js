export const ok = (res, data) => res.status(200).json({ ok: true, data });
export const created = (res, data) => res.status(201).json({ ok: true, data });
export const badRequest = (res, msg='Bad Request') => res.status(400).json({ ok:false, error: msg });
export const unauthorized = (res, msg='Unauthorized') => res.status(401).json({ ok:false, error: msg });
export const forbidden = (res, msg='Forbidden') => res.status(403).json({ ok:false, error: msg });
export const notFound = (res, msg='Not Found') => res.status(404).json({ ok:false, error: msg });
export const serverError = (res, msg='Server Error') => res.status(500).json({ ok:false, error: msg });
