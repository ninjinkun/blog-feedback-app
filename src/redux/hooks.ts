import { useDispatch, useSelector } from 'react-redux';
import type { AppState } from './app-reducer';
import type { AppDispatch } from './create-store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
