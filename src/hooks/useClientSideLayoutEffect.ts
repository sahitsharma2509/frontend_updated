import { useEffect, useLayoutEffect } from 'react';

const useClientSideLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useClientSideLayoutEffect;
