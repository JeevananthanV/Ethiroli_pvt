import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);
export const useStoreState = (sliceName) => useSelector((state) => state[sliceName]);
