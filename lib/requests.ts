export function getOffsetAndLimitFromReq(
  limit,
  offset,
  maxLimit = 100,
  maxOffset = 1000
) {
  const queryLimit = Number(limit);
  const queryOffset = Number(offset) || 0;

  const finalLimit = queryLimit
    ? queryLimit < maxLimit
      ? queryLimit
      : maxLimit
    : 10;
  const finalOffset = queryOffset < maxOffset ? queryOffset : 0;

  return { finalLimit, finalOffset };
}
