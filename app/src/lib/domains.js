// eslint-disable-next-line import/prefer-default-export
export const isValidLabel = (label) => label.length > 0 && !!label.match(/^[a-z0-9]+$/i);
