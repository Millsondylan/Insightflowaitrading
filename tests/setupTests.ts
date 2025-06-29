import '@testing-library/jest-dom';

// OPTIONAL: mock fetch globally for tests
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.fetch = jest.fn(); 